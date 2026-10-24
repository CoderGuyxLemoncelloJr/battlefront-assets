const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const UPNG = require('upng-js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
const images = {};
const assets = [];
async function pack() {
    for (const asset of manifest.assets) {
        const png = fs.readFileSync(asset.file);
        const decoded = UPNG.decode(png.buffer.slice(png.byteOffset, png.byteOffset + png.byteLength));
        asset.pixelWidth = decoded.width;
        asset.pixelHeight = decoded.height;
        asset.sha256 = crypto.createHash('sha256').update(png).digest('hex');
        let limit = 768;
        if (asset.name.startsWith('Holo_')) limit = 300;
        else if (asset.group === 'players') limit = asset.name.endsWith('_Hands') ? 128 : 256;
        const scale = Math.min(1, limit / Math.max(asset.width, asset.height));
        const width = Math.max(1, Math.round(asset.width * scale));
        const height = Math.max(1, Math.round(asset.height * scale));
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(await loadImage(png), 0, 0, width, height);
        const runtime = canvas.toBuffer('image/png');
        assets.push({ ...asset, pixelWidth: width, pixelHeight: height });
        images[asset.name] = runtime.toString('base64');
    }
    fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 4) + '\n');
    const pako = fs.readFileSync(path.join(path.dirname(require.resolve('pako/package.json')),
        'dist/pako_inflate.js'), 'utf8');
    const decoder = fs.readFileSync(require.resolve('upng-js'), 'utf8');
    fs.writeFileSync('png-decoder.js', pako + '\n' + decoder);
    fs.writeFileSync('runtime.js', 'window.BattlefrontPNG = ' + JSON.stringify({
        version: 1,
        assets,
        images
    }, null, 4) + ';\n');
    const bytes = assets.reduce((sum, a) => sum + a.pixelWidth * a.pixelHeight * 4, 0);
    console.log('Packed ' + assets.length + ' runtime PNGs: ' + (bytes / 1048576).toFixed(1) + ' MiB decoded.');
}
pack().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
