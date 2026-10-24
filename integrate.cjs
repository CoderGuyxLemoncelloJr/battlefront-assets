const fs = require('node:fs');
const acorn = require('acorn');
if (!process.argv[2]) throw Error('Pass the original battlefront.js path.');
const source = fs.readFileSync(process.argv[2], 'utf8');
const tree = acorn.parse(source, {
    ecmaVersion: 5
});
const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
const edits = [];

function replace(node, text) {
    edits.push({
        start: node.start,
        end: node.end,
        text
    });
}
const functions = {
    drawPlayer: `function(skin, size, hideHands) {
    var name = skinImageNames[skin];
    if (name && assetImages[name]) {
        image(assetImages[name], -size, -size, size * 2, size * 2);
    }
    if (!hideHands) {
        drawSkinHands(skin, size);
    }
}`,
    drawItemIcon: `function(item, x, y, size) {
    if (item && item.sprite && loadedImages[item.sprite]) {
        drawImg(loadedImages[item.sprite], x - size / 2, y - size / 2, size, size);
    } else if (item && item.itemName === "Crate") {
        drawAsset("prop_Crate", x, y, size * 0.8 / 200);
    }
}`,
    drawSkinHands: `function(skinName, size) {
    drawAsset(skinImageNames[skinName] + "_Hands", 0, 0, size / 212);
}`,
    weaponSprite: `function(x, y, s, r, type, c) {
    var name = type === "Lightsaber" ? "saber_hotbar_blue" : "icon_" + type.replace(/ /g, "_");
    pushStyle();
    pushMatrix();
    translate(x, y);
    rotate(r);
    var ink = c === undefined ? color(0) : c;
    tint(red(ink), green(ink), blue(ink), alpha(ink));
    drawAsset(name, 0, 0, s / 400);
    popMatrix();
    popStyle();
}`,
    starWarsLogo: `function(x, y, s, alpha) {
    pushStyle();
    tint(255, 255, 255, alpha === undefined ? 255 : alpha);
    drawAsset("StarWarsLogo", x * s, y * s, s);
    popStyle();
}`,
    lightsaber: `function(x, y, s, r, type, on, bladeLength) {
    var length = bladeLength === undefined ? (on ? 1 : 0) : bladeLength;
    var frame = round(constrain(length, 0, 1) * 4);
    pushMatrix();
    translate(x, y);
    rotate(r);
    drawAsset("saber_" + (type === "Kylo Ren" ? "red" : "blue") + "_" + frame, 0, 0, s / 390);
    popMatrix();
}`
};
const props = {
    AT_AT: '"prop_" + this.imgName',
    CrashedTIE: '"prop_CrashedTIE_" + (this.type === "sf" ? "sf" : "ln")',
    CrashedXwing: '"prop_CrashedXwing"',
    JunkPile: '"prop_JunkPile_" + this.type',
    Box: '"prop_Crate"'
};

function walk(node) {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'VariableDeclaration') {
        if (node.declarations.length === 1 && node.declarations[0].id.name === 'drawPlayerVector') {
            replace(node, '');
            return;
        }
        for (const d of node.declarations) {
            if (functions[d.id.name] && d.init && d.init.type === 'FunctionExpression') replace(d.init,
                functions[d.id.name]);
            if (d.id.name === 'imagesToLoad') {
                const cached = manifest.assets.filter(a => !a.extra).map(a => ({
                    name: a.name,
                    w: a.width,
                    h: a.height
                }));
                replace(d.init, JSON.stringify(cached, null, 4));
            }
        }
    }
    if (node.type === 'ForStatement' && source.slice(node.start, node.start + 80).includes(
            'playerSkinImageIndex')) {
        replace(node, '');
        return;
    }
    if (node.type === 'ExpressionStatement' && node.expression.type === 'CallExpression' && source.slice(node
            .expression.callee.start, node.expression.callee.end) === 'imagesToLoad.push') {
        replace(node, '');
        return;
    }
    if (node.type === 'AssignmentExpression') {
        const left = source.slice(node.left.start, node.left.end);
        if (functions[left] && node.right.type === 'FunctionExpression') replace(node.right, functions[left]);
        const match = left.match(/^(\w+)\.prototype\.render$/);
        if (match && props[match[1]]) {
            const type = match[1];
            replace(node.right, `function() {
    pushMatrix();
    translate(this.x, this.y);
    rotate(${type === 'JunkPile' ? '-this.rotation' : 'this.rotation'});
    drawAsset(${props[type]}, 0, 0, ${type === 'Box' ? 'this.size / 200' : '1'});
    popMatrix();
}`);
        }
        if (match && match[1] === 'Tree') replace(node.right, `function() {
    pushStyle();
    pushMatrix();
    translate(this.x, this.y);
    rotate(this.rotation);
    tint(255, 255, 255, this.translucent);
    drawAsset("prop_Tree_" + (this.shape === "tri" ? "tri" : "round"), 0, 0, this.width / 400);
    popMatrix();
    popStyle();
    var alpha = dist(playerPos.x, playerPos.y, this.x, this.y) < this.width / 1.78 && playerPos.z < this.zValue ? 175 : 255;
    this.translucent = lerp(this.translucent, alpha, 0.1);
}`);
        if (['F_11D', 'Sniper', 'E11'].includes(left) && node.right.type === 'NewExpression' && node.right
            .callee.name === 'Blaster') {
            const render = node.right.arguments[0].properties.find(p => p.key.name === 'renderFunc');
            replace(render.value, `function() { drawAsset("weapon_${left}", 0, 0); }`);
        }
    }
    if (node.type === 'IfStatement' && source.slice(node.test.start, node.test.end) ===
        'gameStage === "ImageLoad"') {
        replace(node.consequent, `{
            startAssets(assetNames);
            stepAssets();
            if (assetLoad.ready) {
                loadedImages = assetImages;
                for (var holoIndex = 0; holoIndex < holoNum; holoIndex++) {
                    holos.push(assetImages["Holo_" + holoIndex]);
                }
                imgIndex = imagesToLoad.length;
                gameStage = "Menu";
            } else {
                loadScreen();
                fill(assetLoad.error ? color(255, 120, 120) : color(255));
                textSize(16);
                textAlign(CENTER, CENTER);
                text(assetLoad.error || round(assetLoad.index / assetNames.length * 100) + "%", width / 2, height / 2 + 200);
            }
        }`);
        return;
    }
    for (const key of Object.keys(node)) {
        if (Array.isArray(node[key])) node[key].forEach(walk);
        else if (node[key] && typeof node[key] === 'object') walk(node[key]);
    }
}
walk(tree);
edits.sort((a, b) => b.start - a.start);
let output = source;
let limit = source.length + 1;
for (const edit of edits) {
    if (edit.end > limit) throw Error('Overlapping edits at ' + source.slice(edit.start, edit.start + 100));
    output = output.slice(0, edit.start) + edit.text + output.slice(edit.end);
    limit = edit.start;
}
const loader = fs.readFileSync('pjs-loader.js', 'utf8') + '\nvar assetNames = ' + JSON.stringify(manifest
    .assets.map(a => a.name), null, 4) + ';\n';
output = 'var assetImages;\nvar drawAsset;\n' + output.replace('// jshint ignore : start',
    '// jshint ignore : start\n' + loader);
acorn.parse(output, {
    ecmaVersion: 5
});
fs.writeFileSync('battlefront-images.js', output);
console.log('Created image-based Battlefront build.');
