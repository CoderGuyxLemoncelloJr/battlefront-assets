const fs = require('node:fs');
const {
    createCanvas,
    loadImage
} = require('@napi-rs/canvas');
async function main() {
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    for (const asset of manifest.assets) {
        if (!asset.extra || asset.name.startsWith('Holo_')) continue;
        const img = await loadImage(asset.file);
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, img.width, img.height).data;
        let left = img.width,
            top = img.height,
            right = 0,
            bottom = 0;
        for (let y = 0; y < img.height; y++) {
            for (let x = 0; x < img.width; x++) {
                if (!data[(y * img.width + x) * 4 + 3]) continue;
                left = Math.min(left, x);
                top = Math.min(top, y);
                right = Math.max(right, x);
                bottom = Math.max(bottom, y);
            }
        }
        if (left > right || top > bottom) throw Error('Empty sprite: ' + asset.name);
        left = Math.max(0, left - 8);
        top = Math.max(0, top - 8);
        right = Math.min(img.width - 1, right + 8);
        bottom = Math.min(img.height - 1, bottom + 8);
        const sx = img.width / asset.width,
            sy = img.height / asset.height;
        const out = createCanvas(right - left + 1, bottom - top + 1);
        out.getContext('2d').drawImage(canvas, -left, -top);
        asset.origin.x -= left / sx;
        asset.origin.y -= top / sy;
        asset.width = out.width / sx;
        asset.height = out.height / sy;
        asset.pixelWidth = out.width;
        asset.pixelHeight = out.height;
        fs.writeFileSync(asset.file, out.toBuffer('image/png'));
    }
    fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 4) + '\n');
}
main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
