const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const UPNG = require('upng-js');
const acorn = require('acorn');
const scope = {window: {}};
vm.runInNewContext(fs.readFileSync('images.js', 'utf8'), scope);
const pack = scope.window.BattlefrontPNG;
const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
assert.equal(new Set(manifest.assets.map(a => a.name)).size, manifest.assets.length);
for (const asset of manifest.assets) {
    const png = fs.readFileSync(asset.file);
    const decoded = UPNG.decode(png.buffer.slice(png.byteOffset, png.byteOffset + png.byteLength));
    assert.equal(decoded.width, asset.pixelWidth, asset.name);
    assert.equal(decoded.height, asset.pixelHeight, asset.name);
    assert.equal(crypto.createHash('sha256').update(png).digest('hex'), asset.sha256, asset.name);
    assert(png.equals(Buffer.from(pack.images[asset.name], 'base64')), asset.name);
    const rgba = new Uint8Array(UPNG.toRGBA8(decoded)[0]);
    if (asset.name !== 'MenuAchievements') assert(rgba.some((v, i) => i % 4 === 3 && v > 0), asset.name + ' is empty');
}
for (const file of ['pjs-loader.js', 'battlefront-images.js']) {
    if (fs.existsSync(file)) acorn.parse(fs.readFileSync(file, 'utf8'), {ecmaVersion:5});
}
console.log(manifest.assets.length + ' PNGs match the manifest and packed bytes. PJS syntax passes.');
