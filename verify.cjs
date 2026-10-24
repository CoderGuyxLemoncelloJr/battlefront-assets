const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const UPNG = require('upng-js');
const acorn = require('acorn');
const scope = {
    window: {}
};
vm.runInNewContext(fs.readFileSync('runtime.js', 'utf8'), scope);
const pack = scope.window.BattlefrontPNG;
const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
assert.equal(new Set(manifest.assets.map(a => a.name)).size, manifest.assets.length);
for (const asset of manifest.assets) {
    const png = fs.readFileSync(asset.file);
    const decoded = UPNG.decode(png.buffer.slice(png.byteOffset, png.byteOffset + png.byteLength));
    assert.equal(decoded.width, asset.pixelWidth, asset.name);
    assert.equal(decoded.height, asset.pixelHeight, asset.name);
    assert.equal(crypto.createHash('sha256').update(png).digest('hex'), asset.sha256, asset.name);
    const entry = pack.assets.find(a => a.name === asset.name);
    const runtime = Buffer.from(pack.images[asset.name], 'base64');
    const small = UPNG.decode(runtime.buffer.slice(runtime.byteOffset, runtime.byteOffset + runtime.byteLength));
    assert.equal(small.width, entry.pixelWidth, asset.name);
    assert.equal(small.height, entry.pixelHeight, asset.name);
    assert.equal(entry.width, asset.width, asset.name);
    assert.equal(entry.height, asset.height, asset.name);
    assert.deepEqual(JSON.parse(JSON.stringify(entry.origin || null)), asset.origin || null, asset.name);
    const rgba = new Uint8Array(UPNG.toRGBA8(decoded)[0]);
    if (asset.name !== 'MenuAchievements') assert(rgba.some((v, i) => i % 4 === 3 && v > 0), asset.name +
        ' is empty');
}
const holo = pack.assets.find(a => a.name === 'Holo_0');
for (const mask of pack.assets.filter(a => a.name.startsWith('Menu'))) {
    assert.equal(mask.pixelWidth, holo.pixelWidth, mask.name + ' mask width');
    assert.equal(mask.pixelHeight, holo.pixelHeight, mask.name + ' mask height');
}
const callbacks = [];
const loadScope = {
    window: { BattlefrontPNG: pack },
    $: { ajax() {
        return {
            done(fn) { callbacks.push(fn); return this; },
            fail() { return this; }
        };
    } }
};
vm.createContext(loadScope);
vm.runInContext(fs.readFileSync('pjs-loader.js', 'utf8'), loadScope);
const game = acorn.parse(fs.readFileSync('battlefront-images.js', 'utf8'), { ecmaVersion: 5 });
const names = game.body.flatMap(node => node.type === 'VariableDeclaration' ? node.declarations : [])
    .find(node => node.id.name === 'assetNames').init.elements.map(node => node.value);
loadScope.startAssets(names);
callbacks.shift()();
const read = callbacks.shift();
read();
read();
assert.equal(loadScope.assetLoad.error, '');
assert.equal(loadScope.assetLoad.list.length, names.length, 'Repeated callbacks must not duplicate images');
assert.equal(loadScope.assetLoad.list.length, manifest.assets.length);
assert.deepEqual(Array.from(loadScope.assetLoad.list, a => a.name), names);
for (const file of ['pjs-loader.js', 'battlefront-images.js']) {
    if (!fs.existsSync(file)) continue;
    const tree = acorn.parse(fs.readFileSync(file, 'utf8'), {
        ecmaVersion: 5
    });

    function walk(node) {
        if (!node || typeof node !== 'object') return;
        if (['ForStatement', 'ForInStatement', 'WhileStatement', 'DoWhileStatement'].includes(node.type)) {
            assert.equal(node.body.type, 'BlockStatement', file + ' needs braces for Khan loop protection');
        }
        for (const value of Object.values(node)) {
            if (Array.isArray(value)) value.forEach(walk);
            else if (value && typeof value === 'object') walk(value);
        }
    }
    walk(tree);
}
const bytes = pack.assets.reduce((sum, a) => sum + a.pixelWidth * a.pixelHeight * 4, 0);
assert(bytes < 64 * 1048576, 'Runtime image memory exceeds 64 MiB');
console.log(manifest.assets.length + ' source and runtime PNGs verified. PJS syntax passes. Runtime pixels: ' + (bytes / 1048576).toFixed(1) + ' MiB.');
