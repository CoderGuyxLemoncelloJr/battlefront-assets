const fs = require('node:fs');
const {
    JSDOM
} = require('jsdom');
const {
    createCanvas,
    loadImage
} = require('@napi-rs/canvas');
const dom = new JSDOM('<body><canvas id="c"></canvas></body>', {
    runScripts: 'outside-only'
});
const w = dom.window;
const canvases = new WeakMap();
for (const key of ['width', 'height']) {
    const prop = Object.getOwnPropertyDescriptor(w.HTMLCanvasElement.prototype, key);
    Object.defineProperty(w.HTMLCanvasElement.prototype, key, {
        get: prop.get,
        set(value) {
            prop.set.call(this, value);
            const canvas = canvases.get(this);
            if (canvas) canvas[key] = value;
        }
    });
}
w.HTMLCanvasElement.prototype.getContext = function(type) {
    if (type !== '2d') return null;
    let c = canvases.get(this);
    if (!c) {
        c = createCanvas(this.width || 1, this.height || 1);
        canvases.set(this, c);
    }
    if (c.width !== this.width) c.width = this.width;
    if (c.height !== this.height) c.height = this.height;
    const ctx = c.getContext('2d');
    if (!ctx.unwrapped) {
        const draw = ctx.drawImage.bind(ctx);
        ctx.drawImage = (img, ...args) => draw(canvases.get(img) || img, ...args);
        ctx.unwrapped = true;
    }
    return ctx;
};
w.HTMLCanvasElement.prototype.toDataURL = function() {
    return canvases.get(this).toDataURL();
};
w.eval(fs.readFileSync(require.resolve('processing-js'), 'utf8'));
const p = new w.Processing(w.document.getElementById('c'));
p.size(1200, 1200);
const vm = require('node:vm');
const scope = {
    console,
    Math,
    lowDetailMode: false,
    tickClock: {
        gameMs: 0,
        realMs: 0,
        baseMs: 1000 / 60
    },
    loadedImages: {}
};
for (const name in p) scope[name] = typeof p[name] === 'function' ? p[name].bind(p) : p[name];
scope.rotate = angle => p.rotate(angle * Math.PI / 180);
for (const name of ['sin', 'cos', 'tan']) scope[name] = angle => Math[name](angle * Math.PI / 180);
for (const name of ['asin', 'acos', 'atan']) scope[name] = value => Math[name](value) * 180 / Math.PI;
scope.atan2 = (y, x) => Math.atan2(y, x) * 180 / Math.PI;
scope.arc = (x, y, a, b, start, end) => p.arc(x, y, a, b, start * Math.PI / 180, end * Math.PI / 180);
vm.createContext(scope);
vm.runInContext(fs.readFileSync('drawings.js', 'utf8'), scope);
p.noLoop();
const extrasOnly = process.argv.includes('--extras');
const assets = extrasOnly ? JSON.parse(fs.readFileSync('manifest.json', 'utf8')).assets.filter(a => !a
    .extra) : [];
scope.playerPos = {
    x: 10000,
    y: 10000,
    z: 0
};
scope.drawImg = (img, x, y, w, h) => {
    if (img) p.image(img, x, y, w, h);
};

