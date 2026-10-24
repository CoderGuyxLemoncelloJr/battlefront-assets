var assetBase = "https://cdn.jsdelivr.net/gh/CoderGuyxLemoncelloJr/battlefront-assets@main/";
var assetLoad = { started: false, ready: false, error: "", index: 0, list: [], meta: {} };
var assetImages = {};
var startAssets = function(names) {
    if (assetLoad.started) return;
    assetLoad.started = true;
    if (typeof $ === "undefined" || !$.ajax) {
        assetLoad.error = "Image loader unavailable. Restart the project.";
        return;
    }
    var fail = function() {
        assetLoad.error = "Images could not load. Check your connection and restart.";
    };
    var readPack = function() {
        var pack = window.BattlefrontPNG;
        if (!pack || pack.version !== 1) {
            fail();
            return;
        }
        var wanted = {};
        for (var i = 0; i < names.length; i++) wanted[names[i]] = true;
        for (var j = 0; j < pack.assets.length; j++) {
            var entry = pack.assets[j];
            assetLoad.meta[entry.name] = entry;
            if (wanted[entry.name]) assetLoad.list.push(entry);
        }
        if (assetLoad.list.length !== names.length) {
            assetLoad.error = "An image is missing from the asset pack.";
        }
    };
    $.ajax({ url: assetBase + "png-decoder.js", dataType: "script", cache: true, timeout: 30000 }).done(function() {
        $.ajax({ url: assetBase + "images.js", dataType: "script", cache: true, timeout: 60000 }).done(readPack).fail(fail);
    }).fail(fail);
};
var stepAssets = function() {
    if (assetLoad.error || !assetLoad.list.length || assetLoad.ready) return;
    try {
        var entry = assetLoad.list[assetLoad.index];
        var text = window.atob(window.BattlefrontPNG.images[entry.name]);
        var bytes = new window.Uint8Array(text.length);
        for (var i = 0; i < text.length; i++) bytes[i] = text.charCodeAt(i);
        var png = window.UPNG.decode(bytes.buffer);
        var rgba = new window.Uint8Array(window.UPNG.toRGBA8(png)[0]);
        var img = createImage(png.width, png.height, ARGB);
        var data = img.sourceImg.getContext("2d").createImageData(png.width, png.height);
        data.data.set(rgba);
        img.fromImageData(data);
        assetImages[entry.name] = img;
        assetLoad.index++;
        assetLoad.ready = assetLoad.index === assetLoad.list.length;
    } catch (error) {
        assetLoad.error = "Image decode failed: " + (error.message || error);
    }
};
var drawAsset = function(name, x, y, size) {
    var img = assetImages[name];
    var meta = assetLoad.meta[name];
    if (!img || !meta) return false;
    var origin = meta.origin || { x: 0, y: 0 };
    var scale = size === undefined ? 1 : size;
    image(img, x - origin.x * scale, y - origin.y * scale, meta.width * scale, meta.height * scale);
    return true;
};
