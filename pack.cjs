const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const UPNG = require('upng-js');
const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
const images = {};
for (const asset of manifest.assets) {
    const png = fs.readFileSync(asset.file);
    const decoded = UPNG.decode(png.buffer.slice(png.byteOffset, png.byteOffset + png.byteLength));
    asset.pixelWidth = decoded.width;
    asset.pixelHeight = decoded.height;
    asset.sha256 = crypto.createHash('sha256').update(png).digest('hex');
    images[asset.name] = png.toString('base64');
}
fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 4) + '\n');
const pako = fs.readFileSync(path.join(path.dirname(require.resolve('pako/package.json')), 'dist/pako_inflate.js'), 'utf8');
const decoder = fs.readFileSync(require.resolve('upng-js'), 'utf8');
fs.writeFileSync('png-decoder.js', pako + '\n' + decoder);
fs.writeFileSync('images.js', 'window.BattlefrontPNG = ' + JSON.stringify({version: 1, assets: manifest.assets, images}, null, 4) + ';\n');
console.log('Packed ' + manifest.assets.length + ' PNG images.');
