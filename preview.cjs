const fs = require('node:fs');
const {
    createCanvas,
    loadImage
} = require('@napi-rs/canvas');
async function main() {
    const assets = JSON.parse(fs.readFileSync('manifest.json', 'utf8')).assets;
    const canvas = createCanvas(1440, Math.ceil(assets.length / 8) * 190);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#18202b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < assets.length; i++) {
        const asset = assets[i],
            img = await loadImage(asset.file),
            x = (i % 8) * 180,
            y = Math.floor(i / 8) * 190;
        ctx.fillStyle = '#394552';
        ctx.fillRect(x + 5, y + 5, 170, 155);
        const scale = Math.min(158 / img.width, 143 / img.height);
        ctx.drawImage(img, x + 90 - img.width * scale / 2, y + 82 - img.height * scale / 2, img.width *
            scale, img.height * scale);
        ctx.fillStyle = '#edf4ff';
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(asset.name, x + 90, y + 177, 174);
    }
    fs.writeFileSync('preview.png', canvas.toBuffer('image/png'));
}
main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