function render(name, width, height, draw, groupOverride, origin) {
    const factor = Math.max(2, Math.min(4, Math.ceil(1024 / Math.max(width, height))));
    p.size(width * factor, height * factor);
    p.resetMatrix();
    p.background(0, 0);
    p.noTint();
    p.rectMode(p.CORNER);
    p.ellipseMode(p.CENTER);
    p.strokeWeight(1);
    p.stroke(0);
    p.fill(255);
    p.pushMatrix();
    p.scale(factor);
    p.randomSeed(1234);
    p.noiseSeed(1234);
    draw();
    p.popMatrix();
    const canvas = canvases.get(w.document.getElementById('c'));
    const group = groupOverride || (name.startsWith('PlayerSkin_') ? 'players' : name.startsWith('Menu') ||
        name === 'MinimapMask' ? 'ui' : /Sand|Moss/.test(name) ? 'textures' : 'items');

    const file = name + '.png';
    fs.writeFileSync(file, canvas.toBuffer('image/png'));
    assets.push({
        name,
        file,
        group,
        width,
        height,
        pixelWidth: width * factor,
        pixelHeight: height * factor,
        ...(origin ? {
            origin,
            extra: true
        } : {})
    });
    console.log(name, width * factor, height * factor);
}
async function main() {
    if (!extrasOnly) {
        for (const item of scope.imagesToLoad) render(item.name, item.w, item.h, () => item.display());
    }
    for (const asset of assets) {
        const img = await loadImage(asset.file);
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const target = p.createImage(img.width, img.height, p.ARGB);
        target.imageData.data.set(ctx.getImageData(0, 0, img.width, img.height).data);
        target.fromImageData(target.imageData);
        scope.loadedImages[asset.name] = target;
    }
    for (const name of Object.keys(scope.gunDraw)) {
        render('weapon_' + name, 240, 100, () => {
            p.translate(40, 50);
            scope.gunDraw[name]();
        }, 'weapons', {
            x: 40,
            y: 50
        });
    }
    for (const name of ['F_11D', 'E11', 'Sniper', 'Kylo Ren Lightsaber']) {
        render('icon_' + name.replace(/ /g, '_'), 400, 400, () => scope.weaponSprite(200, 200, 400, 0,
            name, p.color(255)), 'weapons', {
            x: 200,
            y: 200
        });
    }
    for (const [skin, name] of scope.skinImgsToBake) {
        render(name + '_Hands', 600, 600, () => {
            p.translate(300, 300);
            scope.drawSkinHands(skin, 212);
        }, 'players', {
            x: 300,
            y: 300
        });
    }
    for (const skin of ['Luke Skywalker', 'Kylo Ren']) {
        for (let frame = 0; frame <= 4; frame++) {
            render('saber_' + (skin === 'Kylo Ren' ? 'red' : 'blue') + '_' + frame, 512, 512, () => scope
                .lightsaber(256, 430, 390, 0, skin, frame > 0, frame / 4), 'weapons', {
                    x: 256,
                    y: 430
                });
        }
    }
    render('StarWarsLogo', 600, 300, () => scope.starWarsLogo(60, 100, 1), 'ui', {
        x: 60,
        y: 100
    });
    for (let frame = 0; frame < 15; frame++) {
        render('Holo_' + frame, 600, 600, () => {
            p.strokeWeight(3);
            for (let y = 0; y < 615; y += 3) {
                const bright = p.map(p.noise(y / 5), 0, 1, 30, 300) + p.random(-3, 3);
                p.stroke(bright * 0.8, bright * 1.2, 255);
                p.line(0, y - 15 + frame, 600, y - 15 + frame);
            }
        }, 'ui', {
            x: 0,
            y: 0
        });
    }
    const props = [
        ['AT_AT_Moss', 'AT_AT', {
            imgName: 'AT_AT_Moss'
        }, 1600, 1600],
        ['AT_AT_Sand', 'AT_AT', {
            imgName: 'AT_AT_Sand'
        }, 1600, 1600],
        ['CrashedTIE_sf', 'CrashedTIE', {
            type: 'sf'
        }, 1600, 1000],
        ['CrashedTIE_ln', 'CrashedTIE', {
            type: 'ln'
        }, 1600, 1000],
        ['CrashedXwing', 'CrashedXwing', {}, 1400, 1400],
        ['Crate', 'Box', {
            size: 200
        }, 224, 224],
        ['Tree_tri', 'Tree', {
            shape: 'tri'
        }, 512, 512],
        ['Tree_round', 'Tree', {
            shape: 'rect'
        }, 512, 512]
    ];
    for (let type = 1; type <= 5; type++) props.push(['JunkPile_' + type, 'JunkPile', {
        type
    }, 512, 512]);
    for (const [name, type, config, width, height] of props) {
        const obj = {
            x: 0,
            y: 0,
            rotation: 0,
            color: p.color(95, 98, 95),
            borderColor: p.color(0),
            borderSize: 2,
            width: 400,
            height: 400,
            translucent: 255,
            canopyColor: p.color(16, 77, 16),
            zValue: 1,
            ...config
        };
        render('prop_' + name, width, height, () => {
            p.rectMode(p.CENTER);
            p.translate(width / 2, height / 2);
            scope.propDraw[type].call(obj);
        }, 'props', {
            x: width / 2,
            y: height / 2
        });
    }
    fs.writeFileSync('manifest.json', JSON.stringify({
        version: 1,
        assets
    }, null, 4) + '\n');
    p.exit();
    w.close();
}
main().catch(error => {
    console.error(error);
    p.exit();
    w.close();
    process.exitCode = 1;
});
