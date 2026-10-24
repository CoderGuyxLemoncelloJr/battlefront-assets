var assetImages;
var drawAsset;
/**
 * 
 * You'll probably need to hit restart once
 * 
╔══╗╔═══╦════╦════╦╗──╔═══╦═══╦═══╦═══╦═╗─╔╦════╗╔╗──╔╦═══╗
║╔╗║║╔═╗║╔╗╔╗║╔╗╔╗║║──║╔══╣╔══╣╔═╗║╔═╗║║╚╗║║╔╗╔╗║║╚╗╔╝║╔═╗║
║╚╝╚╣║─║╠╝║║╚╩╝║║╚╣║──║╚══╣╚══╣╚═╝║║─║║╔╗╚╝╠╝║║╚╝╚╗║║╔╩╝╔╝║
║╔═╗║╚═╝║─║║───║║─║║─╔╣╔══╣╔══╣╔╗╔╣║─║║║╚╗║║─║║───║╚╝║╔╗╚╗║
║╚═╝║╔═╗║─║║───║║─║╚═╝║╚══╣║──║║║╚╣╚═╝║║─║║║─║║───╚╗╔╝║╚═╝║
╚═══╩╝─╚╝─╚╝───╚╝─╚═══╩═══╩╝──╚╝╚═╩═══╩╝─╚═╝─╚╝────╚╝─╚═══╝
 * 
 * This is a project by ✝ 𝕮𝕲𝕏𝕷𝕮𝕵 ✝ (@KingCobraVenom and
 * @LemoncelloJr)
 * 
 * ----------------------------------------------------------
 * 
 * @VERSION_LOG (Release.Major.Minor.Patch)
 * 
 * 0.3.1.11
 *  - Fixed zero-height floor and wall collisions being
 * misread at z = 0.000000000000000000000000...1 you get the
 * point
 *  - Separated movement collision stepping by axis to reduce
 * wall-sticking and floor clipping
 * 
 * 0.3.1.10
 *  - Smoothed the player fly-height ceiling and blocked
 * detonator launches from bypassing it
 * 
 * 0.3.1.9
 *  - Replaced the heavy collision sampling increase with a
 * cheaper rect corner pushout for wall clipping
 * 
 * 0.3.1.8
 *  - Increased hitbox collision sampling density to catch
 * wall-corner clipping earlier
 * 
 * 0.3.1.7
 *  - Improved stable player collision stepping to reduce
 * corner sliding and getting stuck on hitbox edges
 * 
 * 0.3.1.6
 *  - Added limited-use counts for medkits and detonators,
 * with respawn refills
 *  - Added matching AI detonator and medkit inventories that
 * refill on bot respawn
 * 
 * 0.3.1.5
 *  - Added hold-Z zoom-out for blaster loadouts
 * 
 * 0.3.1.4
 *  - Made Kashyyyk fog banks huge, more mobile, and able to pass over ground-level players
 * 
 * 0.3.1.3
 *  - Added fog pockets to Kashyyyk
 * 
 * 0.3.1.1
 *  - Auto-deflect chance now shifts a bit with player
 * health
 *  - AI tactical choices now react more strongly to health
 * and nearby support pressure
 * 
 * 0.3.1.0
 *  - Added the Sniper class weapon with a custom sniper
 * sprite
 *  - Added Force Sense slow motion for dangerous incoming
 * lasers
 *  - Updated reflected laser direction when deflecting from
 * behind
 *  - Tweaked sniper zoom, HUD placement, and Kylo Ren saber
 * audio
 * 
 * 0.2.6.0 - 0.3.0.0
 *  - Didn't track any major/minor updates throughout these
 * versions.
 *  - General improvements/additions
 * 
 * 0.2.6.0
 *  - Added sick slow motion
 *  - Added Force Sense (50/50 chance to block a laser)
 *  - Added Version Log
 * 
 * 0.2.5.1
 *  - Nerfed AI sniping abilities (you're welcome.)
 *  - Updated dash ability to drain Force Meter
 * 
 * 0.2.5.0
 *  - Added sniper class
 *  - Added zooming
 *  - Added THE FORCE
 *  - Added dash ability
 * 
 * 0.2.4.1
 *  - Fixed minimap bug as well as minimap visuals
 * 
 * 0.2.4.0
 *  - Added gamemodes:
 *      Team Deathmatch
 *      Battle Royale
 *  - Enhanced artificial intelligence to handle lightsabers
 *  - Added more sound effects
 *  - Added the base of Star Destroyer map
 * 
 * 0.2.3.1
 *  - Patched ANNOYING popMatrix() bug
 *  - Patched floor collision detection
 * 
 * 0.2.3.0
 *  - Added credits crawl screen
 *  - Added sound effects
 *  - Added lightsaber class
 *  - Added character image loading
 * 
 * 0.2.2.0
 *  - Integrated artificial intelligence into the AI entities
 *  - Updated collision framework
 *  - Updated credits page
 * 
 * 0.2.1.0
 *  - Added minimap
 *  - Added AI entities
 *  - Enhanced user interface
 *  - Updated image loading
 * 
 * 0.1.0.0 - 0.2.0.0
 *  - Didn't track any major/minor updates throughout these
 * versions.
 *  - General improvements/additions including Abilities
 * framework as well as Kashyyyk and Jakku
 * 
 * 0.1.0.0
 *  - Main framework as well as physics engine and 3D
 * rendering engine. V1 private release.
 * 
 * ----------------------------------------------------------
 * 
 * A note on the inheritance and class structure...
 * 
 * GameMap  -->   Various maps for the game are created as
 * instances of the parent GameMap class, and contain
 * arrays of GameObjs
 * GameObj  -->   GameObj is a general parent class, specific
 * game object classes, such as Door, inherit from the parent
 * class
 * 
**/
var lowDetailMode = true; //SET TO TRUE IF YOU CAN'T LOAD THE GAME
/**Global Variables**/
var mapFetch = false;
//General Variable Definitions
var playerPos = new PVector(0, 0); //The player's position
var camPos = new PVector(0, 0); //The camera's position
var minimapView = {
    canvas: null,
    size: 400,
    nextUpdateMs: 0
};
var inventoryState = {
    selected: 0,
    lastWeapon: null,
    readyAt: 0,
    cosmeticsOpen: false,
    uiConsumed: false
};
var getHeldItem;
var returnToWeapon;
var drawHeldItem;
var drawPlacementPreview;
var removePlacedCrates;
var worldToScreen;
var screenToWorld;
var cameraState = {
    ready: false,
    map: null,
    roll: 0,
    pitch: 1,
    recoil: 0,
    shakeX: 0,
    shakeY: 0
};
var screenShake = 0; //SHAKEY BREAKEY
var bloodScreen = 0; //Alpha of the BLLOOOODDD
var playerVel = new PVector(0, 0); //The player's velocity
var playerFloorHit = false;
var playerTeam = 1;
var hitboxSize = 30; //The radius of the player's hitbox
var colPrecision = 8; //The precision of collisions, recommended as a multiple of 4; higher values = more points checked
var colSamples = [];
for (var colSampleI = 0; colSampleI < colPrecision; colSampleI++) {
    colSamples.push({
        x: cos((360 / colPrecision) * colSampleI),
        y: sin((360 / colPrecision) * colSampleI)
    });
}
var colBucket = 320;
var collideMode = "stable"; //Testing collision modes
var skin = "Kylo Ren"; //Skin
var bodyAngle = 0;
var walkSway = 0;
var currentMap;
var Kashyyyk;
var Jakku;
var StarDestroyer;
var currentGun;
var character = "Jedi";
var characterData;
var defaultCharacter = "Jedi";
var gameStage;
var matchState;
var stageTransition;
var planetList;
var getMatchAliveBots;
var devConsole;
var loadedImages = {}; //Loaded images will go here
var squadCommandMode = false;
var squadCommandButton = {
    x: 430,
    y: 19,
    w: 118,
    h: 30
};
var squadPowerButton = {
    x: 300,
    y: 19,
    w: 54,
    h: 30
};
var squadSystemEnabled = true;
var squadClickLock = false;
var deathScreenActive = false;
var deathScreenFrame = 0;
var deathRespawnAt = 76;
var deathTransStarted = false;
var stuckHoldFrames = 180;
var stuckHoldCount = 0;
var stuckHoldLock = false;
var deathScorePaid = false;
var playerGunPose = 0;
var playerSpeed = 1.02;
var playerDeaths = 0;
var playerCredits = 0;
var creditDisplay = {
    value: 0,
    speed: 0,
    scrollSoundValue: 0,
    scrollSoundTick: 0,
    soundEnabled: true
};
var creditPopups = [];
var playerJumpHeight = 0.1;
var flyCeilSoft = 0.55;
var flyCeilBuffer = 0.08;
var flyCeilExtra = 2;
var jetpackEquipped = true;
var playerHealth = 100;
var playerMaxHealth = 100;
var playerShield = 20;
var playerMaxShield = 20;
var playerShieldRegen = 0.03;
var pHpRegenFull = 0.05;
var pHpRegenLow = 0.02;
var F_11D;
var Sniper;
var E11;
var Blaster;
var Lightsaber;
var lightsaber;
var Laser;
var Detonator;
var DashArrow;
var AIPlayer;
var startCharacterShop;
var addCreditChange;
var playerDamageMult = 1;
var jediDashSettings = {
    burstSpeed: 90,
    arrowCount: 3,
    arrowDelayFrames: 3,
    forceCost: 20
};
var forceSettings = {
    regenSpeed: 0.23,
    dangerSenseCost: 3,
    dangerSenseSlowMoFrames: 24,
    dangerSenseSlowMoScale: 0.02,
    dangerSenseThreatDamage: 30,
    dangerSenseThreatSpeed: 70,
    dangerSenseThreatDistance: 420
};
var playerForce = 100;
var playerMaxForce = 100;
var dangerSense = 0;
var projectilePools = {
    lasers: [],
    detonators: [],
    maxLasers: 160,
    maxDetonators: 40
};
var getPooledLaser = function(config) {
    var laser = projectilePools.lasers.pop();
    if (laser) {
        laser.reset(config);
        return laser;
    }
    return new Laser(config);
};
var getPooledDetonator = function(config) {
    var det = projectilePools.detonators.pop();
    if (det) {
        det.reset(config);
        return det;
    }
    return new Detonator(config);
};
var recycleProjectile = function(ent) {
    if (!ent || !ent.poolType) {
        return;
    }
    ent.owner = null;
    ent.renderFunc = null;
    ent._activeLayer = undefined;
    if (ent.poolType === "laser" && projectilePools.lasers.length < projectilePools.maxLasers) {
        projectilePools.lasers.push(ent);
    } else if (ent.poolType === "detonator" && projectilePools.detonators.length < projectilePools.maxDetonators) {
        projectilePools.detonators.push(ent);
    }
};
var keys = {}; //The keys being pressed
var aiSettings = {
    aimShootTolerance: 18,
    aimThrowTolerance: 24,
    botSpeed: 1,
    useLearningBots: true,
    debugLearning: false,
    explorationRate: 0.5,
    rewardScale: 1,
    targetSearchRange: 1450,
    preferredCombatRange: 430,
    botSpacingRange: 155,
    idleSpreadRange: 320,
    detonatorAvoidRange: 430,
    detonatorUrgentRange: 250,
    detonatorPenalty: 0.025,
    lightsaberFearRange: 400,
    lightsaberKeepAwayRange: 300,
    maxBotMoveSpeedMult: 1.45,
    botDetonatorCooldown: 280,
    botDetonatorMinRange: 280,
    botDetonatorMaxRange: 400,
    botDetonatorThrowChance: 0.12,
    botHealthScale: 2 / 3,
    botDamageScale: 1,
    squadFollowMinRange: 145,
    squadFollowMaxRange: 360,
    squadFollowComfortRange: 235,
    squadFollowPull: 1.35,
    squadPriorityRange: 430,
    squadShootBias: 1.15,
    learningRate: 0.08,
    discount: 0.9,
    decisionFrames: 10,
    perceptionIntervalMs: 100,
    friendlyCheckMs: 50
};
var matchBotWalkSpeed = playerSpeed * 1.45;
var aiTacticalActions = ["advance", "strafe", "retreat", "hold", "chaseEnemy", "shootEnemy", "throwDetonator", "regroup", "spreadOut", "avoidDetonator", "unstuck"];
var aiTargetSerial = 1;
var runtimeErrMsg = "";
var runtimeFailed = false;
var performanceStats = {
    updateMs: 0,
    renderMs: 0,
    targetCandidates: 0,
    sightSamples: 0,
    culledObjects: 0,
    perceptionScans: 0
};
var inputKeys = {
    sprint: 16,
    jump: 32,
    left: 65,
    right: 68,
    up: 87,
    down: 83,
    zoom: 90,
    focus: 88,
    cosmetics: 74,
    unstick: 66,
    dash: 67,
    reload: 82,
    saber: 86,
    medkit: 81,
    detonator: 71,
    landmine: 72,
    arrowLeft: 37,
    arrowRight: 39,
    arrowUp: 38,
    arrowDown: 40,
    consoleOpen: 84,
    consoleClose: 192,
    escape: 27
};
var hudLayout = {
    minimapX: 20,
    minimapY: 430,
    minimapSize: 150,
    weaponX: 470,
    weaponY: 575
};
var canAcceptGameplayInput = function() {
    return (gameStage === "Play" && matchState.phase === "live" && !stageTransition.active && !deathScreenActive && !runtimeFailed && !devConsole.active);
};
var getSelectedCharacterData = function() {
    if (!characterData[character]) {
        character = defaultCharacter;
    }
    return characterData[character];
};
var getSelectedMap = function() {
    var maps = {
        Kashyyyk: Kashyyyk,
        Jakku: Jakku,
        "Star Destroyer": StarDestroyer
    };
    return maps[planetList[0]] || Kashyyyk || null;
};
var tickClock = {
    baseMs: 1000 / 60,
    stepMs: 1000 / 60,
    lastMs: null,
    deltaMs: 1000 / 60,
    wallStepMs: 1000 / 60,
    renderDeltaMs: 1000 / 60,
    renderScale: 1,
    realMs: 0,
    gameMs: 0,
    accumulatorMs: 0,
    maxGapMs: 250,
    tick: 0,
    stepsThisFrame: 0,
    scale: 1
};
var gameInput = {
    pressed: {},
    mousePressed: false,
    mouseReleased: false
};
var clearGameInput = function() {
    gameInput.pressed = {};
    gameInput.mousePressed = false;
    gameInput.mouseReleased = false;
};
var uiEase = function(amount) {
    return 1 - pow(1 - amount, tickClock.renderScale);
};
/**Helper Functions**/
var drawImg = function(img, x, y, w, h) {
    if (!img) {
        return false;
    }
    image(img, x, y, w, h);
    return true;
};
var prepMap = function(map) {
    if (!map) {
        return false;
    }
    if (!map.entities) {
        map.entities = {};
    }
    for (var layer = min(map.bottomZ !== undefined ? map.bottomZ : 0, map.killZ !== undefined ? map.killZ : 0) - 2; layer <= (map.topZ !== undefined ? map.topZ : 0) + 3; layer++) {
        if (!map.entities[layer]) {
            map.entities[layer] = [];
        }
    }
    return true;
};
var solidAt = function(x, y, z, size) {
    if (!currentMap || !currentMap.objects) {
        return false;
    }
    var zLayer = floor(z);
    var zRounded = round(z * 10) / 10;
    for (var layer = zLayer - 1; layer <= zLayer; layer++) {
        var cols = currentMap.getNearbyCollisions ? currentMap.getNearbyCollisions(layer, x, y, size + 2) : currentMap.collisionLayers ? currentMap.collisionLayers[layer] : null;
        if (!cols || cols.length === undefined) {
            continue;
        }
        for (var c = 0; c < cols.length; c++) {
            var col = cols[c];
            if (!col || col.plane) {
                continue;
            }
            for (var p = 0; p < colSamples.length; p++) {
                if (col.checkCollision(x + size * colSamples[p].x, y + size * colSamples[p].y, zRounded)) {
                    return true;
                }
            }
        }
    }
    return false;
};
var softCharCollide = function(actor, isPlayerActor) {
    if (!currentMap || !currentMap.entities) {
        return;
    }
    var pos = isPlayerActor ? playerPos : actor.pos;
    var vel = isPlayerActor ? playerVel : actor.vel;
    var size = isPlayerActor ? hitboxSize : actor.colSize;
    if (!pos || !vel || !size) {
        return;
    }
    var tick = tickClock.scale;
    var z0 = floor(pos.z);
    var zMin = max(currentMap.killZ, z0 - 1);
    var zMax = min(currentMap.topZ + 1, z0 + 1);
    for (var z = zMin; z <= zMax; z++) {
        var list = currentMap.entities[z];
        if (!list) {
            continue;
        }
        for (var i = 0; i < list.length; i++) {
            var ent = list[i];
            if (!ent || !ent.pos || ent.health === undefined || ent.health <= 0 || ent === actor) {
                continue;
            }
            if (abs(ent.pos.z - pos.z) > 1.2) {
                continue;
            }
            var minDist = (size + (ent.colSize || hitboxSize)) * 0.82;
            var dx = pos.x - ent.pos.x;
            var dy = pos.y - ent.pos.y;
            var dSq = dx * dx + dy * dy;
            if (dSq >= minDist * minDist) {
                continue;
            }
            var d = sqrt(max(dSq, 0.0001));
            if (d < 0.01) {
                dx = cos((tickClock.tick + i * 37) % 360);
                dy = sin((tickClock.tick + i * 37) % 360);
                d = 1;
            }
            var push = min((minDist - d) * 0.18 * tick, 4.5);
            var nx = dx / d;
            var ny = dy / d;
            var actorPush = push * 0.5;
            var otherPush = push * 0.5;
            pos.x += nx * actorPush;
            pos.y += ny * actorPush;
            vel.x += nx * actorPush * 0.08;
            vel.y += ny * actorPush * 0.08;
            if (ent.vel) {
                ent.pos.x -= nx * otherPush;
                ent.pos.y -= ny * otherPush;
                ent.vel.x -= nx * otherPush * 0.08;
                ent.vel.y -= ny * otherPush * 0.08;
            }
        }
    }
};
var applyDamage = function(target, dmg) {
    if (!target) {
        return;
    }
    if (dmg <= 0) {
        return;
    }
    if (target.maxShield === undefined) {
        target.maxShield = 0;
    }
    if (target.shield === undefined) {
        target.shield = target.maxShield;
    }
    if (target.shield < 0) {
        target.shield = 0;
    }
    if (target.shield > target.maxShield) {
        target.shield = target.maxShield;
    }
    if (target.shield > 0) {
        var take = min(target.shield, dmg);
        target.shield -= take;
        dmg -= take;
    }
    if (dmg > 0) {
        if (target.health !== undefined) {
            var mult = target.damageMult !== undefined ? target.damageMult : 1;
            target.health -= dmg * mult;
            if (target.maxHealth === undefined) {
                target.maxHealth = target.health;
            }
            if (target.health < 0) {
                target.health = 0;
            }
            if (target.health > target.maxHealth) {
                target.health = target.maxHealth;
            }
        }
    }
};
var aiMoveToward = function(bot, targetPos, speedScale) {
    if (!targetPos) {
        return;
    }
    var dx = targetPos.x - bot.pos.x;
    var dy = targetPos.y - bot.pos.y;
    var d = sqrt(dx * dx + dy * dy);
    if (d < 0.001) {
        return;
    }
    var accel = min(bot.walkSpeed * (speedScale || 1), playerSpeed * aiSettings.maxBotMoveSpeedMult) * tickClock.scale;
    bot.vel.x += (dx / d) * accel;
    bot.vel.y += (dy / d) * accel;
};
var aiMoveAway = function(bot, targetPos, speedScale) {
    if (!targetPos) {
        return;
    }
    var away = {
        x: bot.pos.x + (bot.pos.x - targetPos.x),
        y: bot.pos.y + (bot.pos.y - targetPos.y),
        z: bot.pos.z
    };
    aiMoveToward(bot, away, speedScale);
};
var aiApplySquadFollow = function(bot, crowdingAlly) {
    if (!bot || !bot.inPlayerSquad || !bot.aiMemory) {
        return;
    }
    var dx = playerPos.x - bot.pos.x;
    var dy = playerPos.y - bot.pos.y;
    var d = sqrt(dx * dx + dy * dy);
    bot.aiMemory.squadStepTimer -= tickClock.scale;
    if (bot.aiMemory.squadStepTimer <= 0) {
        bot.aiMemory.squadAngle += random(-65, 65);
        bot.aiMemory.squadDrift = random(-115, 115);
        bot.aiMemory.squadStepPower = random(0.45, 0.9);
        bot.aiMemory.squadStepTimer = floor(random(48, 110));
    } else {
        bot.aiMemory.squadAngle += random(-0.75, 0.75) * tickClock.scale;
    }
    var desired = aiSettings.squadFollowComfortRange + bot.aiMemory.squadDrift;
    var anchor = {
        x: playerPos.x + cos(bot.aiMemory.squadAngle) * desired,
        y: playerPos.y + sin(bot.aiMemory.squadAngle) * desired,
        z: playerPos.z
    };
    if (d > aiSettings.squadFollowMaxRange) {
        aiMoveToward(bot, anchor, aiSettings.squadFollowPull);
    } else if (d < aiSettings.squadFollowMinRange) {
        aiMoveAway(bot, playerPos, 0.5);
    } else if (d > aiSettings.squadFollowComfortRange) {
        aiMoveToward(bot, anchor, 0.4);
    } else if (dist(bot.pos.x, bot.pos.y, anchor.x, anchor.y) > 80) {
        aiMoveToward(bot, anchor, bot.aiMemory.squadStepPower);
    }
    if (crowdingAlly && crowdingAlly.pos) {
        aiMoveAway(bot, crowdingAlly.pos, 0.45);
    }
};

var skinImageNames = {
    "First Order Stormtrooper": "PlayerSkin_FirstOrderStormtrooper",
    Shadowtrooper: "PlayerSkin_Shadowtrooper",
    "Shadow Trooper": "PlayerSkin_Shadowtrooper",
    "Heavy Shoretrooper": "PlayerSkin_HeavyShoretrooper",
    Shoretrooper: "PlayerSkin_Shoretrooper",
    "Luke Skywalker": "PlayerSkin_LukeSkywalker",
    "Kylo Ren": "PlayerSkin_KyloRen",
    "Clone Trooper": "PlayerSkin_CloneTrooper",
    "Rebel Trooper": "PlayerSkin_RebelTrooper"
};
var drawSkinHands = function(skinName, size) {
    drawAsset(skinImageNames[skinName] + "_Hands", 0, 0, size / 212);
};
var drawPlayer = function(skin, size, hideHands) {
    var name = skinImageNames[skin];
    if (name && assetImages[name]) {
        image(assetImages[name], -size, -size, size * 2, size * 2);
    }
    if (!hideHands) {
        drawSkinHands(skin, size);
    }
};
var getHandColors = function(skinName) {
    var n = ("" + skinName).toLowerCase();
    if (n.indexOf("rebel") >= 0 || n.indexOf("luke") >= 0) {
        return {
            fill: color(219, 197, 143),
            stroke: color(173, 155, 114)
        };
    }
    if (n.indexOf("shore") >= 0) {
        return {
            fill: color(202, 193, 136),
            stroke: color(184, 176, 128)
        };
    }
    if (n.indexOf("shadow") >= 0 || n.indexOf("kylo") >= 0) {
        return {
            fill: color(38, 38, 38),
            stroke: color(23)
        };
    }
    return {
        fill: color(250),
        stroke: color(214, 214, 214)
    };
};
var renderBlaster = function(gun, skinName, pose) {
    if (!gun || !gun.render) {
        return;
    }
    if (gun.isLightsaber) {
        gun.render(skinName);
        return;
    }
    var tactical = 1 - constrain(pose, 0, 1);
    pushMatrix();
    translate(-15 * constrain(tactical, 0, 1), -35 - 4 * constrain(tactical, 0, 1));
    rotate(-90 + 70 * constrain(tactical, 0, 1));
    scale(0.5, 0.5);
    gun.render();
    var hand = getHandColors(skinName);
    pushStyle();
    stroke(hand.stroke);
    strokeWeight(5);
    fill(hand.fill);
    ellipse(22, 18, 30, 30);
    ellipse(76, 14, 30, 30);
    popStyle();
    popMatrix();
};
var crosshair = function(x1, y1, x2, y2, r, type, spread) {
    if (type === "spread") {
        stroke(0, 150);
        noFill();
        strokeWeight(dist(x1, y1, x2, y2) / 70);
        pushMatrix();
        translate(x2, y2);
        rotate(r);
        strokeCap(SQUARE);
        arc(0, 0, dist(x1, y1, x2, y2) * 2, dist(x1, y1, x2, y2) * 2, -spread / 2, spread / 2);
        arc(0, 0, dist(x1, y1, x2, y2) * 1.5, dist(x1, y1, x2, y2) * 1.5, -spread / 3, spread / 3);
        line(dist(x1, y1, x2, y2) / 1.1, 0, dist(x1, y1, x2, y2) - 2, 0);
        strokeCap(ROUND);
        popMatrix();
    } else if (type === "normal") {
        stroke(0, 150);
        noFill();
        strokeWeight(dist(x1, y1, x2, y2) / 70);
        pushMatrix();
        translate(x1, y1);
        rotate((tickClock.realMs / tickClock.baseMs) * 2);
        strokeCap(SQUARE);
        ellipse(0, 0, dist(x1, y1, x2, y2) / 3.5, dist(x1, y1, x2, y2) / 3.5);
        line(dist(x1, y1, x2, y2) / 15, 0, dist(x1, y1, x2, y2) / 5, 0);
        line(-dist(x1, y1, x2, y2) / 15, 0, -dist(x1, y1, x2, y2) / 5, 0);
        line(0, dist(x1, y1, x2, y2) / 15, 0, dist(x1, y1, x2, y2) / 5);
        line(0, -dist(x1, y1, x2, y2) / 15, 0, -dist(x1, y1, x2, y2) / 5);
        point(0, 0);
        strokeCap(ROUND);
        popMatrix();
    }
};
var playSound_ = function(name, vol) {};
var stopSound_ = function(name) {};
var stopCreditClicks = function() {
    stopSound_("score");
    creditDisplay.value = playerCredits;
    creditDisplay.speed = 0;
    creditDisplay.scrollSoundValue = round(playerCredits);
    creditDisplay.scrollSoundTick = 0;
    creditDisplay.soundEnabled = false;
};
var playCreditClick = function() {
    if (!creditDisplay.soundEnabled) {
        return;
    }
    playSound_("score", 0.225);
};
matchState = {
    gameMode: "Team Deathmatch",
    scoreLimit: 100,
    teamScores: [0, 0],
    botRespawns: [],
    phase: "idle",
    countdownFrame: 0,
    countdownStarted: false,
    countdownStepFrames: 72,
    winCheckFrame: 0,
    winConfirmFrames: 30,
    endingFrame: 0,
    endingHoldFrames: 96,
    playerKills: 0,
    lastCreditAward: 0,
    creditsAwarded: false,
    winnerTeam: -1
};
var findOpenMatchSpawn = function(anchor, minPlayerDist, minEntityDist, angleHint, radiusMin, radiusMax) {
    anchor = anchor || currentMap.spawnPos;
    var spawnX = anchor.x;
    var spawnY = anchor.y;
    var spawnZ = anchor.z;
    for (var attempt = 0; attempt < 180; attempt++) {
        var testX;
        var testY;
        if (angleHint !== null && angleHint !== undefined && attempt < 100) {
            var spawnAngle = angleHint + random(-26, 26);
            var spawnRadius = random(radiusMin || 130, radiusMax || 520);
            testX = constrain(anchor.x + cos(spawnAngle) * spawnRadius, -currentMap.width / 2 + 70, currentMap.width / 2 - 70);
            testY = constrain(anchor.y + sin(spawnAngle) * spawnRadius, -currentMap.height / 2 + 70, currentMap.height / 2 - 70);
        } else {
            testX = random(-currentMap.width / 2 + 90, currentMap.width / 2 - 90);
            testY = random(-currentMap.height / 2 + 90, currentMap.height / 2 - 90);
        }
        var clearOfEntities = dist(testX, testY, playerPos.x, playerPos.y) > minPlayerDist;
        for (var z = currentMap.killZ; z < currentMap.topZ + 2 && clearOfEntities; z++) {
            var entList = currentMap.entities[z];
            if (!entList) {
                continue;
            }
            for (var e = 0; e < entList.length; e++) {
                var ent = entList[e];
                if (ent && ent.pos && dist(testX, testY, ent.pos.x, ent.pos.y) < minEntityDist) {
                    clearOfEntities = false;
                    break;
                }
            }
        }
        var floorFound = false;
        var floorZ = spawnZ;
        for (var layer = currentMap.killZ; layer <= currentMap.topZ + 1 && !floorFound; layer++) {
            var cols = currentMap.collisionLayers ? currentMap.collisionLayers[layer] : null;
            if (!cols || cols.length === undefined) {
                continue;
            }
            for (var colIndex = 0; colIndex < cols.length; colIndex++) {
                var col = cols[colIndex];
                if (!col || !col.plane || !col.spawnSurface) {
                    continue;
                }
                var testZ = col.lowZ !== undefined ? floor(col.lowZ) : layer;
                if (testZ < currentMap.killZ || testZ > currentMap.topZ + 1) {
                    continue;
                }
                if (col.checkCollision(testX, testY, testZ) && !solidAt(testX, testY, testZ, hitboxSize)) {
                    floorZ = testZ + 0.001;
                    floorFound = true;
                    break;
                }
            }
        }
        if (clearOfEntities && floorFound) {
            return {
                x: testX,
                y: testY,
                z: floorZ
            };
        }
    }
    return {
        x: spawnX,
        y: spawnY,
        z: spawnZ
    };
};
var spawnBRBots = function() {
    var botSkins = ["Rebel Trooper", "First Order Stormtrooper"];
    var botCount = 23;
    for (var b = 0; b < botCount; b++) {
        var spawn = findOpenMatchSpawn(currentMap.spawnPos, hitboxSize * 5.6, hitboxSize * 4.5,
            (360 / botCount) * b, min(currentMap.width, currentMap.height) * 0.12, min(currentMap.width, currentMap.height) * 0.46);
        var bot = new AIPlayer({
            x: spawn.x,
            y: spawn.y,
            z: spawn.z,
            team: 100 + b,
            skin: botSkins[b % botSkins.length],
            walkSpeed: matchBotWalkSpeed
        });
        bot.isMatchBot = true;
        bot.isBattleRoyaleBot = true;
        var layer = constrain(floor(bot.pos.z), currentMap.killZ, currentMap.topZ + 1);
        if (!currentMap.entities[layer]) {
            currentMap.entities[layer] = [];
        }
        currentMap.entities[layer].push(bot);
    }
    currentMap._initialTeamBotsSpawned = true;
};
var spawnMatchBots = function() {
    if (!currentMap || currentMap._initialTeamBotsSpawned) {
        return;
    }
    var skinName = ("" + skin).toLowerCase();
    if (skinName.indexOf("rebel") >= 0 || skinName.indexOf("clone") >= 0) {
        playerTeam = 0;
    } else {
        playerTeam = 1;
    }
    if (matchState.gameMode === "Battle Royale") {
        spawnBRBots();
        return;
    }
    var teamSkins = ["Rebel Trooper", "First Order Stormtrooper"];
    currentMap._matchClusterSpawns = [];
    currentMap._matchPlayerSpawn = null;
    for (var clusterTeam = 0; clusterTeam < 2; clusterTeam++) {
        var clusterX = currentMap.spawnPos.x;
        var clusterY = currentMap.spawnPos.y;
        var clusterZ = currentMap.spawnPos.z;
        var clusterAnchorFound = false;
        for (var clusterAttempt = 0; clusterAttempt < 180; clusterAttempt++) {
            var clusterTestX = random(-currentMap.width / 2 + 90, currentMap.width / 2 - 90);
            var clusterTestY = random(-currentMap.height / 2 + 90, currentMap.height / 2 - 90);
            var clusterFarEnough = true;
            if (clusterTeam > 0 && currentMap._matchClusterSpawns[0]) {
                clusterFarEnough = dist(clusterTestX, clusterTestY, currentMap._matchClusterSpawns[0].x, currentMap._matchClusterSpawns[0].y) > min(currentMap.width, currentMap.height) * 0.35;
            }
            if (!clusterFarEnough) {
                continue;
            }
            var clusterFloorFound = false;
            var clusterFloorZ = currentMap.spawnPos.z;
            for (var clusterLayer = currentMap.killZ; clusterLayer <= currentMap.topZ + 1 && !clusterFloorFound; clusterLayer++) {
                var clusterCols = currentMap.collisionLayers ? currentMap.collisionLayers[clusterLayer] : null;
                if (!clusterCols || clusterCols.length === undefined) {
                    continue;
                }
                for (var clusterColIndex = 0; clusterColIndex < clusterCols.length; clusterColIndex++) {
                    var clusterCol = clusterCols[clusterColIndex];
                    if (!clusterCol || !clusterCol.plane || !clusterCol.spawnSurface) {
                        continue;
                    }
                    var clusterTestZ = clusterCol.lowZ !== undefined ? floor(clusterCol.lowZ) : clusterLayer;
                    if (clusterTestZ < currentMap.killZ || clusterTestZ > currentMap.topZ + 1) {
                        continue;
                    }
                    if (clusterCol.checkCollision(clusterTestX, clusterTestY, clusterTestZ) && !solidAt(clusterTestX, clusterTestY, clusterTestZ, hitboxSize)) {
                        clusterFloorZ = clusterTestZ + 0.001;
                        clusterFloorFound = true;
                        break;
                    }
                }
            }
            if (clusterFloorFound) {
                clusterX = clusterTestX;
                clusterY = clusterTestY;
                clusterZ = clusterFloorZ;
                clusterAnchorFound = true;
                break;
            }
        }
        if (!clusterAnchorFound) {
            for (var fallbackLayer = currentMap.killZ; fallbackLayer <= currentMap.topZ + 1; fallbackLayer++) {
                var fallbackCols = currentMap.collisionLayers ? currentMap.collisionLayers[fallbackLayer] : null;
                if (!fallbackCols || fallbackCols.length === undefined) {
                    continue;
                }
                for (var fallbackColIndex = 0; fallbackColIndex < fallbackCols.length; fallbackColIndex++) {
                    var fallbackCol = fallbackCols[fallbackColIndex];
                    if (!fallbackCol || !fallbackCol.plane || !fallbackCol.spawnSurface) {
                        continue;
                    }
                    var fallbackTestZ = fallbackCol.lowZ !== undefined ? floor(fallbackCol.lowZ) : fallbackLayer;
                    if (fallbackTestZ < currentMap.killZ || fallbackTestZ > currentMap.topZ + 1) {
                        continue;
                    }
                    if (fallbackCol.checkCollision(clusterX, clusterY, fallbackTestZ) && !solidAt(clusterX, clusterY, fallbackTestZ, hitboxSize)) {
                        clusterZ = fallbackTestZ + 0.001;
                        clusterAnchorFound = true;
                        break;
                    }
                }
                if (clusterAnchorFound) {
                    break;
                }
            }
        }
        currentMap._matchClusterSpawns[clusterTeam] = {
            x: clusterX,
            y: clusterY,
            z: clusterZ
        };
    }
    for (var teamId = 0; teamId < 2; teamId++) {
        var botCount = teamId === playerTeam ? 7 : 8;
        var teamCluster = currentMap._matchClusterSpawns[teamId] || currentMap.spawnPos;
        for (var b = 0; b < botCount; b++) {
            var spawnX = teamCluster.x;
            var spawnY = teamCluster.y;
            var spawnZ = teamCluster.z;
            for (var attempt = 0; attempt < 128; attempt++) {
                var spawnAngle = (360 / botCount) * b + random(-24, 24);
                var spawnRadius = random(145, 470);
                var testX = constrain(teamCluster.x + cos(spawnAngle) * spawnRadius, -currentMap.width / 2 + 70, currentMap.width / 2 - 70);
                var testY = constrain(teamCluster.y + sin(spawnAngle) * spawnRadius, -currentMap.height / 2 + 70, currentMap.height / 2 - 70);
                var clearOfEntities = dist(testX, testY, playerPos.x, playerPos.y) > hitboxSize * 4.2;
                for (var z = currentMap.killZ; z < currentMap.topZ + 2 && clearOfEntities; z++) {
                    var entList = currentMap.entities[z];
                    if (!entList) {
                        continue;
                    }
                    for (var e = 0; e < entList.length; e++) {
                        var ent = entList[e];
                        if (ent && ent.pos && dist(testX, testY, ent.pos.x, ent.pos.y) < hitboxSize * 4.2) {
                            clearOfEntities = false;
                            break;
                        }
                    }
                }
                var botFloorFound = false;
                var botFloorZ = spawnZ;
                for (var botLayer = currentMap.killZ; botLayer <= currentMap.topZ + 1 && !botFloorFound; botLayer++) {
                    var botCols = currentMap.collisionLayers ? currentMap.collisionLayers[botLayer] : null;
                    if (!botCols || botCols.length === undefined) {
                        continue;
                    }
                    for (var botColIndex = 0; botColIndex < botCols.length; botColIndex++) {
                        var botCol = botCols[botColIndex];
                        if (!botCol || !botCol.plane || !botCol.spawnSurface) {
                            continue;
                        }
                        var botTestZ = botCol.lowZ !== undefined ? floor(botCol.lowZ) : botLayer;
                        if (botTestZ < currentMap.killZ || botTestZ > currentMap.topZ + 1) {
                            continue;
                        }
                        if (botCol.checkCollision(testX, testY, botTestZ) && !solidAt(testX, testY, botTestZ, hitboxSize)) {
                            botFloorZ = botTestZ + 0.001;
                            botFloorFound = true;
                            break;
                        }
                    }
                }
                if (clearOfEntities && botFloorFound) {
                    spawnX = testX;
                    spawnY = testY;
                    spawnZ = botFloorZ;
                    break;
                }
            }
            var bot = new AIPlayer({
                x: spawnX,
                y: spawnY,
                z: spawnZ,
                team: teamId,
                skin: teamSkins[teamId],
                walkSpeed: matchBotWalkSpeed
            });
            bot.isMatchBot = true;
            if (teamId === playerTeam && b < 3) {
                bot.wasPlayerSquad = true;
                bot.inPlayerSquad = true;
            }
            var layer = constrain(floor(bot.pos.z), currentMap.killZ, currentMap.topZ + 1);
            if (!currentMap.entities[layer]) {
                currentMap.entities[layer] = [];
            }
            currentMap.entities[layer].push(bot);
        }
    }
    currentMap._initialTeamBotsSpawned = true;
};
var playerDie = function(respawnNow) {
    if (respawnNow !== true) {
        if (deathScreenActive) {
            return;
        }
        if (matchState.gameMode === "Battle Royale" && matchState.phase === "live") {
            matchState.phase = "ending";
            matchState.winnerTeam = -2;
            matchState.endingFrame = 0;
            playerHealth = 0;
            playerShield = 0;
            playerVel.mult(0);
            squadCommandMode = false;
            stopCreditClicks();
            return;
        }
        playerDeaths++;
        deathScreenActive = true;
        deathScreenFrame = 0;
        deathTransStarted = false;
        deathScorePaid = true;
        squadCommandMode = false;
        playerHealth = 0;
        playerShield = 0;
        playerVel.mult(0);
        return;
    }
    if (!deathScreenActive) {
        playerDeaths++;
    }
    deathScreenActive = false;
    deathScreenFrame = 0;
    deathTransStarted = false;
    stuckHoldCount = 0;
    stuckHoldLock = false;
    deathScorePaid = false;
    var respawnSkinName = ("" + skin).toLowerCase();
    if (respawnSkinName.indexOf("rebel") >= 0 || respawnSkinName.indexOf("clone") >= 0) {
        playerTeam = 0;
    } else {
        playerTeam = 1;
    }
    if (playerDeaths === 0) {
        spawnMatchBots();
    }
    playerVel.mult(0);
    var playerCluster = currentMap._matchClusterSpawns && currentMap._matchClusterSpawns[playerTeam] ? currentMap._matchClusterSpawns[playerTeam] : currentMap.spawnPos;
    var playerSpawnX = playerCluster.x;
    var playerSpawnY = playerCluster.y;
    var playerSpawnZ = playerCluster.z;
    for (var playerAttempt = 0; playerAttempt < 160; playerAttempt++) {
        var playerSpawnAngle = random(0, 360);
        var playerSpawnRadius = random(130, 430);
        var playerTestX = constrain(playerCluster.x + cos(playerSpawnAngle) * playerSpawnRadius, -currentMap.width / 2 + 70, currentMap.width / 2 - 70);
        var playerTestY = constrain(playerCluster.y + sin(playerSpawnAngle) * playerSpawnRadius, -currentMap.height / 2 + 70, currentMap.height / 2 - 70);
        var playerClearEnts = true;
        for (var playerZ = currentMap.killZ; playerZ < currentMap.topZ + 2 && playerClearEnts; playerZ++) {
            var playerEntList = currentMap.entities[playerZ];
            if (!playerEntList) {
                continue;
            }
            for (var playerE = 0; playerE < playerEntList.length; playerE++) {
                var playerEnt = playerEntList[playerE];
                if (playerEnt && playerEnt.pos && dist(playerTestX, playerTestY, playerEnt.pos.x, playerEnt.pos.y) < hitboxSize * 4.2) {
                    playerClearEnts = false;
                    break;
                }
            }
        }
        var playerFloorFound = false;
        var playerFloorZ = playerSpawnZ;
        for (var playerLayer = currentMap.killZ; playerLayer <= currentMap.topZ + 1 && !playerFloorFound; playerLayer++) {
            var playerCols = currentMap.collisionLayers ? currentMap.collisionLayers[playerLayer] : null;
            if (!playerCols || playerCols.length === undefined) {
                continue;
            }
            for (var playerColIndex = 0; playerColIndex < playerCols.length; playerColIndex++) {
                var playerCol = playerCols[playerColIndex];
                if (!playerCol || !playerCol.plane || !playerCol.spawnSurface) {
                    continue;
                }
                var playerTestZ = playerCol.lowZ !== undefined ? floor(playerCol.lowZ) : playerLayer;
                if (playerTestZ < currentMap.killZ || playerTestZ > currentMap.topZ + 1) {
                    continue;
                }
                if (playerCol.checkCollision(playerTestX, playerTestY, playerTestZ) && !solidAt(playerTestX, playerTestY, playerTestZ, hitboxSize)) {
                    playerFloorZ = playerTestZ + 0.001;
                    playerFloorFound = true;
                    break;
                }
            }
        }
        if (playerClearEnts && playerFloorFound) {
            playerSpawnX = playerTestX;
            playerSpawnY = playerTestY;
            playerSpawnZ = playerFloorZ;
            break;
        }
    }
    currentMap._matchPlayerSpawn = {
        x: playerSpawnX,
        y: playerSpawnY,
        z: playerSpawnZ
    };
    for (var className in characterData) {
        if (!characterData[className] || !characterData[className].abilities) {
            continue;
        }
        if (characterData[className].equipment) {
            characterData[className].equipment.durationCount = characterData[className].equipment.duration;
        }
        for (var abilityIndex = 0; abilityIndex < characterData[className].abilities.length; abilityIndex++) {
            var respawnAbility = characterData[className].abilities[abilityIndex];
            if (!respawnAbility) {
                continue;
            }
            respawnAbility.rechargeCount = 0;
            respawnAbility.pressed = false;
            if (respawnAbility.maxUses !== undefined) {
                respawnAbility.remainingUses = respawnAbility.maxUses;
                respawnAbility.durationCount = 0;
            } else if (respawnAbility.sprite === "jetpack_icon") {
                respawnAbility.durationCount = respawnAbility.duration;
            } else {
                respawnAbility.durationCount = 0;
            }
        }
    }
    inventoryState.selected = 0;
    inventoryState.cosmeticsOpen = false;
    playerPos = new PVector(playerSpawnX, playerSpawnY, playerSpawnZ);
    cameraState.ready = false;
    currentGun.shots = 0;
    currentGun.reloadTime = 0;
    playerHealth = playerMaxHealth;
    playerShield = playerMaxShield;
    playerDamageMult = 1;
    stuckHoldCount = 0;
    stuckHoldLock = false;
};
var weaponSprite = function(x, y, s, r, type, c) {
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
};
/**SFX (SwankyMan, Modified)**/
// jshint ignore : start
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
        for (var i = 0; i < names.length; i++) {
            wanted[names[i]] = true;
        }
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
        $.ajax({ url: assetBase + "runtime.js", dataType: "script", cache: true, timeout: 60000 }).done(readPack).fail(fail);
    }).fail(fail);
};
var stepAssets = function() {
    if (assetLoad.error || !assetLoad.list.length || assetLoad.ready) return;
    try {
        var entry = assetLoad.list[assetLoad.index];
        var text = window.atob(window.BattlefrontPNG.images[entry.name]);
        var bytes = new window.Uint8Array(text.length);
        for (var i = 0; i < text.length; i++) {
            bytes[i] = text.charCodeAt(i);
        }
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

var assetNames = [
    "MenuMain",
    "MenuPlay",
    "MenuPlayCustom",
    "MenuShop",
    "MenuCredits",
    "MenuAchievements",
    "MinimapMask",
    "AT_AT_Moss",
    "Jakku_Sand",
    "AT_AT_Sand",
    "Jakku_Platform_Sand",
    "thermal_detonator",
    "medkit_1",
    "jetpack_icon",
    "jetpack_sprite",
    "red_landmine_sprite",
    "blue_landmine_sprite",
    "PlayerSkin_FirstOrderStormtrooper",
    "PlayerSkin_Shadowtrooper",
    "PlayerSkin_HeavyShoretrooper",
    "PlayerSkin_Shoretrooper",
    "PlayerSkin_LukeSkywalker",
    "PlayerSkin_KyloRen",
    "PlayerSkin_CloneTrooper",
    "PlayerSkin_RebelTrooper",
    "saber_hotbar_blue",
    "saber_hotbar_red",
    "weapon_F_11D",
    "weapon_Sniper",
    "weapon_E11",
    "icon_F_11D",
    "icon_E11",
    "icon_Sniper",
    "icon_Kylo_Ren_Lightsaber",
    "PlayerSkin_FirstOrderStormtrooper_Hands",
    "PlayerSkin_Shadowtrooper_Hands",
    "PlayerSkin_HeavyShoretrooper_Hands",
    "PlayerSkin_Shoretrooper_Hands",
    "PlayerSkin_LukeSkywalker_Hands",
    "PlayerSkin_KyloRen_Hands",
    "PlayerSkin_CloneTrooper_Hands",
    "PlayerSkin_RebelTrooper_Hands",
    "saber_blue_0",
    "saber_blue_1",
    "saber_blue_2",
    "saber_blue_3",
    "saber_blue_4",
    "saber_red_0",
    "saber_red_1",
    "saber_red_2",
    "saber_red_3",
    "saber_red_4",
    "StarWarsLogo",
    "Holo_0",
    "Holo_1",
    "Holo_2",
    "Holo_3",
    "Holo_4",
    "Holo_5",
    "Holo_6",
    "Holo_7",
    "Holo_8",
    "Holo_9",
    "Holo_10",
    "Holo_11",
    "Holo_12",
    "Holo_13",
    "Holo_14",
    "prop_AT_AT_Moss",
    "prop_AT_AT_Sand",
    "prop_CrashedTIE_sf",
    "prop_CrashedTIE_ln",
    "prop_CrashedXwing",
    "prop_Crate",
    "prop_Tree_tri",
    "prop_Tree_round",
    "prop_JunkPile_1",
    "prop_JunkPile_2",
    "prop_JunkPile_3",
    "prop_JunkPile_4",
    "prop_JunkPile_5"
];

// huge thanks to DebugRanger for the jsdelivr fetching
if (typeof PJSCodeInjector !== "undefined" && typeof Reflect !== "undefined") {
    PJSCodeInjector.applyInstance = function(o) {
        return function() {
            return Reflect.construct(o, arguments);
        };
    };
}
var AudioCtx = typeof AudioContext !== "undefined" ? AudioContext : typeof webkitAudioContext !== "undefined" ? webkitAudioContext : null;
var context = null;
var audio = null;
var audioLoadQueue = [];
var audioLoading = false;
var ensureAudioContext = function() {
    if (!context && AudioCtx) {
        try {
            context = new AudioCtx();
        } catch (e) {
            return false;
        }
    }
    if (context && context.resume) {
        try {
            var resumed = context.resume();
            if (resumed && resumed.catch) {
                resumed.catch(function() {});
            }
        } catch (e) {
            return false;
        }
    }
    return !!context;
};
var sounds = {};
var sources = {};
var sourceGains = {};
var soundBase64 = {};
var soundStatus = {};
var pendingSoundPlays = {};
var soundFiles = {
    blaster: "https://cdn.jsdelivr.net/gh/CoderGuyxLemoncelloJr/1@main/laser1.js",
    explosion: "https://cdn.jsdelivr.net/gh/CoderGuyxLemoncelloJr/1@main/explosion.js",
    swoosh: "https://cdn.jsdelivr.net/gh/CoderGuyxLemoncelloJr/1@main/swoosh.js",
    click: "https://cdn.jsdelivr.net/gh/CoderGuyxLemoncelloJr/1@main/click.js",
    lightsaberHum: "https://cdn.jsdelivr.net/gh/CoderGuyxLemoncelloJr/1@main/lightsaber-hum.js",
    kyloRenLightsaberHum: "https://cdn.jsdelivr.net/gh/CoderGuyxLemoncelloJr/1@main/kylo-ren-lightsaber-hum.js",
    kyloRenLightsaberIgnite: "https://cdn.jsdelivr.net/gh/CoderGuyxLemoncelloJr/1@main/kylo-ren-lightsaber-ignite.js",
    blastDoor: "https://cdn.jsdelivr.net/gh/CoderGuyxLemoncelloJr/1@main/blast-door.js",
    score: "https://cdn.jsdelivr.net/gh/CoderGuyxLemoncelloJr/1@main/score.js",
    openingCrawl: "https://cdn.jsdelivr.net/gh/CoderGuyxLemoncelloJr/1@main/opening-crawl.js"
};
var loadSound = function(name, base64String, afterLoad) {
    if (sounds[name]) {
        if (afterLoad) {
            afterLoad();
        }
        return;
    }
    if (!context) {
        soundStatus[name] = "audio disabled";
        return;
    }
    soundStatus[name] = "decoding";
    var binary = atob(base64String);
    var arrayBuffer = new ArrayBuffer(binary.length);
    var bytes = new Uint8Array(arrayBuffer);
    for (var bufferIndex = 0; bufferIndex < arrayBuffer.byteLength; bufferIndex++) {
        bytes[bufferIndex] = binary.charCodeAt(bufferIndex) & 0xff;
    }
    context.decodeAudioData(arrayBuffer, function(buffer) {
        sounds[name] = buffer;
        soundStatus[name] = "ready";
        if (afterLoad) {
            afterLoad();
        }
    }, function(e) {
        soundStatus[name] = "decode error";
        pendingSoundPlays[name] = null;
        println("Error decoding sound " + name);
    });
};
var playPendingSound = function(name) {
    var pendingSound = pendingSoundPlays[name];
    if (!pendingSound) {
        return;
    }
    pendingSoundPlays[name] = null;
    playSound_(name, pendingSound.vol, pendingSound.loop, pendingSound.onEnded, pendingSound.offset);
};
var processAudioLoadQueue = function() {
    if (audioLoading || !audioLoadQueue.length) {
        return;
    }
    var entry = audioLoadQueue.shift();
    if (typeof $ === "undefined" || !$.ajax) {
        soundStatus[entry.name] = "loader missing";
        pendingSoundPlays[entry.name] = null;
        processAudioLoadQueue();
        return;
    }
    audioLoading = true;
    soundStatus[entry.name] = "loading";
    audio = null;
    if (typeof window !== "undefined") {
        window.audio = null;
    }
    var finish = function() {
        audio = null;
        if (typeof window !== "undefined") {
            window.audio = null;
        }
        audioLoading = false;
        processAudioLoadQueue();
    };
    try {
        $.ajax({
            url: entry.url,
            dataType: "script",
            cache: true,
            timeout: 10000
        }).done(function() {
            var loadedAudio = audio || (typeof window !== "undefined" && window.audio);
            if (!loadedAudio) {
                soundStatus[entry.name] = "loaded empty";
                pendingSoundPlays[entry.name] = null;
                return;
            }
            soundBase64[entry.name] = loadedAudio;
            try {
                loadSound(entry.name, loadedAudio, function() {
                    playPendingSound(entry.name);
                });
            } catch (e) {
                soundStatus[entry.name] = "decode error";
                pendingSoundPlays[entry.name] = null;
            }
        }).fail(function() {
            soundStatus[entry.name] = "failed";
            pendingSoundPlays[entry.name] = null;
        }).always(finish);
    } catch (e) {
        soundStatus[entry.name] = "failed";
        pendingSoundPlays[entry.name] = null;
        finish();
    }
};
var loadSoundScript = function(name, url) {
    if (soundStatus[name]) {
        return;
    }
    soundStatus[name] = "queued";
    audioLoadQueue.push({
        name: name,
        url: url
    });
    processAudioLoadQueue();
};
var volume = 1; //0 = silent, 1 = normal, 2 = louder
var soundEnabled = false;
var saberHumCooldown = 234;
var lastSaberHum = -9999;
var saberAudioToken = 0;
var saberIgniting = false;
var saberHumStart = -9999;
var kyloHumDelay = 1;
var playSoundInternal = function(name, vol, loop, onEnded, offset) {
    if (!soundEnabled || !ensureAudioContext()) {
        return null;
    }
    if (!sounds[name]) {
        pendingSoundPlays[name] = {
            vol: vol,
            loop: loop,
            onEnded: onEnded,
            offset: offset
        };
        if (soundBase64[name] && soundStatus[name] !== "decoding" && soundStatus[name] !== "decode error") {
            loadSound(name, soundBase64[name], function() {
                playPendingSound(name);
            });
        } else if (soundFiles[name] && soundStatus[name] !== "loading" && soundStatus[name] !== "decoding" && !soundStatus[name]) {
            loadSoundScript(name, soundFiles[name]);
        }
        return null;
    }
    var gain = context.createGain();
    gain.gain.value = max(0, vol === undefined ? volume : vol);
    var source = context.createBufferSource();
    source.buffer = sounds[name];
    source.loop = !!loop;
    source.connect(gain);
    gain.connect(context.destination);
    if (!sources[name]) {
        sources[name] = [];
    }
    if (!sourceGains[name]) {
        sourceGains[name] = [];
    }
    sources[name].push(source);
    sourceGains[name].push(gain);
    source.onended = function() {
        var activeSources = sources[name];
        var activeGains = sourceGains[name];
        if (!activeSources) {
            return;
        }
        for (var sourceIndex = activeSources.length - 1; sourceIndex >= 0; sourceIndex--) {
            if (activeSources[sourceIndex] === source) {
                activeSources.splice(sourceIndex, 1);
                if (activeGains) {
                    activeGains.splice(sourceIndex, 1);
                }
            }
        }
        source.disconnect();
        gain.disconnect();
        if (onEnded) {
            onEnded();
        }
    };
    try {
        source.start(0, offset || 0);
    } catch (e) {
        source.start(0);
    }
    return source;
};
playSound_ = function(name, vol, loop, onEnded, offset) {
    try {
        return playSoundInternal(name, vol, loop, onEnded, offset);
    } catch (e) {
        soundStatus[name] = "playback error";
        pendingSoundPlays[name] = null;
        return null;
    }
};
stopSound_ = function(name) {
    pendingSoundPlays[name] = null;
    if (!context) {
        return;
    }
    var activeSources = sources[name];
    if (!activeSources) {
        return;
    }
    if (!activeSources.length) {
        activeSources = [activeSources];
    }
    for (var sourceIndex = activeSources.length - 1; sourceIndex >= 0; sourceIndex--) {
        try {
            activeSources[sourceIndex].stop(0);
        } catch (e) {}
    }
    sources[name] = [];
    sourceGains[name] = [];
};
var setSoundVolume_ = function(name, vol) {
    var activeGains = sourceGains[name];
    if (!activeGains) {
        return;
    }
    for (var gainIndex = 0; gainIndex < activeGains.length; gainIndex++) {
        if (activeGains[gainIndex]) {
            activeGains[gainIndex].gain.value = vol;
        }
    }
};
var getSaberHumName = function() {
    return skin === "Kylo Ren" ? "kyloRenLightsaberHum" : "lightsaberHum";
};
var stopSaberAudio = function() {
    saberAudioToken++;
    saberIgniting = false;
    saberHumStart = -9999;
    stopSound_("lightsaberHum");
    stopSound_("kyloRenLightsaberHum");
    stopSound_("kyloRenLightsaberIgnite");
};
var playLightsaberHum_ = function(vol, forceStart) {
    var humName = getSaberHumName();
    stopSound_(humName === "kyloRenLightsaberHum" ? "lightsaberHum" : "kyloRenLightsaberHum");
    var activeSources = sources[humName];
    if (activeSources && activeSources.length > 0) {
        setSoundVolume_(humName, vol);
        return;
    }
    if (!forceStart && millis() / tickClock.baseMs - lastSaberHum < saberHumCooldown) {
        return;
    }
    lastSaberHum = millis() / tickClock.baseMs;
    playSound_(humName, vol, true);
};
var getSaberHumVol = function() {
    var motionHum = (abs(currentGun.spinVelocity || 0) / 34) * 0.85 + constrain((currentGun.aimVelocity || 0) / 90, 0, 1) * 0.75;
    if (skin === "Kylo Ren") {
        return lerp(0.42, constrain(0.58 + motionHum * 1.95, 0.58, 1.9), constrain(motionHum / 0.85, 0, 1));
    }
    return constrain(0.09 + motionHum, 0.09, 1.45);
};
var startSaberAudio = function() {
    if (!currentGun || !currentGun.isLightsaber || !currentGun.on) {
        return;
    }
    saberAudioToken++;
    var token = saberAudioToken;
    if (skin === "Kylo Ren") {
        if (!soundEnabled) {
            saberIgniting = false;
            return;
        }
        saberIgniting = true;
        saberHumStart = millis() / tickClock.baseMs + kyloHumDelay;
        stopSound_("lightsaberHum");
        stopSound_("kyloRenLightsaberHum");
        stopSound_("kyloRenLightsaberIgnite");
        playSound_("kyloRenLightsaberIgnite", 0.8, false, function() {
            if (token !== saberAudioToken || !currentGun || !currentGun.isLightsaber || !currentGun.on || skin !== "Kylo Ren" || !(gameStage === "Play" && matchState.phase === "live") || stageTransition.active || playerHealth <= 0) {
                return;
            }
            if (saberIgniting) {
                saberIgniting = false;
                playLightsaberHum_(getSaberHumVol(), true);
            }
        }, 0.18);
    } else {
        saberIgniting = false;
        playLightsaberHum_(getSaberHumVol(), true);
    }
};
var updateSaberHum = function() {
    if (!(gameStage === "Play" && matchState.phase === "live") || stageTransition.active || !currentGun || !currentGun.isLightsaber || !currentGun.on || inventoryState.selected !== 0 || playerHealth <= 0) {
        stopSaberAudio();
        return;
    }
    if (saberIgniting) {
        if (millis() / tickClock.baseMs < saberHumStart) {
            return;
        }
        saberIgniting = false;
        playLightsaberHum_(getSaberHumVol(), true);
        return;
    }
    playLightsaberHum_(getSaberHumVol());
};
for (var soundFileName in soundFiles) {
    if (soundFiles.hasOwnProperty(soundFileName)) {
        loadSoundScript(soundFileName, soundFiles[soundFileName]);
    }
}
var e_11Blaster = "blaster";
var explosion = "explosion";
/**S'more Global Variables**/
var fov = 2; //Field of View. Larger number = smaller mouse motion
//Yeah, I know the fov values kind of work backwards
keys[inputKeys.sprint] = false;
var mouseClick = false;
var menuClickPending = false;
var mouseRelease = false;
var defaultZoom = 0.6;
var zoom = defaultZoom; //How much to scale things
//Right now this assignment doesn't do anything; check the minimap functions
var gameMode = 0;
var matchGameModes = ["Team Deathmatch", "Battle Royale"];
var matchModeIndex = 0;
//Load Images
var headerFont = createFont("Magneto", 25);
var backupHeaderFont = createFont("Arial Bold Italic", 25);
var basicHeaderFont = createFont("sans-serif", 25);
var mainFont = createFont("Cascadia Code", 30);
var backupMainFont = createFont("Source Code Pro", 30);
var basicMainFont = createFont("monospace", 30);
var titleFont = createFont("CASTELLAR", 45);
var backupTitleFont = createFont("Times New Roman", 45);
var basicTitleFont = createFont("serif", 45);
var imagesToLoad = [
    {
        "name": "MenuMain",
        "w": 600,
        "h": 600
    },
    {
        "name": "MenuPlay",
        "w": 600,
        "h": 600
    },
    {
        "name": "MenuPlayCustom",
        "w": 600,
        "h": 600
    },
    {
        "name": "MenuShop",
        "w": 600,
        "h": 600
    },
    {
        "name": "MenuCredits",
        "w": 600,
        "h": 600
    },
    {
        "name": "MenuAchievements",
        "w": 600,
        "h": 600
    },
    {
        "name": "MinimapMask",
        "w": 150,
        "h": 150
    },
    {
        "name": "AT_AT_Moss",
        "w": 600,
        "h": 600
    },
    {
        "name": "Jakku_Sand",
        "w": 600,
        "h": 600
    },
    {
        "name": "AT_AT_Sand",
        "w": 600,
        "h": 600
    },
    {
        "name": "Jakku_Platform_Sand",
        "w": 600,
        "h": 300
    },
    {
        "name": "thermal_detonator",
        "w": 600,
        "h": 600
    },
    {
        "name": "medkit_1",
        "w": 400,
        "h": 400
    },
    {
        "name": "jetpack_icon",
        "w": 200,
        "h": 230
    },
    {
        "name": "jetpack_sprite",
        "w": 200,
        "h": 230
    },
    {
        "name": "red_landmine_sprite",
        "w": 200,
        "h": 200
    },
    {
        "name": "blue_landmine_sprite",
        "w": 200,
        "h": 200
    },
    {
        "name": "PlayerSkin_FirstOrderStormtrooper",
        "w": 424,
        "h": 424
    },
    {
        "name": "PlayerSkin_Shadowtrooper",
        "w": 424,
        "h": 424
    },
    {
        "name": "PlayerSkin_HeavyShoretrooper",
        "w": 424,
        "h": 424
    },
    {
        "name": "PlayerSkin_Shoretrooper",
        "w": 424,
        "h": 424
    },
    {
        "name": "PlayerSkin_LukeSkywalker",
        "w": 424,
        "h": 424
    },
    {
        "name": "PlayerSkin_KyloRen",
        "w": 424,
        "h": 424
    },
    {
        "name": "PlayerSkin_CloneTrooper",
        "w": 424,
        "h": 424
    },
    {
        "name": "PlayerSkin_RebelTrooper",
        "w": 424,
        "h": 424
    },
    {
        "name": "saber_hotbar_blue",
        "w": 64,
        "h": 64
    },
    {
        "name": "saber_hotbar_red",
        "w": 64,
        "h": 64
    }
];
var skinImgsToBake = [
    ["First Order Stormtrooper", "PlayerSkin_FirstOrderStormtrooper"],
    ["Shadowtrooper", "PlayerSkin_Shadowtrooper"],
    ["Heavy Shoretrooper", "PlayerSkin_HeavyShoretrooper"],
    ["Shoretrooper", "PlayerSkin_Shoretrooper"],
    ["Luke Skywalker", "PlayerSkin_LukeSkywalker"],
    ["Kylo Ren", "PlayerSkin_KyloRen"],
    ["Clone Trooper", "PlayerSkin_CloneTrooper"],
    ["Rebel Trooper", "PlayerSkin_RebelTrooper"]
];

var imgIndex = -1; //Current index of the image being loaded
var curImg; //The current image being loaded
/**Misc**/
var menuStars = []; //for loading stars
for (var i = 0; i < random(150, 200); i++) {
    menuStars.push({
        x: random(-50, 650),
        y: random(-50, 650),
        size: random(0.5, 2),
        color: color(random(150, 255), random(150, 255), 255, random(50, 255))
    });
}
var starWarsLogo = function(x, y, s, alpha) {
    pushStyle();
    tint(255, 255, 255, alpha === undefined ? 255 : alpha);
    drawAsset("StarWarsLogo", x * s, y * s, s);
    popStyle();
};
var glowLine = function(x1, y1, x2, y2, glowColor, vertical) {
    var StrokeWeight = 9;
    stroke(glowColor);
    for (var i = 0; i < 20; i++) {
        strokeWeight(StrokeWeight + i * 1.3);
        if (vertical) {
            line(x1, y1 + StrokeWeight / 1.75, x2, y2 - StrokeWeight / 1.75);
        } else {
            line(x1 + StrokeWeight / 1.75, y1, x2 - StrokeWeight / 1.75, y2);
        }
    }
    stroke(255, 255, 255, 230);
    strokeWeight(StrokeWeight);
    line(x1, y1, x2, y2);
};
lightsaber = function(x, y, s, r, type, on, bladeLength) {
    var length = bladeLength === undefined ? (on ? 1 : 0) : bladeLength;
    var frame = round(constrain(length, 0, 1) * 4);
    pushMatrix();
    translate(x, y);
    rotate(r);
    drawAsset("saber_" + (type === "Kylo Ren" ? "red" : "blue") + "_" + frame, 0, 0, s / 390);
    popMatrix();
};

var loadScreen = function() {
    textAlign(CENTER, CENTER);
    textFont(basicHeaderFont, 12);
    background(0, 0, 15);
    noStroke();
    for (var s = 0; s < menuStars.length; s++) {
        fill(menuStars[s].color);
        ellipse(menuStars[s].x * width / 600, menuStars[s].y * height / 600, menuStars[s].size, menuStars[s].size);
    }
    pushMatrix();
    translate((width - 600) / 2, (height - 600) / 2);
    starWarsLogo(145, 105, 0.8);
    textSize(43);
    textMode(CENTER);
    for (var c = 0; c < 30; c++) {
        fill(255, 0, 0);
        textMode(CENTER);
        text("B A T T L E F R O N T", 300 + sin(c * 10) * 2, 240 + cos(c * 10) * 2);
    }
    fill(8, 8, 8);
    textMode(CENTER);
    text("B A T T L E F R O N T", 300, 240);
    fill(255, 204, 0);
    textSize(40);
    text("L O A D I N G . . .", 300, 323);
    if (imgIndex < imagesToLoad.length) {
        glowLine(450, 400, 100 + ((imgIndex + 1) / (imagesToLoad.length + 1)) * 350, 400, color(0, 0, 255, 30), false);
        pushMatrix();
        translate(500, 400);
        rotate(90);
        strokeWeight(13);
        stroke(31, 31, 31);
        line(200 - 200, -20, 200 - 200, 330 - 275 - 10);
        stroke(201, 201, 201);
        line(200 - 200, -9, 200 - 200, 305 - 275 - 10 - 9);
        stroke(201, 201, 201);
        line(200 - 200, 35, 200 - 200, 330 - 275 - 15);
        fill(255, 0, 0);
        noStroke();
        ellipse(0, 20 - 10, 7, 9);
        popMatrix();
    }
    popMatrix();
};
gameStage = "ImageLoad";
stageTransition = {
    active: false,
    x: -850,
    switched: false,
    nextStage: "",
    afterSwitch: null
};
var startStageTrans = function(nextStage, afterSwitch) {
    if (stageTransition.active) {
        return;
    }
    stageTransition.active = true;
    stageTransition.x = width + 200;
    stageTransition.switched = false;
    stageTransition.nextStage = nextStage;
    stageTransition.afterSwitch = afterSwitch || null;
    playSound_("swoosh", 0.8);
};
var drawStageTrans = function() {
    if (!stageTransition.active) {
        return;
    }
    noStroke();
    fill(194, 194, 194);
    quad(stageTransition.x, 0, stageTransition.x - 200, height, stageTransition.x + width, height, stageTransition.x + width + 200, 0);
    stageTransition.x = lerp(stageTransition.x, stageTransition.switched ? -width - 240 : 0, 1 - pow(1 - (stageTransition.switched ? 0.16 : 0.18), tickClock.renderScale));
    if (!stageTransition.switched && stageTransition.x < 8) {
        if (stageTransition.afterSwitch) {
            stageTransition.afterSwitch();
        }
        gameStage = stageTransition.nextStage;
        stageTransition.switched = true;
    }
    if (stageTransition.switched && stageTransition.x < -width - 210) {
        stageTransition.active = false;
        stageTransition.afterSwitch = null;
    }
};
var findTDMSpawn = function(teamId) {
    var teamCluster = currentMap._matchClusterSpawns && currentMap._matchClusterSpawns[teamId] ? currentMap._matchClusterSpawns[teamId] : currentMap.spawnPos;
    var spawnX = teamCluster.x;
    var spawnY = teamCluster.y;
    var spawnZ = teamCluster.z;
    for (var attempt = 0; attempt < 180; attempt++) {
        var testX = attempt < 35 && teamCluster ? teamCluster.x + cos(random(0, 360)) * random(160, 520) : random(-currentMap.width / 2 + 90, currentMap.width / 2 - 90);
        var testY = attempt < 35 && teamCluster ? teamCluster.y + sin(random(0, 360)) * random(160, 520) : random(-currentMap.height / 2 + 90, currentMap.height / 2 - 90);
        testX = constrain(testX, -currentMap.width / 2 + 70, currentMap.width / 2 - 70);
        testY = constrain(testY, -currentMap.height / 2 + 70, currentMap.height / 2 - 70);
        var clearOfEntities = dist(testX, testY, playerPos.x, playerPos.y) > hitboxSize * 4.2;
        for (var z = currentMap.killZ; z < currentMap.topZ + 2 && clearOfEntities; z++) {
            var entList = currentMap.entities[z];
            if (!entList) {
                continue;
            }
            for (var e = 0; e < entList.length; e++) {
                var ent = entList[e];
                if (ent && ent.pos && dist(testX, testY, ent.pos.x, ent.pos.y) < hitboxSize * 4.2) {
                    clearOfEntities = false;
                    break;
                }
            }
        }
        if (!clearOfEntities) {
            continue;
        }
        for (var layer = currentMap.killZ; layer <= currentMap.topZ + 1; layer++) {
            var cols = currentMap.collisionLayers ? currentMap.collisionLayers[layer] : null;
            if (!cols || cols.length === undefined) {
                continue;
            }
            for (var c = 0; c < cols.length; c++) {
                var col = cols[c];
                if (!col || !col.plane || !col.spawnSurface) {
                    continue;
                }
                var testZ = col.lowZ !== undefined ? floor(col.lowZ) : layer;
                if (testZ < currentMap.killZ || testZ > currentMap.topZ + 1) {
                    continue;
                }
                if (col.checkCollision(testX, testY, testZ) && !solidAt(testX, testY, testZ, hitboxSize)) {
                    return new PVector(testX, testY, testZ + 0.001);
                }
            }
        }
    }
    return new PVector(spawnX, spawnY, spawnZ);
};
var awardTDMKill = function(killerTeam, victimTeam) {
    if (matchState.gameMode !== "Team Deathmatch" || matchState.phase !== "live") {
        return;
    }
    if (killerTeam === undefined || victimTeam === undefined || killerTeam === victimTeam) {
        return;
    }
    matchState.teamScores[killerTeam] = (matchState.teamScores[killerTeam] || 0) + 1;
    if (matchState.teamScores[killerTeam] >= matchState.scoreLimit && matchState.phase !== "ending") {
        matchState.phase = "ending";
        matchState.winnerTeam = killerTeam;
        matchState.endingFrame = 0;
        if (matchState.winnerTeam === playerTeam && !matchState.creditsAwarded) {
            matchState.lastCreditAward = floor(random(90, 141)) * 5 + matchState.playerKills * floor(random(8, 16)) * 5;
            addCreditChange(matchState.lastCreditAward);
            matchState.creditsAwarded = true;
        }
        stopCreditClicks();
    }
};
var updateBotRespawns = function() {
    if (!currentMap || !currentMap.entities || matchState.gameMode !== "Team Deathmatch" || matchState.phase !== "live") {
        return;
    }
    for (var r = matchState.botRespawns.length - 1; r >= 0; r--) {
        matchState.botRespawns[r].timer -= tickClock.scale;
        if (matchState.botRespawns[r].timer > 0) {
            continue;
        }
        var data = matchState.botRespawns[r];
        var pos = findTDMSpawn(data.team);
        var bot = new AIPlayer({
            x: pos.x,
            y: pos.y,
            z: pos.z,
            team: data.team,
            skin: data.skin,
            walkSpeed: data.walkSpeed || matchBotWalkSpeed
        });
        bot.isMatchBot = true;
        bot.wasPlayerSquad = data.wasPlayerSquad;
        bot.inPlayerSquad = squadSystemEnabled && data.inPlayerSquad;
        var layer = constrain(floor(bot.pos.z), currentMap.killZ, currentMap.topZ + 1);
        if (!currentMap.entities[layer]) {
            currentMap.entities[layer] = [];
        }
        currentMap.entities[layer].push(bot);
        matchState.botRespawns.splice(r, 1);
    }
};
var drawSquadButton = function() {
    squadCommandButton.x = width - 172;
    squadCommandButton.y = 19;
    squadCommandButton.w = 118;
    squadCommandButton.h = 30;
    squadPowerButton.x = squadCommandButton.x - squadCommandButton.w / 2 - squadPowerButton.w / 2 - 8;
    squadPowerButton.y = squadCommandButton.y;
    squadPowerButton.w = 54;
    squadPowerButton.h = 30;
    var hover = mouseX >= squadCommandButton.x - squadCommandButton.w / 2 && mouseX <= squadCommandButton.x + squadCommandButton.w / 2 && mouseY >= squadCommandButton.y - squadCommandButton.h / 2 && mouseY <= squadCommandButton.y + squadCommandButton.h / 2;
    var powerHover = mouseX >= squadPowerButton.x - squadPowerButton.w / 2 && mouseX <= squadPowerButton.x + squadPowerButton.w / 2 && mouseY >= squadPowerButton.y - squadPowerButton.h / 2 && mouseY <= squadPowerButton.y + squadPowerButton.h / 2;
    rectMode(CENTER);
    strokeWeight(2);
    stroke(squadSystemEnabled ? color(90, 180, 255) : color(255, 80, 80, 190));
    fill(squadSystemEnabled ? color(15, 75, 110, powerHover ? 235 : 190) : color(75, 15, 15, powerHover ? 230 : 185));
    rect(squadPowerButton.x, squadPowerButton.y, squadPowerButton.w, squadPowerButton.h, 5);
    textAlign(CENTER, CENTER);
    textSize(13);
    noStroke();
    fill(squadSystemEnabled ? color(185, 230, 255) : color(255, 150, 150));
    text(squadSystemEnabled ? "ON" : "OFF", squadPowerButton.x, squadPowerButton.y);
    strokeWeight(2);
    stroke(squadCommandMode ? color(90, 180, 255) : color(255, 245, 180, 180));
    fill(!squadSystemEnabled ? color(20, 20, 20, hover ? 175 : 120) : squadCommandMode ? color(20, 70, 115, hover ? 235 : 205) : color(0, 0, 0, hover ? 190 : 145));
    rect(squadCommandButton.x, squadCommandButton.y, squadCommandButton.w, squadCommandButton.h, 5);
    textAlign(CENTER, CENTER);
    textSize(13);
    noStroke();
    fill(!squadSystemEnabled ? color(140, 140, 140) : squadCommandMode ? color(185, 230, 255) : color(255, 245, 180));
    var squadCount = 0;
    if (squadSystemEnabled && currentMap && currentMap.entities) {
        for (var squadZ = currentMap.killZ; squadZ < currentMap.topZ + 2; squadZ++) {
            var squadList = currentMap.entities[squadZ];
            if (!squadList) {
                continue;
            }
            for (var squadE = 0; squadE < squadList.length; squadE++) {
                if (squadList[squadE] && squadList[squadE].inPlayerSquad && squadList[squadE].health > 0) {
                    squadCount++;
                }
            }
        }
    }
    text("SQUAD " + squadCount, squadCommandButton.x, squadCommandButton.y);
};
var findAllyClick = function() {
    if (!currentMap || !currentMap.entities || !camPos) {
        return null;
    }
    var best = null;
    var bestD = 999999;
    for (var z = currentMap.killZ; z < currentMap.topZ + 2; z++) {
        var list = currentMap.entities[z];
        if (!list) {
            continue;
        }
        for (var e = 0; e < list.length; e++) {
            var ent = list[e];
            if (!ent || !ent.isMatchBot || ent.team !== playerTeam || ent.health <= 0 || !ent.pos) {
                continue;
            }
            if (abs(ent.pos.z - playerPos.z) > 2.2) {
                continue;
            }
            var allyScreen = worldToScreen(ent.pos.x, ent.pos.y, ent.pos.z);
            var d = dist(mouseX, mouseY, allyScreen.x, allyScreen.y);
            if (d < max(8, max(ent.colSize || hitboxSize, 36) * 1.35 * zoom) && d < bestD) {
                best = ent;
                bestD = d;
            }
        }
    }
    return best;
};
var handleSquadClick = function() {
    if (!mouseIsPressed) {
        squadClickLock = false;
    }
    if (mouseClick !== true || squadClickLock || gameStage !== "Play" || devConsole.active) {
        return false;
    }
    squadCommandButton.x = width - 172;
    squadCommandButton.y = 19;
    squadCommandButton.w = 118;
    squadCommandButton.h = 30;
    squadPowerButton.x = squadCommandButton.x - squadCommandButton.w / 2 - squadPowerButton.w / 2 - 8;
    squadPowerButton.y = squadCommandButton.y;
    squadPowerButton.w = 54;
    squadPowerButton.h = 30;
    var powerHover = mouseX >= squadPowerButton.x - squadPowerButton.w / 2 && mouseX <= squadPowerButton.x + squadPowerButton.w / 2 && mouseY >= squadPowerButton.y - squadPowerButton.h / 2 && mouseY <= squadPowerButton.y + squadPowerButton.h / 2;
    if (powerHover) {
        squadSystemEnabled = !squadSystemEnabled;
        squadCommandMode = false;
        if (currentMap && currentMap.entities) {
            for (var powerZ = currentMap.killZ; powerZ < currentMap.topZ + 2; powerZ++) {
                var powerList = currentMap.entities[powerZ];
                if (!powerList) {
                    continue;
                }
                for (var powerE = 0; powerE < powerList.length; powerE++) {
                    if (powerList[powerE] && powerList[powerE].isMatchBot && powerList[powerE].team === playerTeam) {
                        if (!squadSystemEnabled) {
                            powerList[powerE].wasPlayerSquad = powerList[powerE].wasPlayerSquad || powerList[powerE].inPlayerSquad;
                            powerList[powerE].inPlayerSquad = false;
                        } else if (powerList[powerE].wasPlayerSquad) {
                            powerList[powerE].inPlayerSquad = true;
                        }
                    }
                }
            }
        }
        squadClickLock = true;
        playSound_("click", 0.65);
        mouseClick = null;
        return true;
    }
    if (mouseX >= squadCommandButton.x - squadCommandButton.w / 2 && mouseX <= squadCommandButton.x + squadCommandButton.w / 2 && mouseY >= squadCommandButton.y - squadCommandButton.h / 2 && mouseY <= squadCommandButton.y + squadCommandButton.h / 2) {
        if (!squadSystemEnabled) {
            squadClickLock = true;
            mouseClick = null;
            return true;
        }
        squadCommandMode = !squadCommandMode;
        squadClickLock = true;
        playSound_("click", 0.65);
        mouseClick = null;
        return true;
    }
    if (!squadSystemEnabled || !squadCommandMode || !(gameStage === "Play" && matchState.phase === "live" && !stageTransition.active)) {
        return false;
    }
    var clickedAlly = findAllyClick();
    if (clickedAlly) {
        clickedAlly.inPlayerSquad = !clickedAlly.inPlayerSquad;
        clickedAlly.wasPlayerSquad = clickedAlly.inPlayerSquad;
        squadClickLock = true;
        playSound_("click", 0.45);
        mouseClick = null;
        return true;
    }
    return false;
};
var resetMatchForHome = function() {
    clearGameInput();
    inventoryState.selected = 0;
    inventoryState.cosmeticsOpen = false;
    removePlacedCrates(currentMap);
    tickClock.accumulatorMs = 0;
    if (currentMap && currentMap.entities) {
        prepMap(currentMap);
        for (var resetZ = currentMap.killZ; resetZ < currentMap.topZ + 2; resetZ++) {
            if (typeof recycleProjectile === "function") {
                for (var resetEnt = 0; resetEnt < currentMap.entities[resetZ].length; resetEnt++) {
                    recycleProjectile(currentMap.entities[resetZ][resetEnt]);
                }
            }
            currentMap.entities[resetZ] = [];
        }
        currentMap._initialTeamBotsSpawned = false;
        currentMap._matchClusterSpawns = null;
        currentMap._matchPlayerSpawn = null;
        matchState.botRespawns = [];
    }
    squadCommandMode = false;
    deathScreenActive = false;
    deathScreenFrame = 0;
    deathTransStarted = false;
    deathScorePaid = false;
    matchState.phase = "idle";
    matchState.countdownFrame = 0;
    matchState.countdownStarted = false;
    matchState.winCheckFrame = 0;
    matchState.endingFrame = 0;
    matchState.playerKills = 0;
    matchState.teamScores = [0, 0];
    matchState.botRespawns = [];
    matchState.lastCreditAward = 0;
    matchState.creditsAwarded = false;
    matchState.winnerTeam = -1;
    creditPopups = [];
    playerVel.mult(0);
    playerHealth = playerMaxHealth;
    playerShield = playerMaxShield;
    playerForce = playerMaxForce;
    stopCreditClicks();
};
addCreditChange = function(amount, x, y) {
    if (amount === 0) {
        return;
    }
    creditDisplay.soundEnabled = true;
    playerCredits += amount;
    if (x !== undefined && y !== undefined) {
        creditPopups.push({
            x: x,
            y: y,
            amount: amount,
            life: 90,
            maxLife: 90
        });
    }
};
var transitionToPlay = function(nextMap) {
    if (stageTransition.active) {
        return;
    }
    nextMap = nextMap || getSelectedMap();
    if (!nextMap) {
        return;
    }
    startStageTrans("Play", function() {
        getSelectedCharacterData();
        if (!currentGun) {
            currentGun = new Lightsaber({});
        }
        currentMap = nextMap;
        tickClock.gameMs = 0;
        tickClock.tick = 0;
        tickClock.accumulatorMs = 0;
        dangerSense = 0;
        currentMap._aliveCountAtMs = undefined;
        currentMap._aliveBotCount = 0;
        minimapView.nextUpdateMs = 0;
        clearGameInput();
        prepMap(currentMap);
        squadCommandMode = false;
        matchState.gameMode = matchGameModes[matchModeIndex % matchGameModes.length];
        squadSystemEnabled = matchState.gameMode !== "Battle Royale";
        deathScreenActive = false;
        deathScreenFrame = 0;
        deathTransStarted = false;
        deathScorePaid = false;
        playerForce = playerMaxForce;
        if (currentMap && currentMap.entities) {
            prepMap(currentMap);
            for (var transitionZ = currentMap.killZ; transitionZ < currentMap.topZ + 2; transitionZ++) {
                if (typeof recycleProjectile === "function") {
                    for (var transitionEnt = 0; transitionEnt < currentMap.entities[transitionZ].length; transitionEnt++) {
                        recycleProjectile(currentMap.entities[transitionZ][
                            transitionEnt
                        ]);
                    }
                }
                currentMap.entities[transitionZ] = [];
            }
            currentMap._initialTeamBotsSpawned = false;
            currentMap._matchClusterSpawns = null;
            currentMap._matchPlayerSpawn = null;
            matchState.botRespawns = [];
        }
        currentMap._initialTeamBotsSpawned = false;
        playerDeaths = -1;
        playerDie(true);
        matchState.phase = "countdown";
        matchState.countdownFrame = 0;
        matchState.countdownStarted = false;
        matchState.winCheckFrame = 0;
        matchState.endingFrame = 0;
        matchState.playerKills = 0;
        matchState.teamScores = [0, 0];
        matchState.botRespawns = [];
        matchState.lastCreditAward = 0;
        matchState.creditsAwarded = false;
        matchState.winnerTeam = -1;
        stopCreditClicks();
    });
};
var headings = ["Achievements", "Play", "Main", "Shop", "Credits"];
planetList = ["Kashyyyk", "Jakku", "Star Destroyer"];
var planetNum = 0;
var menuRot = 230;
var menuRotVel = 0;
var menuSlideFriction = 0.93;
var menuDragPower = 0.02;
var holoHeight = -25;
var holos = [];
var holoNum = 15;
var currentMenu = null;
var fullCreditsFrame = 0;
var creditsSoundPlayed = false;
var creditsLogoStart = 82;
var creditsLogoSlam = 20;
var creditsLogoHold = 180;
var creditsCrawlH = 3400;
var fullCreditsText = "KHAN ACADEMY PRESENTS\nA LEMONCELLOJR & CODER GUY PRODUCTION\nSTAR WARS\nBATTLEFRONT\nMAIN PRODUCTION CREDITS\n\nDirected By\nLemoncelloJr\nCoder Guy\n\nWritten By\nLemoncelloJr\n\nProduced By\nCoderGuyxLemoncelloJr\n\nFramework & Core Development\nLemoncelloJr\n\nAnimation, Visual Effects & Art Direction\nCoder Guy\n\nSound Layout & Audio Design\nSwankyMan\n\nProcessingJS jsDelivr Fetch Assistance\ndebugRanger\n\nImage Loading Systems\nGreenGhost\n\nStar Wars Logo Assistance\nEA\n\nAdditional Contributions\nBristleFrost\n\nCAST & GAME SYSTEMS\n\nProgramming & Systems Engineering\nLemoncelloJr\n\nVisual Design & Effects\nCoder Guy\n\nCombat Visual Effects\nCoder Guy\n\nUI Construction\nCoder Guy\n\nAnimation Systems\nCoder Guy\n\nLighting & Scene Effects\nCoder Guy\n\nGame Framework Architecture\nLemoncelloJr\n\nLevel Construction\nLemoncelloJr\n\nAdditional Bug Fixing & Technical Support\ndebugRanger\n\nAUDIO CREDITS\n\nSound Layout\nSwankyMan\n\nMusic Inspired By\nStar Wars Original Motion Picture Soundtrack\n\nSound Effects Inspired By\nStar Wars Sound Library\n\nSPECIAL THANKS\n\nGeorge Lucas\nKhan Academy\nProcessingJS\nThe Khan Academy Community\njsDelivr CDN\nEveryone who tested the game\nEveryone who believed this project could exist\n\nDISCLAIMER\n\nThis is a non-commercial fan production created for educational and entertainment purposes on Khan Academy.\n\nStar Wars and all associated properties are owned by Lucasfilm Ltd. and The Walt Disney Company.\n\nNo copyright infringement intended.\n\nMade with imagination,\nProcessingJS,\nand way too many semicolons.\n\nIt is a period of creativity.\nDeep within the Khan Academy systems,\ndevelopers have forged an ambitious\nSTAR WARS game using the ancient\npowers of ProcessingJS...\n\nGuided by the coding mastery of\nLEMONCELLOJR and the artistic force\nof CODER GUY, the project\nrapidly evolved into a fully armed\nbrowser experience.\n\nWith assistance from DEBUGRANGER,\nGREENGHOST, SWANKYMAN, and others,\nthe game now stands ready to bring\nbalance to the KA galaxy....";
var drawSoundButton = function() {
    var soundButtonX = width - 34;
    var soundButtonY = height - 32;
    var soundButtonW = 42;
    var soundButtonH = 42;
    var soundButtonHover = mouseX >= soundButtonX - soundButtonW / 2 && mouseX <= soundButtonX + soundButtonW / 2 && mouseY >= soundButtonY - soundButtonH / 2 && mouseY <= soundButtonY + soundButtonH / 2;
    noFill();
    for (var soundGlow = 11; soundGlow >= 5; soundGlow -= 2) {
        stroke(255, 255, 255, soundButtonHover ? 34 : 22);
        strokeWeight(soundGlow);
        rect(soundButtonX, soundButtonY, soundButtonW, soundButtonH, 5);
    }
    stroke(soundButtonHover ? color(130, 230, 255) : color(255));
    strokeWeight(3);
    fill(0);
    rect(soundButtonX, soundButtonY, soundButtonW, soundButtonH, 5);
    fill(soundEnabled ? color(160, 255, 185) : color(220));
    textFont(basicHeaderFont, 22);
    text(soundEnabled ? "🔊" : "🔇", soundButtonX, soundButtonY);
};
var drawFullCredits = function() {
    fullCreditsFrame += tickClock.renderScale;
    background(0, 0, 15);
    noStroke();
    for (var creditsStarIndex = 0; creditsStarIndex < menuStars.length; creditsStarIndex++) {
        fill(menuStars[creditsStarIndex].color);
        ellipse(menuStars[creditsStarIndex].x * width / 600, menuStars[creditsStarIndex].y * height / 600, menuStars[creditsStarIndex].size, menuStars[creditsStarIndex].size);
    }
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    drawSoundButton();
    if (mouseClick) {
        if (mouseX >= width - 34 - 21 && mouseX <= width - 34 + 21 && mouseY >= height - 32 - 21 && mouseY <= height - 32 + 21) {
            soundEnabled = !soundEnabled;
            if (soundEnabled) {
                playSound_("click", 0.7);
            } else {
                stopSound_("openingCrawl");
            }
        } else {
            if (!stageTransition.active) {
                stopSound_("openingCrawl");
                startStageTrans("Menu", function() {
                    fullCreditsFrame = 0;
                    creditsSoundPlayed = false;
                    currentMenu = null;
                    if (currentMap) {
                        resetMatchForHome();
                    }
                });
            }
            return;
        }
    }
    if (fullCreditsFrame >= creditsLogoStart && !creditsSoundPlayed) {
        playSound_("openingCrawl", 0.8);
        creditsSoundPlayed = true;
    }
    if (fullCreditsFrame >= creditsLogoStart) {
        var logoFrame = fullCreditsFrame - creditsLogoStart;
        var logoScale = 1;
        var logoAlpha = 255;
        if (logoFrame < creditsLogoSlam) {
            var slamProgress = logoFrame / creditsLogoSlam;
            logoScale = lerp(10, 1, 1 - pow(1 - slamProgress, 4));
        } else if (logoFrame < creditsLogoSlam + creditsLogoHold) {
            logoScale = 1;
        } else {
            var shrinkProgress = constrain(
                (logoFrame - creditsLogoSlam - creditsLogoHold) / 220, 0, 1);
            logoScale = lerp(1, 0.02, shrinkProgress);
            logoAlpha = 255 * (1 - shrinkProgress);
        }
        if (logoScale > 0.03 && logoAlpha > 2) {
            pushMatrix();
            translate(width / 2 - 226 * logoScale, height / 2 - 41 * logoScale);
            starWarsLogo(0, 0, logoScale, logoAlpha);
            popMatrix();
        }
    }
    var crawlStartFrame = creditsLogoStart + creditsLogoSlam + creditsLogoHold + 99;
    if (fullCreditsFrame >= crawlStartFrame) {
        var crawlFrame = fullCreditsFrame - crawlStartFrame;
        var crawlY = height + 70 - crawlFrame * 0.62;
        pushMatrix();
        translate(width / 2, crawlY);
        scale(1, 0.72);
        textAlign(CENTER, TOP);
        textFont(basicHeaderFont, 25);
        fill(255, 210, 35);
        textLeading(34);
        text(fullCreditsText, -205, 0, 410, creditsCrawlH);
        popMatrix();
        if (crawlY < -creditsCrawlH * 0.72 - 120) {
            if (!stageTransition.active) {
                stopSound_("openingCrawl");
                startStageTrans("Menu", function() {
                    fullCreditsFrame = 0;
                    creditsSoundPlayed = false;
                    currentMenu = null;
                    if (currentMap) {
                        resetMatchForHome();
                    }
                });
            }
        }
    }
};
var menu = function() {
    if (keys[inputKeys.arrowLeft] || keys[inputKeys.left]) {
        menuRotVel -= 0.5 * tickClock.renderScale;
    }
    if (keys[inputKeys.arrowRight] || keys[inputKeys.right]) {
        menuRotVel += 0.5 * tickClock.renderScale;
    }
    menuRotVel *= pow(menuSlideFriction, tickClock.renderScale);
    menuRot += menuRotVel * tickClock.renderScale;
    menuRot %= 360;
    background(0, 0, 15);
    noStroke();
    for (var menuStarIndex = 0; menuStarIndex < menuStars.length; menuStarIndex++) {
        fill(menuStars[menuStarIndex].color);
        var starX = menuStars[menuStarIndex].x * width / 600 + ((mouseX - width / 2) * menuStars[menuStarIndex].size) / -40;
        var starY = menuStars[menuStarIndex].y * height / 600 + ((mouseY - height / 2) * menuStars[menuStarIndex].size) / -40;
        ellipse(starX, starY, menuStars[menuStarIndex].size, menuStars[menuStarIndex].size);
    }
    textAlign(RIGHT, TOP);
    textFont(basicHeaderFont, 22);
    var menuCreditActivity = constrain(abs(creditDisplay.speed) / 5, 0, 1);
    if (creditDisplay.speed < -0.01) {
        fill(255, lerp(230, 80, menuCreditActivity), lerp(130, 80, menuCreditActivity));
    } else {
        fill(lerp(255, 110, menuCreditActivity), lerp(230, 255, menuCreditActivity), lerp(130, 150, menuCreditActivity));
    }
    pushMatrix();
    translate(width - 18, 16);
    scale(1 + (creditDisplay.speed > 0 ? menuCreditActivity * 0.35 : 0));
    text("₹ " + round(creditDisplay.value), 0, 0);
    popMatrix();
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    textFont(headerFont);
    fill(0);
    drawSoundButton();
    if (mouseX >= width - 34 - 21 && mouseX <= width - 34 + 21 && mouseY >= height - 32 - 21 && mouseY <= height - 32 + 21 && mouseClick) {
        soundEnabled = !soundEnabled;
        playSound_("click", 0.7);
    }
    textFont(headerFont);
    for (var i = 0; i < headings.length; i++) {
        fill(0);
        stroke(255);
        strokeWeight(3);
        menuRot += 360 / headings.length;
        menuRot = menuRot % 360;
        if (menuRot <= 360 && menuRot >= 180) {
            pushMatrix();
            translate(width / 2 + 250 * cos(menuRot), height - 100 + sin(menuRot) * 12);
            scale(abs(sin(menuRot)), 1 + sin(menuRot) / 4);
            var backBoxW = textWidth(headings[i]) * 1.8;
            noFill();
            for (var backGlow = 11; backGlow >= 5; backGlow -= 2) {
                stroke(255, 255, 255, 22);
                strokeWeight(backGlow);
                rect(0, 0, backBoxW, 50, 5);
            }
            fill(0);
            stroke(255);
            strokeWeight(3);
            rect(0, 0, backBoxW, 50, 5);
            popMatrix();
        }
    }
    for (var i = 0; i < headings.length; i++) {
        stroke(255);
        strokeWeight(3);
        textFont(headerFont);
        menuRot += 360 / headings.length;
        menuRot = menuRot % 360;
        if (menuRot >= 0 && menuRot <= 180) {
            pushMatrix();
            translate(width / 2 + 250 * cos(menuRot), height - 100 + sin(menuRot) * 12);
            scale(abs(sin(menuRot)), 1 + sin(menuRot) / 4);
            var frontBoxW = textWidth(headings[i]) * 1.8;
            noFill();
            for (var frontGlow = 11; frontGlow >= 5; frontGlow -= 2) {
                stroke(255, 255, 255, 22);
                strokeWeight(frontGlow);
                rect(0, 0, frontBoxW, 50, 5);
            }
            fill(0);
            stroke(255);
            strokeWeight(3);
            rect(0, 0, frontBoxW, 50, 5);
            for (var headingGlow = 4; headingGlow >= 1; headingGlow--) {
                fill(255, 255, 255, 24);
                text(headings[i], -headingGlow, 0);
                text(headings[i], headingGlow, 0);
                text(headings[i], 0, -headingGlow);
                text(headings[i], 0, headingGlow);
            }
            fill(255);
            text(headings[i], 0, 0);
            if (menuRot >= 50 && menuRot <= 140) {
                if (menuRot >= 75 && menuRot <= 105) {
                    //Draw Holo
                    holoHeight = lerp(holoHeight, -425, uiEase(0.1));
                    fill(100, 100, 255, map(holoHeight, -25, -425, 0, 100));
                    noStroke();
                    var fade = 0;
                    strokeWeight(5);
                    for (var j = holoHeight; j <= -25; j += 5) {
                        fade += 0.2;
                        fill(50, 200 + fade * 1.2, 255, constrain(fade * 0.8, 2, 3));
                        quad(-textWidth(headings[i]) * 0.6, -25, textWidth(headings[i]) * 0.6, -25,
                            (-5 / 8) * j, j,
                            (5 / 8) * j, j);
                    }
                    if (holoHeight < -350) {
                        var activeMenu = "Menu" + headings[i];
                        if (!(activeMenu === "MenuPlay" && currentMenu === "MenuPlayCustom")) {
                            currentMenu = activeMenu;
                        }
                        var menuPointerScaleX = max(0.001, abs(sin(menuRot)));
                        var menuPointerScaleY = max(0.001, 1 + sin(menuRot) / 4);
                        var menuPointerX = (mouseX - (width / 2 + 250 * cos(menuRot))) / menuPointerScaleX;
                        var menuPointerY = (mouseY - (height - 100 + sin(menuRot) * 12)) / menuPointerScaleY;
                        var menuHoloX = menuPointerX + 300;
                        var menuHoloY = menuPointerY + 480;
                        switch (currentMenu) {
                            //Update the menu
                            case "MenuPlay":
                                noStroke();
                                fill(220, 150);
                                if (menuPointerX >= -125 && menuPointerX <= 125 && menuPointerY >= 170 - 480 - 25 && menuPointerY <= 170 - 480 + 25) {
                                    rect(0, 170 - 480, 250, 50);
                                    if (mouseClick) {
                                        playSound_("click", 0.7);
                                        matchModeIndex = floor(random(0, matchGameModes.length));
                                        var quickPlanetName = planetList[floor(random(0, planetList.length))];
                                        transitionToPlay(quickPlanetName === "Kashyyyk" ? Kashyyyk !== undefined ? Kashyyyk : null : quickPlanetName === "Jakku" ? Jakku !== undefined ? Jakku : null : quickPlanetName === "Star Destroyer" ? StarDestroyer !== undefined ? StarDestroyer : null : Kashyyyk !== undefined ? Kashyyyk : null);
                                    }
                                } else if (menuPointerX >= -105 && menuPointerX <= 105 && menuPointerY >= 240 - 480 - 25 && menuPointerY <= 240 - 480 + 25) {
                                    rect(0, 240 - 480, 210, 50);
                                    if (mouseClick) {
                                        playSound_("click", 0.7);
                                        planetNum = 0;
                                        currentMenu = "MenuPlayCustom";
                                    }
                                }
                                break;
                            case "MenuPlayCustom":
                                fill(220, 150);
                                pushMatrix();
                                translate(-300, -480);
                                if (dist(menuHoloX, menuHoloY, 165, 160) <= 50) {
                                    triangle(180, 180, 180, 140, 150, 160);
                                    if (mouseClick) {
                                        playSound_("click", 0.7);
                                        matchModeIndex = (matchModeIndex - 1 + matchGameModes.length) % matchGameModes.length;
                                    }
                                }
                                if (dist(menuHoloX, menuHoloY, 435, 160) <= 50) {
                                    triangle(420, 180, 420, 140, 450, 160);
                                    if (mouseClick) {
                                        playSound_("click", 0.7);
                                        matchModeIndex = (matchModeIndex + 1 + matchGameModes.length) % matchGameModes.length;
                                    }
                                }
                                if (dist(menuHoloX, menuHoloY, 205, 260) <= 50) {
                                    triangle(220, 280, 220, 240, 190, 260);
                                    if (mouseClick) {
                                        playSound_("click", 0.7);
                                        planetNum--;
                                        planetNum = abs(planetNum % planetList.length);
                                    }
                                }
                                if (dist(menuHoloX, menuHoloY, 395, 260) <= 50) {
                                    triangle(380, 280, 380, 240, 410, 260);
                                    if (mouseClick) {
                                        playSound_("click", 0.7);
                                        planetNum++;
                                        planetNum = planetNum % planetList.length;
                                    }
                                }
                                if (menuHoloX >= 225 && menuHoloX <= 375 && menuHoloY >= 177.5 && menuHoloY <= 202.5) {
                                    rect(300, 190, 150, 25);
                                    //Go to advanced settings
                                }
                                if (menuHoloX >= 255 && menuHoloX <= 345 && menuHoloY >= 387.5 && menuHoloY <= 412.5) {
                                    rect(300, 400, 90, 25);
                                    if (mouseClick) {
                                        playSound_("click", 0.7);
                                        var customPlanetName = planetList[planetNum];
                                        transitionToPlay(customPlanetName === "Kashyyyk" ? Kashyyyk !== undefined ? Kashyyyk : null : customPlanetName === "Jakku" ? Jakku !== undefined ? Jakku : null : customPlanetName === "Star Destroyer" ? StarDestroyer !== undefined ? StarDestroyer : null : Kashyyyk !== undefined ? Kashyyyk : null);
                                    }
                                }
                                popMatrix();
                                textFont(mainFont, 20);
                                fill(30, 30, 100);
                                fill(150, 150, 200);
                                text(
                                    ("" + matchGameModes[matchModeIndex % matchGameModes.length]).toUpperCase(), 0, 160 - 480);
                                if (planetList[planetNum] === "Star Destroyer") {
                                    textLeading(20);
                                    text("Star\nDestroyer", 0, 252 - 480);
                                } else {
                                    text(planetList[planetNum], 0, 260 - 480);
                                }
                                break;
                            case "MenuShop":
                                noStroke();
                                fill(220, 150);
                                if (menuHoloX >= 212.5 - 75 && menuHoloX <= 212.5 + 75 && menuHoloY <= 150 + 15 && menuHoloY >= 150 - 15) {
                                    rect(212.5 - 300, 150 - 480, 150, 30);
                                    if (mouseClick) {
                                        playSound_("click", 0.7);
                                        startCharacterShop("Assault");
                                    }
                                }
                                if (menuHoloX >= 387.5 - 75 && menuHoloX <= 387.5 + 75 && menuHoloY <= 150 + 15 && menuHoloY >= 150 - 15) {
                                    rect(387.5 - 300, 150 - 480, 150, 30);
                                    if (mouseClick) {
                                        playSound_("click", 0.7);
                                        startCharacterShop("Specialist");
                                    }
                                }
                                if (menuHoloX >= 227.5 - 60 && menuHoloX <= 227.5 + 60 && menuHoloY <= 190 + 15 && menuHoloY >= 190 - 15) {
                                    rect(227.5 - 300, 190 - 480, 120, 30);
                                    if (mouseClick) {
                                        playSound_("click", 0.7);
                                        startCharacterShop("Officer");
                                    }
                                }
                                if (menuHoloX >= 372.5 - 60 && menuHoloX <= 372.5 + 60 && menuHoloY <= 190 + 15 && menuHoloY >= 190 - 15) {
                                    rect(372.5 - 300, 190 - 480, 120, 30);
                                    if (mouseClick) {
                                        playSound_("click", 0.7);
                                        startCharacterShop("Heavy");
                                    }
                                }
                                if (menuHoloX >= 300 - 105 && menuHoloX <= 300 + 105 && menuHoloY <= 240 + 15 && menuHoloY >= 240 - 15) {
                                    rect(0, 240 - 480, 210, 30);
                                    if (mouseClick) {
                                        playSound_("click", 0.7);
                                        startCharacterShop("Jedi");
                                    }
                                }
                                if (menuHoloX >= 300 - 90 && menuHoloX <= 300 + 90 && menuHoloY <= 285 + 15 && menuHoloY >= 285 - 15) {
                                    rect(0, 285 - 480, 180, 30);
                                    if (mouseClick) {
                                        playSound_("click", 0.7);
                                        startCharacterShop("Infiltrator");
                                    }
                                }
                                if (menuHoloX >= 300 - 75 && menuHoloX <= 300 + 75 && menuHoloY <= 330 + 15 && menuHoloY >= 330 - 15) {
                                    rect(0, 330 - 480, 150, 30);
                                    if (mouseClick) {
                                        playSound_("click", 0.7);
                                        startCharacterShop("Enforcer");
                                    }
                                }
                                if (menuHoloX >= 300 - 60 && menuHoloX <= 300 + 60 && menuHoloY <= 375 + 15 && menuHoloY >= 375 - 15) {
                                    rect(0, 375 - 480, 120, 30);
                                    if (mouseClick) {
                                        playSound_("click", 0.7);
                                        startCharacterShop("Aerial");
                                    }
                                }
                                break;
                            case "MenuCredits":
                                noStroke();
                                fill(220, 150);
                                if (menuHoloX >= 185 && menuHoloX <= 415 && menuHoloY >= 125 - 21 && menuHoloY <= 125 + 21) {
                                    rect(0, 125 - 480, 230, 42);
                                    if (mouseClick) {
                                        playSound_("click", 0.7);
                                        playSound_("openingCrawl", 0.8);
                                        creditsSoundPlayed = true;
                                        startStageTrans("FullCredits", function() {
                                            fullCreditsFrame = 0;
                                            currentMenu = null;
                                        });
                                    }
                                }
                                break;
                        }
                        //Draw the specific menus
                        if (loadedImages[currentMenu]) {
                            holos[round((tickClock.realMs / tickClock.baseMs) / 5) % holoNum].mask(loadedImages[currentMenu]);
                        }
                        image(holos[round((tickClock.realMs / tickClock.baseMs) / 5) % holoNum], -300, -480, 600, 600);
                    } else {
                        currentMenu = null;
                    }
                } else {
                    //Fading Holo
                    holoHeight = lerp(holoHeight, -25, uiEase(0.15));
                    fill(100, 100, 255, map(holoHeight, -25, -425, 0, 100));
                    stroke(255, 0);
                    quad(-textWidth(headings[i]) * 0.6, -25, textWidth(headings[i]) * 0.6, -25,
                        (-5 / 8) * (holoHeight + 25), holoHeight,
                        (5 / 8) * (holoHeight + 25), holoHeight);
                }
            }
            popMatrix();
        }
    }
};
/**Developer Console**/
var inGameVariables = [];
devConsole = {
    active: false,
    input: "",
    history: [],
    maxHistory: 14 * 4
};
var maxConsoleLines = 14 * 4;
var consoleScroll = 0;
var scrollY = 0;
var targetScrollY = 0;
var lineHeight = 15;
var maxScrollLines = 0;
var consoleHeight = 250;
var holding = false; //for console handle
var transitionD = false;
var transitionU = false;
var transitionT = false;
var keyMap = {
    8: {
        normal: "BACKSPACE"
    },
    9: {
        normal: "TAB"
    },
    10: {
        normal: "ENTER"
    },
    16: {
        normal: ""
    },
    17: {
        normal: ""
    },
    18: {
        normal: ""
    },
    20: {
        normal: ""
    },
    32: {
        normal: " "
    }, //space
    48: {
        normal: "0",
        shift: ")"
    },
    49: {
        normal: "1",
        shift: "!"
    },
    50: {
        normal: "2",
        shift: "@"
    },
    51: {
        normal: "3",
        shift: "#"
    },
    52: {
        normal: "4",
        shift: "$"
    },
    53: {
        normal: "5",
        shift: "%"
    },
    54: {
        normal: "6",
        shift: "^"
    },
    55: {
        normal: "7",
        shift: "&"
    },
    56: {
        normal: "8",
        shift: "*"
    },
    57: {
        normal: "9",
        shift: "("
    },
    65: {
        normal: "a",
        shift: "A"
    },
    66: {
        normal: "b",
        shift: "B"
    },
    67: {
        normal: "c",
        shift: "C"
    },
    68: {
        normal: "d",
        shift: "D"
    },
    69: {
        normal: "e",
        shift: "E"
    },
    70: {
        normal: "f",
        shift: "F"
    },
    71: {
        normal: "g",
        shift: "G"
    },
    72: {
        normal: "h",
        shift: "H"
    },
    73: {
        normal: "i",
        shift: "I"
    },
    74: {
        normal: "j",
        shift: "J"
    },
    75: {
        normal: "k",
        shift: "K"
    },
    76: {
        normal: "l",
        shift: "L"
    },
    77: {
        normal: "m",
        shift: "M"
    },
    78: {
        normal: "n",
        shift: "N"
    },
    79: {
        normal: "o",
        shift: "O"
    },
    80: {
        normal: "p",
        shift: "P"
    },
    81: {
        normal: "q",
        shift: "Q"
    },
    82: {
        normal: "r",
        shift: "R"
    },
    83: {
        normal: "s",
        shift: "S"
    },
    84: {
        normal: "t",
        shift: "T"
    },
    85: {
        normal: "u",
        shift: "U"
    },
    86: {
        normal: "v",
        shift: "V"
    },
    87: {
        normal: "w",
        shift: "W"
    },
    88: {
        normal: "x",
        shift: "X"
    },
    89: {
        normal: "y",
        shift: "Y"
    },
    90: {
        normal: "z",
        shift: "Z"
    },
    186: {
        normal: ";",
        shift: ":"
    },
    187: {
        normal: "=",
        shift: "+"
    },
    188: {
        normal: ",",
        shift: "<"
    },
    189: {
        normal: "-",
        shift: "_"
    },
    190: {
        normal: ".",
        shift: ">"
    },
    191: {
        normal: "/",
        shift: "?"
    },
    192: {
        normal: "`",
        shift: "~"
    },
    219: {
        normal: "[",
        shift: "{"
    },
    220: {
        normal: "\\",
        shift: "|"
    },
    221: {
        normal: "]",
        shift: "}"
    },
    222: {
        normal: "'",
        shift: '"'
    }
};
var commands = ["/clear", "/fov [val]", "/gamemode [val] [obj?]", "/help", "/help1", "/help2", "/help3", "/jumpheight [obj] [val]", "/kill [obj]", "/load [savecode]", "/setspawn", "/skin [skin]", "/stats", "/spawn", "/speed [obj] [val]", "/togglecollisions [true/false]", "/tp [obj] [x] [y] [|z]"];
var matchIndex = 0;
var filteredCommands = [];
var TPsec = 0;
var TPmin = 0;
var TPhr = 0;
var colOff = false;
var terrainCol = true;
var addConsoleHistory = function(message, isError) {
    devConsole.history.unshift({
        text: message,
        error: isError === true,
        userInput: false
    });
    if (devConsole.history.length > 56) {
        devConsole.history.pop();
    }
    consoleScroll = 0;
};
var parseAIArray = function(str) {
    str = str.trim();
    //Must start with '[' and end with ']'
    if (str.charAt(0) !== "[" || str.charAt(str.length - 1) !== "]") {
        return " Must start with '[' and end with ']'!";
    }
    //Only allow valid characters
    for (var i = 0; i < str.length; i++) {
        if ("0123456789,.-[] \n\r\t".indexOf(str.charAt(i)) === -1) {
            return " Only digits, commas, brackets, dash, and dot allowed!";
        }
    }
    var index = 0;
    var length = str.length;
    var parseNumber = function() {
        var start = index;
        var dotCount = 0;
        var minusCount = 0;
        while (index < length) {
            var c = str.charAt(index);
            if ("0123456789.-".indexOf(c) === -1) {
                break;
            }
            if (c === ".") {
                dotCount++;
                //Disallow multiple dots or dots not surrounded by digits
                var before = str.charAt(index - 1);
                var after = str.charAt(index + 1);
                if (dotCount > 1 || "0123456789".indexOf(before) === -1 || "0123456789".indexOf(after) === -1) {
                    break;
                }
            }
            if (c === "-") {
                if (index !== start) {
                    break;
                }
                minusCount++;
                if (minusCount > 1) {
                    break;
                }
            }
            index++;
        }
        if (start === index) {
            return null;
        }
        var num = parseFloat(str.substring(start, index));
        if (isNaN(num)) {
            return null;
        }
        return num;
    };
    var parse = function() {
        if (str.charAt(index) !== "[") {
            return null;
        }
        index++; //skip '['
        var arr = [];
        var expectValue = true;
        while (index < length) {
            var c = str.charAt(index);
            if (" \n\r\t".indexOf(c) !== -1) {
                index++;
                continue;
            }
            if (expectValue) {
                if (c === "[") {
                    return " Nested arrays are not allowed!";
                } else if ("0123456789-.".indexOf(c) !== -1) {
                    var num = parseNumber();
                    if (num === null) {
                        return null;
                    }
                    arr.push(num);
                    expectValue = false;
                } else if (c === "]") {
                    index++;
                    return arr;
                } else {
                    return " Invalid character!";
                }
            } else {
                if (c === ",") {
                    //Disallow trailing commas or double commas
                    var nextChar = str.charAt(index + 1);
                    while (" \n\r\t".indexOf(nextChar) !== -1) {
                        index++;
                        nextChar = str.charAt(index + 1);
                    }
                    if (nextChar === "," || nextChar === "]") {
                        return " Invalid use of comma!";
                    }
                    index++;
                    expectValue = true;
                } else if (c === "]") {
                    index++;
                    return arr;
                    //If this project was not created by ✝ 𝕮𝕲𝕏𝕷𝕮𝕵 ✝ and is not a spin-off of such a project, it has been plagiarized
                } else {
                    return " Invalid character!";
                }
            }
        }
        return " Close your array!";
    };
    var result = parse();
    if (result === null) {
        return null;
    }
    //Skip trailing whitespace
    while (index < length) {
        var c = str.charAt(index);
        if (" \n\r\t".indexOf(c) === -1) {
            return null;
        }
        index++;
    }
    return result;
};
var GameConsole = function(command) {
    command = command.trim();
    devConsole.history.unshift({
        text: command,
        error: false,
        userInput: true //special flag for user-typed line
    });
    if (devConsole.history.length > devConsole.maxHistory) {
        devConsole.history.pop();
    }
    //Get command name (first word before parentheses or space)
    var cmdMatch = command.match(/^([\/]?[a-zA-Z_]+)/);
    var cmd = cmdMatch ? cmdMatch[1].toLowerCase() : "";
    var args = command.split(" ");
    if (cmd === "/tp" && args.length >= 4 && args.length <= 5) {
        var who = args[1];
        var x = parseFloat(args[2]);
        var y = parseFloat(args[3]);
        var z = playerPos.z;
        if (args.length === 5) {
            z = parseFloat(args[4]);
        }
        if (who === "@p") {
            if (x < currentMap.width / 2 && x > -currentMap.width / 2 && y < currentMap.height / 2 && y > -currentMap.height / 2) {
                playerPos.x = x;
                playerPos.y = y;
                playerPos.z = z;
                addConsoleHistory(" Teleported to " + x + ", " + y + ", " + z, false);
            } else {
                addConsoleHistory(" Out of border: >" + x + ", " + y + "<", true);
            }
        } else {
            addConsoleHistory(" Unknown target: > " + who + " <", true);
        }
    } else if (cmd === "/gamemode" && args.length >= 2 && args.length <= 3) {
        var who = "@p";
        if (args.length === 3) {
            who = args[2];
        }
        var mode = parseFloat(args[1]);
        if (mode !== 0 && mode !== 1 && mode !== 2) {
            addConsoleHistory(" Unknown gamemode: > " + args[1] + " <", true);
        } else {
            if (who === "@p") {
                gameMode = mode;
                if (gameMode === 0) {
                    colOff = false;
                    terrainCol = true;
                    playerSpeed = 1;
                    fov = 4;
                } else if (gameMode === 1) {
                    fov = 4;
                    playerSpeed = 2;
                } else if (gameMode === 2) {
                    colOff = true;
                    terrainCol = false;
                    playerSpeed = 2;
                    fov = 4;
                }
                addConsoleHistory(" Set gamemode to: " + gameMode, false);
            } else {
                addConsoleHistory(" Unknown target: > " + who + " <", true);
            }
        }
    } else if (cmd === "/gamemode" && args.length === 1) {
        addConsoleHistory(" Too little arguments!", true);
    } else if (cmd === "/gamemode" && args.length > 3) {
        addConsoleHistory(" Too many arguments!", true);
    } else if (cmd === "/speed" && args.length === 3) {
        var who = args[1];
        var speed = parseFloat(args[2]);
        if (who === "@p") {
            playerSpeed = speed;
            addConsoleHistory(" Player speed set to: " + speed, false);
        } else {
            addConsoleHistory(" Unknown target: > " + who + " <", true);
        }
    } else if (cmd === "/speed" && args.length > 3) {
        addConsoleHistory(" Too many arguments!", true);
    } else if (cmd === "/speed" && args.length < 3) {
        addConsoleHistory(" Too little arguments!", true);
    } else if (cmd === "/spawn" && args.length === 1) {
        playerPos.x = currentMap.spawnPos.x;
        playerPos.y = currentMap.spawnPos.y;
        playerPos.z = currentMap.spawnPos.z;
        addConsoleHistory(" Teleported to spawn", false);
    } else if (cmd === "/spawn" && args.length > 1) {
        addConsoleHistory(" Too many arguments!", true);
    } else if (cmd === "/setspawn" && args.length === 1) {
        currentMap.spawnPos.x = playerPos.x;
        currentMap.spawnPos.y = playerPos.y;
        currentMap.spawnPos.z = playerPos.z;
        addConsoleHistory(" Set spawnpoint at: " + round(currentMap.spawnPos.x) + ", " + round(currentMap.spawnPos.y) + ", " + round(currentMap.spawnPos.z), false);
    } else if (cmd === "/setspawn" && args.length > 1) {
        addConsoleHistory(" Too many arguments!", true);
    } else if (cmd === "/fov" && args.length === 2) {
        if (parseFloat(args[1]) > 0 && parseFloat(args[1]) < 10000) {
            fov = parseFloat(args[1]);
            addConsoleHistory(" FOV set to: " + fov, false);
        } else {
            addConsoleHistory(" Invalid value: " + args[1], true);
        }
    } else if (cmd === "/fov" && args.length > 2) {
        addConsoleHistory(" Too many arguments!", true);
    } else if (cmd === "/fov" && args.length < 2) {
        addConsoleHistory(" Too little arguments!", true);
    } else if (cmd === "/stats" && args.length === 1) {
        addConsoleHistory("    Time played:", false);
        addConsoleHistory("     second(s): " + round(TPsec) + ", minute(s): " + TPmin + ", hour(s): " + TPhr + ". Only accurate if", false);
        addConsoleHistory("     this page has remained active.", false);
        addConsoleHistory("    Current position: " + round(playerPos.x) + ", " + round(playerPos.y) + ", " + round(playerPos.z * 100) / 100, false);
        addConsoleHistory("    Current frames per second: " + ~~this.__frameRate, false);
        addConsoleHistory("    Deaths: " + playerDeaths, false);
        addConsoleHistory("    Simulation: " + round(1000 / tickClock.stepMs) + " ticks/s; catch-up ticks: " + tickClock.stepsThisFrame, false);
        addConsoleHistory("    Game time ms: " + round(tickClock.gameMs) + "; AI scans: " + performanceStats.perceptionScans, false);
        addConsoleHistory("    Update/render ms: " + performanceStats.updateMs + " / " + performanceStats.renderMs, false);
        addConsoleHistory("    Target candidates/sight samples: " + performanceStats.targetCandidates + " / " + performanceStats.sightSamples, false);
        addConsoleHistory("    Culled objects: " + performanceStats.culledObjects, false);
    } else if (cmd === "/stats" && args.length > 1) {
        addConsoleHistory(" Too many arguments!", true);
    } else if ((cmd === "/help1" || cmd === "/help") && args.length === 1) {
        addConsoleHistory(" Page 1", false);
        addConsoleHistory(" @p = yourself", false);
        addConsoleHistory(" example uses of commands:", false);
        addConsoleHistory(" /tp [obj] [x] [y] [z, optional]", false);
        addConsoleHistory("   teleports you to any position within the border", false);
        addConsoleHistory(" /spawn", false);
        addConsoleHistory("   teleports you to your spawn position", false);
        addConsoleHistory(" /setspawn", false);
        addConsoleHistory("   sets spawn to current position", false);
        addConsoleHistory(" /fov [val]", false);
        addConsoleHistory("   changes your FOV. the lower the value, the bigger the FOV", false);
        addConsoleHistory("", false);
        addConsoleHistory(" use /help2 to view next page", false);
    } else if ((cmd === "/help1" || cmd === "/help") && args.length > 1) {
        addConsoleHistory(" Too many arguments!", true);
    } else if (cmd === "/help2" && args.length === 1) {
        addConsoleHistory(" Page 2", false);
        addConsoleHistory(" /stats", false);
        addConsoleHistory("   displays current position, framerate, and time playing this game", false);
        addConsoleHistory(" /speed [obj] [val]", false);
        addConsoleHistory("   sets the object's movement speed to the value", false);
        addConsoleHistory(" /clear", false);
        addConsoleHistory("   clears the console", false);
        addConsoleHistory(" /kill [obj]", false);
        addConsoleHistory("   Kills the object", false);
        addConsoleHistory(" /togglecollisions [true/false]", false);
        addConsoleHistory("   Switches between collisions being turned on and off", false);
        addConsoleHistory(' "//" can be used at the beginning of a message', false);
        addConsoleHistory('to act as a comment and prevent "undefined" errors', false);
        addConsoleHistory(" use /help3 to view next page", false);
    } else if (cmd === "/help2" && args.length > 1) {
        addConsoleHistory(" Too many arguments!", true);
    } else if (cmd === "/help3" && args.length === 1) {
        addConsoleHistory(" Page 3", false);
        addConsoleHistory(" /load [savecode]", false);
        addConsoleHistory("   Used to load a save code into the game", false);
        addConsoleHistory("   Must be enclosed in brackets. Must have commas inbetween values", false);
        addConsoleHistory("   Must have NO spaces inside brackets. Must have NO semicolons", false);
        addConsoleHistory("   '0123456789.,-[]' Are the only digits allowen in the savecode", false);
        addConsoleHistory("", false);
        addConsoleHistory("", false);
        addConsoleHistory("", false);
        addConsoleHistory("", false);
        addConsoleHistory("", false);
        addConsoleHistory("", false);
        addConsoleHistory(" use /help2 to view last page", false);
    } else if (cmd === "/help3" && args.length > 1) {
        addConsoleHistory(" Too many arguments!", true);
    } else if (cmd === "/clear" && args.length === 1) {
        devConsole.history = [];
    } else if (cmd === "/clear" && args.length > 1) {
        addConsoleHistory(" Too many arguments!", true);
    } else if (cmd === "/togglecollisions" && args.length >= 1 && args.length <= 2) {
        if (args.length === 1) {
            if (colOff === false) {
                colOff = true;
                addConsoleHistory("Collisions have been turned off", false);
            } else {
                colOff = false;
                addConsoleHistory("Collisions have been turned on", false);
            }
        } else {
            if (args[1] === "true") {
                terrainCol = true;
                addConsoleHistory("Terrain collisions have been turned on", false);
            } else if (args[1] === "false") {
                colOff = true;
                terrainCol = false;
                addConsoleHistory("Terrain collisions have been turned off", false);
            } else {
                addConsoleHistory(" Unknown boolean literal: > " + args[1] + " <", true);
                addConsoleHistory(" Try /togglecollisions [true/false]", true);
            }
        }
    } else if (cmd === "/togglecollisions" && args.length > 2) {
        addConsoleHistory(" Too many arguments!", true);
    } else if (cmd === "/kill" && args.length === 2) {
        var trgt = args[1];
        if (trgt === "@p") {
            playerVel.mult(0);
            playerPos = new PVector(currentMap.spawnPos.x, currentMap.spawnPos.y, currentMap.spawnPos.z);
            playerDeaths++;
            addConsoleHistory(" Sucsessfully killed: " + trgt, false);
        } else {
            addConsoleHistory(" Cannot find target: " + trgt, true);
        }
    } else if (cmd === "/kill" && args.length > 2) {
        addConsoleHistory(" Too many arguments!", true);
    } else if (cmd === "/kill" && args.length < 2) {
        addConsoleHistory(" Too little arguments!", true);
    } else if (cmd === "/load" && args.length === 2) {
        var input = args[1];
        var parsed = parseAIArray(input);
        if (parsed === " Must start with '[' and end with ']'!") {
            addConsoleHistory(" Must start with '[' and end with ']'!", true);
        } else if (parsed === " Invalid character!") {
            addConsoleHistory(parsed, true);
        } else if (parsed === " No number found") {
            addConsoleHistory(parsed, true);
        } else if (parsed === " Close your array!") {
            addConsoleHistory(parsed, true);
        } else if (parsed === " Only digits, commas, brackets, dash, and dot allowed!") {
            addConsoleHistory(parsed, true);
        } else if (parsed === " Invalid use of comma!") {
            addConsoleHistory(parsed, true);
        } else if (parsed === null) {
            addConsoleHistory(" Invalid entry!", true);
        } else {
            addConsoleHistory(" Loaded!", false);
            addConsoleHistory(parsed, false);
        }
    } else if (cmd === "/load" && args.length > 2) {
        addConsoleHistory(" Too many arguments! (Do not use spaces inbetween vals)", true);
    } else if (cmd === "/load" && args.length < 2) {
        addConsoleHistory(" Too little arguments!", true);
    } else if (cmd === "/jumpheight" && args.length === 3) {
        var who = args[1];
        var height = parseFloat(args[2]);
        if (parseFloat(args[2]) > 0 && parseFloat(args[2]) < 100000) {
            if (who === "@p") {
                playerJumpHeight = height;
                addConsoleHistory(" Player jump height set to: " + height, false);
            } else {
                addConsoleHistory(" Unknown target: > " + who + " <", true);
            }
        } else {
            addConsoleHistory(" Invalid value: > " + args[2] + " <", true);
        }
    } else if (cmd === "/jumpheight" && args.length > 3) {
        addConsoleHistory(" Too many arguments!", true);
    } else if (cmd === "/jumpheight" && args.length < 3) {
        addConsoleHistory(" Too little arguments!", true);
    } else if (cmd === "/skin" && args.length === 2) {
        var trgt = args[1];
        if (trgt === "Kylo_Ren") {
            playerSpeed = 1.1;
            skin = "Kylo Ren";
            addConsoleHistory(" Set skin to: " + skin, false);
        } else if (trgt === "Stormtrooper") {
            playerSpeed = 1;
            skin = trgt;
            addConsoleHistory(" Set skin to: " + skin, false);
        } else if (trgt === "Shoretrooper") {
            playerSpeed = 1;
            skin = trgt;
            addConsoleHistory(" Set skin to: " + skin, false);
        } else if (trgt === "Heavy_Shoretrooper") {
            skin = "Heavy Shoretrooper";
            playerSpeed = 0.8;
            addConsoleHistory(" Set skin to: " + skin, false);
        } else if (trgt === "Shadow_Trooper") {
            skin = "Shadow Trooper";
            playerSpeed = 1;
            addConsoleHistory(" Set skin to: " + skin, false);
        } else if (trgt === "Luke_Skywalker") {
            skin = "Luke Skywalker";
            playerSpeed = 1.1;
            addConsoleHistory(" Set skin to: " + skin, false);
        } else {
            addConsoleHistory(" Cannot find skin: " + trgt, true);
        }
    } else if (cmd === "/skin" && args.length > 2) {
        addConsoleHistory(" Too many arguments!", true);
    } else if (cmd === "/skin" && args.length < 2) {
        addConsoleHistory(" Too little arguments!", true);
    } else if (devConsole.input.charAt(0) === "/" && devConsole.input.charAt(1) !== "/") {
        addConsoleHistory(" Unknown command: > " + cmd + " <", true);
    } else if (devConsole.input.charAt(0) === "/" && devConsole.input.charAt(1) === "/") {
        //nothing :)
    } else if (cmd === "let") {
        var fullCommand = command.trim();
        if (!fullCommand.endsWith(";")) {
            addConsoleHistory(" Must end with ';'!", false);
            return;
        }
        var VAR = args[1];
        var rawVAL = args[3];
        var VAL;
        //Check for valid variable name
        if (!/^[$A-Za-z_][$A-Za-z0-9_]*$/.test(VAR)) {
            addConsoleHistory(" Invalid variable name: " + VAR, false);
            return;
        }
        //Check if rawVAL is a number
        if (!isNaN(parseFloat(rawVAL))) {
            VAL = parseFloat(rawVAL);
        } else {
            //Check if it's a previously defined variable
            var found = false;
            for (var i = 0; i < inGameVariables.length; i++) {
                if (inGameVariables[i].VAR === rawVAL) {
                    VAL = inGameVariables[i].VAL;
                    found = true;
                    break;
                }
            }
            if (!found) {
                addConsoleHistory(" Unknown variable or invalid value: " + rawVAL, false);
                return;
            }
        }
        inGameVariables.push({
            VAR: VAR,
            VAL: VAL
        });
        addConsoleHistory(" " + VAR + " = " + VAL, false);
    } else if (cmd === "print") {
        var fullCommand = command.trim();
        if (!/^print\((.+)\);$/.test(fullCommand)) {
            addConsoleHistory(' Invalid print syntax. Use: print("text"); or print(variable);', false);
            return;
        }
        //Extract the contents inside parentheses
        var inside = fullCommand.match(/^print\((.+)\);$/)[1].trim();
        //If inside is a quoted string
        if (
            (inside.startsWith('"') && inside.endsWith('"')) || (inside.startsWith("'") && inside.endsWith("'"))) {
            addConsoleHistory(inside.slice(1, -1), false);
        } else {
            //Try to treat it as a variable
            var found = false;
            for (var i = 0; i < inGameVariables.length; i++) {
                if (inGameVariables[i].VAR === inside) {
                    addConsoleHistory(" " + inGameVariables[i].VAL, false);
                    found = true;
                    break;
                }
            }
            if (!found) {
                addConsoleHistory(" Undefined variable: " + inside, false);
            }
        }
    } else {
        addConsoleHistory(" undefined", true);
    }
    addConsoleHistory(" ——————————————————————————————————————————————————————————————————————", true);
};
var drawDevConsole = function() {
    pushStyle();
    rectMode(CORNER);
    textAlign(LEFT, BASELINE);
    textFont(basicMainFont, 15);
    noStroke();
    var fullHeight = 250 - height;
    if (!mouseIsPressed) {
        holding = false;
    }
    if (holding && !transitionD && !transitionU && !transitionT) {
        consoleHeight = constrain(mouseY - (height - 250), fullHeight, 250);
    }
    if (!holding && !transitionD && !transitionU && !transitionT) {
        if (consoleHeight > 200 && devConsole.active) {
            transitionD = true;
        } else if (consoleHeight < fullHeight + 40 && consoleHeight > fullHeight + 5) {
            transitionT = true;
        }
    }
    var consoleTarget = transitionD ? 250 : transitionT ? fullHeight : 0;
    if (transitionD || transitionU || transitionT) {
        consoleHeight = lerp(consoleHeight, consoleTarget, uiEase(0.15));
        if (abs(consoleHeight - consoleTarget) < 1) {
            consoleHeight = consoleTarget;
            devConsole.active = !transitionD;
            transitionD = false;
            transitionU = false;
            transitionT = false;
        }
    }
    var top = constrain(height - 250 + consoleHeight, 0, height);
    var handleY = constrain(top - 10, 0, height - 20);
    if (mouseX >= width / 2 - 40 && mouseX <= width / 2 + 40 && mouseY >= handleY && mouseY <= handleY + 20 && mouseIsPressed && !transitionD && !transitionU && !transitionT) {
        holding = true;
        devConsole.active = true;
    }
    fill(22, 28, 38, 235);
    rect(0, top, width, height - top);
    if (top < height - 25) {
        var visibleLines = max(0, floor((height - top - 48) / lineHeight));
        maxScrollLines = max(0, devConsole.history.length - visibleLines);
        consoleScroll = constrain(consoleScroll, 0, maxScrollLines);
        targetScrollY = consoleScroll * lineHeight;
        scrollY = lerp(scrollY, targetScrollY, uiEase(0.2));
        for (var historyIndex = 0; historyIndex < devConsole.history.length; historyIndex++) {
            var entry = devConsole.history[historyIndex];
            var lineY = height - 42 + scrollY - historyIndex * lineHeight;
            if (lineY < top + 18 || lineY > height - 38) {
                continue;
            }
            fill(entry.error ? color(255, 110, 110) : entry.userInput ? color(165, 190, 210) : color(225, 235, 245));
            var lineText = (entry.userInput ? "> " : "") + entry.text;
            while (lineText.length > 0 && textWidth(lineText) > width - 24) {
                lineText = lineText.slice(0, -1);
            }
            text(lineText, 12, lineY);
        }
        var inputText = devConsole.input;
        var blink = floor(tickClock.realMs / 650) % 2 === 0 ? "_" : " ";
        while (inputText.length > 0 && textWidth(inputText + blink) > width - 42) {
            inputText = inputText.slice(1);
        }
        fill(100, 180, 240);
        text(">", 12, height - 14);
        fill(220, 235, 245);
        text(inputText + blink, 28, height - 14);
        filteredCommands = devConsole.input.charAt(0) === "/" ? commands.filter(function(command) {
            return command.indexOf(devConsole.input.toLowerCase()) === 0;
        }) : [];
        matchIndex = constrain(matchIndex, 0, max(0, filteredCommands.length - 1));
        if (devConsole.active && filteredCommands.length > 0) {
            var maxShow = min(12, min(filteredCommands.length, max(0, floor((height - top - 48) / 18))));
            var firstMatch = max(0, matchIndex - maxShow + 1);
            var boxY = height - 32 - maxShow * 18;
            fill(18, 25, 35, 245);
            rect(24, boxY, min(320, width - 36), maxShow * 18, 4);
            textAlign(LEFT, CENTER);
            textSize(13);
            for (var matchRow = 0; matchRow < maxShow; matchRow++) {
                var commandIndex = firstMatch + matchRow;
                fill(commandIndex === matchIndex ? color(100, 200, 255) : color(220, 230, 240));
                text(filteredCommands[commandIndex], 30, boxY + matchRow * 18 + 9);
            }
        }
    }
    fill(holding ? 120 : 80, 130, 160, 200);
    rect(width / 2 - 40, handleY, 80, 20, 5);
    popStyle();
};
/**Create Collisions Framework**/
var Collision = function(config) {
    this.type = config.type;
    this.collisionMode = config.collisionMode || "static";
    this.liveCollision = this.collisionMode === "live";
    this.blocksLasers = config.blocksLasers !== undefined ? config.blocksLasers : true;
    this.blocksPlayers = config.blocksPlayers !== undefined ? config.blocksPlayers : true;
    this.plane = config.plane !== undefined ? config.plane : false;
    this.spawnSurface = config.spawnSurface !== undefined ? config.spawnSurface : false;
    this.smoothCorners = config.smoothCorners !== undefined ? config.smoothCorners : false;
    if (config.lowZ !== undefined) {
        this.lowZ = config.lowZ;
        this.highZ = config.highZ !== undefined ? config.highZ : config.lowZ;
    } else if (config.zValue !== undefined) {
        this.lowZ = config.zValue;
        this.highZ = config.zValue;
    } else {
        this.lowZ = -100;
        this.highZ = 100;
        //By default, it will assume an all-encompassing collision
    }
    if (this.type === "rect" || this.type === "ellipse") {
        //Note that these collisions will be CENTERED at the given (x, y) point
        this.x = config.x !== undefined ? config.x : 0;
        this.y = config.y !== undefined ? config.y : 0;
        this.width = config.width !== undefined ? config.width : 50;
        this.height = config.height !== undefined ? config.height : 50;
        this.rotation = config.rotation !== undefined ? config.rotation : 0;
    } else if (this.type === "quad") {
        this.p1 = [config.points[0], config.points[1]] || [-50, 50];
        this.p2 = [config.points[2], config.points[3]] || [-50, -50];
        this.p3 = [config.points[4], config.points[5]] || [50, -50];
        this.p4 = [config.points[6], config.points[7]] || [50, 50];
    } else if (this.type === "tri") {
        //In a tri, point values are absolute, not relative
        this.p1 = [config.points[0], config.points[1]] || [-50, 50];
        this.p2 = [config.points[2], config.points[3]] || [-50, -50];
        this.p3 = [config.points[4], config.points[5]] || [50, -50];
    }
    this.refreshCache();
};
Collision.prototype.refreshCache = function() {
    this._floorLowZ = floor(this.lowZ);
    this._floorHighZ = floor(this.highZ);
    this._planeMinZ = this._floorLowZ - 0.1;
    this._planeMaxZ = this._floorHighZ + 0.1;
    this._solidMinZ = this._floorLowZ;
    this._solidMaxZ = constrain(this._floorHighZ, this._floorLowZ + 0.9, 999);
    if (this.type === "rect" || this.type === "ellipse") {
        this._halfW = this.width / 2;
        this._halfH = this.height / 2;
        this._rotationNorm = ((this.rotation % 360) + 360) % 360;
        this._absRot = abs(this._rotationNorm);
    }
    if (this.type === "rect") {
        this._rectAxisAligned = this._rotationNorm === 0 || this._rotationNorm === 180;
        this._rectQuarterTurn = this._rotationNorm === 90 || this._rotationNorm === 270;
        if (this._rectAxisAligned) {
            this._minX = this.x - this._halfW;
            this._maxX = this.x + this._halfW;
            this._minY = this.y - this._halfH;
            this._maxY = this.y + this._halfH;
        } else if (this._rectQuarterTurn) {
            this._minX = this.x - this._halfH;
            this._maxX = this.x + this._halfH;
            this._minY = this.y - this._halfW;
            this._maxY = this.y + this._halfW;
        } else {
            this._rectHalfDiag = sqrt(this.width * this.width + this.height * this.height) / 2;
            this._minX = this.x - this._rectHalfDiag;
            this._maxX = this.x + this._rectHalfDiag;
            this._minY = this.y - this._rectHalfDiag;
            this._maxY = this.y + this._rectHalfDiag;
            var hyp = sqrt(this._halfW * this._halfW + this._halfH * this._halfH);
            var phi = atan(this.width / this.height) + 90;
            this._ax = cos(phi + this.rotation) * hyp + this.x;
            this._ay = sin(phi + this.rotation) * hyp + this.y;
            this._bx = cos(-phi + this.rotation) * hyp + this.x;
            this._by = sin(-phi + this.rotation) * hyp + this.y;
            this._cx = cos(phi + this.rotation + 180) * hyp + this.x;
            this._cy = sin(phi + this.rotation + 180) * hyp + this.y;
            this._dx = cos(-phi + this.rotation + 180) * hyp + this.x;
            this._dy = sin(-phi + this.rotation + 180) * hyp + this.y;
            this._quadArea1 = 0.5 * abs(this._ax * (this._by - this._cy) + this._bx * (this._cy - this._ay) + this._cx * (this._ay - this._by));
            this._quadArea2 = 0.5 * abs(this._ax * (this._dy - this._cy) + this._dx * (this._cy - this._ay) + this._cx * (this._ay - this._dy));
        }
    } else if (this.type === "ellipse") {
        this._ellipseHalfMax = max(this.width, this.height) / 2;
        this._minX = this.x - this._ellipseHalfMax;
        this._maxX = this.x + this._ellipseHalfMax;
        this._minY = this.y - this._ellipseHalfMax;
        this._maxY = this.y + this._ellipseHalfMax;
        if (this.width === this.height) {
            this._circleRadius = this.width / 2;
        } else if (this.width > this.height) {
            this._ellipseFocusOffset = sqrt(this._halfW * this._halfW - this._halfH * this._halfH);
            this._ellipseFocus1X = this.x + cos(this.rotation) * this._ellipseFocusOffset;
            this._ellipseFocus1Y = this.y + sin(this.rotation) * this._ellipseFocusOffset;
            this._ellipseFocus2X = this.x - cos(this.rotation) * this._ellipseFocusOffset;
            this._ellipseFocus2Y = this.y - sin(this.rotation) * this._ellipseFocusOffset;
        } else {
            this._ellipseFocusOffset = sqrt(this._halfH * this._halfH - this._halfW * this._halfW);
            this._ellipseFocus1X = this.x + cos(this.rotation + 90) * this._ellipseFocusOffset;
            this._ellipseFocus1Y = this.y + sin(this.rotation + 90) * this._ellipseFocusOffset;
            this._ellipseFocus2X = this.x - cos(this.rotation + 90) * this._ellipseFocusOffset;
            this._ellipseFocus2Y = this.y - sin(this.rotation + 90) * this._ellipseFocusOffset;
        }
    } else if (this.type === "quad") {
        this._minX = min(min(this.p1[0], this.p2[0]), min(this.p3[0], this.p4[0]));
        this._maxX = max(max(this.p1[0], this.p2[0]), max(this.p3[0], this.p4[0]));
        this._minY = min(min(this.p1[1], this.p2[1]), min(this.p3[1], this.p4[1]));
        this._maxY = max(max(this.p1[1], this.p2[1]), max(this.p3[1], this.p4[1]));
        this._quadArea1 = 0.5 * abs(this.p1[0] * (this.p2[1] - this.p3[1]) + this.p2[0] * (this.p3[1] - this.p1[1]) + this.p3[0] * (this.p1[1] - this.p2[1]));
        this._quadArea2 = 0.5 * abs(this.p1[0] * (this.p4[1] - this.p3[1]) + this.p4[0] * (this.p3[1] - this.p1[1]) + this.p3[0] * (this.p1[1] - this.p4[1]));
    } else if (this.type === "tri") {
        this._minX = min(this.p1[0], min(this.p2[0], this.p3[0]));
        this._maxX = max(this.p1[0], max(this.p2[0], this.p3[0]));
        this._minY = min(this.p1[1], min(this.p2[1], this.p3[1]));
        this._maxY = max(this.p1[1], max(this.p2[1], this.p3[1]));
        this._triArea = 0.5 * abs(this.p1[0] * (this.p2[1] - this.p3[1]) + this.p2[0] * (this.p3[1] - this.p1[1]) + this.p3[0] * (this.p1[1] - this.p2[1]));
    }
};
Collision.prototype.checkCollision = function(x, y, z) {
    //Checks z collision, rounding to the nearest --thousandth-- tenths place (yeah, I really wish it were more accurate)
    //Added the - 0.1 so that you'll hit your head on ceilings
    if (
        (this.plane && z >= this._planeMinZ && z <= this._planeMaxZ) || (!this.plane && z >= this._solidMinZ && z <= this._solidMaxZ)) {
        if (this.type === "rect") {
            if (this._rectAxisAligned) {
                if (x < this._minX || x > this._maxX || y < this._minY || y > this._maxY) {
                    return false;
                }
            } else if (this._rectQuarterTurn) {
                if (x < this._minX || x > this._maxX || y < this._minY || y > this._maxY) {
                    return false;
                }
            } else {
                if (x < this._minX || x > this._maxX || y < this._minY || y > this._maxY) {
                    return false;
                }
            }
        } else if (this.type === "ellipse") {
            if (x < this.x - this._ellipseHalfMax || x > this.x + this._ellipseHalfMax || y < this.y - this._ellipseHalfMax || y > this.y + this._ellipseHalfMax) {
                return false;
            }
        } else if (this.type === "quad") {
            if (x < this._minX || x > this._maxX || y < this._minY || y > this._maxY) {
                return false;
            }
        } else if (this.type === "tri") {
            if (x < this._minX || x > this._maxX || y < this._minY || y > this._maxY) {
                return false;
            }
        }
        if (this.type === "rect") {
            if (this._rectAxisAligned || this._rectQuarterTurn) {
                return x >= this._minX && x <= this._maxX && y >= this._minY && y <= this._maxY;
            }
        }
        if (this.type === "quad" || this.type === "rect") {
            //If this is a rect in standard position, this code won't          //run because the above rect if will stop the function
            var a1x, a1y, b1x, b1y, c1x, c1y, d1x, d1y;
            if (this.type === "quad") {
                a1x = this.p1[0];
                a1y = this.p1[1];
                b1x = this.p2[0];
                b1y = this.p2[1];
                c1x = this.p3[0];
                c1y = this.p3[1];
                d1x = this.p4[0];
                d1y = this.p4[1];
            } else if (this.type === "rect") {
                a1x = this._ax;
                a1y = this._ay;
                b1x = this._bx;
                b1y = this._by;
                c1x = this._cx;
                c1y = this._cy;
                d1x = this._dx;
                d1y = this._dy;
            }
            return (abs(
                (0.5 * abs(x * (b1y - c1y) + b1x * (c1y - y) + c1x * (y - b1y))) / this._quadArea1 + (0.5 * abs(a1x * (y - c1y) + x * (c1y - a1y) + c1x * (a1y - y))) / this._quadArea1 + (0.5 * abs(a1x * (b1y - y) + b1x * (y - a1y) + x * (a1y - b1y))) / this._quadArea1 - 1) < 0.001 || abs(
                (0.5 * abs(x * (d1y - c1y) + d1x * (c1y - y) + c1x * (y - d1y))) / this._quadArea2 + (0.5 * abs(a1x * (y - c1y) + x * (c1y - a1y) + c1x * (a1y - y))) / this._quadArea2 + (0.5 * abs(a1x * (d1y - y) + d1x * (y - a1y) + x * (a1y - d1y))) / this._quadArea2 - 1) < 0.001);
        } else if (this.type === "tri") {
            //Although not copied exactly, the ideas for calculating the area of the tri and using the barycentric coordinate method came from Google's Gemini
            var a = this.p1;
            var b = this.p2;
            var c = this.p3;
            return (abs(
                (0.5 * abs(x * (b[1] - c[1]) + b[0] * (c[1] - y) + c[0] * (y - b[1]))) / this._triArea + (0.5 * abs(a[0] * (y - c[1]) + x * (c[1] - a[1]) + c[0] * (a[1] - y))) / this._triArea + (0.5 * abs(a[0] * (b[1] - y) + b[0] * (y - a[1]) + x * (a[1] - b[1]))) / this._triArea - 1) < 0.001);
        } else if (this.type === "ellipse") {
            if (this.width > this.height) {
                //Elongated Horizontally
                return (dist(x, y, this._ellipseFocus1X, this._ellipseFocus1Y) + dist(x, y, this._ellipseFocus2X, this._ellipseFocus2Y) <= this.width);
            } else if (this.width < this.height) {
                //Elongated Vertically
                return (dist(x, y, this._ellipseFocus1X, this._ellipseFocus1Y) + dist(x, y, this._ellipseFocus2X, this._ellipseFocus2Y) <= this.height);
            } else {
                //Perfect Circle
                var circleDx = x - this.x;
                var circleDy = y - this.y;
                return (circleDx * circleDx + circleDy * circleDy <= this._circleRadius * this._circleRadius);
            }
        }
    }
    return false;
};
Collision.prototype.findNormal = function(x, y) {
    if (this.type === "rect") {
        if (abs(this.rotation) === 0 || abs(this.rotation) === 180) {
            if (
                (round(y) >= this.y + this.height / 2 - 3 && playerVel.y < 0) || (y <= this.y - this.height / 2 + 3 && playerVel.y > 0)) {
                return new PVector(0, -playerVel.y);
                //I don't like having to use this error margin of 3, it doesn't work out well. But I don't know how to fix it...
            } else {
                return new PVector(-playerVel.x, 0);
            }
        } else if (abs(this.rotation === 90) || abs(this.rotation) === 270) {} else {
            var normal = new PVector(playerVel.mag() * sin("something"), playerVel.mag * sin("something"));
        }
    } else if (this.type === "quad") {} else if (this.type === "tri") {} else if (this.type === "ellipse") {}
};
Collision.prototype.entityCollide = function(pos, vel, size, bounce) {
    var hitMask = 0; //1 = plane (floor), 2 = non-plane (walls/solids)
    var velScale = 1;
    if (vel && vel._stepScale !== undefined) {
        velScale = vel._stepScale;
    }
    var zRounded = round(pos.z * 10) / 10;
    if (!this.plane && this.type === "rect" && zRounded >= floor(this.lowZ) && zRounded <= constrain(floor(this.highZ), floor(this.lowZ) + 0.9, 999)) {
        var dx = pos.x - this.x;
        var dy = pos.y - this.y;
        var localX = dx * cos(-this.rotation) - dy * sin(-this.rotation);
        var localY = dx * sin(-this.rotation) + dy * cos(-this.rotation);
        var localVelX = vel ? vel.x * cos(-this.rotation) - vel.y * sin(-this.rotation) : 0;
        var localVelY = vel ? vel.x * sin(-this.rotation) + vel.y * cos(-this.rotation) : 0;
        var halfW = this.width / 2;
        var halfH = this.height / 2;
        var wallSkin = 0.25;
        var pushLocalX = 0;
        var pushLocalY = 0;
        var closestX = constrain(localX, -halfW, halfW);
        var closestY = constrain(localY, -halfH, halfH);
        var cornerDx = localX - closestX;
        var cornerDy = localY - closestY;
        var cornerDistSq = cornerDx * cornerDx + cornerDy * cornerDy;
        if (cornerDistSq <= pow(size + wallSkin, 2)) {
            if (abs(cornerDx) < 0.0001 && abs(cornerDy) < 0.0001) {
                var overlapX = halfW + size + wallSkin - abs(localX);
                var overlapY = halfH + size + wallSkin - abs(localY);
                if (overlapX < overlapY) {
                    var pushSignX = localX < -0.0001 ? -1 : localX > 0.0001 ? 1 : localVelX > 0 ? -1 : 1;
                    pushLocalX = overlapX * pushSignX;
                } else {
                    var pushSignY = localY < -0.0001 ? -1 : localY > 0.0001 ? 1 : localVelY > 0 ? -1 : 1;
                    pushLocalY = overlapY * pushSignY;
                }
            } else {
                var cornerDist = sqrt(max(0.0001, cornerDistSq));
                var cornerPush = size + wallSkin - cornerDist;
                pushLocalX = (cornerDx / cornerDist) * cornerPush;
                pushLocalY = (cornerDy / cornerDist) * cornerPush;
            }
            var pushWorldX = pushLocalX * cos(this.rotation) - pushLocalY * sin(this.rotation);
            var pushWorldY = pushLocalX * sin(this.rotation) + pushLocalY * cos(this.rotation);
            var pushLen = max(0.0001, sqrt(pushWorldX * pushWorldX + pushWorldY * pushWorldY));
            var normalX = pushWorldX / pushLen;
            var normalY = pushWorldY / pushLen;
            var inwardSpeed = vel ? vel.x * normalX + vel.y * normalY : 0;
            pos.x += pushWorldX;
            pos.y += pushWorldY;
            if (vel && inwardSpeed < 0) {
                vel.x -= inwardSpeed * normalX;
                vel.y -= inwardSpeed * normalY;
            }
            return 2;
        }
    }
    for (var k = 0; k < colSamples.length; k++) {
        var sampleX = pos.x + size * colSamples[k].x;
        var sampleY = pos.y + size * colSamples[k].y;
        if (this.checkCollision(sampleX, sampleY, zRounded)) {
            if (this.plane) {
                var floorZ = floor(this.lowZ);
                var previousZ = pos.z - (vel ? vel.z * velScale : 0);
                var rising = vel && vel.z > 0.001;
                var landTolerance = 0.1;
                if (!rising && vel && vel.z <= 0) {
                    landTolerance = max(0.1, abs(vel.z * velScale) + 0.05);
                }
                if (!rising && pos.z >= floorZ - landTolerance) {
                    hitMask |= 1;
                    if (bounce) {
                        pos.z -= vel.z * velScale;
                        vel.z -= vel.z * (1 + bounce);
                    } else {
                        //Stops players from falling, and rounds their z
                        vel.z = 0;
                        pos.z = floorZ;
                        //Did this ^ so that it will round to the nearest, instead of simply snapping it to the lowZ with floor
                    }
                } else if (rising && previousZ <= floorZ - 0.05 && pos.z >= floorZ - 0.05) {
                    //Block upward motion only when crossing into the underside of a plane.
                    if (bounce) {
                        pos.z -= vel.z * velScale;
                        vel.z -= vel.z * (1 + bounce);
                    } else {
                        pos.z = min(pos.z, floorZ - 0.051);
                        vel.z = 0;
                    }
                }
            } else {
                hitMask |= 2;
                if (collideMode === "unstable") {
                    vel.add(this.findNormal(sampleX + 300, sampleY + 300));
                    println(playerVel);
                    break;
                } else {
                    if (k === 1 || k === 3 || k === 5 || k === 7) {
                        pos.x -= vel.x * velScale;
                        pos.y -= vel.y * velScale;
                        if (bounce) {
                            vel.x -= vel.x * (1 + bounce);
                            vel.y -= vel.y * (1 + bounce);
                        } else {
                            vel.x = 0;
                            vel.y = 0;
                        }
                    } else if (k === 0 || k === 4) {
                        pos.x -= vel.x * velScale;
                        if (bounce) {
                            vel.x -= vel.x * (1 + bounce);
                        } else {
                            vel.x = 0;
                        }
                    } else if (k === 2 || k === 6) {
                        //if is only for clarity
                        pos.y -= vel.y * velScale;
                        if (bounce) {
                            vel.y -= vel.y * (1 + bounce);
                        } else {
                            vel.y = 0;
                        }
                    }
                }
            }
        }
    }
    return hitMask;
};
Collision.prototype.move = function(x, y) {
    if (this.type === "rect" || this.type === "ellipse") {
        this.x += x;
        this.y += y;
    } else {
        this.p1[0] += x;
        this.p1[1] += y;
        this.p2[0] += x;
        this.p2[1] += y;
        this.p3[0] += x;
        this.p3[1] += y;
        if (this.type === "quad") {
            this.p4[0] += x;
            this.p4[1] += y;
        }
    }
    this.refreshCache();
};
Collision.prototype.turn = function(angle) {
    if (this.type === "rect" || this.type === "ellipse") {
        this.rotation += angle;
        this.refreshCache();
    }
};
var zChanger = function(collider, type, zChange, snap) {
    this.collision = new Collision(collider); //Collider is a collision config
    this.type = type || "sudden";
    this.zChange = zChange;
    this.snap = snap || false;
};
zChanger.prototype.update = function() {
    var ci = this.collision;
    if (ci.checkCollision(playerPos.x, playerPos.y, round(playerPos.z * 10) / 10)) {
        if (this.type === "smooth") {
            var dx = playerPos.x - (ci.x + (ci.height / 2) * cos(-ci.rotation - 90));
            var dy = playerPos.y - (ci.y + (ci.height / 2) * sin(-ci.rotation + 90));
            var stepZ = (this.zChange[1] - this.zChange[0]) * abs(
                (sin(90 + ci.rotation - atan(dx / dy)) * sqrt(sq(dx) + sq(dy))) / ci.height) + this.zChange[0];
            if (this.snap || (playerPos.z - stepZ < 0 && playerPos.z - stepZ > -1)) {
                playerPos.z = stepZ;
                playerVel.z = 0.005;
            }
        } else {
            if (this.snap) {
                playerPos.z = this.zChange;
            } else if (playerPos.z >= floor(this.collision.lowZ) && playerPos.z <= floor(this.collision.highZ)) {
                playerPos.z = this.zChange;
            }
        }
    }
};
/**GameObject Constructor**/
var GameObj = function(config) {
    this.x = config.x !== undefined ? config.x : 0;
    this.y = config.y !== undefined ? config.y : 0;
    if (config.lowZ !== undefined) {
        this.lowZ = config.lowZ;
        this.highZ = config.highZ !== undefined ? config.highZ : config.lowZ;
    } else if (config.zValue !== undefined) {
        this.lowZ = config.zValue;
        this.highZ = config.zValue;
    } else {
        this.lowZ = 0;
        this.highZ = 0;
    }
    this.collisions = config.collisions || [];
    this.tag = config.tag;
    this.renderEveryLayer = config.renderEveryLayer !== undefined ? config.renderEveryLayer : false;
};
//These are placeholder functions. Specific object constructors will inherit from here and override functions
GameObj.prototype.update = function() {};
GameObj.prototype.render = function() {
    fill(255, 0, 0);
    noStroke();
    ellipse(this.x, this.y, 50, 50);
};
GameObj.prototype.interact = function() {
    if (dist(playerPos.x, playerPos.y, this.x, this.y) <= 100) {
        //Run Code
    }
};
/**Specific Object Constructors**/
//These inherit from the parent GameObj class, and instances of these are put into GameMap instances
var Decoration = function(config) {
    GameObj.call(this, config);
    this.rotation = -(config.rotation !== undefined ? config.rotation : 0);
    this.onRender = config.onRender || function() {};
    this.onUpdate = config.onUpdate || function() {};
};
Decoration.prototype = Object.create(GameObj.prototype);
Decoration.prototype.update = function() {
    this.onUpdate();
};
Decoration.prototype.render = function() {
    this.onRender();
};
var Wall = function(config) {
    GameObj.call(this, config);
    this.width = config.width !== undefined ? config.width : 50;
    this.height = config.height !== undefined ? config.height : 50;
    this.rotation = -(config.rotation !== undefined ? config.rotation : 0);
    this.color = config.color || color(150, 150, 160);
    this.borderColor = config.borderColor || color(0);
    this.borderSize = config.borderSize !== undefined ? config.borderSize : 2;
    this.top = config.top !== undefined ? config.top : true;
    this.gapFill = config.gapFill !== undefined ? config.gapFill : false;
    if (config.blocksLasers !== null) {
        this.blocksLasers = config.blocksLasers;
    } else {
        this.blocksLasers = false;
    }
    if (this.top === true) {
        this.collisions = [
            new Collision({
                type: "rect",
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
                rotation: this.rotation,
                lowZ: this.lowZ,
                highZ: this.highZ,
                blocksLasers: this.blocksLasers,
                smoothCorners: config.smoothCorners
            }),
            new Collision({
                type: "rect",
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
                rotation: this.rotation,
                zValue: ceil(this.highZ),
                plane: true
            })
        ];
    } else {
        this.collisions = [
            new Collision({
                type: "rect",
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
                rotation: this.rotation,
                lowZ: this.lowZ,
                highZ: this.highZ,
                blocksLasers: this.blocksLasers
            })
        ];
    }
};
Wall.prototype = Object.create(GameObj.prototype);
Wall.prototype.render = function() {
    rectMode(CENTER);
    fill(this.color);
    stroke(this.borderColor);
    strokeWeight(this.borderSize);
    pushMatrix();
    translate(this.x, this.y);
    rotate(this.rotation);
    rect(0, 0, this.width, this.height);
    if (this.gapFill) {
        rect(
            (this.x - camPos.x) / 20,
            (this.y - camPos.y) / 20, this.width * 1.05, this.height * 1.05);
    }
    popMatrix();
};
var Circle = function(config) {
    GameObj.call(this, config);
    this.width = config.width !== undefined ? config.width : 50;
    this.height = config.height !== undefined ? config.height : 50;
    this.collisions = [
        new Collision({
            type: "ellipse",
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        })
    ];
    this.color = config.color !== undefined ? config.color : color(150, 150, 160);
};
Circle.prototype = Object.create(GameObj.prototype);
Circle.prototype.render = function() {
    fill(this.color);
    stroke(0);
    strokeWeight(3);
    ellipse(this.x, this.y, this.width, this.height);
};
var Floor = function(config) {
    GameObj.call(this, config);
    this.points = config.points;
    this.width = config.width;
    this.height = config.height;
    this.ellipse = config.ellipse;
    this.rotation = -(config.rotation !== undefined ? config.rotation : 0);
    this.color = config.color || color(150, 150, 160);
    this.fadeColor = config.fadeColor || color(150, 150, 160, 150);
    //Floor collisions seriously need to be reworked
    if (config.collisions) {
        this.collisions = config.collisions;
        this.secondCollision = config.collisions[0];
        //This seems to cause issues with inter-connectedness
    } else if (this.width) {
        if (this.ellipse) {
            this.collisions = [
                new Collision({
                    type: "ellipse",
                    x: this.x,
                    y: this.y,
                    width: this.width,
                    height: this.height,
                    rotation: this.rotation,
                    plane: true,
                    lowZ: this.lowZ,
                    highZ: this.highZ
                })
            ];
            this.secondCollision = new Collision({
                type: "ellipse",
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
                rotation: this.rotation,
                plane: true,
                lowZ: this.lowZ,
                highZ: this.highZ
            });
        } else {
            this.collisions = [
                new Collision({
                    type: "rect",
                    x: this.x,
                    y: this.y,
                    width: this.width,
                    height: this.height,
                    rotation: this.rotation,
                    plane: true,
                    lowZ: this.lowZ,
                    highZ: this.highZ
                })
            ];
            this.secondCollision = new Collision({
                type: "rect",
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
                rotation: this.rotation,
                plane: true,
                lowZ: this.lowZ,
                highZ: this.highZ
            });
        }
    } else if (this.points.length === 8) {
        this.collisions = [
            new Collision({
                type: "quad",
                points: this.points,
                rotation: this.rotation,
                plane: true,
                lowZ: this.lowZ,
                highZ: this.highZ
            })
        ];
        this.secondCollision = new Collision({
            type: "quad",
            points: this.points,
            rotation: this.rotation,
            plane: true,
            lowZ: this.lowZ,
            highZ: this.highZ
        });
    } else {
        this.collisions = [
            new Collision({
                type: "tri",
                points: this.points,
                rotation: this.rotation,
                plane: true,
                lowZ: this.lowZ,
                highZ: this.highZ
            })
        ];
        this.secondCollision = new Collision({
            type: "tri",
            points: this.points,
            rotation: this.rotation,
            plane: true,
            lowZ: this.lowZ,
            highZ: this.highZ
        });
    }
    for (var floorColIndex = 0; floorColIndex < this.collisions.length; floorColIndex++) {
        if (this.collisions[floorColIndex] && this.collisions[floorColIndex].plane) {
            this.collisions[floorColIndex].spawnSurface = true;
        }
    }
    //Testing a method to deepCopy, didn't work
    this.secondCollision.lowZ = -100;
    this.secondCollision.highZ = this.lowZ;
    //Do I want this to be -1?
};
Floor.prototype = Object.create(GameObj.prototype);
Floor.prototype.render = function() {
    noStroke();
    if (this.secondCollision.checkCollision(playerPos.x, playerPos.y, round(playerPos.z * 10) / 10) && playerPos.z < this.lowZ - 0.1) {
        fill(this.fadeColor);
    } else {
        fill(this.color);
    }
    if (this.points) {
        var tp = this.points; //Not toilet paper
        if (tp.length === 8) {
            quad(tp[0], tp[1], tp[2], tp[3], tp[4], tp[5], tp[6], tp[7]);
        } else {
            triangle(tp[0], tp[1], tp[2], tp[3], tp[4], tp[5]);
        }
    } else if (this.ellipse) {
        pushMatrix();
        translate(this.x, this.y);
        rotate(this.rotation);
        ellipse(0, 0, this.width, this.height);
        popMatrix();
    } else {
        rectMode(CENTER);
        pushMatrix();
        translate(this.x, this.y);
        rotate(this.rotation);
        rect(0, 0, this.width, this.height);
        popMatrix();
    }
};
var Sands = function(config) {
    GameObj.call(this, config);
    this.sands = [];
    for (var k = 0; k < 3000; k++) {
        this.sands.push({
            x: random(-2500, 2500),
            y: random(-2500, 2500),
            size: random(2, 10),
            color: color(random(200, 255), random(150, 200), random(0, 75))
        });
    }
};
Sands.prototype = Object.create(GameObj.prototype);
Sands.prototype.render = function() {
    noStroke();
    for (var k = 0; k < this.sands.length; k++) {
        fill(this.sands[k].color);
        ellipse(this.sands[k].x, this.sands[k].y, this.sands[k].size, this.sands[k].size);
    }
};
var Stairs = function(config) {
    GameObj.call(this, config);
    this.stepHeight = config.stepHeight !== undefined ? config.stepHeight : 10;
    this.stepSpace = config.stepSpace !== undefined ? config.stepSpace : 10;
    this.width = config.width || [150, 140]; //Bottom width, top width
    this.height = config.height !== undefined ? config.height : 60;
    this.rotation = -(config.rotation !== undefined ? config.rotation : 0);
    this.color = config.color || color(150, 150, 160);
    this.railColor = config.railColor || color(120, 120, 130);
    this.railThickness = config.railThickness !== undefined ? config.railThickness : 6;
    this.rails = config.rails !== undefined ? config.rails : true;
    this.blocksLasers = config.blocksLasers !== undefined ? config.blocksLasers : false;
    this.mode = config.mode || "smooth";
    if (config.zChange) {
        if (this.mode === "smooth") {
            this.zChanger = new zChanger({
                type: "rect",
                x: this.x,
                y: this.y,
                width: (this.width[0] + this.width[1]) / 2,
                height: this.height,
                rotation: this.rotation
            }, "smooth", config.zChange);
        } else {
            this.zChangerTop = new zChanger({
                type: "rect",
                width: this.width[1],
                height: 5,
                x: this.x + (this.height / 2) * cos(-this.rotation + 90),
                y: this.y + (this.height / 2) * sin(-this.rotation - 90),
                rotation: this.rotation
            }, "sudden", config.zChange[1]);
            this.zChangerBottom = new zChanger({
                type: "rect",
                width: this.width[0],
                height: 5,
                x: this.x + (this.height / 2) * cos(-this.rotation - 90),
                y: this.y + (this.height / 2) * sin(-this.rotation + 90),
                rotation: this.rotation
            }, "sudden", config.zChange[0]);
        }
    }
    if (this.rails) {
        this.collisions = [
            new Collision({
                type: "rect",
                x: this.x - ((this.width[0] + this.width[1]) / 4) * cos(-this.rotation),
                y: this.y + ((this.width[0] + this.width[1]) / 4) * sin(-this.rotation),
                width: this.railThickness,
                height: this.height,
                blocksLasers: this.blocksLasers,
                rotation: this.rotation
            }),
            new Collision({
                type: "rect",
                x: this.x - ((this.width[0] + this.width[1]) / 4) * cos(-this.rotation + 180),
                y: this.y + ((this.width[0] + this.width[1]) / 4) * sin(-this.rotation + 180),
                width: this.railThickness,
                height: this.height,
                blocksLasers: this.blocksLasers,
                rotation: this.rotation
            })
        ];
    }
};
Stairs.prototype = Object.create(GameObj.prototype);
Stairs.prototype.update = function() {
    if (this.mode === "smooth") {
        this.zChanger.update();
    } else {
        this.zChangerTop.update();
        this.zChangerBottom.update();
    }
};
Stairs.prototype.render = function() {
    pushMatrix();
    translate(this.x, this.y);
    rotate(this.rotation);
    fill(this.color);
    noStroke();
    for (var k = 0; k < floor(this.height / (this.stepHeight + this.stepSpace)); k++) {
        rect(0, this.height / 2 - this.stepHeight / 2 - k * (this.stepHeight + this.stepSpace), this.width[0] + ((this.width[0] - this.width[1]) / this.height) * (this.height / 2 - this.stepHeight / 2 - k * (this.stepHeight + this.stepSpace)) - (this.width[0] - this.width[1]) / 2, this.stepHeight);
    }
    if (this.rails) {
        stroke(this.railColor);
        strokeWeight(this.railThickness);
        line(this.width[1] / -2, this.height / -2, this.width[0] / -2, this.height / 2);
        line(this.width[1] / 2, this.height / -2, this.width[0] / 2, this.height / 2);
    }
    popMatrix();
};
var SparkParticles2 = function(config) {
    GameObj.call(this, config);
    this.sparks = [];
    this.x = config.x !== undefined ? config.x : 0;
    this.y = config.y !== undefined ? config.y : 0;
    this.dir = -(config.direction !== undefined ? config.direction : 0);
    this.amt = config.rate !== undefined ? config.rate : 170;
    this.spread = config.spread !== undefined ? config.spread : 40;
    this.color = config.color || color(150, 150, 200, 200);
};
SparkParticles2.prototype = Object.create(GameObj.prototype);
SparkParticles2.prototype.update = function() {
    this.spawnClock = (this.spawnClock || 0) + tickClock.scale;
    if (this.spawnClock >= max(1, this.amt)) {
        this.spawnClock %= max(1, this.amt);
        this.amt = max(1, this.amt + round(random(-5, 5)));
        for (var k = 0; k < random(3, 15); k++) {
            this.sparks.push({
                x: this.x,
                y: this.y,
                colour: this.color ? this.color : random() < 0.5 ? color(255, 255, 0) : color(168, 168, 255), //hehe
                r: random(-this.spread, this.spread),
                x2: 0,
                vel: random(3, 7),
                sz: 7,
                life: random(3, 7)
            });
        }
    }
    for (var particleIndex = this.sparks.length - 1; particleIndex >= 0; particleIndex--) {
        var p = this.sparks[particleIndex];
        if (p.life <= 0) {
            p.sz -= p.vel * tickClock.scale;
        }
        p.life -= 0.5 * tickClock.scale;
        p.x2 += p.vel * tickClock.scale;
        if (p.sz <= 0) {
            this.sparks.splice(particleIndex, 1);
        }
    }
};
SparkParticles2.prototype.render = function() {
    for (var particleIndex = 0; particleIndex < this.sparks.length; particleIndex++) {
        var p = this.sparks[particleIndex];
        pushMatrix();
        translate(p.x, p.y);
        rotate(this.dir + p.r);
        for (var s = 0; s < 3; s++) {
            stroke(p.colour, (-s + 3) * 100);
            strokeWeight((s + 1) * 2);
            line(p.x2, 0, p.x2 + p.sz, 0);
        }
        popMatrix();
    }
};
//Having bizzare issues here with layering and colors
var AT_AT = function(config) {
    GameObj.call(this, config);
    this.width = config.width !== undefined ? config.width : 50;
    this.height = config.height !== undefined ? config.height : 50;
    this.rotation = -(config.rotation !== undefined ? config.rotation : 0);
    this.collisions = [
        new Collision({
            type: "rect",
            x: this.x - 24,
            y: this.y - 339,
            width: 124,
            height: 132,
            rotation: 0,
            lowZ: 0,
            highZ: 1
        }), //neck
        new Collision({
            type: "rect",
            x: this.x - 23,
            y: this.y - 456,
            width: 189,
            height: 161,
            rotation: 0,
            lowZ: 0,
            highZ: 1
        }), //head
        new Collision({
            type: "rect",
            x: this.x - 235,
            y: this.y - 203,
            width: 215,
            height: 90,
            rotation: 10,
            lowZ: 0,
            highZ: 1
        }), //top leg
        new Collision({
            type: "rect",
            x: this.x - 415,
            y: this.y - 203,
            width: 183,
            height: 90,
            rotation: -10,
            lowZ: 0,
            highZ: 1
        }), //top leg
        new Collision({
            type: "rect",
            x: this.x - 514,
            y: this.y - 188,
            width: 80,
            height: 164,
            rotation: -10,
            lowZ: 0,
            highZ: 1
        }), //top foot
        new Collision({
            type: "rect",
            x: this.x - 188,
            y: this.y - 203 + 377,
            width: 215,
            height: 90,
            rotation: 33,
            lowZ: 0,
            highZ: 1
        }), //bottom leg
        new Collision({
            type: "rect",
            x: this.x - 309,
            y: this.y - 210 + 377,
            width: 183,
            height: 90,
            rotation: -33,
            lowZ: 0,
            highZ: 1
        }), //bottom leg
        new Collision({
            type: "rect",
            x: this.x - 386,
            y: this.y - 151 + 377,
            width: 80,
            height: 164,
            rotation: -40,
            lowZ: 0,
            highZ: 1
        }), //bottom foot
        new Collision({
            type: "rect",
            x: this.x + 89,
            y: this.y - 184,
            width: 123,
            height: 198,
            rotation: -24,
            lowZ: 0,
            highZ: 1
        }), //back
        new Collision({
            type: "rect",
            x: this.x + 57,
            y: this.y,
            width: 254,
            height: 275,
            rotation: 0,
            lowZ: 0,
            highZ: 1
        }), //back
        new Collision({
            type: "rect",
            x: this.x + 89,
            y: this.y + 180,
            width: 123,
            height: 198,
            rotation: 24,
            lowZ: 0,
            highZ: 1
        }), //back
        new Collision({
            type: "rect",
            x: this.x - 22,
            y: this.y,
            width: 254,
            height: 600,
            rotation: 0,
            lowZ: 0,
            highZ: 1
        }), //body
        new Collision({
            type: "rect",
            x: this.x - 110,
            y: this.y - 570,
            width: 20,
            height: 80,
            rotation: 0,
            lowZ: 0,
            highZ: 1
        })
    ];
    this.color = config.color || color(150, 150, 160);
    this.borderColor = config.borderColor || color(0);
    this.borderSize = config.borderSize !== undefined ? config.borderSize : 2;
    this.imgName = config.imgName || "AT_AT_Moss";
};
AT_AT.prototype = Object.create(GameObj.prototype);
AT_AT.prototype.render = function() {
    pushMatrix();
    translate(this.x, this.y);
    rotate(this.rotation);
    drawAsset("prop_" + this.imgName, 0, 0, 1);
    popMatrix();
};
var blastDoorSoundGroups = {};
var BlastDoor = function(config) {
    GameObj.call(this, config);
    this.thickness = config.thickness !== undefined ? config.thickness : 10;
    this.color = config.color || color(110);
    this.width = config.width !== undefined ? config.width : 200;
    this.dist = config.dist !== undefined ? config.dist : 100;
    this.distZ = config.distZ || [floor(this.lowZ), floor(this.highZ)];
    this.speed = config.speed !== undefined ? config.speed : 0.5;
    this.rotation = -(config.rotation !== undefined ? config.rotation : 0);
    this.timer = 0;
    this.collisions = [
        new Collision({
            type: "rect",
            collisionMode: "live",
            lowZ: this.lowZ,
            highZ: this.highZ + 1,
            width: this.width / 2,
            height: this.thickness,
            rotation: this.rotation,
            x: this.x + (this.width / 4) * cos(this.rotation),
            y: this.y + (this.width / 4) * sin(this.rotation),
            smoothCorners: config.smoothCorners
        }),
        new Collision({
            type: "rect",
            collisionMode: "live",
            lowZ: this.lowZ,
            highZ: this.highZ + 1,
            width: this.width / 2,
            height: this.thickness,
            rotation: this.rotation,
            x: this.x + (this.width / 4) * cos(this.rotation + 180),
            y: this.y + (this.width / 4) * sin(this.rotation + 180),
            smoothCorners: config.smoothCorners
        })
    ];
};
BlastDoor.prototype = Object.create(GameObj.prototype);
BlastDoor.prototype.hasNearbyOpener = function() {
    if (floor(playerPos.z) <= this.distZ[1] && floor(playerPos.z) >= this.distZ[0] && dist(this.x, this.y, playerPos.x, playerPos.y) < this.dist) {
        return true;
    }
    if (!currentMap || !currentMap.entities) {
        return false;
    }
    var zStart = max(currentMap.killZ, floor(this.distZ[0]));
    var zEnd = min(currentMap.topZ + 1, floor(this.distZ[1]));
    for (var z = zStart; z <= zEnd; z++) {
        var list = currentMap.entities[z];
        if (!list) {
            continue;
        }
        for (var e = 0; e < list.length; e++) {
            var ent = list[e];
            if (!ent || !ent.pos || ent.health === undefined || ent.health <= 0) {
                continue;
            }
            if (dist(this.x, this.y, ent.pos.x, ent.pos.y) < this.dist) {
                return true;
            }
        }
    }
    return false;
};
BlastDoor.prototype.update = function() {
    var tick = tickClock.scale;
    if (this._openerAtMs === undefined || tickClock.gameMs >= this._openerAtMs || tickClock.gameMs < this._lastOpenerMs) {
        this._hasOpener = this.hasNearbyOpener();
        this._lastOpenerMs = tickClock.gameMs;
        this._openerAtMs = tickClock.gameMs + 100;
    }
    var hasOpener = this._hasOpener;
    var soundGroup = round(this.x) + ":" + round(this.y) + ":" + round(this.rotation) + ":" + round(this.width);
    if (hasOpener) {
        if (this.timer <= 0 && !blastDoorSoundGroups[soundGroup]) {
            playSound_("blastDoor", constrain(map(dist(this.x, this.y, playerPos.x, playerPos.y), 0, 1200, 0.7, 0), 0, 0.7) / 3);
            blastDoorSoundGroups[soundGroup] = true;
        }
        this.timer = min(this.speed, this.timer + 0.05 * tick);
    } else if (this.timer > 0) {
        this.timer = max(0, this.timer - 0.05 * tick);
    } else {
        blastDoorSoundGroups[soundGroup] = false;
    }
    this.collisions[0].width = lerp(this.width / 2, 0, this.timer / this.speed);
    this.collisions[0].x = lerp(this.x + (this.width / 4) * cos(this.rotation), this.x + (this.width / 2) * cos(this.rotation), this.timer / this.speed);
    this.collisions[0].y = lerp(this.y + (this.width / 4) * sin(this.rotation), this.y + (this.width / 2) * sin(this.rotation), this.timer / this.speed);
    this.collisions[0].refreshCache();
    this.collisions[1].width = lerp(this.width / 2, 0, this.timer / this.speed);
    this.collisions[1].x = lerp(this.x + (this.width / 4) * cos(this.rotation + 180), this.x + (this.width / 2) * cos(this.rotation + 180), this.timer / this.speed);
    this.collisions[1].y = lerp(this.y + (this.width / 4) * sin(this.rotation + 180), this.y + (this.width / 2) * sin(this.rotation + 180), this.timer / this.speed);
    this.collisions[1].refreshCache();
};
BlastDoor.prototype.render = function() {
    pushMatrix();
    translate(this.x, this.y);
    rotate(this.rotation);
    strokeWeight(this.thickness);
    stroke(this.color);
    line(-this.width / 2, 0, lerp(0, -this.width / 2, this.timer / this.speed), 0);
    line(this.width / 2, 0, lerp(0, this.width / 2, this.timer / this.speed), 0);
    popMatrix();
};
var CrashedTIE = function(config) {
    GameObj.call(this, config);
    this.rotation = -(config.rotation !== undefined ? config.rotation : 0);
    this.collisions = [
        new Collision({
            type: "ellipse",
            x: this.x,
            y: this.y,
            lowZ: this.lowZ - 2,
            highZ: this.highZ + 2,
            width: 200,
            height: 200
        }),
        new Collision({
            type: "rect",
            x: this.x + 160 * cos(this.rotation + 180),
            y: this.y + 160 * sin(this.rotation + 180),
            width: 100,
            height: 480,
            rotation: this.rotation,
            lowZ: this.lowZ - 2,
            highZ: this.highZ + 2
        }),
        new Collision({
            type: "rect",
            x: this.x + 125 * cos(this.rotation),
            y: this.y + 125 * sin(this.rotation),
            width: 50,
            height: 60,
            rotation: this.rotation,
            lowZ: this.lowZ - 2,
            highZ: this.highZ + 2
        })
    ];
    this.type = config.type;
};
CrashedTIE.prototype = Object.create(GameObj.prototype);
CrashedTIE.prototype.render = function() {
    pushMatrix();
    translate(this.x, this.y);
    rotate(this.rotation);
    drawAsset("prop_CrashedTIE_" + (this.type === "sf" ? "sf" : "ln"), 0, 0, 1);
    popMatrix();
};
var FireParticles = function(config) {
    GameObj.call(this, config);
    this.rotation = -config.rotation;
    this.particles = [];
};
FireParticles.prototype = Object.create(GameObj.prototype);
FireParticles.prototype.update = function() {
    this.spawnClock = (this.spawnClock || 0) + tickClock.scale;
    while (this.spawnClock >= 7) {
        this.spawnClock -= 7;
        this.particles.push(random() > 0.7 ? {
            type: "smoke",
            x: 0,
            y: 0,
            size: random(10, 30),
            fade: 200,
            vx: random(-1.5, 1.5),
            vy: random(-1.5, 1.5)
        } : {
            type: "ember",
            x: 0,
            y: 0,
            size: random(5, 10),
            vx: random(1, 7),
            vy: random(-3, 3)
        });
    }
    for (var particleIndex = this.particles.length - 1; particleIndex >= 0; particleIndex--) {
        var p = this.particles[particleIndex];
        p.x += p.vx * tickClock.scale;
        p.y += p.vy * tickClock.scale;
        if (p.type === "smoke") {
            p.vx *= pow(0.995, tickClock.scale);
            p.vy *= pow(0.995, tickClock.scale);
            p.size += tickClock.scale;
            p.fade -= tickClock.scale;
            if (p.fade < 20) {
                this.particles.splice(particleIndex, 1);
            }
        } else {
            p.vy += random(-0.1, 0.1) * tickClock.scale;
            p.size -= 0.1 * tickClock.scale;
            if (p.size < 0.3) {
                this.particles.splice(particleIndex, 1);
            }
        }
    }
};
FireParticles.prototype.render = function() {
    pushMatrix();
    translate(this.x, this.y);
    rotate(this.rotation);
    noStroke();
    for (var particleIndex = 0; particleIndex < this.particles.length; particleIndex++) {
        var p = this.particles[particleIndex];
        if (p.type === "smoke") {
            fill(100, p.fade);
        } else {
            fill(255, 0, 0);
        }
        ellipse(p.x, p.y, p.size, p.size);
    }
    popMatrix();
};
var CrashedXwing = function(config) {
    GameObj.call(this, config);
    this.rotation = -(config.rotation !== undefined ? config.rotation : 0);
    this.type = config.type;
    this.color = config.color || color(180, 0, 0);
    this.collisions = [
        new Collision({
            type: "rect",
            height: 370,
            y: this.y - 65 * cos(this.rotation),
            width: 140,
            x: this.x - 65 * cos(this.rotation + 90),
            rotation: this.rotation,
            lowZ: this.lowZ,
            highZ: this.highZ + 1
        })
        //new Collision({type: "rect", height: 375, width: 50, rotation: this.rotation, lowZ: this.lowZ, highZ: this.highZ + 1, x: this.x - 100 * cos(this.rotation) - 138 * sin(this.rotation), y: this.y - 138 * sin(this.rotation + 90) - 100 * cos(this.rotation + 90)})
        //new Collision({type: "rect", height: 375, width: 50, rotation: this.rotation, lowZ: this.lowZ, highZ: this.highZ + 1, x: this.x - 100 * cos(this.rotation) - 138 * cos(this.rotation + 90), y: this.y - 100 * cos(this.rotation + 90) - 138 * sin(this.rotation + 90)})
        //new Collision({type: "rect", height: 160, width: 50, rotation: this.rotation, lowZ: this.lowZ, highZ: this.highZ + 1, y: this.y - 25 * cos(this.rotation) - 100 * sin(this.rotation), x: this.x - 100 * cos(this.rotation) - 25 * sin(this.rotation)})
    ];
};
CrashedXwing.prototype = Object.create(GameObj.prototype);
CrashedXwing.prototype.render = function() {
    pushMatrix();
    translate(this.x, this.y);
    rotate(this.rotation);
    drawAsset("prop_CrashedXwing", 0, 0, 1);
    popMatrix();
};
var JunkPile = function(config) {
    GameObj.call(this, config);
    this.rotation = -config.rotation || random(0, 360); //Had been rotation; I think -rotation?
    this.type = config.type || round(random(1, 5));
    switch (this.type) {
        case 1:
            this.collisions = [
                new Collision({
                    type: "ellipse",
                    x: this.x - 10 * cos(this.rotation) - 25 * sin(this.rotation),
                    y: this.y - 25 * sin(this.rotation + 90) - 10 * cos(this.rotation + 90),
                    width: 40,
                    height: 40,
                    lowZ: this.lowZ,
                    highZ: this.highZ + 1
                }),
                new Collision({
                    type: "ellipse",
                    x: this.x - 30 * cos(this.rotation) + 15 * sin(this.rotation),
                    y: this.y + 15 * sin(this.rotation + 90) - 30 * cos(this.rotation + 90),
                    width: 35,
                    height: 35,
                    lowZ: this.lowZ,
                    highZ: this.highZ + 1
                }),
                new Collision({
                    type: "rect",
                    x: this.x + 20 * cos(this.rotation) + 20 * sin(this.rotation),
                    y: this.y + 20 * sin(this.rotation + 90) + 20 * cos(this.rotation + 90),
                    width: 50,
                    height: 50,
                    rotation: this.rotation,
                    lowZ: this.lowZ,
                    highZ: this.highZ + 1
                }),
                new Collision({
                    type: "ellipse",
                    x: this.x - 10 * cos(this.rotation) - 25 * sin(this.rotation),
                    y: this.y - 25 * sin(this.rotation + 90) - 10 * cos(this.rotation + 90),
                    width: 40,
                    height: 40,
                    zValue: this.highZ + 2,
                    plane: true
                }),
                new Collision({
                    type: "ellipse",
                    x: this.x - 30 * cos(this.rotation) + 15 * sin(this.rotation),
                    y: this.y + 15 * sin(this.rotation + 90) - 30 * cos(this.rotation + 90),
                    width: 35,
                    height: 35,
                    zValue: this.highZ + 2,
                    plane: true
                }),
                new Collision({
                    type: "rect",
                    x: this.x + 20 * cos(this.rotation) + 20 * sin(this.rotation),
                    y: this.y + 20 * sin(this.rotation + 90) + 20 * cos(this.rotation + 90),
                    width: 50,
                    height: 50,
                    rotation: this.rotation,
                    zValue: this.highZ + 2,
                    plane: true
                })
            ];
            break;
        case 2:
            this.collisions = [
                new Collision({
                    type: "ellipse",
                    x: this.x,
                    y: this.y,
                    width: 55,
                    height: 55,
                    lowZ: this.lowZ,
                    highZ: this.highZ + 1
                }),
                new Collision({
                    type: "ellipse",
                    x: this.x,
                    y: this.y,
                    width: 55,
                    height: 55,
                    zValue: this.highZ + 2,
                    plane: true
                }),
                new Collision({
                    type: "ellipse",
                    x: this.x + 50 * cos(this.rotation),
                    y: this.y - 50 * sin(this.rotation),
                    width: 40,
                    height: 40,
                    lowZ: this.lowZ,
                    highZ: this.highZ + 1
                }),
                new Collision({
                    type: "ellipse",
                    x: this.x + 50 * cos(this.rotation),
                    y: this.y - 50 * sin(this.rotation),
                    width: 40,
                    height: 40,
                    zValue: this.highZ + 2,
                    plane: true
                })
            ];
            break;
        case 3:
            //Does 3 really need collisions?
            break;
        case 4:
            this.collisions = [
                new Collision({
                    type: "ellipse",
                    x: this.x - 80 * cos(this.rotation) + 30 * sin(this.rotation),
                    y: this.y + 30 * sin(this.rotation + 90) - 80 * cos(this.rotation + 90),
                    width: 70,
                    height: 70,
                    lowZ: this.lowZ,
                    highZ: this.highZ + 2
                }),
                new Collision({
                    type: "ellipse",
                    x: this.x,
                    y: this.y,
                    width: 80,
                    height: 130,
                    rotation: this.rotation,
                    lowZ: this.lowZ,
                    highZ: this.highZ + 2
                })
            ];
            break;
        case 5:
            this.collisions = [
                new Collision({
                    type: "ellipse",
                    x: this.x + 45 * (sin(this.rotation) + cos(this.rotation)),
                    y: this.y + 45 * (sin(this.rotation + 90) + cos(this.rotation + 90)),
                    width: 70,
                    height: 70,
                    lowZ: this.lowZ,
                    highZ: this.highZ + 1
                }),
                new Collision({
                    type: "ellipse",
                    x: this.x + 45 * (sin(this.rotation) + cos(this.rotation)),
                    y: this.y + 45 * (sin(this.rotation + 90) + cos(this.rotation + 90)),
                    width: 70,
                    height: 70,
                    zValue: this.highZ + 2,
                    plane: true
                }),
                new Collision({
                    type: "rect",
                    x: this.x - 30 * cos(this.rotation) - 60 * sin(this.rotation),
                    y: this.y - 60 * sin(this.rotation + 90) - 30 * cos(this.rotation + 90),
                    width: 100,
                    height: 60,
                    rotation: this.rotation,
                    lowZ: this.lowZ,
                    highZ: this.highZ + 1
                }),
                new Collision({
                    type: "rect",
                    x: this.x - 30 * cos(this.rotation) - 60 * sin(this.rotation),
                    y: this.y - 60 * sin(this.rotation + 90) - 30 * cos(this.rotation + 90),
                    width: 100,
                    height: 60,
                    rotation: this.rotation,
                    zValue: this.highZ + 2,
                    plane: true
                })
            ];
            break;
    }
};
JunkPile.prototype = Object.create(GameObj.prototype);
JunkPile.prototype.render = function() {
    pushMatrix();
    translate(this.x, this.y);
    rotate(-this.rotation);
    drawAsset("prop_JunkPile_" + this.type, 0, 0, 1);
    popMatrix();
};
var Box = function(config) {
    GameObj.call(this, config);
    this.size = config.size !== undefined ? config.size : 50;
    this.rotation = -(config.rotation !== undefined ? config.rotation : 0);
    this.plane = config.plane !== undefined ? config.plane : false;
    this.collisions = [
        new Collision({
            type: "rect",
            x: this.x,
            y: this.y,
            width: this.size,
            height: this.size,
            rotation: this.rotation,
            lowZ: this.lowZ,
            highZ: this.highZ
        }),
        new Collision({
            type: "rect",
            x: this.x,
            y: this.y,
            width: this.size,
            height: this.size,
            rotation: this.rotation,
            plane: true,
            zValue: floor(this.highZ) + 1
        })
    ];
    //This project was originally created by @LemoncelloJr and @KingCobraVenom
};
Box.prototype = Object.create(GameObj.prototype);
Box.prototype.render = function() {
    pushMatrix();
    translate(this.x, this.y);
    rotate(this.rotation);
    drawAsset("prop_Crate", 0, 0, this.size / 200);
    popMatrix();
};
var KashyyykFloor = function(config) {
    GameObj.call(this, config);
    this.patches = [];
    this.zValue = -6;
    var patchCount = config.patchCount !== undefined ? config.patchCount : 3000;
    for (var i = 0; i < patchCount; i++) {
        this.patches.push({
            //These used to reference currentMap.width, but that doesn't work because those properties don't exist in the current map by the time the object is created
            x: random(-5400 / 2 + 300, 5400 / 2 + 300),
            y: random(-5400 / 2 + 300, 5400 / 2 + 300),
            size: random(5, 10),
            color: lerpColor(color(50, 35, 20), //earthy brown
                color(40, 60, 30), //mossy green
                random(0.2, 0.7)),
            shape: random() < 0.5 ? "ellipse" : "rect"
        });
    }
};
KashyyykFloor.prototype = Object.create(GameObj.prototype);
KashyyykFloor.prototype.render = function() {
    for (var i = 0; i < 60; i++) {
        pushMatrix();
        translate(-i * 4, 0);
        beginShape();
        fill(237, 184, 78, i * 3);
        noStroke();
        strokeWeight(40);
        vertex(-2200, -currentMap.height / 2 + 300);
        vertex(-2200, currentMap.height / 2 + 300);
        vertex(-1484, currentMap.height / 2 + 300);
        bezierVertex(-1558, 245, -1293, -393, -1638, -currentMap.height / 2 + 300);
        endShape(CLOSE);
        popMatrix();
    }
    noStroke();
    for (var i = 0; i < this.patches.length; i++) {
        var p = this.patches[i];
        fill(0, 30);
        if (p.shape === "ellipse") {
            ellipse(p.x, p.y, p.size, p.size);
        } else {
            rectMode(CENTER);
            rect(p.x, p.y, p.size, p.size * 0.6, 5);
        }
    }
    fill(99, 99, 99);
    rect(300, 1675, 535, 315);
    rect(300, 2223, 1800, 800);
};
var SparkParticles = function(config) {
    GameObj.call(this, config);
    this.sparks = [];
    this.x = config.x !== undefined ? config.x : 0;
    this.y = config.y !== undefined ? config.y : 0;
    this.dir = config.direction !== undefined ? config.direction : 0;
    this.amt = config.rate !== undefined ? config.rate : 2;
    this.spread = config.spread !== undefined ? config.spread : 40;
};
SparkParticles.prototype = Object.create(GameObj.prototype);
SparkParticles.prototype.update = function() {
    this.spawnClock = (this.spawnClock || 0) + tickClock.scale;
    while (this.spawnClock >= max(1, this.amt)) {
        this.spawnClock -= max(1, this.amt);
        this.sparks.push({
            x: this.x,
            y: this.y,
            colour: random() < 0.5 ? color(255, 255, 0) : color(168, 168, 255),
            r: random(-this.spread, this.spread),
            x2: 0,
            vel: random(3, 4),
            sz: 7,
            life: 5
        });
    }
    for (var particleIndex = this.sparks.length - 1; particleIndex >= 0; particleIndex--) {
        var p = this.sparks[particleIndex];
        if (p.life <= 0) {
            p.sz -= p.vel * tickClock.scale;
        }
        p.life -= 0.5 * tickClock.scale;
        p.x2 += p.vel * tickClock.scale;
        if (p.sz <= 0) {
            this.sparks.splice(particleIndex, 1);
        }
    }
};
SparkParticles.prototype.render = function() {
    for (var particleIndex = 0; particleIndex < this.sparks.length; particleIndex++) {
        var p = this.sparks[particleIndex];
        pushMatrix();
        translate(p.x, p.y);
        rotate(this.dir + p.r);
        for (var s = 0; s < 3; s++) {
            stroke(p.colour, (-s + 3) * 100);
            strokeWeight((s + 1) * 2);
            line(p.x2, 0, p.x2 + p.sz, 0);
        }
        popMatrix();
    }
};
//Tree constructor
var Tree = function(config) {
    GameObj.call(this, config);
    this.zValue = config.zValue !== undefined ? config.zValue : 1;
    this.width = config.width !== undefined ? config.width : 80;
    this.height = config.height || this.width;
    this.trunkColor = config.trunkColor || color(33, 22, 17); //dark brown
    this.translucent = 255;
    this.canopyColor = config.canopyColor || color(random(12, 20), random(74, 80), random(12, 20)); //translucent green
    this.hasPlatform = config.hasPlatform !== undefined ? config.hasPlatform : false;
    this.platformWidth = config.platformWidth || this.width + 40;
    this.platformHeight = config.platformHeight !== undefined ? config.platformHeight : 10;
    this.platformYOffset = config.platformYOffset !== undefined ? config.platformYOffset : 100;
    this.platformColor = config.platformColor || color(139, 69, 19);
    this.shape = random() < 0.5 ? "tri" : "rect";
    this.rotation = random(0, 360);
    this.collisions = [
        new Collision({
            type: "ellipse",
            x: this.x,
            y: this.y,
            lowZ: config.zValue - 3,
            highZ: config.zValue,
            width: config.width / 5,
            height: config.height / 5
        })
    ];
};
Tree.prototype = Object.create(GameObj.prototype);
Tree.prototype.render = function() {
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
};
var commandPostHexPoints = [];
for (var i = 0; i < 360; i += 60) {
    commandPostHexPoints.push(30 * cos(i));
    commandPostHexPoints.push(30 * sin(i));
}
var CommandPost = function(config) {
    GameObj.call(this, config);
    this.controlState = config.controlState || "captured";
    this.controllingTeam = config.controllingTeam !== undefined ? config.controllingTeam : 1; // Idk what this should be
    this.radius = config.radius !== undefined ? config.radius : 500;
};
CommandPost.prototype = Object.create(GameObj.prototype);
CommandPost.prototype.render = function() {
    // (this.controllingTeam !== playerTeam) // Again, idk how this should work
    var controlColor = this.controllingTeam === 1 ? color(80, 80, 255) : color(255, 80, 80);
    strokeWeight(3);
    stroke(controlColor, 160);
    switch (this.controlState) {
        case "captured":
            fill(controlColor, 80);
            break;
        case "contested":
            fill(controlColor, 50);
            break;
        case "capturing":
            fill(controlColor, 65 + 15 * sin((tickClock.realMs / tickClock.baseMs) * 6));
            break;
    }
    ellipse(this.x, this.y, this.radius * (1 + 0.05 * sin((tickClock.realMs / tickClock.baseMs) * 2)), this.radius * (1 + 0.05 * sin((tickClock.realMs / tickClock.baseMs) * 2)));
    // Hologram thingamajigger
    stroke(50);
    fill(90);
    var h = commandPostHexPoints;
    pushMatrix();
    translate(this.x, this.y);
    for (var i = 0; i < 5; i++) {
        var j = i * 2;
        quad(h[j], h[j + 1], h[j + 2], h[j + 3], h[j + 2] * 2, h[j + 3] * 2, h[j] * 2, h[j + 1] * 2);
    }
    quad(h[10], h[11], h[0], h[1], h[0] * 2, h[1] * 2, h[10] * 2, h[11] * 2);
    noStroke();
    fill(140);
    quad(h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7]);
    quad(h[6], h[7], h[8], h[9], h[10], h[11], h[0], h[1]);
    popMatrix();
};
//Define Internal Functions
var deepCopy = function(objb) {
    if (typeof objb !== "object" || objb === null) {
        return objb;
    }
    var copy = Array.isArray(objb) ? [] : {};
    for (var key in objb) {
        if (objb.hasOwnProperty(key)) {
            copy[key] = deepCopy(objb[key]);
        }
    }
    return copy;
};
var layerObj = function(config, lowZ, highZ, type) {
    //Objects get so messed up and interconnected that making this function was a nightmare  o_o   appreciate it
    var layeredObjs = [];
    var layerType = type || "Wall";
    for (var k = lowZ; k <= highZ; k++) {
        if (layerType === "Wall") {
            if (k === highZ) {
                layeredObjs.push(new Wall({
                    x: config.x,
                    y: config.y,
                    width: config.width,
                    height: config.height,
                    color: config.color,
                    borderColor: config.borderColor,
                    borderSize: config.borderSize,
                    smoothCorners: config.smoothCorners,
                    zValue: k
                }));
            } else {
                layeredObjs.push(new Wall({
                    x: config.x,
                    y: config.y,
                    width: config.width,
                    height: config.height,
                    color: config.color,
                    borderColor: config.borderColor,
                    borderSize: config.borderSize,
                    smoothCorners: config.smoothCorners,
                    zValue: k,
                    top: "None",
                    gapFill: true
                }));
            }
        } else if (layerType === "BlastDoor") {
            layeredObjs.push(new BlastDoor({
                x: config.x,
                y: config.y,
                width: config.width,
                thickness: config.thickness,
                color: config.color,
                speed: config.speed,
                dist: config.dist,
                distZ: config.distZ || [k, k],
                rotation: config.rotation,
                smoothCorners: config.smoothCorners,
                zValue: k
            }));
        }
    }
    return layeredObjs;
};
/**Entity Constructor**/
var Entity = function(config) {
    this.pos = new PVector(config.x !== undefined ? config.x : 0, config.y !== undefined ? config.y : 0, config.z !== undefined ? config.z : 0);
    this.vel = new PVector(config.xVel !== undefined ? config.xVel : 0, config.yVel !== undefined ? config.yVel : 0, config.zVel !== undefined ? config.zVel : 0);
    this.colSize = config.colSize || hitboxSize;
    this.bounce = config.bounce !== undefined ? config.bounce : 0;
    this.slide = config.slide !== undefined ? config.slide : 0.8;
};
Entity.prototype.update = function() {
    var tick = tickClock.scale;
    this.vel.z -= 0.005 * tick;
    this.vel.x *= pow(this.slide, tick);
    this.vel.y *= pow(this.slide, tick);
    //Entities are handled in a loop where i is the layer; thus, we can use i to know if the entity is in the correct array
    this.collide();
    var activeLayer = this._activeLayer !== undefined ? this._activeLayer : floor(this.pos.z);
    if (this.pos.z < currentMap.killZ || this.pos.z > currentMap.topZ + 1) {
        return "delete";
    }
    if (floor(this.pos.z) < activeLayer) {
        return "zDown";
    }
    if (floor(this.pos.z) > activeLayer) {
        return "zUp";
    }
    this.pos.x += this.vel.x * tick;
    this.pos.y += this.vel.y * tick;
    this.pos.z += this.vel.z * tick;
    return false;
};
Entity.prototype.render = function() {};
Entity.prototype.collide = function() {
    var z = floor(this.pos.z);
    this.touchingFloorCollision = false;
    this.touchingNonFloorCollision = false;
    for (var layer = z - 1; layer <= z; layer++) {
        var colObj = currentMap.getNearbyCollisions ? currentMap.getNearbyCollisions(layer, this.pos.x, this.pos.y, this.colSize + 4) : currentMap.collisionLayers ? currentMap.collisionLayers[layer] : null;
        if (colObj && colObj.length !== undefined) {
            for (var colIndx = 0; colIndx < colObj.length; colIndx++) {
                var hit = colObj[colIndx].entityCollide(this.pos, this.vel, this.colSize, this.bounce);
                if (hit & 1) {
                    this.touchingFloorCollision = true;
                }
                if (hit & 2) {
                    this.touchingNonFloorCollision = true;
                }
            }
        }
    }
};
DashArrow = function(config) {
    Entity.call(this, config);
    this.poolType = null;
    this.rot = config.rot !== undefined ? config.rot : 0;
    this.life = config.life !== undefined ? config.life : 22;
    this.maxLife = this.life;
    this.size = config.size !== undefined ? config.size : 44;
    this.delay = config.delay !== undefined ? config.delay : 0;
    this.followActor = config.followActor || null;
    this.followPlayer = config.followPlayer !== undefined ? config.followPlayer : false;
};
DashArrow.prototype = Object.create(Entity.prototype);
DashArrow.prototype.constructor = DashArrow;
DashArrow.prototype.update = function() {
    if (this.delay > 0) {
        this.delay = max(0, this.delay - tickClock.scale);
        if (this.followPlayer) {
            this.pos.x = playerPos.x;
            this.pos.y = playerPos.y;
            this.pos.z = playerPos.z;
        } else if (this.followActor && this.followActor.pos) {
            this.pos.x = this.followActor.pos.x;
            this.pos.y = this.followActor.pos.y;
            this.pos.z = this.followActor.pos.z;
        }
        return false;
    }
    this.life -= tickClock.scale;
    if (this.life <= 0) {
        return "delete";
    }
    return false;
};
DashArrow.prototype.render = function() {
    if (this.delay > 0) {
        return;
    }
    var a = 105 * constrain(this.life / this.maxLife, 0, 1);
    var s = this.size;
    pushMatrix();
    translate(this.pos.x, this.pos.y);
    rotate(this.rot);
    noStroke();
    fill(190, 245, 255, a * 0.55);
    triangle(s * 0.04, -s * 0.2, s * 0.48, 0, s * 0.04, s * 0.2);
    popMatrix();
};
var isJediActor = function(actor, isPlayerActor) {
    if (isPlayerActor) {
        return character === "Jedi" || (currentGun && currentGun.isLightsaber);
    }
    if (!actor) {
        return false;
    }
    var actorSkin = (actor.skin || "").toLowerCase();
    return (actor.isJedi || actor.character === "Jedi" || (actor.currentGun && actor.currentGun.isLightsaber) || (actor.weapon && actor.weapon.isLightsaber) || actorSkin === "kylo ren" || actorSkin === "luke skywalker");
};
var spawnJediDashArrows = function(pos, z, rot, actor, isPlayerActor) {
    if (!currentMap || !currentMap.entities || !pos) {
        return;
    }
    var layer = constrain(floor(z), currentMap.killZ, currentMap.topZ + 1);
    if (!currentMap.entities[layer]) {
        currentMap.entities[layer] = [];
    }
    for (var a = 0; a < jediDashSettings.arrowCount; a++) {
        currentMap.entities[layer].push(new DashArrow({
            x: pos.x,
            y: pos.y,
            z: z,
            rot: rot,
            life: 68,
            size: hitboxSize * 4,
            delay: a * jediDashSettings.arrowDelayFrames,
            followActor: actor,
            followPlayer: isPlayerActor
        }));
    }
};
var triggerJediDash = function(actor, isPlayerActor) {
    if (!isJediActor(actor, isPlayerActor)) {
        return false;
    }
    var pos = isPlayerActor ? playerPos : actor.pos;
    var vel = isPlayerActor ? playerVel : actor.vel;
    var angle = ((isPlayerActor ? bodyAngle : actor.bodyAngle) || 0) - 90;
    if (!pos || !vel) {
        return false;
    }
    if (isPlayerActor) {
        if (playerForce < jediDashSettings.forceCost) {
            return false;
        }
        playerForce = max(0, playerForce - jediDashSettings.forceCost);
    } else {
        if (actor.maxForce === undefined) {
            actor.maxForce = playerMaxForce;
        }
        if (actor.force === undefined) {
            actor.force = actor.maxForce;
        }
        if (actor.force < jediDashSettings.forceCost) {
            return false;
        }
        actor.force = max(0, actor.force - jediDashSettings.forceCost);
    }
    vel.x += cos(angle) * jediDashSettings.burstSpeed;
    vel.y += sin(angle) * jediDashSettings.burstSpeed;
    spawnJediDashArrows(pos, pos.z, angle, actor, isPlayerActor);
    screenShake = max(screenShake, 1.2);
    return true;
};
var playerHasForce = function() {
    return character === "Jedi" || (currentGun && currentGun.isLightsaber);
};
var updateForceMeter = function() {
    if (!playerHasForce()) {
        playerForce = playerMaxForce;
        return;
    }
    playerForce = min(playerMaxForce, playerForce + forceSettings.regenSpeed * tickClock.scale);
};
var drawForceMeter = function() {
    if (!playerHasForce()) {
        return;
    }
    var meterW = 260;
    var meterH = 13;
    var meterX = 20;
    var meterY = 13;
    var fillAmount = constrain(playerForce / playerMaxForce, 0, 1);
    pushStyle();
    rectMode(CORNER);
    noStroke();
    fill(0, 105);
    rect(meterX - 3, meterY - 3, meterW + 6, meterH + 6, 3);
    fill(12, 26, 42, 210);
    rect(meterX, meterY, meterW, meterH, 2);
    fill(84, 210, 255, 235);
    rect(meterX, meterY, meterW * fillAmount, meterH, 2);
    fill(210, 248, 255, 175);
    rect(meterX, meterY, meterW * fillAmount, 3, 2);
    stroke(175, 232, 255, 190);
    strokeWeight(2);
    noFill();
    rect(meterX, meterY, meterW, meterH, 2);
    fill(0, 230);
    textAlign(CENTER, CENTER);
    textSize(10);
    text("FORCE", meterX + meterW / 2, meterY + meterH / 2);
    popStyle();
};
//Specific entity constructors
Laser = function(config) {
    this.reset(config);
};
Laser.prototype = Object.create(Entity.prototype);
Laser.prototype.constructor = Laser;
Laser.prototype.reset = function(config) {
    Entity.call(this, config);
    this.poolType = "laser";
    this.damage = config.damage;
    this.renderFunc = config.renderFunc;
    this.maxDist = config.maxDist;
    this.cullDist = config.cullDist !== undefined ? config.cullDist : 5000;
    this.muzzleOffset = config.muzzleOffset !== undefined ? config.muzzleOffset : 12;
    this.tailMax = config.tailMax !== undefined ? config.tailMax : 90;
    this.travelDist = 0;
    this.drawVelX = this.vel.x;
    this.drawVelY = this.vel.y;
    this.owner = config.owner || null;
    //death animation flags
    this.dead = false;
    this.deathTime = 0; //counts frames after death
    // Start just outside the shooter, but do not skip through close walls.
    var spawnStart = new PVector(this.pos.x, this.pos.y, this.pos.z);
    var speed = sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
    if (speed > 0) {
        this.pos.x += (this.vel.x / speed) * this.muzzleOffset;
        this.pos.y += (this.vel.y / speed) * this.muzzleOffset;
    }
    if (this.raycastWalls(spawnStart, this.pos)) {
        this.pos = spawnStart;
    }
    this.startPos = new PVector(this.pos.x, this.pos.y, this.pos.z);
};
Laser.prototype.getTailPoint = function() {
    var speed = sqrt(this.drawVelX * this.drawVelX + this.drawVelY * this.drawVelY);
    if (speed <= 0) {
        return {
            x: this.pos.x,
            y: this.pos.y
        };
    }
    var tailLen = constrain(this.travelDist, 8, this.tailMax);
    return {
        x: this.pos.x - (this.drawVelX / speed) * tailLen,
        y: this.pos.y - (this.drawVelY / speed) * tailLen
    };
};
Laser.prototype.pointHitsLaserWall = function(x, y, z) {
    var layer = floor(z);
    var zRounded = round(z * 10) / 10;
    var colObj = currentMap.getNearbyCollisions ? currentMap.getNearbyCollisions(layer, x, y, 2) : currentMap.collisionLayers ? currentMap.collisionLayers[layer] : null;
    if (colObj) {
        for (var m = 0; m < colObj.length; m++) {
            if (!colObj[m].plane && colObj[m].blocksLasers && colObj[m].checkCollision(x, y, zRounded)) {
                return true;
            }
        }
    }
    return false;
};
Laser.prototype.raycastWalls = function(startPos, endPos) {
    var dx = endPos.x - startPos.x;
    var dy = endPos.y - startPos.y;
    var dz = (endPos.z || 0) - (startPos.z || 0);
    var distTravel = sqrt(dx * dx + dy * dy);
    var steps = max(1, ceil(distTravel / 4));
    var lastSafeT = 0;
    if (this.pointHitsLaserWall(startPos.x, startPos.y, startPos.z)) {
        return {
            t: 0,
            x: startPos.x,
            y: startPos.y,
            z: startPos.z,
            type: "wall"
        };
    }
    for (var step = 1; step <= steps; step++) {
        var t = step / steps;
        var x = startPos.x + dx * t;
        var y = startPos.y + dy * t;
        var z = startPos.z + dz * t;
        if (this.pointHitsLaserWall(x, y, z)) {
            var lo = lastSafeT;
            var hi = t;
            for (var refine = 0; refine < 6; refine++) {
                var mid = (lo + hi) / 2;
                if (this.pointHitsLaserWall(startPos.x + dx * mid, startPos.y + dy * mid, startPos.z + dz * mid)) {
                    hi = mid;
                } else {
                    lo = mid;
                }
            }
            return {
                t: hi,
                x: startPos.x + dx * hi,
                y: startPos.y + dy * hi,
                z: startPos.z + dz * hi,
                type: "wall"
            };
        }
        lastSafeT = t;
    }
    return null;
};
Laser.prototype.segmentCircleHit = function(startPos, endPos, cx, cy, radius) {
    var dx = endPos.x - startPos.x;
    var dy = endPos.y - startPos.y;
    var lenSq = dx * dx + dy * dy;
    if (lenSq <= 0) {
        return dist(startPos.x, startPos.y, cx, cy) <= radius ? 0 : null;
    }
    var fx = startPos.x - cx;
    var fy = startPos.y - cy;
    if (fx * fx + fy * fy <= radius * radius) {
        return 0;
    }
    var b = 2 * (fx * dx + fy * dy);
    var c = fx * fx + fy * fy - radius * radius;
    var discriminant = b * b - 4 * lenSq * c;
    if (discriminant < 0) {
        return null;
    }
    discriminant = sqrt(discriminant);
    var t1 = (-b - discriminant) / (2 * lenSq);
    var t2 = (-b + discriminant) / (2 * lenSq);
    if (t1 >= 0 && t1 <= 1) {
        return t1;
    }
    if (t2 >= 0 && t2 <= 1) {
        return t2;
    }
    return null;
};
Laser.prototype.getActorLightsaber = function(actor, isPlayerActor) {
    if (isPlayerActor) {
        return currentGun && currentGun.isLightsaber ? currentGun : null;
    }
    if (!actor) {
        return null;
    }
    if (actor.currentGun && actor.currentGun.isLightsaber) {
        return actor.currentGun;
    }
    if (actor.weapon && actor.weapon.isLightsaber) {
        return actor.weapon;
    }
    return null;
};
Laser.prototype.isEnemyLaserFor = function(actor, isPlayerActor) {
    if (!this.owner || this.owner.team === undefined) {
        return false;
    }
    var targetTeam = isPlayerActor ? playerTeam : actor.team;
    return targetTeam !== undefined && this.owner.team !== targetTeam;
};
Laser.prototype.isMovingToward = function(startPos, endPos, x, y) {
    return (
        (endPos.x - startPos.x) * (x - startPos.x) + (endPos.y - startPos.y) * (y - startPos.y) > 0);
};
Laser.prototype.tryAutoSaberDeflect = function(actor, isPlayerActor, startPos, endPos, hitT) {
    var saber = this.getActorLightsaber(actor, isPlayerActor);
    if (!saber || !this.isEnemyLaserFor(actor, isPlayerActor)) {
        return null;
    }
    var pos = isPlayerActor ? playerPos : actor.pos;
    if (!pos || !this.isMovingToward(startPos, endPos, pos.x, pos.y)) {
        return null;
    }
    var autoDeflectRoll = random();
    var autoDeflectChance = 0.5;
    if (isPlayerActor) {
        autoDeflectChance = constrain(0.44 + (1 - constrain(playerHealth / max(1, playerMaxHealth), 0, 1)) * 0.18, 0.44, 0.62);
    }
    if (isPlayerActor && this.owner && this.owner.pos && playerHasForce() && playerForce >= forceSettings.dangerSenseCost) {
        var laserSpeed = sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
        if (this.damage >= forceSettings.dangerSenseThreatDamage && laserSpeed >= forceSettings.dangerSenseThreatSpeed && dist(this.owner.pos.x, this.owner.pos.y, playerPos.x, playerPos.y) >= forceSettings.dangerSenseThreatDistance && autoDeflectRoll < autoDeflectChance) {
            playerForce = max(0, playerForce - forceSettings.dangerSenseCost);
            dangerSense = max(dangerSense, forceSettings.dangerSenseSlowMoFrames);
            screenShake = max(screenShake, 0.6);
        }
    }
    if (autoDeflectRoll >= autoDeflectChance) {
        return null;
    }
    var wasOff = !saber.on;
    saber.on = true;
    if (isPlayerActor && wasOff) {
        startSaberAudio();
    }
    this.triggerAutoSaberSwing(saber);
    var facingAngle = isPlayerActor ? bodyAngle : actor.bodyAngle;
    if (facingAngle === undefined) {
        facingAngle = 0;
    }
    var reflectRot = facingAngle - 90;
    if (isPlayerActor) {
        var impactX = startPos.x + (endPos.x - startPos.x) * hitT;
        var impactY = startPos.y + (endPos.y - startPos.y) * hitT;
        var laserSide = atan2(impactY - playerPos.y, impactX - playerPos.x) % 360;
        if (laserSide < 0) {
            laserSide += 360;
        }
        var playerFacing = reflectRot % 360;
        if (playerFacing < 0) {
            playerFacing += 360;
        }
        var laserFrontDiff = (laserSide - playerFacing) % 360;
        if (laserFrontDiff > 180) {
            laserFrontDiff -= 360;
        }
        if (laserFrontDiff < -180) {
            laserFrontDiff += 360;
        }
        if (abs(laserFrontDiff) > 90) {
            reflectRot = (playerFacing + 180) % 360;
        } else {
            reflectRot = playerFacing;
        }
    }
    var owner = isPlayerActor ? {
        isPlayer: true,
        team: playerTeam
    } : actor;
    return {
        t: hitT,
        x: startPos.x + (endPos.x - startPos.x) * hitT,
        y: startPos.y + (endPos.y - startPos.y) * hitT,
        z: startPos.z + (endPos.z - startPos.z) * hitT,
        type: isPlayerActor ? "playerSaber" : "entitySaber",
        reflectRot: reflectRot,
        owner: owner,
        saber: saber,
        justTurnedOn: wasOff
    };
};
Laser.prototype.triggerAutoSaberSwing = function(saber) {
    if (!saber) {
        return;
    }
    saber.clicked = true;
    saber.halfWay = false;
    saber.swingDidDamage = false;
    saber.randomNumber = floor(random(0, 3));
    saber.shotTime = saber.fireRate || 22;
    if (saber.spinVelocity !== undefined) {
        saber.spinVelocity = max(saber.spinVelocity || 0, 18);
    }
};
Laser.prototype.damageEntityHit = function(ent) {
    var beforeHealth = ent.health !== undefined ? ent.health : 0;
    var beforeShield = ent.shield !== undefined ? ent.shield : 0;
    applyDamage(ent, this.damage);
    var done = max(0, beforeHealth + beforeShield - ((ent.health !== undefined ? ent.health : 0) + (ent.shield !== undefined ? ent.shield : 0)));
    if (this.owner && this.owner.aiMemory && done > 0 && ent.team !== undefined) {
        if (ent.team === this.owner.team) {
            this.owner.aiMemory.pendingReward -= done * 0.12;
        } else {
            this.owner.aiMemory.pendingReward += done * 0.08;
            if (beforeHealth > 0 && ent.health <= 0) {
                this.owner.aiMemory.pendingReward += 8;
            }
        }
    }
    if (this.owner && this.owner.isPlayer && ent.isMatchBot && ent.team !== playerTeam && done > 0) {
        ent.playerCreditDamage = (ent.playerCreditDamage || 0) + done;
        ent.playerCreditDamageMax = max(1, (ent.maxHealth || 100) + (ent.maxShield || 0));
    }
    if (ent.isMatchBot && beforeHealth > 0 && ent.health <= 0 && !ent.creditPaid) {
        if (!ent.tdmScorePaid && this.owner && this.owner.team !== undefined) {
            awardTDMKill(this.owner.team, ent.team);
            ent.tdmScorePaid = true;
        }
        if (ent.team !== playerTeam && ent.playerCreditDamage > 0) {
            var damagePercent = constrain(ent.playerCreditDamage / max(1, ent.playerCreditDamageMax || (ent.maxHealth || 100) + (ent.maxShield || 0)), 0, 1);
            var killBaseCredits = (floor(random(18, 31)) + matchState.playerKills * 5) * 5;
            var earnedCredits = max(1, floor(killBaseCredits * damagePercent));
            matchState.playerKills++;
            ent.creditPaid = true;
            addCreditChange(earnedCredits, ent.pos.x, ent.pos.y - 82);
        } else if (this.owner && this.owner.isPlayer && ent.team === playerTeam) {
            ent.creditPaid = true;
            addCreditChange(-floor(random(40, 71)), ent.pos.x, ent.pos.y - 82);
        }
    }
};
Laser.prototype.raycastPlayerSaber = function(startPos, endPos, closest) {
    if (!(this.owner && this.owner.team !== undefined && this.owner.team !== playerTeam) || floor(playerPos.z) !== floor(endPos.z) || !(currentGun && currentGun.isLightsaber && currentGun.on && (mouseIsPressed || currentGun.clicked || abs(currentGun.spinAngle) > 6)) || playerHealth <= 0) {
        return closest;
    }
    var saberRange = (hitboxSize * 2) / 3 + (currentGun.range || 0);
    var saberDx = endPos.x - playerPos.x;
    var saberDy = endPos.y - playerPos.y;
    if (saberDx * saberDx + saberDy * saberDy > saberRange * saberRange || (closest && closest.t <= 1)) {
        return closest;
    }
    var saberX = endPos.x;
    var saberY = endPos.y;
    var laserSide = atan2(saberY - playerPos.y, saberX - playerPos.x) % 360;
    if (laserSide < 0) {
        laserSide += 360;
    }
    var playerFacing = (bodyAngle - 90) % 360;
    if (playerFacing < 0) {
        playerFacing += 360;
    }
    var laserFrontDiff = (laserSide - playerFacing) % 360;
    if (laserFrontDiff > 180) {
        laserFrontDiff -= 360;
    }
    if (laserFrontDiff < -180) {
        laserFrontDiff += 360;
    }
    if (abs(laserFrontDiff) > 90) {
        return closest;
    }
    return {
        t: 1,
        x: saberX,
        y: saberY,
        z: endPos.z,
        type: "playerSaber",
        reflectRot: abs(laserFrontDiff) > 90 ? (playerFacing + 180) % 360 : playerFacing
    };
};
Laser.prototype.raycastEntities = function(startPos, endPos) {
    var zLayer = floor(endPos.z);
    var entList = currentMap.entities[zLayer];
    var closest = null;
    if (entList) {
        for (var e = 0; e < entList.length; e++) {
            var ent = entList[e];
            if (ent && ent.pos && ent.health !== undefined && floor(ent.pos.z) === zLayer) {
                if (ent === this.owner) {
                    continue;
                }
                var entT = this.segmentCircleHit(startPos, endPos, ent.pos.x, ent.pos.y, ent.colSize);
                if (entT !== null && (!closest || entT < closest.t)) {
                    closest = this.tryAutoSaberDeflect(ent, false, startPos, endPos, entT) || {
                        t: entT,
                        x: startPos.x + (endPos.x - startPos.x) * entT,
                        y: startPos.y + (endPos.y - startPos.y) * entT,
                        z: startPos.z + (endPos.z - startPos.z) * entT,
                        type: "entity",
                        ent: ent
                    };
                }
            }
        }
    }
    closest = this.raycastPlayerSaber(startPos, endPos, closest);
    if (this.owner && this.owner.team !== undefined && this.owner.team !== playerTeam && floor(playerPos.z) === zLayer && (!this.owner.pos || dist(this.owner.pos.x, this.owner.pos.y, playerPos.x, playerPos.y) > hitboxSize)) {
        var playerT = this.segmentCircleHit(startPos, endPos, playerPos.x, playerPos.y, hitboxSize);
        if (playerT !== null && (!closest || (closest.type !== "playerSaber" && playerT < closest.t))) {
            closest = this.tryAutoSaberDeflect(null, true, startPos, endPos, playerT) || {
                t: playerT,
                x: startPos.x + (endPos.x - startPos.x) * playerT,
                y: startPos.y + (endPos.y - startPos.y) * playerT,
                z: startPos.z + (endPos.z - startPos.z) * playerT,
                type: "player"
            };
        }
    }
    return closest;
};
Laser.prototype.collide = function(startPos, endPos) {
    if (!startPos) {
        startPos = this.pos;
    }
    if (!endPos) {
        endPos = this.pos;
    }
    var wallHit = this.raycastWalls(startPos, endPos);
    var entityHit = this.raycastEntities(startPos, endPos);
    var hit = null;
    if (wallHit && (!hit || wallHit.t < hit.t)) {
        hit = wallHit;
    }
    if (entityHit && (!hit || entityHit.t < hit.t)) {
        hit = entityHit;
    }
    if (!hit) {
        return false;
    }
    this.pos.x = hit.x;
    this.pos.y = hit.y;
    this.pos.z = hit.z;
    if (hit.type === "entity") {
        this.damageEntityHit(hit.ent);
    } else if (hit.type === "playerSaber" || hit.type === "entitySaber") {
        var reflectRot = hit.reflectRot !== undefined ? hit.reflectRot : bodyAngle - 90;
        var reflectSpeed = max(20, sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y));
        this.vel.x = cos(reflectRot) * reflectSpeed;
        this.vel.y = sin(reflectRot) * reflectSpeed;
        this.owner = hit.owner || {
            isPlayer: true,
            team: playerTeam
        };
        this.startPos = new PVector(this.pos.x, this.pos.y, this.pos.z);
        this.travelDist = 0;
        screenShake = max(screenShake, 1.5);
        var humSaber = hit.saber || currentGun;
        if (hit.type === "playerSaber" && !hit.justTurnedOn) {
            playLightsaberHum_(humSaber && humSaber.getSpinHumVolume ? humSaber.getSpinHumVolume() : 0.16);
        }
        return false;
    } else if (hit.type === "player") {
        var prevPlayerVitals = playerHealth + playerShield;
        if (this.damage > 0) {
            var pLaserDmgTmp = {
                health: playerHealth,
                maxHealth: playerMaxHealth,
                shield: playerShield,
                maxShield: playerMaxShield,
                damageMult: playerDamageMult !== undefined ? playerDamageMult : 1
            };
            applyDamage(pLaserDmgTmp, this.damage);
            playerHealth = pLaserDmgTmp.health;
            playerShield = pLaserDmgTmp.shield;
        }
        if (prevPlayerVitals > 0 && playerHealth <= 0 && !deathScorePaid && this.owner && this.owner.team !== undefined) {
            awardTDMKill(this.owner.team, playerTeam);
            deathScorePaid = true;
        }
        if (this.owner && this.owner.aiMemory) {
            this.owner.aiMemory.pendingReward += max(0, prevPlayerVitals - (playerHealth + playerShield)) * 0.08;
            if (prevPlayerVitals > 0 && playerHealth <= 0) {
                this.owner.aiMemory.pendingReward += 8;
            }
        }
        bloodScreen = max(bloodScreen, this.damage * 2);
    }
    return true;
};
Laser.prototype.update = function() {
    //If laser is already dead, run death timer
    if (this.dead) {
        this.deathTime += tickClock.scale;
        if (this.deathTime > 60) {
            //1 second at 60 FPS
            return "delete";
        }
        return false;
    }
    //Normal movement
    var prevPos = new PVector(this.pos.x, this.pos.y, this.pos.z);
    this.drawVelX = this.vel.x;
    this.drawVelY = this.vel.y;
    this.pos.x += this.vel.x * tickClock.scale;
    this.pos.y += this.vel.y * tickClock.scale;
    this.pos.z += this.vel.z * tickClock.scale;
    this.travelDist += dist(prevPos.x, prevPos.y, this.pos.x, this.pos.y);
    //Only real raycast hits should make the impact flash.
    if (this.collide(prevPos, this.pos)) {
        this.dead = true;
        this.deathTime = 0;
        //Stop moving but stay visible
        this.vel.x = 0;
        this.vel.y = 0;
        this.vel.z = 0;
        return false;
    }
    // Far safety cleanup only. Normal lasers should die from raycast hits, not from weapon range.
    if (dist(this.startPos.x, this.startPos.y, this.pos.x, this.pos.y) > this.cullDist) {
        return "delete";
    }
    return false;
};
Laser.prototype.render = function() {
    this.renderFunc(this);
};
AIPlayer = function(config) {
    Entity.call(this, config);
    this.health = config.health !== undefined ? config.health : 100 * aiSettings.botHealthScale;
    this.maxHealth = config.maxHealth !== undefined ? config.maxHealth : this.health;
    this.maxShield = config.maxShield !== undefined ? config.maxShield : 20 * aiSettings.botHealthScale;
    this.shield = config.shield !== undefined ? config.shield : this.maxShield;
    this.shieldRegen = config.shieldRegen !== undefined ? config.shieldRegen : ((playerShieldRegen * 2) / 3) * aiSettings.botHealthScale;
    this.healthRegenFullShield = config.healthRegenFullShield !== undefined ? config.healthRegenFullShield : ((pHpRegenFull * 2) / 3) * aiSettings.botHealthScale;
    this.healthRegenLowShield = config.healthRegenLowShield !== undefined ? config.healthRegenLowShield : ((pHpRegenLow * 2) / 3) * aiSettings.botHealthScale;
    this.weapon = config.weapon;
    this.skin = config.skin;
    this.isJedi = config.isJedi || this.skin === "Kylo Ren" || this.skin === "Luke Skywalker";
    this.maxForce = config.maxForce !== undefined ? config.maxForce : playerMaxForce;
    this.force = config.force !== undefined ? config.force : this.maxForce;
    this.bodyAngle = config.bodyAngle !== undefined ? config.bodyAngle : 0;
    this.counter = random(0, 100000);
    this.damageMult = 1;
    this.walkSpeed = config.walkSpeed !== undefined ? config.walkSpeed : aiSettings.botSpeed;
    this.team = config.team !== undefined ? config.team : 0;
    this.wallTouch = 0;
    this.gunPose = 0;
    this.wantsToShoot = false;
    this.maxDetonatorCount = config.maxDetonatorCount !== undefined ? config.maxDetonatorCount : 2;
    this.detonatorCount = config.detonatorCount !== undefined ? config.detonatorCount : this.maxDetonatorCount;
    this.maxMedkitCount = config.maxMedkitCount !== undefined ? config.maxMedkitCount : 1;
    this.medkitCount = config.medkitCount !== undefined ? config.medkitCount : this.maxMedkitCount;
    this.medkitBuffFrames = 0;
    this.inPlayerSquad = false;
    this.aimWarmup = 0;
    this.aimWarmupFrames = config.aimWarmupFrames !== undefined ? config.aimWarmupFrames : 9;
    this.aiMemory = {
        target: null,
        targetId: "",
        lastPos: new PVector(this.pos.x, this.pos.y, this.pos.z),
        stuckTimer: 0,
        recentHealth: this.health || 0,
        recentShield: this.shield || 0,
        recentTargetVitals: 0,
        action: "hold",
        previousAction: "hold",
        stateKey: "idle",
        previousStateKey: "idle",
        rewardTotal: 0,
        lastReward: 0,
        pendingReward: 0,
        exploration: aiSettings.explorationRate,
        debugLabel: "idle",
        q: {},
        decisionFrame: 0,
        strafeDir: random() < 0.5 ? -1 : 1,
        idleAngle: random(0, 360),
        idleStepTimer: floor(random(15, 45)),
        idleStepPower: 0.6,
        squadAngle: random(0, 360),
        squadDrift: random(-40, 40),
        squadStepTimer: floor(random(25, 70)),
        squadStepPower: 0.35,
        detonatorCooldown: floor(random(90, aiSettings.botDetonatorCooldown)),
        medkitCooldown: floor(random(60, 180)),
        actionAge: 0
    };
    this.getBlaster();
};
AIPlayer.prototype = Object.create(Entity.prototype);
AIPlayer.prototype.getBlaster = function() {
    if ((!this.weapon || !this.weapon.shootFrom) && F_11D) {
        this.weapon = new Blaster({
            weaponId: F_11D.weaponId,
            laserSpeed: F_11D.laserSpeed,
            damage: F_11D.damage,
            laserRender: F_11D.laserRender,
            fireRate: F_11D.fireRate,
            shotsAllowed: F_11D.shotsAllowed,
            reloadSpeed: F_11D.reloadSpeed,
            renderFunc: F_11D.renderFunc,
            maxDist: F_11D.maxDist,
            accuracy: F_11D.accuracy,
            auto: F_11D.auto,
            renderZoom: F_11D.renderZoom,
            scopeFov: F_11D.scopeFov
        });
    }
    return this.weapon;
};
AIPlayer.prototype.updateBlaster = function() {
    var gun = this.getBlaster();
    if (gun && gun.tick) {
        gun.tick();
    }
    var tick = tickClock.scale;
    var reloading = gun && gun.reloadTime > 0;
    this.gunPose = lerp(this.gunPose, reloading ? 0 : this.wantsToShoot ? 1 : sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y) > 0.12 ? 0 : 0.35, constrain((this.wantsToShoot ? 0.24 : 0.15) * tick, 0, 1));
    if (this.wantsToShoot && !reloading && this.gunPose > 0.72) {
        this.aimWarmup = min(this.aimWarmupFrames, this.aimWarmup + tick);
    } else {
        this.aimWarmup = max(0, this.aimWarmup - tick * 2);
    }
    this.wantsToShoot = false;
};
var aiTraceLineOfSight = function(bot, target) {
    if (!bot || !target || !target.pos || abs(bot.pos.z - target.pos.z) > 1.2) {
        return false;
    }
    if (!currentMap || !currentMap.collisionLayers) {
        return true;
    }
    var dx = target.pos.x - bot.pos.x;
    var dy = target.pos.y - bot.pos.y;
    var dz = (target.pos.z || 0) - (bot.pos.z || 0);
    var distTravel = sqrt(dx * dx + dy * dy);
    var steps = max(1, ceil(distTravel / 18));
    for (var step = 0; step <= steps; step++) {
        performanceStats.sightSamples++;
        var t = step / steps;
        var x = bot.pos.x + dx * t;
        var y = bot.pos.y + dy * t;
        var zCheck = bot.pos.z + dz * t;
        var zRounded = round(zCheck * 10) / 10;
        var colObj = currentMap.getNearbyCollisions(floor(zCheck), x, y, 2);
        if (!colObj) {
            continue;
        }
        for (var m = 0; m < colObj.length; m++) {
            if (!colObj[m].plane && colObj[m].blocksLasers && colObj[m].checkCollision(x, y, zRounded)) {
                return false;
            }
        }
    }
    return true;
};
var aiHasLineOfSight = function(bot, target) {
    if (!bot || !target || !target.pos || abs(bot.pos.z - target.pos.z) > 1.2 || (target.isPlayerTarget ? playerHealth <= 0 : target.health <= 0)) {
        return false;
    }
    if (!target.isPlayerTarget && !target._aiTargetId) {
        target._aiTargetId = "ent" + aiTargetSerial++;
    }
    var key = target.isPlayerTarget ? "player" : target._aiTargetId;
    if (!bot._sightCache || bot._sightMap !== currentMap) {
        bot._sightCache = {};
        bot._sightMap = currentMap;
    }
    var cached = bot._sightCache[key];
    if (cached && tickClock.gameMs < cached.untilMs) {
        return cached.visible;
    }
    var visible = aiTraceLineOfSight(bot, target);
    bot._sightCache[key] = {
        visible: visible,
        untilMs: tickClock.gameMs + aiSettings.perceptionIntervalMs
    };
    return visible;
};
var getAIPerception = function(bot) {
    var layer = floor(bot.pos.z);
    if (bot._perception && bot._perceptionMap === currentMap && bot._perceptionLayer === layer && tickClock.gameMs < bot._perceptionUntilMs) {
        return bot._perception;
    }
    bot._sightCache = {};
    var view = {
        nearestTarget: null,
        visibleTarget: null,
        ally: null,
        crowdingCombat: null,
        crowdingIdle: null,
        detonator: null,
        allyCount: 0,
        nearbyEnemyCount: 0
    };
    var candidates = [];
    var allyDist = 900;
    var combatDist = aiSettings.botSpacingRange;
    var idleDist = aiSettings.idleSpreadRange;
    var detonatorDist = aiSettings.detonatorAvoidRange;
    if (playerHealth > 0 && playerTeam !== bot.team) {
        var playerDist = dist(bot.pos.x, bot.pos.y, playerPos.x, playerPos.y);
        if (playerDist < aiSettings.targetSearchRange) {
            candidates.push({
                distance: playerDist,
                target: {
                    isPlayerTarget: true,
                    team: playerTeam,
                    pos: playerPos,
                    health: playerHealth,
                    shield: playerShield,
                    colSize: hitboxSize
                }
            });
        }
    }
    for (var z = max(currentMap.killZ, layer - 2); z <= min(currentMap.topZ + 1, layer + 2); z++) {
        var list = currentMap.entities[z] || [];
        for (var index = 0; index < list.length; index++) {
            var ent = list[index];
            if (!ent || ent === bot || !ent.pos) {
                continue;
            }
            var distance = dist(bot.pos.x, bot.pos.y, ent.pos.x, ent.pos.y);
            if (ent.health !== undefined && ent.health > 0) {
                if (ent.team !== bot.team && distance < aiSettings.targetSearchRange) {
                    performanceStats.targetCandidates++;
                    candidates.push({
                        distance: distance,
                        target: ent
                    });
                }
                if (abs(z - layer) <= 1) {
                    if (ent.team === bot.team) {
                        if (distance <= 360) {
                            view.allyCount++;
                        }
                        if (distance < allyDist) {
                            view.ally = ent;
                            allyDist = distance;
                        }
                        if (distance < combatDist) {
                            view.crowdingCombat = ent;
                            combatDist = distance;
                        }
                        if (distance < idleDist) {
                            view.crowdingIdle = ent;
                            idleDist = distance;
                        }
                    } else if (distance <= 420) {
                        view.nearbyEnemyCount++;
                    }
                }
            }
            if (ent.fuse !== undefined && ent.armDelay !== undefined && ent.explosionMax !== undefined && ent.explosionDamageMax !== undefined && !ent.damageDone && distance < detonatorDist) {
                view.detonator = ent;
                detonatorDist = distance;
            }
        }
    }
    candidates.sort(function(a, b) {
        return a.distance - b.distance;
    });
    view.nearestTarget = candidates.length ? candidates[0].target : null;
    for (var candidateIndex = 0; candidateIndex < candidates.length; candidateIndex++) {
        if (aiHasLineOfSight(bot, candidates[candidateIndex].target)) {
            view.visibleTarget = candidates[candidateIndex].target;
            break;
        }
    }
    var firstScan = !bot._perception;
    bot._perception = view;
    bot._perceptionMap = currentMap;
    bot._perceptionLayer = layer;
    bot._perceptionUntilMs = tickClock.gameMs + (firstScan ? 50 + bot.counter % 50 : aiSettings.perceptionIntervalMs);
    performanceStats.perceptionScans++;
    return view;
};
AIPlayer.prototype.update = function() {
    this.counter += tickClock.scale;
    this.updateBlaster();
    if (this.aiMemory && this.aiMemory.medkitCooldown > 0) {
        this.aiMemory.medkitCooldown = max(0, this.aiMemory.medkitCooldown - tickClock.scale);
    }
    if (this.medkitBuffFrames > 0) {
        this.medkitBuffFrames = max(0, this.medkitBuffFrames - tickClock.scale);
        this.damageMult = 0.8;
    } else {
        this.damageMult = 1;
    }
    if (this.health > 0 && this.medkitCount > 0 && this.aiMemory && this.aiMemory.medkitCooldown <= 0) {
        var medkitView = getAIPerception(this);
        var aiNearbyAllies = medkitView.allyCount;
        var aiNearbyEnemies = medkitView.nearbyEnemyCount;
        if (playerHealth > 0 && playerTeam !== this.team && dist(this.pos.x, this.pos.y, playerPos.x, playerPos.y) <= 420) {
            aiNearbyEnemies++;
        }
        var aiHealthRatio = constrain(this.health / max(1, this.maxHealth || 100), 0, 1);
        if (aiHealthRatio < 0.42 || (aiHealthRatio < 0.62 && aiNearbyEnemies > aiNearbyAllies)) {
            this.health = min(this.maxHealth, this.health + 30);
            this.medkitCount--;
            this.medkitBuffFrames = 200;
            this.damageMult = 0.8;
            this.aiMemory.medkitCooldown = 420;
        }
    }
    if (gameStage === "Play" && matchState.phase === "live" && !stageTransition.active) {
        var hasLineOfSight = aiHasLineOfSight;
        var traceFriendly = function(bot, target) {
            if (!bot || !target || !target.pos || !currentMap || !currentMap.entities) {
                return false;
            }
            var zLayer = floor(bot.pos.z);
            var zMin = max(currentMap.killZ, zLayer - 1);
            var zMax = min(currentMap.topZ + 1, zLayer + 1);
            for (var z = zMin; z <= zMax; z++) {
                var list = currentMap.entities[z];
                if (!list) {
                    continue;
                }
                for (var e = 0; e < list.length; e++) {
                    var ent = list[e];
                    if (!ent || ent === bot || ent === target || !ent.pos || ent.health === undefined || ent.health <= 0 || ent.team !== bot.team) {
                        continue;
                    }
                    if (abs(ent.pos.z - bot.pos.z) > 1.2) {
                        continue;
                    }
                    var dx = target.pos.x - bot.pos.x;
                    var dy = target.pos.y - bot.pos.y;
                    var lenSq = dx * dx + dy * dy;
                    if (lenSq <= 0) {
                        continue;
                    }
                    var radius = (ent.colSize || hitboxSize) * 0.95;
                    var fx = bot.pos.x - ent.pos.x;
                    var fy = bot.pos.y - ent.pos.y;
                    var b = 2 * (fx * dx + fy * dy);
                    var c = fx * fx + fy * fy - radius * radius;
                    var discriminant = b * b - 4 * lenSq * c;
                    if (discriminant < 0) {
                        continue;
                    }
                    discriminant = sqrt(discriminant);
                    var t1 = (-b - discriminant) / (2 * lenSq);
                    var t2 = (-b + discriminant) / (2 * lenSq);
                    if ((t1 > 0.02 && t1 < 0.98) || (t2 > 0.02 && t2 < 0.98)) {
                        return true;
                    }
                }
            }
            return false;
        };
        var segHitFriendly = function(bot, target) {
            var cache = bot._friendlyCheck;
            if (cache && cache.target === target && tickClock.gameMs < cache.untilMs) {
                return cache.blocked;
            }
            var blocked = traceFriendly(bot, target);
            bot._friendlyCheck = {
                target: target,
                blocked: blocked,
                untilMs: tickClock.gameMs + aiSettings.friendlyCheckMs
            };
            return blocked;
        };
        var findNearestEnemy = function(bot, onlyVisible) {
            var view = getAIPerception(bot);
            var target = onlyVisible ? view.visibleTarget : view.nearestTarget;
            if (!target || (target.isPlayerTarget ? playerHealth <= 0 : target.health <= 0)) {
                return null;
            }
            if (target.isPlayerTarget) {
                target.pos = playerPos;
                target.health = playerHealth;
                target.shield = playerShield;
            }
            return target;
        };
        var canThrowDetonator = function(bot, target, visible, targetDist) {
            if (!bot || !bot.aiMemory || !target || !target.pos || !visible || !Detonator) {
                return false;
            }
            if ((bot.detonatorCount || 0) <= 0) {
                return false;
            }
            if (bot.aiMemory.detonatorCooldown > 0) {
                return false;
            }
            if (targetDist < aiSettings.botDetonatorMinRange || targetDist > aiSettings.botDetonatorMaxRange) {
                return false;
            }
            if (segHitFriendly(bot, target)) {
                return false;
            }
            var allyNearTarget = false;
            if (currentMap && currentMap.entities) {
                var allyNearMinZ = max(currentMap.killZ, floor(target.pos.z || bot.pos.z) - 2);
                var allyNearMaxZ = min(currentMap.topZ + 1, floor(target.pos.z || bot.pos.z) + 2);
                for (var allyNearZ = allyNearMinZ; allyNearZ <= allyNearMaxZ && !allyNearTarget; allyNearZ++) {
                    var allyNearList = currentMap.entities[allyNearZ];
                    if (!allyNearList) {
                        continue;
                    }
                    for (var allyNearE = 0; allyNearE < allyNearList.length; allyNearE++) {
                        var allyNearEnt = allyNearList[allyNearE];
                        if (!allyNearEnt || allyNearEnt === bot || !allyNearEnt.pos || allyNearEnt.health <= 0 || allyNearEnt.team !== bot.team) {
                            continue;
                        }
                        if (dist(target.pos.x, target.pos.y, allyNearEnt.pos.x, allyNearEnt.pos.y) < 280) {
                            allyNearTarget = true;
                            break;
                        }
                    }
                }
            }
            if (allyNearTarget) {
                return false;
            }
            return true;
        };
        var applyIdleSpread = function(bot, crowdingAlly) {
            if (!bot.aiMemory) {
                return;
            }
            if (crowdingAlly && crowdingAlly.pos) {
                aiMoveAway(bot, crowdingAlly.pos, 1.25);
                bot.bodyAngle = atan2(bot.pos.x - crowdingAlly.pos.x, -(bot.pos.y - crowdingAlly.pos.y));
                return;
            }
            bot.aiMemory.idleStepTimer -= tickClock.scale;
            if (bot.aiMemory.idleStepTimer <= 0) {
                bot.aiMemory.idleAngle += random(-95, 95);
                bot.aiMemory.idleStepPower = random(0.75, 1.25);
                bot.aiMemory.idleStepTimer = floor(random(38, 95));
            } else {
                bot.aiMemory.idleAngle += random(-2.5, 2.5);
            }
            var idleAccel = min(bot.walkSpeed * (0.26 + bot.aiMemory.idleStepPower * 0.28), playerSpeed * aiSettings.maxBotMoveSpeedMult) * tickClock.scale;
            bot.vel.x += cos(bot.aiMemory.idleAngle) * idleAccel;
            bot.vel.y += sin(bot.aiMemory.idleAngle) * idleAccel;
        };
        var runLearningBot = function(bot) {
            if (!bot.aiMemory) {
                bot.aiMemory = {
                    target: null,
                    targetId: "",
                    lastPos: new PVector(bot.pos.x, bot.pos.y, bot.pos.z),
                    stuckTimer: 0,
                    recentHealth: bot.health || 0,
                    recentShield: bot.shield || 0,
                    recentTargetVitals: 0,
                    action: "hold",
                    previousAction: "hold",
                    stateKey: "idle",
                    previousStateKey: "idle",
                    rewardTotal: 0,
                    lastReward: 0,
                    pendingReward: 0,
                    exploration: aiSettings.explorationRate,
                    debugLabel: "idle",
                    q: {},
                    decisionFrame: 0,
                    strafeDir: random() < 0.5 ? -1 : 1,
                    idleAngle: random(0, 360),
                    idleStepTimer: floor(random(15, 45)),
                    idleStepPower: 0.6,
                    squadAngle: random(0, 360),
                    squadDrift: random(-40, 40),
                    squadStepTimer: floor(random(25, 70)),
                    squadStepPower: 0.35,
                    detonatorCooldown: floor(random(90, aiSettings.botDetonatorCooldown)),
                    medkitCooldown: floor(random(60, 180)),
                    actionAge: 0
                };
            }
            var memory = bot.aiMemory;
            if (memory.detonatorCooldown > 0) {
                memory.detonatorCooldown = max(0, memory.detonatorCooldown - tickClock.scale);
            }
            var moved = dist(bot.pos.x, bot.pos.y, memory.lastPos.x, memory.lastPos.y);
            if (moved < 1.25 && sqrt(bot.vel.x * bot.vel.x + bot.vel.y * bot.vel.y) < 0.25) {
                memory.stuckTimer += tickClock.scale;
            } else {
                memory.stuckTimer = max(0, memory.stuckTimer - 2 * tickClock.scale);
            }
            memory.lastPos.x = bot.pos.x;
            memory.lastPos.y = bot.pos.y;
            memory.lastPos.z = bot.pos.z;
            var target = findNearestEnemy(bot, true);
            var visible = !!target;
            if (!target) {
                target = findNearestEnemy(bot, false);
            }
            var targetId = "";
            if (target) {
                if (target.isPlayerTarget) {
                    targetId = "player";
                } else {
                    if (!target._aiTargetId) {
                        target._aiTargetId = "ent" + aiTargetSerial;
                        aiTargetSerial++;
                    }
                    targetId = target._aiTargetId;
                }
            }
            if (target && !visible) {
                visible = hasLineOfSight(bot, target);
            }
            var view = getAIPerception(bot);
            var allyCount = view.allyCount;
            var nearbyEnemyCount = view.nearbyEnemyCount;
            var ally = view.ally && view.ally.health > 0 ? view.ally : null;
            var crowdingAlly = target ? view.crowdingCombat : view.crowdingIdle;
            if (crowdingAlly && crowdingAlly.health <= 0) {
                crowdingAlly = null;
            }
            var detonator = view.detonator && !view.detonator.damageDone ? view.detonator : null;
            var targetDist = target && target.pos ? dist(bot.pos.x, bot.pos.y, target.pos.x, target.pos.y) : 999999;
            var targetSaber = !!target && (target.isPlayerTarget ? currentGun && currentGun.isLightsaber && currentGun.on : !!(target.currentGun && target.currentGun.isLightsaber && target.currentGun.on));
            var healthRatio = constrain((bot.health || 0) / max(1, bot.maxHealth || 100), 0, 1);
            var danger = 0;
            danger += (1 - constrain(
                ((bot.health || 0) + (bot.shield || 0)) / max(1, (bot.maxHealth || 100) + (bot.maxShield || 0)), 0, 1)) * 2.3;
            danger += (1 - healthRatio) * 1.35;
            if (target && target.pos) {
                var dangerTargetD = dist(bot.pos.x, bot.pos.y, target.pos.x, target.pos.y);
                if (visible) {
                    danger += 0.8;
                }
                if (dangerTargetD < aiSettings.preferredCombatRange * 0.55) {
                    danger += 0.9;
                }
                if (targetSaber && dangerTargetD < aiSettings.lightsaberFearRange) {
                    danger += 2.2 * constrain(1 - dangerTargetD / aiSettings.lightsaberFearRange, 0, 1);
                }
            }
            if (allyCount <= 0) {
                danger += 0.35;
            }
            if (nearbyEnemyCount > allyCount) {
                danger += (nearbyEnemyCount - allyCount) * 0.42;
            } else if (allyCount > nearbyEnemyCount) {
                danger -= min(0.45, (allyCount - nearbyEnemyCount) * 0.12);
            }
            if (bot.aiMemory && bot.aiMemory.stuckTimer > 25) {
                danger += 0.5;
            }
            if (detonator && detonator.pos) {
                danger += 1.1 * constrain(1 - dist(bot.pos.x, bot.pos.y, detonator.pos.x, detonator.pos.y) / aiSettings.detonatorAvoidRange, 0, 1);
            }
            var squadPrioPlayer = false;
            if (bot && bot.inPlayerSquad) {
                var playerPrioDist = dist(bot.pos.x, bot.pos.y, playerPos.x, playerPos.y);
                if (playerPrioDist > aiSettings.squadPriorityRange) {
                    squadPrioPlayer = true;
                } else if (target && visible && targetDist < aiSettings.preferredCombatRange * 1.25) {
                    squadPrioPlayer = false;
                } else if (playerPrioDist > aiSettings.squadFollowComfortRange && (!target || targetDist > aiSettings.preferredCombatRange * 0.85)) {
                    squadPrioPlayer = true;
                }
            }
            if (squadPrioPlayer) {
                target = null;
                targetId = "";
                visible = false;
                targetDist = 999999;
            }
            var stateRangeBucket = "none";
            if (target) {
                var idealRange = targetSaber ? aiSettings.lightsaberKeepAwayRange : aiSettings.preferredCombatRange;
                stateRangeBucket = targetDist < idealRange * 0.6 ? "close" : targetDist < idealRange * 1.35 ? "ideal" : "far";
            }
            var stateKey = ((bot.health || 0) + (bot.shield || 0) < ((bot.maxHealth || 100) + (bot.maxShield || 0)) * 0.45 ? "low" : "ok") + "|" + stateRangeBucket + "|" + (visible ? "seen" : "hidden") + "|" + (danger > 1.7 ? "danger" : "safe") + "|" + (nearbyEnemyCount > allyCount ? "pressured" : allyCount > nearbyEnemyCount ? "supported" : allyCount > 0 ? "paired" : "solo") + "|" + (bot.aiMemory && bot.aiMemory.stuckTimer > 25 ? "stuck" : "free") + "|" + (targetSaber ? "saber" : "normal");
            var reward = 0.01;
            reward += ((bot.health || 0) + (bot.shield || 0) - (memory.recentHealth + memory.recentShield)) * 0.012;
            if ((bot.health || 0) <= 0) {
                reward -= 8;
            }
            if (target) {
                var rewardVitals = target.isPlayerTarget ? max(0, playerHealth) + max(0, playerShield) : max(0, target.health || 0) + max(0, target.shield || 0);
                var damageDone = memory.recentTargetVitals - rewardVitals;
                var rewardTargetId = "";
                if (target.isPlayerTarget) {
                    rewardTargetId = "player";
                } else {
                    if (!target._aiTargetId) {
                        target._aiTargetId = "ent" + aiTargetSerial;
                        aiTargetSerial++;
                    }
                    rewardTargetId = target._aiTargetId;
                }
                if (memory.targetId === rewardTargetId && damageDone > 0) {
                    reward += damageDone * 0.08;
                }
                if (memory.targetId === rewardTargetId && memory.recentTargetVitals > 0 && rewardVitals <= 0) {
                    reward += 8;
                }
                memory.recentTargetVitals = rewardVitals;
            } else {
                memory.recentTargetVitals = 0;
                reward -= 0.02;
            }
            if (visible && target) {
                reward += 0.04;
            }
            if (allyCount > 0) {
                reward += 0.025;
            }
            if (crowdingAlly && !target) {
                reward -= 0.08;
            }
            if (detonator && detonator.pos) {
                reward -= aiSettings.detonatorPenalty * constrain(1 - dist(bot.pos.x, bot.pos.y, detonator.pos.x, detonator.pos.y) / aiSettings.detonatorAvoidRange, 0, 1);
            }
            if (memory.stuckTimer > 25) {
                reward -= 0.08;
            }
            if (memory.pendingReward) {
                reward += memory.pendingReward;
                memory.pendingReward = 0;
            }
            memory.recentHealth = bot.health || 0;
            memory.recentShield = bot.shield || 0;
            reward *= aiSettings.rewardScale;
            memory.lastReward = reward;
            memory.rewardTotal += reward;
            if (memory.previousStateKey && memory.previousAction) {
                if (!memory.q[memory.previousStateKey]) {
                    memory.q[memory.previousStateKey] = {};
                }
                if (memory.q[memory.previousStateKey][memory.previousAction] === undefined) {
                    memory.q[memory.previousStateKey][memory.previousAction] = 0;
                }
                var oldQ = memory.q[memory.previousStateKey][memory.previousAction];
                var future = -999999;
                for (var qIndex = 0; qIndex < aiTacticalActions.length; qIndex++) {
                    if (!memory.q[stateKey]) {
                        memory.q[stateKey] = {};
                    }
                    if (memory.q[stateKey][aiTacticalActions[qIndex]] === undefined) {
                        memory.q[stateKey][aiTacticalActions[qIndex]] = 0;
                    }
                    future = max(future, memory.q[stateKey][aiTacticalActions[qIndex]]);
                }
                memory.q[memory.previousStateKey][memory.previousAction] = oldQ + aiSettings.learningRate * (reward + aiSettings.discount * future - oldQ);
            }
            memory.decisionFrame -= tickClock.scale;
            var detonatorDist = detonator && detonator.pos ? dist(bot.pos.x, bot.pos.y, detonator.pos.x, detonator.pos.y) : 999999;
            if (detonator && detonatorDist < aiSettings.detonatorUrgentRange) {
                memory.action = "avoidDetonator";
                memory.decisionFrame = max(1, floor(aiSettings.decisionFrames / 2));
            } else if (targetSaber && targetDist < aiSettings.lightsaberKeepAwayRange) {
                memory.action = "retreat";
                memory.decisionFrame = max(1, floor(aiSettings.decisionFrames / 2));
            } else if (squadPrioPlayer) {
                memory.action = "regroup";
                memory.decisionFrame = max(1, floor(aiSettings.decisionFrames / 2));
            } else if (!target && crowdingAlly) {
                memory.action = "spreadOut";
                memory.decisionFrame = aiSettings.decisionFrames;
            } else if (memory.decisionFrame <= 0 || !(memory.target && (memory.target.isPlayerTarget ? playerHealth > 0 : memory.target.health !== undefined && memory.target.health > 0)) || memory.stuckTimer > 35) {
                memory.previousStateKey = stateKey;
                memory.previousAction = memory.action;
                if (random() < memory.exploration) {
                    memory.action = aiTacticalActions[floor(random(0, aiTacticalActions.length))];
                } else {
                    var bestAction = "hold";
                    var bestScore = -999999;
                    for (var chooseIndex = 0; chooseIndex < aiTacticalActions.length; chooseIndex++) {
                        var action = aiTacticalActions[chooseIndex];
                        if (!memory.q[stateKey]) {
                            memory.q[stateKey] = {};
                        }
                        if (memory.q[stateKey][action] === undefined) {
                            memory.q[stateKey][action] = 0;
                        }
                        var preferred = aiSettings.preferredCombatRange;
                        var score = memory.q[stateKey][action];
                        var saberThreat = targetSaber && targetDist < aiSettings.lightsaberFearRange;
                        var supportAdv = allyCount - nearbyEnemyCount;
                        var lowHpPress = 1 - healthRatio;
                        if (action === "unstuck") {
                            score += memory.stuckTimer > 25 ? 4 : -2;
                        } else if (action === "avoidDetonator") {
                            score += detonator ? 2.1 : -4;
                            score += danger > 1.9 ? 0.6 : 0;
                        } else if (action === "spreadOut") {
                            score += crowdingAlly ? 3.4 : -1.2;
                            score += !target ? 1.1 : -0.2;
                        } else if (action === "throwDetonator") {
                            score += target && visible ? 1.8 : -4;
                            score += targetDist >= aiSettings.botDetonatorMinRange && targetDist <= aiSettings.botDetonatorMaxRange ? 2.2 : -2.5;
                            score += saberThreat ? 0.9 : 0;
                        } else if (action === "shootEnemy") {
                            score += target && visible ? 3 : -3;
                            score += targetDist < preferred * 1.35 ? 1 : -1.5;
                            score += saberThreat ? 1.1 : 0;
                        } else if (action === "chaseEnemy") {
                            score += target ? 1.2 : -2;
                            score += targetDist > preferred * 1.2 ? 2.2 : -0.6;
                            score -= saberThreat ? 3.2 : 0;
                        } else if (action === "advance") {
                            score += target ? 0.9 : -0.3;
                            score += targetDist > preferred ? 1 : -0.4;
                            score -= saberThreat ? 2.4 : 0;
                        } else if (action === "retreat") {
                            score += danger > 1.5 ? 2.7 : -1.1;
                            score += targetDist < preferred * 0.65 ? 1.3 : 0;
                            score += saberThreat ? 3.8 * constrain(1 - targetDist / aiSettings.lightsaberFearRange, 0, 1) : 0;
                        } else if (action === "strafe") {
                            score += target && visible ? 1.5 : -0.4;
                            score += targetDist < preferred * 1.5 ? 0.5 : 0;
                            score += saberThreat ? 1.2 : 0;
                        } else if (action === "regroup") {
                            score += allyCount <= 0 ? 1.6 : -0.4;
                            score += danger > 1.2 ? 0.9 : 0;
                        } else if (action === "hold") {
                            score += target && visible && targetDist >= preferred * 0.7 && targetDist <= preferred * 1.3 ? 1.2 : -0.2;
                            score += saberThreat && targetDist > aiSettings.lightsaberKeepAwayRange ? 0.5 : 0;
                        }
                        if (action === "retreat") {
                            score += lowHpPress * 3.1;
                            score += supportAdv < 0 ? min(2.8, abs(supportAdv) * 0.9) : 0;
                        } else if (action === "regroup") {
                            score += lowHpPress * 2.2;
                            score += supportAdv < 0 ? min(2.4, abs(supportAdv) * 0.8) : 0;
                        } else if (action === "shootEnemy") {
                            score += supportAdv > 0 ? min(1.8, supportAdv * 0.45) : 0;
                            score -= lowHpPress * 1.5;
                            score -= supportAdv < 0 ? min(2.1, abs(supportAdv) * 0.7) : 0;
                        } else if (action === "hold") {
                            score += supportAdv > 0 && healthRatio > 0.5 ? min(1.2, supportAdv * 0.35) : 0;
                            score -= supportAdv < 0 && healthRatio < 0.35 ? 1.2 : 0;
                        } else if (action === "advance" || action === "chaseEnemy") {
                            score += supportAdv > 0 && healthRatio > 0.62 ? min(1.9, supportAdv * 0.55) : 0;
                            score -= lowHpPress * (action === "chaseEnemy" ? 2.3 : 1.8);
                            score -= supportAdv < 0 ? min(2.6, abs(supportAdv) * 0.85) : 0;
                        } else if (action === "strafe") {
                            score += supportAdv >= 0 ? min(0.9, allyCount * 0.18) : 0;
                            score += healthRatio < 0.55 ? 0.6 : 0;
                        } else if (action === "throwDetonator") {
                            score += supportAdv < 0 ? min(1.1, abs(supportAdv) * 0.35) : 0;
                            score += lowHpPress * 0.7;
                        }
                        if (bot.inPlayerSquad && target && visible) {
                            if (action === "shootEnemy") {
                                score += aiSettings.squadShootBias;
                            } else if (action === "strafe" || action === "hold") {
                                score += aiSettings.squadShootBias * 0.35;
                            }
                        }
                        if (action === "throwDetonator" && !canThrowDetonator(bot, target, visible, targetDist)) {
                            score -= 6;
                        }
                        if (score > bestScore) {
                            bestScore = score;
                            bestAction = action;
                        }
                    }
                    memory.action = bestAction;
                }
                if (memory.action !== "throwDetonator" && canThrowDetonator(bot, target, visible, targetDist) && random() < aiSettings.botDetonatorThrowChance) {
                    memory.action = "throwDetonator";
                }
                memory.decisionFrame = aiSettings.decisionFrames;
                memory.actionAge = 0;
                if (memory.targetId !== targetId) {
                    memory.recentTargetVitals = target ? target.isPlayerTarget ? max(0, playerHealth) + max(0, playerShield) : max(0, target.health || 0) + max(0, target.shield || 0) : 0;
                }
            }
            memory.target = target;
            memory.targetId = targetId;
            memory.stateKey = stateKey;
            memory.actionAge += tickClock.scale;
            memory.debugLabel = memory.action + " r:" + round(memory.rewardTotal);
            if (!target && !crowdingAlly && ally && dist(bot.pos.x, bot.pos.y, ally.pos.x, ally.pos.y) > aiSettings.idleSpreadRange * 2.2) {
                memory.action = "regroup";
            }
            if (squadPrioPlayer) {
                aiApplySquadFollow(bot, crowdingAlly);
            } else {
                var appliedAction = memory.action;
                var actionTargetPos = target && target.pos ? target.pos : null;
                var actionTargetDist = actionTargetPos ? dist(bot.pos.x, bot.pos.y, actionTargetPos.x, actionTargetPos.y) : 999999;
                if (actionTargetPos) {
                    bot.bodyAngle = atan2(actionTargetPos.x - bot.pos.x, -(actionTargetPos.y - bot.pos.y));
                }
                if (detonator && detonator.pos && dist(bot.pos.x, bot.pos.y, detonator.pos.x, detonator.pos.y) < aiSettings.detonatorUrgentRange) {
                    aiMoveAway(bot, detonator.pos, 1.35);
                }
                if (targetSaber && actionTargetDist < aiSettings.lightsaberKeepAwayRange) {
                    aiMoveAway(bot, actionTargetPos, 1.55);
                }
                if (appliedAction === "avoidDetonator" && detonator && detonator.pos) {
                    aiMoveAway(bot, detonator.pos, 1.8);
                } else if (appliedAction === "spreadOut") {
                    applyIdleSpread(bot, crowdingAlly);
                } else if (appliedAction === "advance" && actionTargetPos && !(targetSaber && actionTargetDist < aiSettings.lightsaberFearRange)) {
                    aiMoveToward(bot, actionTargetPos, 0.75);
                } else if (appliedAction === "chaseEnemy" && actionTargetPos && !(targetSaber && actionTargetDist < aiSettings.lightsaberFearRange)) {
                    aiMoveToward(bot, actionTargetPos, 1.15);
                } else if (appliedAction === "retreat" && actionTargetPos) {
                    aiMoveAway(bot, actionTargetPos, targetSaber ? 1.55 : 1.1);
                } else if (appliedAction === "strafe" && actionTargetPos) {
                    var actionDx = actionTargetPos.x - bot.pos.x;
                    var actionDy = actionTargetPos.y - bot.pos.y;
                    var actionD = sqrt(actionDx * actionDx + actionDy * actionDy);
                    if (actionD > 0.001) {
                        var strafeAccel = min(bot.walkSpeed * 0.95, playerSpeed * aiSettings.maxBotMoveSpeedMult) * tickClock.scale;
                        bot.vel.x += (-actionDy / actionD) * strafeAccel * memory.strafeDir;
                        bot.vel.y += (actionDx / actionD) * strafeAccel * memory.strafeDir;
                    }
                    if (memory.actionAge % 45 === 0) {
                        memory.strafeDir *= -1;
                    }
                } else if (appliedAction === "regroup" && ally && ally.pos) {
                    aiMoveToward(bot, ally.pos, 0.9);
                } else if (appliedAction === "unstuck") {
                    var escapeAngle = bot.bodyAngle + 90 + memory.strafeDir * 70;
                    var escapeAccel = min(bot.walkSpeed * 1.4, playerSpeed * aiSettings.maxBotMoveSpeedMult) * tickClock.scale;
                    bot.vel.x += cos(escapeAngle) * escapeAccel;
                    bot.vel.y += sin(escapeAngle) * escapeAccel;
                    if (bot.touchingFloorCollision) {
                        bot.vel.z = max(bot.vel.z, 0.09);
                    }
                }
                if (appliedAction === "throwDetonator" && target && target.pos) {
                    var throwDist = dist(bot.pos.x, bot.pos.y, target.pos.x, target.pos.y);
                    if (canThrowDetonator(bot, target, visible, throwDist) && currentMap && currentMap.entities) {
                        var throwLayer = constrain(floor(bot.pos.z), currentMap.killZ, currentMap.topZ + 1);
                        var throwRot = atan2(target.pos.y - bot.pos.y, target.pos.x - bot.pos.x);
                        var throwPower = constrain(throwDist / 28, 10, 26);
                        var detConfig = {
                            x: bot.pos.x,
                            y: bot.pos.y,
                            z: bot.pos.z + 1,
                            xVel: cos(throwRot) * throwPower,
                            yVel: sin(throwRot) * throwPower,
                            zVel: 0.1,
                            r: random(-4, 4),
                            explosionDamageMax: 150 * aiSettings.botDamageScale,
                            owner: bot
                        };
                        if (!currentMap.entities[throwLayer]) {
                            currentMap.entities[throwLayer] = [];
                        }
                        currentMap.entities[throwLayer].push(getPooledDetonator(detConfig));
                        bot.detonatorCount = max(0, (bot.detonatorCount || 0) - 1);
                        bot.aiMemory.detonatorCooldown = aiSettings.botDetonatorCooldown;
                        bot.aiMemory.pendingReward -= 0.08;
                    }
                }
                if (
                    (appliedAction === "shootEnemy" || appliedAction === "hold" || appliedAction === "strafe") && target && visible) {
                    var aimRot = atan2(target.pos.y - bot.pos.y, target.pos.x - bot.pos.x);
                    var facing = (bot.bodyAngle - 90) % 360;
                    if (facing < 0) {
                        facing += 360;
                    }
                    var aimDiffRaw = (aimRot - facing) % 360;
                    if (aimDiffRaw > 180) {
                        aimDiffRaw -= 360;
                    }
                    if (aimDiffRaw < -180) {
                        aimDiffRaw += 360;
                    }
                    if (!segHitFriendly(bot, target) && abs(aimDiffRaw) <= aiSettings.aimShootTolerance * 2) {
                        bot.wantsToShoot = true;
                        var gun = bot.getBlaster();
                        if (gun && bot.aimWarmup >= bot.aimWarmupFrames * 0.45) {
                            gun.shootFrom(bot.pos, aimRot, bot, {
                                damage: gun.damage * aiSettings.botDamageScale
                            });
                        }
                    }
                }
                if (!target && !crowdingAlly) {
                    applyIdleSpread(bot, null);
                }
            }
            if (!(detonator && detonatorDist < aiSettings.detonatorUrgentRange)) {
                aiApplySquadFollow(bot, crowdingAlly);
            }
        };
        var runFallbackBot = function(bot) {
            var target = findNearestEnemy(bot, true);
            var fallbackVisible = !!target;
            if (!target) {
                target = findNearestEnemy(bot, false);
            }
            var view = getAIPerception(bot);
            var crowdingAlly = target ? view.crowdingCombat : view.crowdingIdle;
            if (crowdingAlly && crowdingAlly.health <= 0) {
                crowdingAlly = null;
            }
            var detonator = view.detonator && !view.detonator.damageDone ? view.detonator : null;
            if (bot.aiMemory && bot.aiMemory.detonatorCooldown > 0) {
                bot.aiMemory.detonatorCooldown = max(0, bot.aiMemory.detonatorCooldown - tickClock.scale);
            }
            if (detonator && dist(bot.pos.x, bot.pos.y, detonator.pos.x, detonator.pos.y) < aiSettings.detonatorUrgentRange) {
                aiMoveAway(bot, detonator.pos, 1.7);
            }
            if (crowdingAlly) {
                applyIdleSpread(bot, crowdingAlly);
            }
            var fbDetUrgent = detonator && dist(bot.pos.x, bot.pos.y, detonator.pos.x, detonator.pos.y) < aiSettings.detonatorUrgentRange;
            if (!target || !target.pos) {
                if (!crowdingAlly) {
                    applyIdleSpread(bot, null);
                }
                if (!fbDetUrgent) {
                    aiApplySquadFollow(bot, crowdingAlly);
                }
                return;
            }
            var d = dist(bot.pos.x, bot.pos.y, target.pos.x, target.pos.y);
            if (!fallbackVisible) {
                fallbackVisible = hasLineOfSight(bot, target);
            }
            var fbTargetSaber = !!target && (target.isPlayerTarget ? currentGun && currentGun.isLightsaber && currentGun.on : !!(target.currentGun && target.currentGun.isLightsaber && target.currentGun.on));
            var fbPrioPlayer = false;
            if (bot && bot.inPlayerSquad) {
                var fbPlayerDist = dist(bot.pos.x, bot.pos.y, playerPos.x, playerPos.y);
                if (fbPlayerDist > aiSettings.squadPriorityRange) {
                    fbPrioPlayer = true;
                } else if (target && fallbackVisible && d < aiSettings.preferredCombatRange * 1.25) {
                    fbPrioPlayer = false;
                } else if (fbPlayerDist > aiSettings.squadFollowComfortRange && (!target || d > aiSettings.preferredCombatRange * 0.85)) {
                    fbPrioPlayer = true;
                }
            }
            if (fbPrioPlayer) {
                if (!fbDetUrgent) {
                    aiApplySquadFollow(bot, crowdingAlly);
                }
                return;
            }
            bot.bodyAngle = atan2(target.pos.x - bot.pos.x, -(target.pos.y - bot.pos.y));
            if (fbTargetSaber && d < aiSettings.lightsaberKeepAwayRange) {
                aiMoveAway(bot, target.pos, 1.55);
            } else if (d > aiSettings.preferredCombatRange && !(fbTargetSaber && d < aiSettings.lightsaberFearRange)) {
                aiMoveToward(bot, target.pos, 0.8);
            } else if (d < aiSettings.preferredCombatRange * 0.55 || (fbTargetSaber && d < aiSettings.lightsaberFearRange)) {
                aiMoveAway(bot, target.pos, fbTargetSaber ? 1.25 : 0.7);
            }
            if (fallbackVisible && !segHitFriendly(bot, target)) {
                bot.wantsToShoot = true;
                var gun = bot.getBlaster();
                var aimRot = atan2(target.pos.y - bot.pos.y, target.pos.x - bot.pos.x);
                if (gun) {
                    gun.shootFrom(bot.pos, aimRot, bot, {
                        damage: gun.damage * aiSettings.botDamageScale
                    });
                }
            }
            if (canThrowDetonator(bot, target, fallbackVisible, d) && random() < aiSettings.botDetonatorThrowChance * 0.6) {
                if (currentMap && currentMap.entities) {
                    var fbThrowLayer = constrain(floor(bot.pos.z), currentMap.killZ, currentMap.topZ + 1);
                    var fallbackThrowRot = atan2(target.pos.y - bot.pos.y, target.pos.x - bot.pos.x);
                    var fbThrowPower = constrain(d / 28, 10, 26);
                    var fallbackDetConfig = {
                        x: bot.pos.x,
                        y: bot.pos.y,
                        z: bot.pos.z + 1,
                        xVel: cos(fallbackThrowRot) * fbThrowPower,
                        yVel: sin(fallbackThrowRot) * fbThrowPower,
                        zVel: 0.1,
                        r: random(-4, 4),
                        explosionDamageMax: 150 * aiSettings.botDamageScale,
                        owner: bot
                    };
                    if (!currentMap.entities[fbThrowLayer]) {
                        currentMap.entities[fbThrowLayer] = [];
                    }
                    currentMap.entities[fbThrowLayer].push(getPooledDetonator(fallbackDetConfig));
                    bot.detonatorCount = max(0, (bot.detonatorCount || 0) - 1);
                    bot.aiMemory.detonatorCooldown = aiSettings.botDetonatorCooldown;
                    bot.aiMemory.pendingReward -= 0.08;
                }
            }
            if (!fbDetUrgent) {
                aiApplySquadFollow(bot, crowdingAlly);
            }
        };
        if (aiSettings.useLearningBots) {
            runLearningBot(this);
        } else {
            runFallbackBot(this);
        }
    }
    var tick = tickClock.scale;
    if (this.isJedi) {
        this.force = min(this.maxForce, this.force + forceSettings.regenSpeed * tick);
    }
    var flatSpeedPrePhys = sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
    if (flatSpeedPrePhys > 0.08) {
        var lookAheadDist = this.inPlayerSquad ? 190 : 125;
        var edgeCheckX = this.pos.x + (this.vel.x / flatSpeedPrePhys) * lookAheadDist;
        var edgeCheckY = this.pos.y + (this.vel.y / flatSpeedPrePhys) * lookAheadDist;
        var edgeCheckZ = floor(this.pos.z);
        var floorAhead = false;
        for (var edgeLayer = edgeCheckZ - 1; edgeLayer <= edgeCheckZ + 1 && !floorAhead; edgeLayer++) {
            var edgeCols = currentMap && currentMap.getNearbyCollisions ? currentMap.getNearbyCollisions(edgeLayer, edgeCheckX, edgeCheckY, 2) : currentMap && currentMap.collisionLayers ? currentMap.collisionLayers[edgeLayer] : null;
            if (!edgeCols) {
                continue;
            }
            for (var edgeColIndex = 0; edgeColIndex < edgeCols.length; edgeColIndex++) {
                var edgeCol = edgeCols[edgeColIndex];
                if (!edgeCol || !edgeCol.plane) {
                    continue;
                }
                var edgeFloorZ = edgeCol.lowZ !== undefined ? floor(edgeCol.lowZ) : edgeLayer;
                if (edgeCol.checkCollision(edgeCheckX, edgeCheckY, edgeFloorZ)) {
                    floorAhead = true;
                    break;
                }
            }
        }
        if (!floorAhead) {
            var edgeAnchor = this.inPlayerSquad ? playerPos : currentMap ? currentMap.spawnPos : null;
            var edgeAnchorX = edgeAnchor ? edgeAnchor.x : 0;
            var edgeAnchorY = edgeAnchor ? edgeAnchor.y : 0;
            var edgeDx = edgeAnchorX - this.pos.x;
            var edgeDy = edgeAnchorY - this.pos.y;
            var edgeD = max(0.001, sqrt(edgeDx * edgeDx + edgeDy * edgeDy));
            var edgePush = (this.inPlayerSquad ? 1.5 : 1.05) * playerSpeed * tick;
            this.vel.x = this.vel.x * 0.15 + (edgeDx / edgeD) * edgePush;
            this.vel.y = this.vel.y * 0.15 + (edgeDy / edgeD) * edgePush;
        }
    }
    var flatSpeedFace = sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
    if (!this.wantsToShoot && flatSpeedFace > 0.1) {
        this.bodyAngle = atan2(this.vel.x, -this.vel.y);
    }
    this.vel.z -= 0.005 * tick;
    this.vel.x *= pow(0.8, tick);
    this.vel.y *= pow(0.8, tick);
    if (abs(this.vel.x) < 0.001) {
        this.vel.x = 0;
    }
    if (abs(this.vel.y) < 0.001) {
        this.vel.y = 0;
    }
    this.vel.z = constrain(this.vel.z, -0.35, 0.18);
    var touchedFloor = false;
    var touchedSolid = false;
    var motionScale = tickClock.scale;
    var maxComp = max(max(abs(this.vel.x), abs(this.vel.y)), abs(this.vel.z)) * motionScale;
    var steps = max(1, ceil(maxComp / 6));
    var stepScale = motionScale / steps;
    var priorStepScale = this.vel._stepScale;
    for (var step = 0; step < steps; step++) {
        this.vel._stepScale = stepScale;
        this.collide();
        if (this.touchingFloorCollision) {
            touchedFloor = true;
        }
        if (this.touchingNonFloorCollision) {
            touchedSolid = true;
        }
        if (this.vel.x !== 0) {
            this.pos.x += this.vel.x * stepScale;
            this.collide();
            if (this.touchingFloorCollision) {
                touchedFloor = true;
            }
            if (this.touchingNonFloorCollision) {
                touchedSolid = true;
            }
        }
        if (this.vel.y !== 0) {
            this.pos.y += this.vel.y * stepScale;
            this.collide();
            if (this.touchingFloorCollision) {
                touchedFloor = true;
            }
            if (this.touchingNonFloorCollision) {
                touchedSolid = true;
            }
        }
        if (this.vel.z !== 0) {
            this.pos.z += this.vel.z * stepScale;
            this.collide();
            if (this.touchingFloorCollision) {
                touchedFloor = true;
            }
            if (this.touchingNonFloorCollision) {
                touchedSolid = true;
            }
        }
    }
    if (priorStepScale === undefined) {
        this.vel._stepScale = 1;
    } else {
        this.vel._stepScale = priorStepScale;
    }
    this.touchingFloorCollision = touchedFloor;
    this.touchingNonFloorCollision = touchedSolid;
    softCharCollide(this, false);
    this.vel.z = constrain(this.vel.z, -0.35, 0.18);
    var activeLayer = this._activeLayer !== undefined ? this._activeLayer : floor(this.pos.z);
    if (this.pos.z < currentMap.killZ || this.pos.z > currentMap.topZ + 1 || this.health <= 0) {
        return "delete";
    }
    if (floor(this.pos.z) < activeLayer) {
        return "zDown";
    }
    if (floor(this.pos.z) > activeLayer) {
        return "zUp";
    }
    if (this.health !== undefined) {
        if (this.maxHealth === undefined) {
            this.maxHealth = this.health;
        }
        if (this.health < 0) {
            this.health = 0;
        }
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }
        if (this.maxShield === undefined) {
            this.maxShield = 0;
        }
        if (this.shield === undefined) {
            this.shield = this.maxShield;
        }
        if (this.shield < 0) {
            this.shield = 0;
        }
        if (this.shield > this.maxShield) {
            this.shield = this.maxShield;
        }
        if (this.maxShield > 0 && this.shield < this.maxShield) {
            this.shield = min(this.maxShield, this.shield + this.shieldRegen * tickClock.scale);
        }
        this.health = min(this.maxHealth, this.health + (this.maxShield <= 0 || this.shield >= this.maxShield ? this.healthRegenFullShield : this.healthRegenLowShield) * tickClock.scale);
    }
    if (this.health <= 0) {
        return "delete";
    }
    return false;
};
AIPlayer.prototype.render = function() {
    if (this.inPlayerSquad) {
        noFill();
        stroke(70, 155, 255, 230);
        strokeWeight(4);
        ellipse(this.pos.x, this.pos.y, this.colSize * 2.8, this.colSize * 2.8);
        stroke(170, 220, 255, 140);
        strokeWeight(2);
        ellipse(this.pos.x, this.pos.y, this.colSize * 2.15, this.colSize * 2.15);
    }
    pushMatrix();
    translate(this.pos.x, this.pos.y);
    rotate(this.bodyAngle);
    drawPlayer(this.skin, 60, true);
    renderBlaster(this.weapon, this.skin, this.gunPose);
    popMatrix();
    var barW = 58;
    var barH = 6;
    var barX = this.pos.x - barW / 2;
    var healthY = this.pos.y - 76;
    var shieldY = healthY + barH + 3;
    var healthPct = constrain(this.health / max(1, this.maxHealth), 0, 1);
    var shieldPct = this.maxShield > 0 ? constrain(this.shield / this.maxShield, 0, 1) : 0;
    rectMode(CORNER);
    noStroke();
    fill(0, 150);
    rect(barX - 1, healthY - 1, barW + 2, barH + 2, 2);
    fill(60, 12, 10, 220);
    rect(barX, healthY, barW, barH, 2);
    fill(235, 35, 20, 235);
    rect(barX, healthY, barW * healthPct, barH, 2);
    fill(0, 130);
    rect(barX - 1, shieldY - 1, barW + 2, barH + 2, 2);
    fill(12, 18, 55, 210);
    rect(barX, shieldY, barW, barH, 2);
    fill(95, 150, 255, 235);
    rect(barX, shieldY, barW * shieldPct, barH, 2);
    if (aiSettings.debugLearning && this.aiMemory) {
        fill(255, 235, 120, 230);
        textAlign(CENTER, CENTER);
        textSize(10);
        text(this.aiMemory.debugLabel, this.pos.x, this.pos.y - 94);
    }
};
var Billy = function(config) {
    Entity.call(this, config);
    this.slide = 0.999;
};
Billy.prototype = Object.create(Entity.prototype);
Billy.prototype.render = function() {
    fill(255, 0, 0);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 50, 50);
};
Detonator = function(config) {
    this.reset(config);
};
Detonator.prototype = Object.create(Entity.prototype);
Detonator.prototype.constructor = Detonator;
Detonator.prototype.reset = function(config) {
    Entity.call(this, config);
    this.poolType = "detonator";
    this.slide = 0.959;
    this.bounce = 0.5;
    this.rv = config.rv !== undefined ? config.rv : 0;
    this.rVel = config.r !== undefined ? config.r : 0;
    this.armDelay = config.armDelay !== undefined ? config.armDelay : 40;
    this.fuse = config.fuse !== undefined ? config.fuse : 100;
    this.exploding = false;
    this.explosionTime = 0;
    this.explosionGrowFrames = 10;
    this.explosionFadeFrames = 50;
    this.explosionMax = 500 + random(-60, 60);
    this.explosionDamageMax = config.explosionDamageMax !== undefined ? config.explosionDamageMax : 150;
    this.owner = config.owner || null;
    this.damageDone = false;
    this.soundDone = false;
};
Detonator.prototype.doExplosionDamage = function() {
    var layer = floor(this.pos.z);
    var radius = this.explosionMax * 0.5;
    var knockMax = 12;
    var maxZPush = 0.18;
    var maxXY = 25;
    for (var zl = layer - 2; zl <= layer + 2; zl++) {
        var list = currentMap.entities[zl];
        if (!list) {
            continue;
        }
        for (var e = 0; e < list.length; e++) {
            var ent = list[e];
            if (!ent || !ent.pos) {
                continue;
            }
            var dz = abs(floor(ent.pos.z) - layer);
            if (dz > 2) {
                continue;
            }
            var dxy = dist(this.pos.x, this.pos.y, ent.pos.x, ent.pos.y);
            var t = 1 - dxy / radius;
            t = constrain(t, 0, 1);
            if (ent.health !== undefined) {
                var dmg = this.explosionDamageMax * t;
                if (dmg > 0) {
                    var beforeHealth = ent.health;
                    var beforeShield = ent.shield !== undefined ? ent.shield : 0;
                    applyDamage(ent, dmg);
                    var done = max(0, beforeHealth + beforeShield - ((ent.health !== undefined ? ent.health : 0) + (ent.shield !== undefined ? ent.shield : 0)));
                    if (this.owner && this.owner.aiMemory && done > 0 && ent.team !== undefined) {
                        if (ent.team === this.owner.team) {
                            this.owner.aiMemory.pendingReward -= done * 0.12;
                        } else {
                            this.owner.aiMemory.pendingReward += done * 0.08;
                            if (beforeHealth > 0 && ent.health <= 0) {
                                this.owner.aiMemory.pendingReward += 8;
                            }
                        }
                    }
                    if (this.owner && this.owner.isPlayer && ent.isMatchBot && ent.team !== playerTeam && done > 0) {
                        ent.playerCreditDamage = (ent.playerCreditDamage || 0) + done;
                        ent.playerCreditDamageMax = max(1,
                            (ent.maxHealth || 100) + (ent.maxShield || 0));
                    }
                    if (ent.isMatchBot && beforeHealth > 0 && ent.health <= 0 && !ent.creditPaid) {
                        if (!ent.tdmScorePaid && this.owner && this.owner.team !== undefined) {
                            awardTDMKill(this.owner.team, ent.team);
                            ent.tdmScorePaid = true;
                        }
                        if (ent.team !== playerTeam && ent.playerCreditDamage > 0) {
                            var damagePercent = constrain(ent.playerCreditDamage / max(1, ent.playerCreditDamageMax || (ent.maxHealth || 100) + (ent.maxShield || 0)), 0, 1);
                            var killBaseCredits = (floor(random(18, 31)) + matchState.playerKills * 5) * 5;
                            var earnedCredits = max(1, floor(killBaseCredits * damagePercent));
                            matchState.playerKills++;
                            ent.creditPaid = true;
                            addCreditChange(earnedCredits, ent.pos.x, ent.pos.y - 82);
                        } else if (this.owner && this.owner.isPlayer && ent.team === playerTeam) {
                            ent.creditPaid = true;
                            addCreditChange(-floor(random(40, 71)), ent.pos.x, ent.pos.y - 82);
                        }
                    }
                }
            }
            if (ent.vel) {
                var strength = knockMax * t;
                if (strength > 0) {
                    var entKnockDx = ent.pos.x - this.pos.x;
                    var entKnockDy = ent.pos.y - this.pos.y;
                    var entKnockDist = sqrt(entKnockDx * entKnockDx + entKnockDy * entKnockDy);
                    if (entKnockDist < 0.0001) {
                        entKnockDist = 0.0001;
                    }
                    var entKnockNx = entKnockDx / entKnockDist;
                    var entKnockNy = entKnockDy / entKnockDist;
                    ent.vel.x += entKnockNx * strength * 20;
                    ent.vel.y += entKnockNy * strength * 20;
                    ent.vel.z += maxZPush / 1.15;
                    ent.pos.z += 0.15;
                    if (ent.vel.x > maxXY) {
                        ent.vel.x = maxXY;
                    }
                    if (ent.vel.x < -maxXY) {
                        ent.vel.x = -maxXY;
                    }
                    if (ent.vel.y > maxXY) {
                        ent.vel.y = maxXY;
                    }
                    if (ent.vel.y < -maxXY) {
                        ent.vel.y = -maxXY;
                    }
                }
            }
        }
    }
    if (abs(playerPos.z - this.pos.z) <= 2) {
        var tp = constrain(1 - dist(this.pos.x, this.pos.y, playerPos.x, playerPos.y) / radius, 0, 1);
        var pdmg = this.explosionDamageMax * tp;
        if (pdmg > 0) {
            var prevPlayerVitals = playerHealth + playerShield;
            var pExplDmgTmp = {
                health: playerHealth,
                maxHealth: playerMaxHealth,
                shield: playerShield,
                maxShield: playerMaxShield,
                damageMult: playerDamageMult !== undefined ? playerDamageMult : 1
            };
            applyDamage(pExplDmgTmp, pdmg);
            playerHealth = pExplDmgTmp.health;
            playerShield = pExplDmgTmp.shield;
            if (prevPlayerVitals > 0 && playerHealth <= 0 && !deathScorePaid && this.owner && this.owner.team !== undefined) {
                awardTDMKill(this.owner.team, playerTeam);
                deathScorePaid = true;
            }
            if (this.owner && this.owner.aiMemory) {
                this.owner.aiMemory.pendingReward += max(0, prevPlayerVitals - (playerHealth + playerShield)) * 0.08;
                if (prevPlayerVitals > 0 && playerHealth <= 0) {
                    this.owner.aiMemory.pendingReward += 8;
                }
            }
            bloodScreen = pdmg * 2;
        }
        var pStrength = knockMax * tp;
        if (pStrength > 0) {
            var playerKnockDx = playerPos.x - this.pos.x;
            var playerKnockDy = playerPos.y - this.pos.y;
            var playerKnockDist = sqrt(playerKnockDx * playerKnockDx + playerKnockDy * playerKnockDy);
            if (playerKnockDist < 0.0001) {
                playerKnockDist = 0.0001;
            }
            var playerKnockNx = playerKnockDx / playerKnockDist;
            var playerKnockNy = playerKnockDy / playerKnockDist;
            playerVel.x += playerKnockNx * pStrength * 20;
            playerVel.y += playerKnockNy * pStrength * 20;
            playerVel.z += maxZPush / 1.15;
            if (playerVel.x > maxXY) {
                playerVel.x = maxXY;
            }
            if (playerVel.x < -maxXY) {
                playerVel.x = -maxXY;
            }
            if (playerVel.y > maxXY) {
                playerVel.y = maxXY;
            }
            if (playerVel.y < -maxXY) {
                playerVel.y = -maxXY;
            }
        }
    }
};
Detonator.prototype.update = function() {
    var tick = tickClock.scale;
    if (this.exploding) {
        this.explosionTime += 0.3 * tick;
        if (!this.damageDone) {
            this.damageDone = true;
            this.doExplosionDamage();
        }
        if (this.explosionTime >= this.explosionGrowFrames + this.explosionFadeFrames) {
            return "delete";
        }
        return false;
    }
    if (this.armDelay > 0) {
        this.armDelay = max(0, this.armDelay - tick);
    } else {
        this.fuse -= tick;
    }
    this.rv += this.rVel * tick;
    this.vel.z -= 0.005 * tick;
    this.vel.x *= pow(this.slide, tick);
    this.vel.y *= pow(this.slide, tick);
    this.collide();
    var activeLayer = this._activeLayer !== undefined ? this._activeLayer : floor(this.pos.z);
    if (floor(this.pos.z) < currentMap.killZ || floor(this.pos.z) > currentMap.topZ + 1) {
        return "delete";
    } else if (floor(this.pos.z) < activeLayer) {
        return "zDown";
    } else if (floor(this.pos.z) > activeLayer) {
        return "zUp";
    }
    this.pos.x += this.vel.x * tick;
    this.pos.y += this.vel.y * tick;
    this.pos.z += this.vel.z * tick;
    if (this.fuse <= 0 && this.armDelay <= 0) {
        this.exploding = true;
        this.explosionTime = 0;
        if (!this.soundDone) {
            playSound_("explosion", constrain(map(dist(this.pos.x, this.pos.y, playerPos.x, playerPos.y), 0, 2200, 1, 0.12), 0.12, 1) / 3);
            this.soundDone = true;
        }
        this.vel.x = 0;
        this.vel.y = 0;
        this.vel.z = 0;
    }
    return false;
};
Detonator.prototype.render = function() {
    if (this.exploding) {
        var t = this.explosionTime;
        var growT = constrain(t / this.explosionGrowFrames, 0, 1);
        var fadeT = constrain((t - this.explosionGrowFrames) / this.explosionFadeFrames, 0, 1);
        var eased = 1 - pow(1 - growT, 3);
        var d = this.explosionMax * eased;
        var a = 1 - fadeT;
        var c1 = lerpColor(color(255, 220, 120, 220), color(255, 80, 40, 0), fadeT);
        var c2 = lerpColor(color(255, 255, 255, 200), color(255, 255, 255, 0), fadeT);
        noStroke();
        fill(red(c1), green(c1), blue(c1), alpha(c1) * a);
        ellipse(this.pos.x, this.pos.y, d, d);
        fill(red(c2), green(c2), blue(c2), alpha(c2) * a);
        ellipse(this.pos.x, this.pos.y, d * 0.45, d * 0.45);
        if (t < 0.35) {
            var dd = dist(playerPos.x, playerPos.y, this.pos.x, this.pos.y);
            var amt = 25 * constrain(1 - dd / 900, 0, 1);
            if (amt > screenShake) {
                screenShake = amt;
            }
        }
        return;
    }
    pushMatrix();
    translate(this.pos.x, this.pos.y);
    rotate(this.rv);
    drawImg(loadedImages.thermal_detonator, -20, -20, 40, 40);
    popMatrix();
};
var Landmine = function(config) {
    Entity.call(this, config);
    this.slide = 0;
    this.bounce = 0;
    this.rv = config.rv !== undefined ? config.rv : 0;
    this.rVel = config.r !== undefined ? config.r : 0;
    this.exploding = false;
    this.explosionTime = 0;
    this.explosionGrowFrames = 10;
    this.explosionFadeFrames = 50;
    this.explosionMax = 500 + random(-60, 60);
    this.type = config.type || "blue";
    this.owner = config.owner || null;
    this.armDelay = config.armDelay !== undefined ? config.armDelay : 45;
    this.triggerRadius = config.triggerRadius !== undefined ? config.triggerRadius : 85;
    this.nextTriggerMs = 0;
    this.explosionDamageMax = config.explosionDamageMax !== undefined ? config.explosionDamageMax : 150;
    this.damageDone = false;
};
Landmine.prototype = Object.create(Entity.prototype);
Landmine.prototype.update = function() {
    var tick = tickClock.scale;
    if (this.exploding) {
        this.explosionTime += 0.3 * tick;
        if (!this.damageDone) {
            this.damageDone = true;
            Detonator.prototype.doExplosionDamage.call(this);
        }
        if (this.explosionTime >= this.explosionGrowFrames + this.explosionFadeFrames) {
            return "delete";
        }
        return false;
    }
    this.armDelay = max(0, this.armDelay - tick);
    if (this.armDelay === 0 && tickClock.gameMs >= this.nextTriggerMs) {
        this.nextTriggerMs = tickClock.gameMs + 100;
        var ownerTeam = this.owner ? this.owner.team : undefined;
        var mineLayer = floor(this.pos.z);
        var triggered = playerHealth > 0 && ownerTeam !== playerTeam && abs(playerPos.z - this.pos.z) < 0.6 && dist(playerPos.x, playerPos.y, this.pos.x, this.pos.y) <= this.triggerRadius;
        var nearby = currentMap.entities[mineLayer] || [];
        for (var mineIndex = 0; mineIndex < nearby.length && !triggered; mineIndex++) {
            var actor = nearby[mineIndex];
            if (actor !== this && actor.health > 0 && actor.team !== ownerTeam && actor.pos && abs(actor.pos.z - this.pos.z) < 0.6 && dist(actor.pos.x, actor.pos.y, this.pos.x, this.pos.y) <= this.triggerRadius) {
                triggered = true;
            }
        }
        if (triggered) {
            this.exploding = true;
            this.explosionTime = 0;
            this.vel.mult(0);
            playSound_("explosion", constrain(1 - dist(playerPos.x, playerPos.y, this.pos.x, this.pos.y) / 2200, 0.12, 1) / 3);
            return false;
        }
    }
    this.rv += this.rVel * tick;
    this.vel.z -= 0.005 * tick;
    this.vel.x *= pow(0.2, tick);
    this.vel.y *= pow(0.2, tick);
    this.collide();
    var activeLayer = this._activeLayer !== undefined ? this._activeLayer : floor(this.pos.z);
    if (floor(this.pos.z) < currentMap.killZ || floor(this.pos.z) > currentMap.topZ + 1) {
        return "delete";
    } else if (floor(this.pos.z) < activeLayer) {
        return "zDown";
    } else if (floor(this.pos.z) > activeLayer) {
        return "zUp";
    }
    this.pos.x += this.vel.x * tick;
    this.pos.y += this.vel.y * tick;
    this.pos.z += this.vel.z * tick;
    if (abs(this.vel.x) < 0.001) {
        this.vel.x = 0;
    }
    if (abs(this.vel.y) < 0.001) {
        this.vel.y = 0;
    }
    return false;
};
Landmine.prototype.render = function() {
    if (this.exploding) {
        var t = this.explosionTime;
        var growT = constrain(t / this.explosionGrowFrames, 0, 1);
        var fadeT = constrain((t - this.explosionGrowFrames) / this.explosionFadeFrames, 0, 1);
        var eased = 1 - pow(1 - growT, 3);
        var d = this.explosionMax * eased;
        var a = 1 - fadeT;
        var c1 = lerpColor(color(255, 220, 120, 220), color(255, 80, 40, 0), fadeT);
        var c2 = lerpColor(color(255, 255, 255, 200), color(255, 255, 255, 0), fadeT);
        noStroke();
        fill(red(c1), green(c1), blue(c1), alpha(c1) * a);
        ellipse(this.pos.x, this.pos.y, d, d);
        fill(red(c2), green(c2), blue(c2), alpha(c2) * a);
        ellipse(this.pos.x, this.pos.y, d * 0.45, d * 0.45);
        if (t < 0.35) {
            var dd = dist(playerPos.x, playerPos.y, this.pos.x, this.pos.y);
            var amt = 25 * constrain(1 - dd / 900, 0, 1);
            if (amt > screenShake) {
                screenShake = amt;
            }
        }
        return;
    }
    pushMatrix();
    translate(this.pos.x, this.pos.y);
    drawImg(this.type === "blue" ? loadedImages.blue_landmine_sprite : loadedImages.red_landmine_sprite, -50, -50, 70, 70);
    popMatrix();
};
var JetParticle = function(config) {
    Entity.call(this, config);
    this.life = config.life !== undefined ? config.life : 30;
    this.s = config.s !== undefined ? config.s : 10;
    this.sShrink = config.sShrink !== undefined ? config.sShrink : 0.35;
    this.col = config.col || color(255, 180, 60, 170);
    this.slide = config.slide !== undefined ? config.slide : 0.92; //a little drag
    this.bounce = 0;
};
JetParticle.prototype = Object.create(Entity.prototype);
JetParticle.prototype.update = function() {
    var tick = tickClock.scale;
    this.vel.z -= 0.002 * tick;
    this.vel.x *= pow(this.slide, tick);
    this.vel.y *= pow(this.slide, tick);
    var activeLayer = this._activeLayer !== undefined ? this._activeLayer : floor(this.pos.z);
    if (floor(this.pos.z) < currentMap.killZ || floor(this.pos.z) > currentMap.topZ + 1) {
        return "delete";
    } else if (floor(this.pos.z) < activeLayer) {
        return "zDown";
    } else if (floor(this.pos.z) > activeLayer) {
        return "zUp";
    }
    this.pos.x += this.vel.x * tick;
    this.pos.y += this.vel.y * tick;
    this.pos.z += this.vel.z * tick;
    this.s -= this.sShrink * tick;
    this.life -= tick;
    if (this.life <= 0 || this.s <= 0) {
        return "delete";
    }
    return false;
};
JetParticle.prototype.render = function() {
    noStroke();
    fill(255, 245, 160, min(210, alpha(this.col) + 45));
    ellipse(this.pos.x, this.pos.y, this.s * 0.45, this.s * 0.45);
    fill(this.col);
    ellipse(this.pos.x, this.pos.y, this.s, this.s);
    fill(255, 90, 25, alpha(this.col) * 0.45);
    ellipse(this.pos.x, this.pos.y, this.s * 1.35, this.s * 1.35);
};
worldToScreen = function(x, y, z) {
    var layerScale = z === undefined ? 1 : (1 - 0.1 * (playerPos.z - floor(z))) * (1 + 0.1 * (z - floor(z)));
    var dx = (x - camPos.x) * zoom * layerScale;
    var dy = (y - camPos.y) * zoom * layerScale * cameraState.pitch;
    return {
        x: width / 2 + cameraState.shakeX + dx * cos(cameraState.roll) - dy * sin(cameraState.roll),
        y: height / 2 + cameraState.shakeY + dx * sin(cameraState.roll) + dy * cos(cameraState.roll)
    };
};
screenToWorld = function(x, y) {
    var dx = x - width / 2 - cameraState.shakeX;
    var dy = y - height / 2 - cameraState.shakeY;
    return {
        x: camPos.x + (dx * cos(cameraState.roll) + dy * sin(cameraState.roll)) / max(0.001, zoom),
        y: camPos.y + (-dx * sin(cameraState.roll) + dy * cos(cameraState.roll)) / max(0.001, zoom * cameraState.pitch)
    };
};
var updateCamera = function(live) {
    var baseZoom = inventoryState.selected === 0 && currentGun && currentGun.renderZoom !== undefined ? currentGun.renderZoom : defaultZoom;
    var moving = constrain(dist(0, 0, playerVel.x, playerVel.y) / 10, 0, 1);
    var sprinting = live && keys[inputKeys.sprint] ? moving : 0;
    var focusing = live && keys[inputKeys.focus] && !squadCommandMode;
    var targetZoom = baseZoom * (1 - sprinting * 0.14 - cameraState.recoil * 0.025);
    if (focusing) {
        targetZoom = baseZoom * 1.25;
    }
    if (squadCommandMode || (keys[inputKeys.zoom] && currentGun && !currentGun.isLightsaber)) {
        targetZoom = max(0.08, baseZoom * 0.42);
    }
    var reset = !cameraState.ready || cameraState.map !== currentMap || dist(camPos.x, camPos.y, playerPos.x, playerPos.y) > 1400;
    if (reset) {
        cameraState.ready = true;
        cameraState.map = currentMap;
        camPos.x = playerPos.x;
        camPos.y = playerPos.y;
        cameraState.roll = 0;
        cameraState.pitch = 1;
        cameraState.recoil = 0;
        zoom = targetZoom;
    }
    var activeFov = inventoryState.selected === 0 && currentGun && currentGun.scopeFov !== undefined ? currentGun.scopeFov : fov;
    var lookX = constrain(mouseX - width / 2, -width * 0.42, width * 0.42) / (activeFov * max(0.4, zoom));
    var lookY = constrain(mouseY - height / 2, -height * 0.42, height * 0.42) / (activeFov * max(0.4, zoom));
    var lookCos = cos(cameraState.roll);
    var lookSin = sin(cameraState.roll);
    var follow = uiEase(focusing ? 0.14 : 0.09);
    camPos.x = lerp(camPos.x, playerPos.x + (live ? lookX * lookCos + lookY * lookSin + playerVel.x * 3 : 0), follow);
    camPos.y = lerp(camPos.y, playerPos.y + (live ? -lookX * lookSin + lookY * lookCos + playerVel.y * 3 : 0), follow);
    camPos.z = playerPos.z;
    zoom = lerp(zoom, targetZoom, uiEase(0.1));
    var targetRoll = live && !focusing && !squadCommandMode ? constrain(-playerVel.x * 0.18, -2.2, 2.2) : 0;
    cameraState.roll = lerp(cameraState.roll, targetRoll, uiEase(0.06));
    cameraState.pitch = lerp(cameraState.pitch, 1 - sprinting * 0.045, uiEase(0.08));
    cameraState.recoil *= pow(0.8, tickClock.renderScale);
    cameraState.shakeX = random(-screenShake, screenShake) * zoom;
    cameraState.shakeY = random(-screenShake, screenShake) * zoom;
};
var updatePlayerAim = function() {
    var aim = screenToWorld(mouseX, mouseY);
    bodyAngle = atan2(aim.x - playerPos.x, -(aim.y - playerPos.y));
    if (keys[inputKeys.right] || keys[inputKeys.arrowRight] || keys[inputKeys.left] || keys[inputKeys.arrowLeft] || keys[inputKeys.down] || keys[inputKeys.arrowDown] || keys[inputKeys.up] || keys[inputKeys.arrowUp]) {
        walkSway = sin((tickClock.gameMs / tickClock.baseMs) * ((1 + 0.45 * keys[inputKeys.sprint]) * 10)) * 4;
    } else {
        walkSway = 0;
    }
};
var updatePlayerVitals = function() {
    if (playerHealth <= 0) {
        playerDie();
        return;
    }
    playerShield = constrain(playerShield, 0, playerMaxShield);
    playerHealth = constrain(playerHealth, 0, playerMaxHealth);
    playerShield = min(playerMaxShield, playerShield + playerShieldRegen * tickClock.scale);
    var regen = playerMaxShield <= 0 || playerShield >= playerMaxShield ? pHpRegenFull : pHpRegenLow;
    playerHealth = min(playerMaxHealth, playerHealth + regen * tickClock.scale);
};
/**GameMap Constructor**/
var GameMap = function(config) {
    //Set up some values
    this.baseColor = config.baseColor || color(255);
    this.onBackgroundRender = config.onBackgroundRender || function() {};
    this.zChangers = config.zChangers || [];
    this.width = config.width;
    this.height = config.height;
    //Add game objects
    this.objectsTemp = [].concat(config.objects);
    this.objects = {};
    this.rangeObjects = [];
    for (var i = 0; i < this.objectsTemp.length; i++) {
        //If they have a single zValue, push them to the array
        if (floor(this.objectsTemp[i].lowZ) === floor(this.objectsTemp[i].highZ)) {
            if (this.objects[floor(this.objectsTemp[i].lowZ)]) {
                //Add to existing layer
                this.objects[floor(this.objectsTemp[i].lowZ)].push(this.objectsTemp[i]);
            } else {
                //Create a new layer
                this.objects[floor(this.objectsTemp[i].lowZ)] = [this.objectsTemp[i]];
            }
        } else {
            //Push the object to rangeObjects, and add their index to the layering scheme
            this.rangeObjects.push(this.objectsTemp[i]);
            for (var j = floor(this.objectsTemp[i].lowZ); j <= floor(this.objectsTemp[i].highZ); j++) {
                if (this.objects[j]) {
                    //Add index to an existing layer
                    this.objects[j].push(this.rangeObjects.length - 1);
                } else {
                    //Create a new layer
                    this.objects[j] = [this.rangeObjects.length - 1];
                }
            }
        }
    }
    //Get the game map's z range
    if (config.bottomZ !== undefined && config.topZ !== undefined) {
        this.bottomZ = config.bottomZ;
        this.topZ = config.topZ;
    } else {
        this.bottomZ = 0;
        this.topZ = 0;
        for (var k = 0; k < this.objectsTemp.length; k++) {
            if (floor(this.objectsTemp[k].lowZ) < this.bottomZ) {
                this.bottomZ = floor(this.objectsTemp[k].lowZ);
            }
            if (floor(this.objectsTemp[k].highZ) > this.topZ) {
                this.topZ = floor(this.objectsTemp[k].highZ);
            }
        }
    }
    if (config.bottomZ !== undefined) {
        this.bottomZ = config.bottomZ;
    }
    if (config.topZ !== undefined) {
        this.topZ = config.topZ;
    }
    //Sort each layer by Z values
    for (var i = this.bottomZ; i <= this.topZ; i++) {
        if (this.objects[i]) {
            this.objects[i].sort(this.lowSort.bind(this));
        }
    }
    this.collisionLayers = {};
    this.collisionBuckets = {};
    this.liveCollisionLayers = {};
    this._collisionQueryId = 0;
    this.colBucket = colBucket;
    for (var layerKey in this.objects) {
        if (this.objects.hasOwnProperty(layerKey)) {
            this.collisionLayers[layerKey] = [];
            this.liveCollisionLayers[layerKey] = [];
            for (var objIndex = 0; objIndex < this.objects[layerKey].length; objIndex++) {
                var mapObj = this.objects[layerKey][objIndex];
                var mapObjCollisions = typeof mapObj === "number" ? this.rangeObjects[mapObj].collisions : mapObj.collisions;
                if (mapObjCollisions) {
                    for (var colIndex = 0; colIndex < mapObjCollisions.length; colIndex++) {
                        this.collisionLayers[layerKey].push(mapObjCollisions[colIndex]);
                    }
                }
            }
            var layerCols = this.collisionLayers[layerKey];
            var layerBuckets = {};
            for (var layerColIndex = 0; layerColIndex < layerCols.length; layerColIndex++) {
                var layerCol = layerCols[layerColIndex];
                if (!layerCol) {
                    continue;
                }
                if (layerCol.liveCollision) {
                    this.liveCollisionLayers[layerKey].push(layerCol);
                    continue;
                }
                var minCellX = floor(layerCol._minX / this.colBucket);
                var maxCellX = floor(layerCol._maxX / this.colBucket);
                var minCellY = floor(layerCol._minY / this.colBucket);
                var maxCellY = floor(layerCol._maxY / this.colBucket);
                for (var cellX = minCellX; cellX <= maxCellX; cellX++) {
                    for (var cellY = minCellY; cellY <= maxCellY; cellY++) {
                        var cellKey = cellX + "," + cellY;
                        if (!layerBuckets[cellKey]) {
                            layerBuckets[cellKey] = [];
                        }
                        layerBuckets[cellKey].push(layerCol);
                    }
                }
            }
            this.collisionBuckets[layerKey] = layerBuckets;
        }
    }
    //Setup positioning
    this.spawnPos = config.spawnPosition || new PVector();
    this.killZ = config.killZ !== undefined ? config.killZ : this.bottomZ - 1;
    this.offsetX = config.offsetX !== undefined ? config.offsetX : 0;
    this.offsetY = config.offsetY !== undefined ? config.offsetY : 0;
    this.offsetZ = config.offsetZ !== undefined ? config.offsetZ : 0;
    //Setup Entities
    this.entities = {};
    for (var i = min(this.bottomZ, this.killZ) - 2; i < this.topZ + 3; i++) {
        this.entities[i] = [];
    }
};
GameMap.prototype.lowSort = function(a, b) {
    var val1;
    var val2;
    //Determine if the object has a static Z value
    if (typeof a === "number") {
        //Get lowZ of ranged objects
        val1 = this.rangeObjects[a].lowZ;
    } else {
        //Get static Z
        val1 = a.lowZ;
    }
    if (typeof b === "number") {
        val2 = this.rangeObjects[b].lowZ;
    } else {
        val2 = b.lowZ;
    }
    //Return comparison
    return val1 - val2;
};
GameMap.prototype.getNearbyCollisions = function(layer, x, y, radius) {
    var layerBuckets = this.collisionBuckets ? this.collisionBuckets[layer] : null;
    var liveCols = this.liveCollisionLayers ? this.liveCollisionLayers[layer] : null;
    var queryRadius = radius || 0;
    var found;
    if (!layerBuckets) {
        found = this.collisionLayers ? this.collisionLayers[layer] ? this.collisionLayers[layer].slice() : null : null;
        if (!found) {
            return liveCols ? liveCols.slice() : null;
        }
        return found;
    }
    var minCellX = floor((x - queryRadius) / this.colBucket);
    var maxCellX = floor((x + queryRadius) / this.colBucket);
    var minCellY = floor((y - queryRadius) / this.colBucket);
    var maxCellY = floor((y + queryRadius) / this.colBucket);
    found = [];
    var queryId = ++this._collisionQueryId;
    for (var cellX = minCellX; cellX <= maxCellX; cellX++) {
        for (var cellY = minCellY; cellY <= maxCellY; cellY++) {
            var bucket = layerBuckets[cellX + "," + cellY];
            if (!bucket) {
                continue;
            }
            for (var bucketIndex = 0; bucketIndex < bucket.length; bucketIndex++) {
                var col = bucket[bucketIndex];
                if (col._lastBucketQueryId === queryId) {
                    continue;
                }
                col._lastBucketQueryId = queryId;
                found.push(col);
            }
        }
    }
    if (liveCols && liveCols.length) {
        for (var liveIndex = 0; liveIndex < liveCols.length; liveIndex++) {
            found.push(liveCols[liveIndex]);
        }
    }
    return found;
};
GameMap.prototype.update = function() {
    prepMap(this);
    performanceStats.targetCandidates = 0;
    performanceStats.sightSamples = 0;
    var updateStart = millis();
    for (var objectIndex = 0; objectIndex < this.objectsTemp.length; objectIndex++) {
        this.objectsTemp[objectIndex].update();
    }
    var pending = [];
    for (var layer = min(this.bottomZ, this.killZ) - 2; layer < this.topZ + 3; layer++) {
        var list = this.entities[layer];
        if (!list) {
            continue;
        }
        var count = list.length;
        for (var entityIndex = 0; entityIndex < count; entityIndex++) {
            pending.push({
                entity: list[entityIndex],
                layer: layer
            });
        }
    }
    for (var pendingIndex = 0; pendingIndex < pending.length; pendingIndex++) {
        var entry = pending[pendingIndex];
        var ent = entry.entity;
        ent._activeLayer = entry.layer;
        var result;
        try {
            result = ent.update();
        } finally {
            ent._activeLayer = undefined;
        }
        var sourceList = this.entities[entry.layer];
        var sourceIndex = sourceList.indexOf(ent);
        if (sourceIndex !== -1) {
            sourceList.splice(sourceIndex, 1);
        }
        if (result === "delete") {
            ent._perception = null;
            ent._sightCache = null;
            ent._friendlyCheck = null;
            if (ent.isMatchBot && matchState.gameMode === "Team Deathmatch") {
                matchState.botRespawns.push({
                    timer: deathRespawnAt,
                    team: ent.team,
                    skin: ent.skin,
                    walkSpeed: ent.walkSpeed,
                    wasPlayerSquad: ent.wasPlayerSquad || ent.inPlayerSquad,
                    inPlayerSquad: ent.wasPlayerSquad || ent.inPlayerSquad
                });
            }
            recycleProjectile(ent);
            continue;
        }
        var nextLayer = ent.pos ? floor(ent.pos.z) : entry.layer;
        if (!this.entities[nextLayer]) {
            this.entities[nextLayer] = [];
        }
        this.entities[nextLayer].push(ent);
    }
    updateBotRespawns();
    performanceStats.updateMs = millis() - updateStart;
};
var isMapObjectVisible = function(obj, layer) {
    if (mapFetch || !obj.collisions || !obj.collisions.length || !(obj instanceof Wall || obj instanceof Floor || obj instanceof Circle || obj instanceof Box) || obj.gapFill) {
        return true;
    }
    var layerScale = abs(1 - 0.1 * (playerPos.z - layer));
    if (layerScale < 0.01) {
        return true;
    }
    var halfWidth = width / (2 * max(0.001, zoom) * min(1, layerScale)) + 120 + screenShake;
    var halfHeight = height / (2 * max(0.001, zoom) * min(1, layerScale)) + 120 + screenShake;
    var cullRadius = max(halfWidth, halfHeight) * 1.15 / cameraState.pitch;
    halfWidth = cullRadius;
    halfHeight = cullRadius;
    for (var collisionIndex = 0; collisionIndex < obj.collisions.length; collisionIndex++) {
        var col = obj.collisions[collisionIndex];
        if (col._minX === undefined || (col._maxX >= camPos.x - halfWidth && col._minX <= camPos.x + halfWidth && col._maxY >= camPos.y - halfHeight && col._minY <= camPos.y + halfHeight)) {
            return true;
        }
    }
    performanceStats.culledObjects++;
    return false;
};
GameMap.prototype.render = function() {
    prepMap(this);
    var renderStart = millis();
    performanceStats.culledObjects = 0;
    background(this.baseColor);
    this.onBackgroundRender();
    //Render game
    pushMatrix();
    //Center the canvas
    translate(width / 2 + cameraState.shakeX, height / 2 + cameraState.shakeY);
    rotate(cameraState.roll);
    scale(zoom, zoom * cameraState.pitch);
    //Loop through Z layers
    //Previously the min and max used floor(playerPos.z), but this will never be below this.killZ and shouldn't get higher than this.topZ + 2
    for (var i = min(this.bottomZ, this.killZ); i < this.topZ + 2; i++) {
        if (!this.entities[i]) {
            this.entities[i] = [];
        }
        if (mapFetch) {
            if (this.objects[i]) {
                pushMatrix();
                translate(-camPos.x, -camPos.y);
                for (var j = 0; j < this.objects[i].length; j++) {
                    if (typeof this.objects[i][j] === "number") {
                        this.rangeObjects[this.objects[i][j]].render();
                    } else {
                        this.objects[i][j].render();
                    }
                }
                popMatrix();
            }
        } else {
            //Check if there is an array for this layer
            if (this.objects[i] || this.entities[i].length > 0) {
                pushMatrix();
                scale(1 - 0.1 * (playerPos.z - (i / constrain(abs(i), 0.0001, 1000)) * floor(abs(i))), 1 - 0.1 * (playerPos.z - (i / constrain(abs(i), 0.0001, 1000)) * floor(abs(i))));
                translate(-camPos.x, -camPos.y);
                //Loop through objects on the layer
                if (this.objects[i]) {
                    for (var j = 0; j < this.objects[i].length; j++) {
                        if (typeof this.objects[i][j] === "number") {
                            var temp = this.rangeObjects[this.objects[i][j]];
                            if (!isMapObjectVisible(temp, i)) {
                                continue;
                            }
                            if (temp.renderEveryLayer && i >= floor(temp.lowZ) && i <= floor(temp.highZ)) {
                                temp.render();
                            } else if (floor(temp.highZ) <= floor(playerPos.z) && i === floor(temp.highZ)) {
                                temp.render();
                            } else if (floor(temp.lowZ) > floor(playerPos.z) && i === floor(temp.lowZ)) {
                                temp.render();
                            } else if (i === floor(playerPos.z)) {
                                popMatrix();
                                pushMatrix();
                                translate(-camPos.x, -camPos.y);
                                temp.render();
                                popMatrix();
                                pushMatrix();
                                scale(1 - 0.1 * (playerPos.z - (i / constrain(abs(i), 0.0001, 1000)) * floor(abs(i))), 1 - 0.1 * (playerPos.z - (i / constrain(abs(i), 0.0001, 1000)) * floor(abs(i))));
                                translate(-camPos.x, -camPos.y);
                            }
                        } else {
                            if (isMapObjectVisible(this.objects[i][j], i)) {
                                this.objects[i][j].render();
                            }
                        }
                    }
                }
                //Loop through the entities
                for (var j = 0; j < this.entities[i].length; j++) {
                    if (this.entities[i][j].pos.z !== i) {
                        pushMatrix();
                        translate(camPos.x, camPos.y);
                        //Do I need to be using the absolute sign?
                        scale(1 + 0.1 * (this.entities[i][j].pos.z - (i / constrain(abs(i), 0.0001, 1000)) * floor(abs(i))), 1 + 0.1 * (this.entities[i]
                            [j].pos.z - (i / constrain(abs(i), 0.0001, 1000)) * floor(abs(i))));
                        translate(-camPos.x, -camPos.y);
                        this.entities[i][j].render();
                        popMatrix();
                    } else {
                        this.entities[i][j].render();
                    }
                }
                popMatrix();
            }
            //Render the player if it is their layer
            if (i === floor(playerPos.z)) {
                pushMatrix();
                translate(playerPos.x - camPos.x, playerPos.y - camPos.y);
                rotate(bodyAngle + walkSway);
                if (jetpackEquipped && getSelectedCharacterData().equipment) {
                    drawImg(loadedImages.jetpack_sprite, -50, -10, 100, 100);
                }
                drawPlayer(skin, 60, true);
                if (getHeldItem()) {
                    drawHeldItem(getHeldItem());
                } else {
                    renderBlaster(currentGun, skin, playerGunPose);
                }
                popMatrix();
            }
        }
    }
    drawPlacementPreview();
    popMatrix();
    performanceStats.renderMs = millis() - renderStart;
};
GameMap.prototype.playerCollide = function() {
    playerFloorHit = false;
    for (var j = floor(playerPos.z) - 2; j <= floor(playerPos.z) + 2; j++) {
        var layerCollisions = this.getNearbyCollisions ? this.getNearbyCollisions(j, playerPos.x, playerPos.y, hitboxSize + 4) : this.collisionLayers ? this.collisionLayers[j] : null;
        if (layerCollisions) {
            for (var l = 0; l < layerCollisions.length; l++) {
                if (layerCollisions[l].entityCollide(playerPos, playerVel, hitboxSize, 0) & 1) {
                    playerFloorHit = true;
                }
            }
        }
    }
};
GameMap.prototype.getMinimap = function() {
    pushMatrix();
    background(this.baseColor);
    translate(width / 2, height / 2);
    scale(width / this.width, height / this.height);
    translate(-this.offsetX, -this.offsetY);
    var previousMapFetch = mapFetch;
    mapFetch = true;
    try {
        for (var layer = min(this.bottomZ, this.killZ); layer < this.topZ + 2; layer++) {
            if (this.objects[layer]) {
                for (var objIndex = 0; objIndex < this.objects[layer].length; objIndex++) {
                    if (typeof this.objects[layer][objIndex] === "number") {
                        this.rangeObjects[this.objects[layer][objIndex]].render();
                    } else {
                        this.objects[layer][objIndex].render();
                    }
                }
            }
        }
        this.minimap = get();
    } finally {
        mapFetch = previousMapFetch;
        popMatrix();
    }
};
GameMap.prototype.drawMinimap = function() {
    image(this.minimap, 0, 0, width, height);
    return get(width / 2 + ((playerPos.x - this.offsetX) / this.width) * width - 75, height / 2 + ((playerPos.y - this.offsetY) / this.height) * height - 75, 150, 150);
};
/**GameMap Instances**/
var makeMapObjects = function(Constructor, rows, keys, defaults) {
    var out = [];
    for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        var config = defaults ? Object.create(defaults) : {};
        for (var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
            if (rows[rowIndex][keyIndex] !== undefined) {
                config[keys[keyIndex]] = rows[rowIndex][keyIndex];
            }
        }
        out.push(new Constructor(config));
    }
    return out;
};
var exampleMap = new GameMap({
    //Background Color
    baseColor: color(240, 230, 150),
    //Objects
    objects: [
        new Wall({
            x: 300,
            width: 200,
            rotation: 30
        }),
        new Circle({
            x: 450,
            y: 200,
            height: 200
        }),
        new Wall({
            x: -100,
            y: 200,
            height: 500,
            width: 200
        })
    ]
});
StarDestroyer = new GameMap({
    baseColor: color(2, 3, 12),
    spawnPosition: new PVector(0, 4800, 0),
    killZ: -4,
    width: 17000,
    height: 17000,
    offsetX: 0,
    offsetY: -300,
    onBackgroundRender: function() {
        pushStyle();
        rectMode(CORNER);
        noStroke();
        fill(0, 1, 6);
        rect(0, 0, width, height);
        for (var starIndex = 0; starIndex < 150; starIndex++) {
            var sx = (((starIndex * 997) % 601) / 601) * width;
            var sy = (((starIndex * 577) % 607) / 607) * height;
            var starGlow = 95 + ((starIndex * 37) % 95);
            var ss = 0.8 + (starIndex % 4) * 0.35;
            fill(starGlow, starGlow + 5, starGlow + 28, 135);
            ellipse(sx, sy, ss, ss);
            if (starIndex % 31 === 0) {
                fill(210, 220, 245, 70);
                ellipse(sx, sy, ss * 3.2, ss * 3.2);
                fill(235, 240, 255, 160);
                ellipse(sx, sy, ss * 1.35, ss * 1.35);
            }
        }
        popStyle();
    },
    objects: [
        new Floor({
            points: [0, -7200, -6900, 6400, 6900, 6400],
            zValue: 0.0001,
            color: color(45, 51, 61),
            fadeColor: color(45, 51, 61, 145)
        }),
        new Floor({
            points: [0, -6100, -5000, 5600, 5000, 5600],
            zValue: 0.0001,
            color: color(55, 61, 70, 210),
            fadeColor: color(55, 61, 70, 120)
        }),
        new Decoration({
            zValue: 0.0001,
            onRender: function() {
                pushStyle();
                noFill();
                strokeWeight(13);
                stroke(84, 92, 105, 180);
                triangle(0, -6950, -6500, 6150, 6500, 6150);
                strokeWeight(8);
                stroke(102, 111, 124, 150);
                line(0, -6800, 0, 6000);
                line(-5100, 5900, 0, -6800);
                line(5100, 5900, 0, -6800);
                line(-3800, 4700, 3800, 4700);
                line(-3100, 3100, 3100, 3100);
                line(-2350, 1500, 2350, 1500);
                line(-1500, -300, 1500, -300);
                line(-850, -2150, 850, -2150);
                stroke(16, 19, 26, 160);
                strokeWeight(46);
                line(-1200, -5450, 1200, -5450);
                line(-1700, -4650, 1700, -4650);
                stroke(120, 150, 190, 100);
                strokeWeight(12);
                line(-4700, 5350, 4700, 5350);
                line(-3900, 4150, 3900, 4150);
                line(-3000, 2400, 3000, 2400);
                stroke(45, 55, 70, 180);
                strokeWeight(80);
                line(-3300, 5000, -2100, 5000);
                line(2100, 5000, 3300, 5000);
                popStyle();
            }
        })
    ]
});
Jakku = new GameMap({
    baseColor: color(220, 180, 30),
    spawnPosition: new PVector(-200, -500, 3.5),
    killZ: -3,
    width: 5000,
    height: 5000,
    objects: [
        //Base
        new Decoration({
            onRender: function() {
                drawImg(loadedImages.Jakku_Sand, -2500, -2500, 5000, 5000);
            },
            zValue: 0.00001
        }),
        //new Floor ({width: 10000, height: 10000, zValue: 0.0001, color: color(255, 0), fadeColor: color(255, 0)}),
        //new Decoration ({onRender: function(){fill(255, 0, 0); ellipse(-100, -100, 50, 50);}, zValue: 0.5}),
        //new Sands ({zValue: 0.00001}),
        new Floor({
            x: -2225,
            width: 550,
            height: 5000,
            zValue: 0.0001,
            color: color(255, 0),
            fadeColor: color(255, 0)
        }),
        new Floor({
            x: 475,
            width: 4050,
            height: 5000,
            zValue: 0.0001,
            color: color(255, 0),
            fadeColor: color(255, 0)
        }),
        new Floor({
            x: -1750,
            width: 500,
            y: -2125,
            height: 750,
            zValue: 0.0001,
            color: color(255, 0),
            fadeColor: color(255, 0)
        }),
        new Floor({
            x: -1750,
            width: 500,
            y: 1500,
            height: 2000,
            zValue: 0.0001,
            color: color(255, 0),
            fadeColor: color(255, 0)
        }),
        //Small Platform
        new Floor({
            x: 300,
            y: 300,
            rotation: 30,
            color: color(150, 50, 0),
            fadeColor: color(150, 50, 0, 150),
            height: 500,
            width: 300,
            lowZ: 0.8,
            highZ: 1.1
        }),
        new Wall({
            x: 425,
            y: 230,
            rotation: 30,
            color: color(120, 25, 0),
            borderColor: color(100, 15, 0),
            width: 10,
            height: 500,
            blocksLasers: false,
            lowZ: 0.9,
            highZ: 1.2
        }),
        new Wall({
            x: 170,
            y: 80,
            rotation: 30,
            color: color(120, 25, 0),
            borderColor: color(100, 15, 0),
            width: 300,
            height: 10,
            blocksLasers: false,
            lowZ: 0.9,
            highZ: 1.2
        }),
        new Wall({
            x: 423,
            y: 515,
            rotation: 30,
            color: color(120, 25, 0),
            borderColor: color(100, 15, 0),
            width: 300,
            height: 10,
            blocksLasers: false,
            lowZ: 0.9,
            highZ: 1.2
        }),
        new Wall({
            x: 85,
            y: 220,
            rotation: 30,
            color: color(120, 25, 0),
            borderColor: color(100, 15, 0),
            width: 10,
            height: 150,
            blocksLasers: false,
            lowZ: 0.9,
            highZ: 1.2
        }),
        new Wall({
            x: 260,
            y: 520,
            rotation: 30,
            color: color(120, 25, 0),
            borderColor: color(100, 15, 0),
            width: 10,
            height: 150,
            blocksLasers: false,
            lowZ: 0.9,
            highZ: 1.2
        }),
        new Stairs({
            x: 140,
            y: 385,
            rotation: -60,
            width: [220, 200],
            railColor: color(120, 25, 0),
            color: color(140, 40, 0),
            railThickness: 8,
            zChange: [0, 1.5],
            lowZ: 0.5,
            highZ: 1.1,
            mode: "smooth"
        }),
        new JunkPile({
            x: 360,
            y: 450,
            lowZ: 0.3,
            highZ: 1.3,
            type: 4,
            rotation: 30
        }),
        new JunkPile({
            x: 300,
            y: 100,
            lowZ: 0.3,
            highZ: 1.3,
            type: 2,
            rotation: 200
        }),
        //new Stairs({x: -150, y: 385, rotation: 70, mode: "smooth", zChange: [0, 1], zValue: 0.5, height: 400}),
        //Ground Ramp
        new Decoration({
            x: -700,
            y: 0,
            lowZ: 0.1,
            highZ: 3,
            onRender: function() {
                noStroke();
                fill(230, 170, 45);
                beginShape();
                vertex(this.x + 150, this.y + 400);
                curveVertex(this.x + 135, this.y + 200);
                vertex(this.x + 150, this.y);
                curveVertex(this.x + 135, this.y - 300);
                vertex(this.x + 150, this.y - 600);
                vertex(this.x - 150, this.y - 600);
                curveVertex(this.x - 135, this.y - 300);
                vertex(this.x - 150, this.y);
                curveVertex(this.x - 195, this.y + 200);
                vertex(this.x - 150, this.y + 400);
                endShape();
                ellipse(this.x, this.y - 500, 375, 425);
                fill(200, 150, 15);
                beginShape();
                vertex(this.x + 100, this.y + 400);
                curveVertex(this.x + 90, this.y + 200);
                vertex(this.x + 100, this.y);
                curveVertex(this.x + 90, this.y - 200);
                vertex(this.x + 100, this.y - 400);
                vertex(this.x - 100, this.y - 400);
                curveVertex(this.x - 90, this.y - 200);
                vertex(this.x - 100, this.y);
                curveVertex(this.x - 130, this.y + 200);
                vertex(this.x - 100, this.y + 400);
                endShape();
                ellipse(this.x, this.y - 500, 250, 350);
                ellipse(this.x - 25, this.y + 200, 250, 75);
            },
            collisions: [
                new Collision({
                    x: -700,
                    y: -200,
                    lowZ: 0.1,
                    highZ: 1.1,
                    type: "rect",
                    height: 500,
                    width: 250
                }),
                new Collision({
                    x: -700,
                    y: -500,
                    height: 400,
                    width: 350,
                    type: "ellipse",
                    lowZ: 0.1,
                    highZ: 2.1
                })
            ]
        }),
        new Floor({
            x: -700,
            y: -500,
            width: 375,
            height: 425,
            ellipse: true,
            zValue: 3,
            color: color(255, 0),
            fadeColor: color(255, 0)
        }),
        //Bridge
        new Floor({
            x: -200,
            width: 800,
            y: -525,
            height: 200,
            color: color(140, 140, 130),
            fadeColor: color(140, 140, 130, 150),
            zValue: 3
        }),
        //Raised platform
        new SparkParticles2({
            x: 280,
            y: -765,
            rate: 170,
            color: color(150, 150, 200, 200),
            direction: 140,
            zValue: 3.05
        }),
        new Floor({
            points: [200, -625, 200, -425, 450, -350, 450, -1100],
            color: color(150, 50, 0),
            fadeColor: color(150, 50, 0, 150),
            zValue: 3.05
        }),
        new Floor({
            x: 675,
            width: 452,
            y: -600,
            height: 500,
            color: color(150, 50, 0),
            fadeColor: color(150, 50, 0, 150),
            zValue: 3.05
        }),
        //new Wall({x: 450, y: -850, height: 500, lowZ: 3.2, highZ: 5.2, borderColor: color(1, 1, 1, 0), color: color(1, 1, 1, 0)}),
        //new Wall({x: 450, y: -400, height: 100, lowZ: 3.2, highZ: 5.2, borderColor: color(1, 1, 1, 0), color: color(1, 1, 1, 0)}),
        new Wall({
            x: 900,
            y: -600,
            color: color(120, 25, 0),
            borderColor: color(100, 15, 0),
            width: 20,
            height: 500,
            blocksLasers: false,
            zValue: 3.1
        }),
        new Wall({
            x: 692,
            y: -360,
            color: color(120, 25, 0),
            borderColor: color(100, 15, 0),
            width: 435,
            height: 20,
            blocksLasers: false,
            zValue: 3.1
        }),
        new Wall({
            x: 545,
            y: -840,
            color: color(120, 25, 0),
            borderColor: color(100, 15, 0),
            width: 135,
            height: 20,
            blocksLasers: false,
            zValue: 3.1
        }),
        new Decoration({
            zValue: 3,
            onRender: function() {
                //Hanging / Broken metal
                strokeWeight(10);
                stroke(120, 25, 0);
                fill(120, 25, 0);
                //Main platform
                line(290, -800, 260, -850);
                line(245, -700, 200, -710);
                line(200, -625, 190, -650);
                line(350, -900, 360, -975);
                line(190, -630, 420, -1050);
                line(620, -850, 610, -875);
                line(680, -850, 670, -875);
                line(740, -850, 730, -875);
                line(800, -850, 790, -875);
                line(475, -875, 790, -875);
                //Pit bay bridges
                line(-2070, 440, -2060, 410);
                line(-1900, 440, -2060, 410);
                line(-2070, 240, -2020, 270);
                line(-1910, 240, -1950, 260);
                line(-1930, 240, -2090, 275);
                arc(-2260, -525, 80, 180, 240, 550);
                line(-2100, -1750, -2070, -1770);
                line(-2070, -1770, -1900, -1775);
                line(-1900, -1775, -1900, -1750);
                line(-1980, -1750, -1950, -1780);
                line(-2030, -1790, -2020, -1750);
            }
        }),
        new SparkParticles2({
            x: 850,
            y: -850,
            direction: 90,
            zValue: 3.05
        }),
        //Hallway
        new Floor({
            x: -1045,
            y: -525,
            width: 450,
            height: 200,
            color: color(140, 140, 130),
            fadeColor: color(140, 140, 130, 150),
            zValue: 3
        }),
        //new Floor({x: -1120, y: -875, width: 250, height: 700, color: color(140, 140, 130), fadeColor: color(140, 140, 130, 150), zValue: 1.1}),
        new Wall({
            x: -1120,
            y: -875,
            width: 250,
            height: 700,
            color: color(140, 140, 130),
            zValue: 0.5,
            borderColor: color(255, 0)
        }),
        new Stairs({
            x: -1120,
            y: -825,
            width: [200, 210],
            height: 400,
            zChange: [1, 3],
            mode: "smooth",
            railColor: color(130, 130, 140),
            railThickness: 8,
            lowZ: 1.2,
            highZ: 3.2,
            rotation: 180
        }),
        new Stairs({
            x: -930,
            y: -1125,
            width: [200, 210],
            height: 90,
            mode: "smooth",
            railColor: color(130, 130, 140),
            railThickness: 8,
            zChange: [0, 1],
            zValue: 0.5,
            rotation: 90
        }),
        //new BlastDoor({rotation: 90, zValue: 1.1, x: -1000, y: -1125, speed: 1}),
        //new BlastDoor({rotation: 90, zValue: 3.3, x: -1000, y: -525, speed: 2}),
        new Wall({
            x: -1250,
            y: -525,
            height: 200,
            lowZ: 1.2,
            highZ: 2.2,
            borderColor: color(255, 0)
        }),
        new Wall({
            x: -975,
            y: -525,
            height: 200,
            lowZ: 0.2,
            highZ: 2.2,
            borderColor: color(255, 0)
        }),
        //If this project was not created by Lemon and CoderGuy, or spun off from the original, it is plagiarism
        //Pit Bay and Bridges
        new Wall({
            color: color(150, 50, 0),
            borderColor: color(100, 50, 0),
            zValue: 0.5,
            x: -1370,
            width: 250,
            height: 2500,
            y: -750
        }),
        new Wall({
            color: color(150, 50, 0),
            borderColor: color(100, 15, 0),
            zValue: 0.5,
            x: -2125,
            width: 250,
            height: 2500,
            y: -750
        }),
        new Wall({
            color: color(150, 50, 0),
            borderColor: color(100, 15, 0),
            zValue: 0.5,
            x: -1747.5,
            width: 1004,
            height: 250,
            y: 625
        }),
        new Wall({
            color: color(150, 50, 0),
            borderColor: color(100, 15, 0),
            zValue: 0.5,
            x: -1747.5,
            width: 502,
            height: 250,
            y: -1875
        }),
        new Floor({
            color: color(130, 40, 0),
            fadeColor: color(130, 40, 0, 150),
            x: -1760,
            y: -525,
            height: 200,
            width: 1000,
            zValue: 3.05
        }),
        new Floor({
            color: color(130, 40, 0),
            fadeColor: color(130, 40, 0, 150),
            x: -2000,
            y: -750,
            width: 200,
            height: 2000,
            zValue: 3.05
        }),
        //new SparkParticles2({zValue: 3, x: -2000, y: -1750, direction: 9}),
        new SparkParticles2({
            x: -2000,
            y: -1750,
            direction: 90,
            zValue: 3
        }),
        //Rails
        //Previously had lowZ 0.4 highZ 1.2
        new Wall({
            x: -1500,
            y: -625,
            color: color(120, 25, 0),
            borderColor: color(100, 15, 0),
            width: 30,
            height: 2250,
            blocksLasers: false,
            zValue: 1.2
        }),
        new Wall({
            x: -2000,
            y: -625,
            color: color(120, 25, 0),
            borderColor: color(100, 15, 0),
            width: 30,
            height: 2250,
            blocksLasers: false,
            zValue: 1.2
        }),
        new Wall({
            x: -1750,
            y: 500,
            color: color(120, 25, 0),
            borderColor: color(100, 15, 0),
            width: 525,
            height: 30,
            blocksLasers: false,
            zValue: 1.2
        }),
        new Wall({
            x: -1750,
            y: -1750,
            color: color(120, 25, 0),
            borderColor: color(100, 15, 0),
            width: 525,
            height: 30,
            blocksLasers: false,
            zValue: 1.2
        }),
        new Wall({
            x: -1750,
            y: -2000,
            color: color(120, 25, 0),
            borderColor: color(100, 15, 0),
            width: 1025,
            height: 30,
            blocksLasers: false,
            zValue: 1.2
        }),
        new Wall({
            x: -2250,
            y: -625,
            color: color(120, 25, 0),
            borderColor: color(100, 15, 0),
            width: 30,
            height: 2750,
            blocksLasers: false,
            zValue: 1.2
        }),
        new Wall({
            x: -1750,
            y: 750,
            color: color(120, 25, 0),
            borderColor: color(100, 15, 0),
            width: 1025,
            height: 30,
            blocksLasers: false,
            zValue: 1.2
        }),
        new Wall({
            x: -1250,
            y: 150,
            color: color(120, 25, 0),
            borderColor: color(100, 15, 0),
            width: 30,
            height: 1200,
            blocksLasers: false,
            zValue: 1.2
        }),
        //Rail posts
        new Decoration({
            zValue: 0.9,
            onRender: function() {
                var scale = -0.1 * (floor(playerPos.z) - 0.5);
                noStroke();
                fill(120, 25, 0);
                for (var railIter = 500; railIter >= -1750; railIter -= 150) {
                    ellipse(-2000, railIter, 30, 30);
                    ellipse(-2000 + (-2000 - camPos.x) / 15, railIter + (railIter - camPos.y) / 15, 45, 45);
                    ellipse(-1500, railIter, 30, 30);
                    ellipse(-1500 + (-1500 - camPos.x) / 15, railIter + (railIter - camPos.y) / 15, 45, 45);
                    ellipse(-2250, railIter, 30, 30);
                    ellipse(-2250 + (-2250 - camPos.x) / 15, railIter + (railIter - camPos.y) / 15, 45, 45);
                    if (railIter > -400) {
                        ellipse(-1250, railIter, 30, 30);
                        ellipse(-1250 + (-1250 - camPos.x) / 15, railIter + (railIter - camPos.y) / 15, 45, 45);
                    }
                }
                for (railIter = -2250; railIter < -1250; railIter += 150) {
                    ellipse(railIter, 750, 30, 30);
                    ellipse(railIter, -2000, 30, 30);
                }
                ellipse(-2250, -1900, 30, 30);
                ellipse(-2250, 650, 30, 30);
                ellipse(-1250, 650, 30, 30);
                ellipse(-1850, 500, 30, 30);
                ellipse(-1650, 500, 30, 30);
                ellipse(-1850, -1750, 30, 30);
                ellipse(-1650, -1750, 30, 30);
            }
        }),
        //Pit
        new CrashedTIE({
            zValue: -2.4,
            type: "ln",
            x: -1750,
            y: -750,
            rotation: -90
        }),
        new JunkPile({
            x: -1850,
            y: -1250,
            zValue: -2.4
        }),
        new JunkPile({
            x: -1700,
            y: -1600,
            zValue: -2.4
        }),
        new JunkPile({
            x: -1900,
            y: 400,
            zValue: -2.4
        }),
        new JunkPile({
            x: -1650,
            y: 150,
            zValue: -2.4
        }),
        //Raised Platforms
        new Stairs({
            zChange: [0, 2.2],
            rotation: 180,
            lowZ: 0.6,
            highZ: 1.6,
            width: [700, 680],
            height: 120,
            y: 782,
            x: -300
        }),
        new Wall({
            lowZ: 0.4,
            highZ: 1.4,
            width: 2400,
            height: 1200,
            y: 1460,
            x: -1100
        }),
        new Decoration({
            zValue: 1.5,
            onRender: function() {
                drawImg(loadedImages.Jakku_Platform_Sand, -2300, 860, 2400, 1200);
            }
        }),
        new Stairs({
            zChange: [2, 4],
            rotation: 90,
            height: 300,
            width: [200, 210],
            x: -1500,
            y: 1000,
            lowZ: 2.6,
            highZ: 3.6,
            color: color(120),
            railColor: color(150),
            stepHeight: 15
        }),
        new Stairs({
            zChange: [2, 4],
            rotation: 90,
            height: 300,
            width: [200, 210],
            x: -1500,
            y: 1920,
            lowZ: 2.6,
            highZ: 3.6,
            color: color(120),
            railColor: color(150),
            stepHeight: 15
        }),
        //-1650  -2300
        new Floor({
            width: 650,
            height: 1200,
            y: 1460,
            x: -1975,
            zValue: 4,
            color: color(120, 110, 130),
            fadeColor: color(120, 110, 130, 120)
        }),
        new Floor({
            color: color(130, 40, 0),
            fadeColor: color(130, 40, 0, 150),
            zValue: 3.05,
            points: [-2120, 860, -1880, 860, -1900, 440, -2100, 440]
        }),
        new SparkParticles2({
            zValue: 3,
            y: 440,
            x: -2000,
            direction: 90
        }),
        new Wall({
            x: -1975,
            width: 650,
            y: 2060,
            zValue: 4.5
        }),
        new Wall({
            x: -2300,
            height: 1200,
            y: 1460,
            zValue: 4.5
        }),
        //Graveyard
        new AT_AT({
            x: 150,
            y: -1750,
            zValue: 0.5,
            imgName: "AT_AT_Sand"
        }),
        new CrashedTIE({
            x: 1500,
            y: 500,
            zValue: 0.5,
            rotation: -30,
            type: "sf"
        }),
        new FireParticles({
            x: 1550,
            y: 400,
            zValue: 0.7
        }),
        new FireParticles({
            x: 1800,
            y: 700,
            zValue: 0.7
        }),
        new Decoration({
            x: 1560,
            y: 370,
            rotation: -30,
            zValue: 0.3,
            onRender: function() {
                pushMatrix();
                translate(this.x, this.y);
                rotate(this.rotation);
                stroke(190, 150, 60);
                strokeWeight(5);
                fill(255, 0);
                arc(0, 0, 400, 1500, 180, 270);
                arc(400, 0, 400, 1500, 180, 270);
                arc(0, 0, 230, 100, 0, 180);
                arc(20, -150, 230, 100, 0, 180);
                arc(40, -300, 230, 100, 0, 180);
                arc(60, -450, 230, 100, 0, 180);
                popMatrix();
            }
        }),
        new CrashedTIE({
            type: "ln",
            x: 1800,
            y: -1900,
            zValue: 0.5,
            rotation: 45
        }),
        new CrashedXwing({
            x: 1100,
            y: 1700,
            zValue: 0.5,
            rotation: 45
        }),
        new CrashedXwing({
            x: 1300,
            y: -700,
            zValue: 0.5,
            rotation: 260,
            color: color(0, 0, 200)
        }),
        //Junk
        new JunkPile({
            zValue: 1.6,
            x: -1000,
            y: 1000,
            type: 4
        }),
        new JunkPile({
            zValue: 1.6,
            x: -70,
            y: 1700,
            type: 3,
            rotation: 110
        }),
        new JunkPile({
            zValue: 1.6,
            x: -550,
            y: 1900,
            type: 5
        }),
        new JunkPile({
            zValue: 1.6,
            x: -2000,
            y: 1300,
            type: 1
        }),
        new JunkPile({
            zValue: 1.6,
            x: -1500,
            y: 1500,
            type: 2
        }),
        new JunkPile({
            zValue: 4.3,
            x: -1800,
            y: 1650
        }),
        new JunkPile({
            zValue: 4.3,
            x: -2050,
            y: 1250,
            type: 2
        }),
        new JunkPile({
            zValue: 4.3,
            x: -2100,
            y: 1900,
            type: 4
        })
    ].concat(layerObj({
        y: -725,
        height: 750,
        x: 450,
        borderColor: color(150, 150, 160)
    }, 0.5, 2.5)).concat(layerObj({
        x: 450,
        y: -850,
        height: 500,
        borderColor: color(150, 150, 160)
    }, 3.2, 5.2)).concat(layerObj({
        x: 450,
        y: -400,
        height: 100,
        borderColor: color(150, 150, 160)
    }, 3.2, 5.2)).concat(layerObj({
        x: -975,
        y: -825,
        height: 400,
        borderColor: color(150, 150, 160)
    }, 0.2, 5.2)).concat(layerObj({
        x: -1250,
        y: -825,
        height: 400,
        borderColor: color(150, 150, 160)
    }, 0.2, 5.2)).concat(layerObj({
        x: -1045,
        y: -425,
        width: 450,
        borderColor: color(150, 150, 160)
    }, 0.2, 5.2)).concat(layerObj({
        x: -1120,
        y: -1862.5,
        width: 250,
        height: 1275,
        borderColor: color(150, 150, 160)
    }, 0.2, 5.2)).concat(layerObj({
        x: -2100,
        y: -675,
        height: 2400,
        width: 200,
        borderColor: color(120, 120, 130),
        color: color(120, 120, 130)
    }, -2.2, 0.2)).concat(layerObj({
        x: -1400,
        y: -675,
        height: 2400,
        width: 200,
        borderColor: color(120, 120, 130),
        color: color(120, 120, 130)
    }, -2.2, 0.2)).concat(layerObj({
        x: -1750,
        y: -1850,
        height: 200,
        width: 750,
        borderColor: color(120, 120, 130),
        color: color(120, 120, 130)
    }, -2.2, 0.2)).concat(layerObj({
        x: -1750,
        y: 600,
        height: 200,
        width: 750,
        borderColor: color(120, 120, 130),
        color: color(120, 120, 130)
    }, -2.2, 0.2)).concat(layerObj({
        rotation: 90,
        x: -1000,
        y: -1125,
        speed: 1,
        thickness: 25,
        distZ: [0, 3.1]
    }, 1.1, 3.1, "BlastDoor")).concat(layerObj({
        rotation: 90,
        x: -1000,
        y: -525,
        speed: 2,
        thickness: 25,
        distZ: [2.3, 5.3]
    }, 3.3, 5.3, "BlastDoor")),
    zChangers: [
        new zChanger({
                x: -700,
                y: -50,
                type: "rect",
                width: 300,
                height: 900,
                lowZ: 0,
                highZ: 3
            }, "smooth",
            [0, 3]),
        new zChanger({
                x: -2000,
                y: 650,
                type: "rect",
                width: 220,
                height: 420,
                lowZ: 3,
                highZ: 4,
                rotation: 180
            }, "smooth",
            [3, 4])
    ]
});
Kashyyyk = new GameMap({
    //Background Color
    baseColor: lerpColor(color(60, 40, 25), color(30, 70, 40), 0.3),
    spawnPosition: new PVector(300, 2365, 0),
    killZ: -2,
    width: 5400,
    height: 5400,
    offsetX: 300,
    offsetY: 300,
    //spawnPosition: new PVector(130, -165, 0),
    //Objects
    objects: [
        new Floor({
            x: 300,
            y: 300,
            width: 5400,
            height: 5400,
            zValue: 0.0001,
            color: color(255, 0),
            fadeColor: color(255, 0)
        }),
        new KashyyykFloor({})
    ].concat(makeMapObjects(Tree,
        [
            [-454, 1120, 327, 3],
            [1577, 449, 494, 3],
            [-782, 1426, 381, 3],
            [867, 920, 450, 3],
            [-1082, -504, 236, 3],
            [-1008, 283, 253, 3],
            [351, 1002, 489, 3],
            [-874, -1008, 302, 3],
            [-1170, -782, 270, 3],
            [-1150, 1467, 255, 3],
            [88, -847, 333, 3],
            [-575, 818, 330, 1],
            [-1160, 1706, 264, 3],
            [653, -1127, 368, 3],
            [724, 327, 201, 3],
            [-299, 810, 306, 3],
            [-232, -397, 299, 3],
            [-1045, 1234, 305, 3],
            [1305, 633, 321, 3],
            [1119, 834, 235, 3],
            [1638, -975, 206, 3],
            [-164, 584, 200, 3],
            [-891, 1737, 325, 3],
            [-313, 1453, 335, 3],
            [-721, 1161, 406, 3],
            [-856, -700, 274, 3],
            [-529, 1485, 404, 3],
            [-598, 194, 338, 3],
            [-351, -226, 255, 3],
            [-990, 763, 461, 3],
            [-1055, -174, 221, 3],
            [-713, -308, 418, 3],
            [42, -486, 391, 3],
            [704, 1281, 393, 3],
            [407, -899, 428, 3],
            [820, 522, 256, 3],
            [973, 1257, 255, 3],
            [1178, -1139, 412, 3],
            [-1090, 479, 256, 3],
            [-743, -17, 353, 3],
            [644, 666, 428, 3],
            [950, 1544, 438, 3],
            [-213, -654, 362, 3],
            [-318, -1065, 442, 3],
            [-482, 509, 476, 3],
            [-562, -602, 319, 3],
            [-35, 368, 400, 3],
            [1155, 1089, 317, 3],
            [-919, 1012, 225, 3],
            [-208, 48, 351, 3]
        ],
        ["x", "y", "width", "zValue"], {
            zValue: 3
        })).concat(makeMapObjects(Wall,
        [
            [300, 5400 / 2 + 325, 5400, 50, color(0), undefined, undefined],
            [300, -5400 / 2 + 275, 5400, 50, color(0), undefined, undefined],
            [5400 / 2 + 325, 300, 50, 5400 + 100, color(0), undefined, undefined],
            [-5400 / 2 + 275, 300, 50, 5400 + 100, color(0), undefined, undefined],
            [115, 1525, 210, 30, color(15), color(15), 0.1],
            [485, 1525, 210, 30, color(15), color(15), 0.1],
            [25, 1675, 30, 281, color(15), color(15), 0.1],
            [575, 1675, 30, 281, color(15), color(15), 0.1],
            [300 - 500, 1830, 800, 30, color(15), color(15), 0.1],
            [300 + 500, 1830, 800, 30, color(15), color(15), 0.1],
            [300 - 900, 1830 + 400, 30, 830, color(15), color(15), 0.1],
            [300 + 900, 1830 + 400, 30, 830, color(15), color(15), 0.1],
            [300, 1830 + 800, 1800, 30, color(15), color(15), 0.1],
            [115, 1525, 210, 30, color(20), color(20), 1],
            [485, 1525, 210, 30, color(20), color(20), 1],
            [25, 1675, 30, 281, color(20), color(20), 1],
            [575, 1675, 30, 281, color(20), color(20), 1],
            [300 - 500, 1830, 800, 30, color(20), color(20), 1],
            [300 + 500, 1830, 800, 30, color(20), color(20), 1],
            [300 - 900, 1830 + 400, 30, 830, color(20), color(20), 1],
            [300 + 900, 1830 + 400, 30, 830, color(20), color(20), 1],
            [300, 1830 + 800, 1800, 30, color(20), color(20), 1],
            [115, 1525, 210, 30, color(25), color(25), 2],
            [485, 1525, 210, 30, color(25), color(25), 2],
            [25, 1675, 30, 281, color(25), color(25), 2],
            [575, 1675, 30, 281, color(25), color(25), 2],
            [300 - 500, 1830, 800, 30, color(25), color(25), 2],
            [300 + 500, 1830, 800, 30, color(25), color(25), 2],
            [300 - 900, 1830 + 400, 30, 830, color(25), color(25), 2],
            [300 + 900, 1830 + 400, 30, 830, color(25), color(25), 2],
            [300, 1830 + 800, 1800, 30, color(25), color(25), 2]
        ],
        ["x", "y", "width", "height", "color", "borderColor", "zValue"])).concat([
        //Shop Desk
        new Wall({
            x: 300 + 650,
            y: 1830 + 569,
            width: 80,
            height: 430,
            color: color(22),
            borderColor: color(22),
            zValue: 0.1
        })
        //Shop NPC
        //Doors
    ]).concat(makeMapObjects(BlastDoor,
        [
            [0, 1525, 0.7, 30],
            [1.999, 1525, 0.7, 30],
            [0.999, 1525, 0.7, 30],
            [2.999, 1525, 0.7, 30],
            [0, 1837, 0.5, 16],
            [0, 1822, 0.5, 16],
            [0.999, 1822, 0.5, 16],
            [0.999, 1837, 0.5, 16],
            [1.999, 1822, 0.5, 16],
            [1.999, 1837, 0.5, 16],
            [2.999, 1822, 0.5, 16],
            [2.999, 1837, 0.5, 16]
        ],
        ["zValue", "y", "speed", "thickness"], {
            rotation: 0,
            x: 300,
            color: color(56, 56, 56),
            dzm: false
        })).concat([
        new Wall({
            x: 300,
            y: 1525,
            width: 300,
            height: 30,
            color: color(25),
            borderColor: color(25),
            zValue: 2.999
        }),
        new Wall({
            x: 300,
            y: 1830,
            width: 300,
            height: 30,
            color: color(25),
            borderColor: color(25),
            zValue: 2.999
        }),
        new Floor({
            x: 300 + 80,
            y: 2223 + 5,
            width: 1830 - 160,
            height: 830,
            color: color(25),
            zValue: 3,
            fadeColor: color(0, 1)
        }),
        new Floor({
            x: 300,
            y: 1677,
            width: 575,
            height: 335,
            color: color(25),
            zValue: 3,
            fadeColor: color(0, 1)
        })
    ]).concat(makeMapObjects(Stairs,
        [
            [2100, [0, 0.5]],
            [2160, [0.5, 1]],
            [2220, [1, 1.5]],
            [2280, [1.5, 2]],
            [2340, [2, 2.5]],
            [2400, [2.5, 3]],
            [2460, [3, 3.5]],
            [2520, [3.5, 4]],
            [2580, [4, 4.5]]
        ],
        ["y", "zChange"], {
            x: -510,
            rotation: 180,
            width: [130, 130],
            railColor: color(128, 128, 128),
            color: color(135, 135, 135),
            railThickness: 8,
            zValue: 0,
            lowZ: 0.5,
            highZ: 1.1,
            mode: "smooth",
            rails: false
        })).concat([
        new Box({
            x: 420,
            y: -782,
            size: 70
        }),
        new CommandPost({
            x: 300,
            y: 2365,
            zValue: 0,
            controlState: "capturing"
        }),
        new AT_AT({
            x: 2428,
            y: 1162
        })
        //new Decoration ({onRender: function(){blaster(127, 1766, 68, 40);}, zValue: 0.00001}),
        //new sparkParticles({x: 200, y: 200, direction: 68})
    ])
});
/**Create Blasters**/
Blaster = function(config) {
    this.weaponId = config.weaponId || "F_11D";
    this.displayName = config.displayName || this.weaponId.replace(/_/g, "-");
    this.spriteId = config.spriteId || this.weaponId;
    this.laserSpeed = config.laserSpeed;
    this.damage = config.damage;
    this.laserRender = config.laserRender;
    this.fireRate = config.fireRate;
    this.shotTime = 0;
    this.shotsAllowed = config.shotsAllowed;
    this.shots = 0;
    this.reloadSpeed = config.reloadSpeed;
    this.reloadTime = 0;
    this.renderFunc = config.renderFunc;
    this.maxDist = config.maxDist;
    this.accuracy = config.accuracy;
    this.auto = config.auto !== undefined ? config.auto : false;
    this.renderZoom = config.renderZoom;
    this.scopeFov = config.scopeFov;
};
Blaster.prototype.tick = function() {
    if (this.shotTime > 0) {
        this.shotTime = max(0, this.shotTime - tickClock.scale);
    }
    if (this.reloadTime > 0) {
        this.reloadTime = max(0, this.reloadTime - tickClock.scale);
        //When reload finishes, reset shots
        if (this.reloadTime === 0) {
            this.shots = 0;
        }
    }
};
Blaster.prototype.tryReload = function() {
    if (this.reloadTime > 0) {
        return false;
    }
    if (this.shots <= 0 || this.shots >= this.shotsAllowed) {
        return false;
    }
    this.reloadTime = this.reloadSpeed;
    return true;
};
Blaster.prototype.update = function() {
    var firingPose = canAcceptGameplayInput() && (mouseIsPressed || mouseClick);
    if (currentGun && currentGun.isLightsaber) {
        playerGunPose = 1;
    } else {
        var reloading = currentGun && currentGun.reloadTime > 0;
        var poseScreen = worldToScreen(playerPos.x, playerPos.y);
        playerGunPose = lerp(playerGunPose, reloading ? 0 : firingPose ? 1 : dist(mouseX, mouseY, poseScreen.x, poseScreen.y) < 170 ? 0 : 1, constrain((firingPose ? 0.32 : 0.18) * tickClock.scale, 0, 1));
    }
    if (canAcceptGameplayInput() && (mouseClick || (mouseIsPressed && this.auto))) {
        this.shoot(playerPos, bodyAngle - 90 + walkSway);
    }
    this.tick();
};
Blaster.prototype.render = function() {
    this.renderFunc();
};
Blaster.prototype.shootFrom = function(pos, rot, owner, overrides) {
    if (!pos) {
        return false;
    }
    var cfg = overrides || {};
    var damage = this.damage;
    var laserSpeed = this.laserSpeed;
    var accuracy = this.accuracy;
    var maxDist = this.maxDist;
    var fireRate = this.fireRate;
    if (cfg.damage !== undefined) {
        damage = cfg.damage;
    }
    if (cfg.laserSpeed !== undefined) {
        laserSpeed = cfg.laserSpeed;
    }
    if (cfg.accuracy !== undefined) {
        accuracy = cfg.accuracy;
    }
    if (cfg.maxDist !== undefined) {
        maxDist = cfg.maxDist;
    }
    if (cfg.fireRate !== undefined) {
        fireRate = cfg.fireRate;
    }
    //Only allow shooting if not reloading and fire cooldown is done
    if (this.reloadTime === 0 && this.shotTime === 0) {
        var layer = constrain(floor(pos.z), currentMap.killZ, currentMap.topZ + 1);
        if (!currentMap.entities[layer]) {
            currentMap.entities[layer] = [];
        }
        //Fire the laser
        var laserConfig = {
            x: pos.x,
            y: pos.y,
            z: pos.z,
            xVel: cos(rot + random(-accuracy, accuracy)) * laserSpeed,
            yVel: sin(rot + random(-accuracy, accuracy)) * laserSpeed,
            damage: damage,
            renderFunc: this.laserRender,
            maxDist: maxDist,
            owner: owner || null
        };
        currentMap.entities[layer].push(getPooledLaser(laserConfig));
        playSound_("blaster", constrain(map(dist(pos.x, pos.y, playerPos.x, playerPos.y), 0, 1200, 0.7, 0), 0, 0.7) / 3);
        //Increment shot count and set fire cooldown
        if (owner && owner.isPlayer) {
            cameraState.recoil = min(1.5, cameraState.recoil + 0.45);
        }
        this.shotTime = fireRate;
        this.shots++;
        //Check if we've reached max shots for the magazine
        if (this.shots >= this.shotsAllowed) {
            //Start reload
            this.reloadTime = this.reloadSpeed;
            this.shots = this.shotsAllowed;
            //Don't reset shots yet - keep them at max until
            //reload finishes
        }
        return true;
    }
    return false;
};
Blaster.prototype.shoot = function(pos, rot) {
    return this.shootFrom(pos, rot, {
        isPlayer: true,
        team: playerTeam
    }, null);
};
F_11D = new Blaster({
    weaponId: "F_11D",
    fireRate: 10,
    shotsAllowed: 30,
    reloadSpeed: 120,
    laserSpeed: 50,
    damage: 10,
    maxDist: 300,
    accuracy: 5, //degrees
    laserRender: function(laser) {
        var t = laser.deathTime;
        if (!laser.dead) {
            var coreColor = color(255, 255, 255, 255);
            var glowColor = color(252, 58, 58, 80);
            var innerColor = color(255, 207, 207, 180);
            var tail = laser.getTailPoint();
            var lx = tail.x;
            var ly = tail.y;
            strokeWeight(14);
            stroke(glowColor);
            line(laser.pos.x, laser.pos.y, lx, ly);
            strokeWeight(8);
            stroke(innerColor);
            line(laser.pos.x, laser.pos.y, lx, ly);
            strokeWeight(4);
            stroke(coreColor);
            line(laser.pos.x, laser.pos.y, lx, ly);
            noStroke();
            fill(255, 0, 0, 30);
            ellipse(laser.pos.x + laser.vel.x * 0.3, laser.pos.y + laser.vel.y * 0.3, 10, 10);
            return;
        }
        var prog = t / 3;
        var fade = 1 - prog / 2;
        var Size = 1 + prog * 50;
        noStroke();
        fill(255, 50, 50, 120 * fade);
        ellipse(laser.pos.x, laser.pos.y, Size, Size);
        fill(255, 200, 200, 200 * fade);
        ellipse(laser.pos.x, laser.pos.y, Size * 0.5, Size * 0.5);
        fill(255, 255, 255, 255 * fade);
        ellipse(laser.pos.x, laser.pos.y, Size * 0.2, Size * 0.2);
        var tailLen = 5;
        strokeWeight(4 * fade);
        stroke(255, 120, 120, 255 * fade);
        line(laser.pos.x, laser.pos.y, laser.pos.x - laser.vel.x * tailLen, laser.pos.y - laser.vel.y * tailLen);
    },
    renderFunc: function() { drawAsset("weapon_F_11D", 0, 0); }
});
Sniper = function(x, y, s) {
    pushMatrix();
    translate(x, y);
    translate(0, -10);
    scale(s / 100);
    noStroke();
    fill(10);
    rect(95, 5, 59, 10, 5);
    rect(145, 3, 10, 14, 5, 0, 0, 5);
    rect(63, 0, 28, 10, 23);
    fill(128, 128, 128);
    rect(0, 2.5, 100, 15, 5);
    fill(10);
    rect(118, 7, 62, 5, 5);
    rect(4, 5, 15, 10, 0, 5, 5, 0);
    rect(9, 6, 78, 8, 5);
    rect(70, 5, 25, 10, 5, 0, 0, 5);
    popMatrix();
};
var sniperSprite = Sniper;
Sniper = new Blaster({
    weaponId: "Sniper",
    fireRate: 38,
    shotsAllowed: 6,
    reloadSpeed: 78,
    laserSpeed: 140,
    damage: 50,
    maxDist: 1250,
    accuracy: 0.3,
    auto: false,
    renderZoom: 0.25,
    scopeFov: 0.7,
    laserRender: F_11D.laserRender,
    renderFunc: function() { drawAsset("weapon_Sniper", 0, 0); }
});
E11 = new Blaster({
    weaponId: "E11",
    displayName: "E-11",
    spriteId: "F_11D",
    fireRate: 10,
    shotsAllowed: 30,
    reloadSpeed: 120,
    laserSpeed: 50,
    damage: 10,
    maxDist: 300,
    accuracy: 5, //degrees
    laserRender: function(laser) {
        var t = laser.deathTime;
        if (!laser.dead) {
            var coreColor = color(255, 255, 255, 255);
            var glowColor = color(252, 58, 58, 80);
            var innerColor = color(255, 207, 207, 180);
            var tail = laser.getTailPoint();
            var lx = tail.x;
            var ly = tail.y;
            strokeWeight(14);
            stroke(glowColor);
            line(laser.pos.x, laser.pos.y, lx, ly);
            strokeWeight(8);
            stroke(innerColor);
            line(laser.pos.x, laser.pos.y, lx, ly);
            strokeWeight(4);
            stroke(coreColor);
            line(laser.pos.x, laser.pos.y, lx, ly);
            noStroke();
            fill(255, 0, 0, 30);
            ellipse(laser.pos.x + laser.vel.x * 0.3, laser.pos.y + laser.vel.y * 0.3, 10, 10);
            return;
        }
        var prog = t / 3;
        var fade = 1 - prog / 2;
        var Size = 1 + prog * 50;
        noStroke();
        fill(255, 50, 50, 120 * fade);
        ellipse(laser.pos.x, laser.pos.y, Size, Size);
        fill(255, 200, 200, 200 * fade);
        ellipse(laser.pos.x, laser.pos.y, Size * 0.5, Size * 0.5);
        fill(255, 255, 255, 255 * fade);
        ellipse(laser.pos.x, laser.pos.y, Size * 0.2, Size * 0.2);
        var tailLen = 5;
        strokeWeight(4 * fade);
        stroke(255, 120, 120, 255 * fade);
        line(laser.pos.x, laser.pos.y, laser.pos.x - laser.vel.x * tailLen, laser.pos.y - laser.vel.y * tailLen);
    },
    renderFunc: function() { drawAsset("weapon_E11", 0, 0); }
});
Lightsaber = function(config) {
    config = config || {};
    this.isLightsaber = true;
    this.displayName = "Lightsaber";
    this.spriteId = "lightsaber";
    this.damage = config.damage !== undefined ? config.damage : 14;
    this.range = config.range !== undefined ? config.range : 185;
    this.arc = config.arc !== undefined ? config.arc : 118;
    this.accuracy = 0;
    this.shotsAllowed = 1;
    this.shots = 0;
    this.reloadTime = 0;
    this.reloadSpeed = 18;
    this.shotTime = 0;
    this.fireRate = config.fireRate !== undefined ? config.fireRate : 22;
    this.saberAngle = 0;
    this.swing = -40;
    this.clicked = false;
    this.halfWay = false;
    this.randomNumber = 0;
    this.wasMousePressed = false;
    this.swingDidDamage = false;
    this.spinAngle = 0;
    this.spinVelocity = 0;
    this.aimVelocity = 0;
    this.hitSweep = 0;
    this.on = true;
    this.bladeLength = 1;
};
Lightsaber.prototype.getSpinHumVolume = function() {
    return constrain(0.24 + (abs(this.spinVelocity) / 34) * 1.5, 0, 1.75);
};
Lightsaber.prototype.tick = function() {
    this.bladeLength += ((this.on ? 1 : 0) - this.bladeLength) * (1 - pow(0.8, tickClock.scale));
    if (this.shotTime > 0) {
        this.shotTime = max(0, this.shotTime - tickClock.scale);
    }
    if (!this.clicked) {
        this.swing += (-40 - this.swing) * 0.25;
    } else if (this.randomNumber === 0) {
        if (this.halfWay === false) {
            this.swing += 7 * tickClock.scale;
        } else {
            this.swing -= 7 * tickClock.scale;
        }
        if (this.swing <= -40 && this.halfWay) {
            this.halfWay = false;
            this.clicked = false;
            this.swing = -40;
            this.randomNumber = floor(random(0, 3));
        }
        if (this.swing >= 100 && !this.halfWay) {
            this.halfWay = true;
        }
    } else if (this.randomNumber === 1) {
        this.swing += 10 * tickClock.scale;
        if (this.swing >= 320) {
            this.halfWay = false;
            this.clicked = false;
            this.swing = -40;
            this.randomNumber = floor(random(0, 3));
        }
    } else {
        this.swing -= 10 * tickClock.scale;
        if (this.swing <= -400) {
            this.halfWay = false;
            this.clicked = false;
            this.swing = -40;
            this.randomNumber = floor(random(0, 3));
        }
    }
};
Lightsaber.prototype.update = function() {
    playerGunPose = 1;
    var diff = bodyAngle - this.saberAngle;
    diff = atan2(sin(diff), cos(diff));
    this.aimVelocity = abs(diff);
    this.saberAngle += diff * 0.2;
    if (this.on && mouseIsPressed) {
        this.clicked = true;
        this.spinVelocity += (34 - this.spinVelocity) * 0.18;
        this.spinAngle = (this.spinAngle + this.spinVelocity * tickClock.scale) % 360;
        this.hitSweep = (this.hitSweep + this.spinVelocity * tickClock.scale) % 360;
        this.wasMousePressed = true;
        if (this.shotTime <= 0) {
            this.swingDidDamage = false;
            this.shotTime = this.fireRate;
        }
    } else if (this.on && mouseClick && !this.wasMousePressed && this.shotTime <= 0) {
        this.clicked = true;
        this.halfWay = false;
        this.swingDidDamage = false;
        this.randomNumber = floor(random(0, 3));
        this.wasMousePressed = true;
        this.shotTime = this.fireRate;
    } else if (!mouseIsPressed) {
        this.wasMousePressed = false;
        this.spinVelocity *= pow(0.72, tickClock.scale);
        this.spinAngle = (this.spinAngle + this.spinVelocity * tickClock.scale) % 360;
        if (abs(this.spinVelocity) < 0.15) {
            this.spinVelocity = 0;
            this.spinAngle += (0 - this.spinAngle) * 0.18;
        }
    }
    if (this.on && this.clicked && !this.swingDidDamage) {
        var attackAngle = (bodyAngle - 90 + this.swing * 0.35 + this.hitSweep) % 360;
        if (attackAngle < 0) {
            attackAngle += 360;
        }
        for (var z = currentMap.killZ; z < currentMap.topZ + 2; z++) {
            var list = currentMap.entities[z];
            if (!list) {
                continue;
            }
            for (var e = 0; e < list.length; e++) {
                var ent = list[e];
                if (!ent || !ent.isMatchBot || ent.team === playerTeam || ent.health <= 0 || abs(ent.pos.z - playerPos.z) > 1.4) {
                    continue;
                }
                var dx = ent.pos.x - playerPos.x;
                var dy = ent.pos.y - playerPos.y;
                var d = sqrt(dx * dx + dy * dy);
                var targetRot = atan2(dy, dx) % 360;
                if (targetRot < 0) {
                    targetRot += 360;
                }
                var saberHitDiff = (targetRot - attackAngle) % 360;
                if (saberHitDiff > 180) {
                    saberHitDiff -= 360;
                }
                if (saberHitDiff < -180) {
                    saberHitDiff += 360;
                }
                if (d <= this.range + (ent.colSize || hitboxSize) && abs(saberHitDiff) <= this.arc / 2) {
                    var beforeHealth = ent.health;
                    var beforeShield = ent.shield || 0;
                    applyDamage(ent, this.damage);
                    if (ent.vel && d > 0.001) {
                        var shove = 1.35;
                        ent.vel.x += (dx / d) * shove;
                        ent.vel.y += (dy / d) * shove;
                        ent.vel.z = max(ent.vel.z || 0, 0.025);
                    }
                    var done = max(0, beforeHealth + beforeShield - ((ent.health || 0) + (ent.shield || 0)));
                    if (done > 0) {
                        ent.playerCreditDamage = (ent.playerCreditDamage || 0) + done;
                        ent.playerCreditDamageMax = max(1,
                            (ent.maxHealth || 100) + (ent.maxShield || 0));
                    }
                    if (beforeHealth > 0 && ent.health <= 0 && !ent.creditPaid) {
                        if (!ent.tdmScorePaid) {
                            awardTDMKill(playerTeam, ent.team);
                            ent.tdmScorePaid = true;
                        }
                        var damagePercent = constrain(ent.playerCreditDamage / max(1, ent.playerCreditDamageMax || (ent.maxHealth || 100) + (ent.maxShield || 0)), 0, 1);
                        var killBaseCredits = (floor(random(18, 31)) + matchState.playerKills * 5) * 5;
                        var earnedCredits = max(1, floor(killBaseCredits * damagePercent));
                        matchState.playerKills++;
                        ent.creditPaid = true;
                        addCreditChange(earnedCredits, ent.pos.x, ent.pos.y - 82);
                    }
                    screenShake = max(screenShake, 3);
                }
            }
        }
        this.swingDidDamage = true;
        if (mouseIsPressed && this.on) {
            this.swingDidDamage = false;
        }
    }
    this.tick();
};
Lightsaber.prototype.tryReload = function() {
    return false;
};
Lightsaber.prototype.render = function(skinName) {
    pushMatrix();
    translate(27, -28);
    rotate(this.swing + this.spinAngle);
    lightsaber(0, 0, 180, 0, skinName === "Kylo Ren" ? "Kylo Ren" : "Luke Skywalker", this.on, this.bladeLength);
    var hand = getHandColors(skinName);
    fill(hand.fill);
    stroke(hand.stroke);
    strokeWeight(3);
    ellipse(5, 8, 17, 17);
    ellipse(5, 23, 17, 17);
    popMatrix();
};
/**Create Abilities**/
var Ability = function(config) {
    this.rechargeTime = config.rechargeTime !== undefined ? config.rechargeTime : 0;
    this.rechargeCount = 0;
    this.duration = config.duration !== undefined ? config.duration : 0;
    this.durationCount = 0;
    this.canDeactivate = config.canDeactivate !== undefined ? config.canDeactivate : false;
    this.onActivate = config.onActivate || function() {};
    this.onDeactivate = config.onDeactivate || function() {};
    this.whileActive = config.whileActive || function() {};
    this.onRender = config.onRender || function() {};
    this.activatorKey = config.activatorKey !== undefined ? config.activatorKey : 0;
    this.pressed = false;
    this.maxUses = config.maxUses;
    this.remainingUses = config.remainingUses !== undefined ? config.remainingUses : this.maxUses;
    this.sprite = null;
};
Ability.prototype.update = function() {
    var tick = tickClock.scale;
    var down = canAcceptGameplayInput() && !!(keys[this.activatorKey] || gameInput.pressed[this.activatorKey]);
    if (this.heldItem) {
        down = canAcceptGameplayInput() && getHeldItem() === this && mouseClick === true && !inventoryState.uiConsumed && !squadCommandMode && tickClock.gameMs >= inventoryState.readyAt;
        if (this.durationCount > 0 && (!canAcceptGameplayInput() || getHeldItem() !== this || squadCommandMode)) {
            this.durationCount = 0;
            this.rechargeCount = this.rechargeTime;
            if (this.itemName !== "Medkit" && this.maxUses !== undefined) {
                this.remainingUses = min(this.maxUses, this.remainingUses + 1);
            }
        }
    }
    var pressed = down && !this.pressed;
    this.pressed = down;
    this.rechargeCount = max(0, this.rechargeCount - tick);
    if (this.durationCount > 0) {
        this.whileActive();
        this.durationCount = max(0, this.durationCount - tick);
        if (pressed && this.canDeactivate) {
            this.durationCount = 0;
        }
        if (this.durationCount === 0) {
            this.onDeactivate();
            this.rechargeCount = this.rechargeTime;
            if (this.heldItem && getHeldItem() === this) {
                returnToWeapon();
            }
        }
        return;
    }
    if (pressed && this.rechargeCount === 0 && (this.maxUses === undefined || this.remainingUses > 0) && (!this.canUse || this.canUse())) {
        this.onActivate();
        if (this.maxUses !== undefined) {
            this.remainingUses = max(0, this.remainingUses - 1);
        }
        this.durationCount = this.duration;
        if (this.durationCount <= 0) {
            this.onDeactivate();
            this.rechargeCount = this.rechargeTime;
            if (this.heldItem && getHeldItem() === this) {
                returnToWeapon();
            }
        }
    }
};
Ability.prototype.render = function(x, y) {
    fill(0, 100);
    noStroke();
    strokeWeight(3);
    ellipse(x, y, 40, 40);
    if (this.sprite !== null) {
        drawImg(loadedImages[this.sprite], x - 15, y - 15, 30, 30);
    }
    noStroke();
    if (this.durationCount > 0) {
        fill(255, 100);
        arc(x, y, 40, 40, -90, 360 * (this.durationCount / this.duration) - 90);
    } else if (this.rechargeCount > 0) {
        fill(220, 0, 0, 200);
        arc(x, y, 40, 40, -90, 360 * (this.rechargeCount / this.rechargeTime) - 90);
    }
    if (this.maxUses !== undefined) {
        textAlign(CENTER, CENTER);
        textSize(12);
        fill(0, 100);
        rect(x + 30, y, 19, 19, 3);
        fill(this.remainingUses > 0 ? 255 : color(255, 120, 120));
        text(this.remainingUses, x + 30, y);
    }
};
var testing = new Ability({
    rechargeTime: 100,
    duration: 100,
    //onActivate: function(){println("Activating!");}, onDeactivate: function(){println("Deactivating!");}, whileActive: function(){println("Active");}, activatorKey: 81});
    activatorKey: 81
});
var Medkit = function(config) {
    Ability.call(this, config);
    this.rechargeTime = config.rechargeTime !== undefined ? config.rechargeTime : 500;
    this.duration = config.duration !== undefined ? config.duration : 90;
    this.heldItem = true;
    this.itemName = "Medkit";
    this.maxUses = config.maxUses !== undefined ? config.maxUses : 2;
    this.remainingUses = config.remainingUses !== undefined ? config.remainingUses : this.maxUses;
    this.canUse = function() {
        return playerHealth < playerMaxHealth;
    };
    this.onActivate = config.onActivate || function() {};
    this.whileActive = config.whileActive || function() {
        playerHealth = min(playerMaxHealth, playerHealth + 30 * min(tickClock.scale, this.durationCount) / this.duration);
    };
    this.onDeactivate = config.onDeactivate || function() {};
    this.activatorKey = config.activatorKey !== undefined ? config.activatorKey : inputKeys.medkit;
    this.sprite = "medkit_1";
};
Medkit.prototype = Object.create(Ability.prototype);
var throwDetonator = function() {
    var layer = floor(playerPos.z);
    var throwAim = screenToWorld(mouseX, mouseY);
    var throwPower = constrain(dist(throwAim.x, throwAim.y, playerPos.x, playerPos.y) * defaultZoom, 0, 420) / 10;
    var detConfig = {
        x: playerPos.x,
        y: playerPos.y,
        z: playerPos.z + 1,
        xVel: cos(bodyAngle - 90) * throwPower,
        yVel: sin(bodyAngle - 90) * throwPower,
        zVel: 0.1,
        r: random(-4, 4),
        owner: {
            isPlayer: true,
            team: playerTeam
        }
    };
    if (!currentMap.entities[layer]) {
        currentMap.entities[layer] = [];
    }
    currentMap.entities[layer].push(getPooledDetonator(detConfig));
}; //Spawns detonator
var ThrowDetonator = function(config) {
    Ability.call(this, config);
    this.rechargeTime = config.rechargeTime !== undefined ? config.rechargeTime : 179;
    this.duration = config.duration !== undefined ? config.duration : 15;
    this.heldItem = true;
    this.itemName = "Grenade";
    this.maxUses = config.maxUses !== undefined ? config.maxUses : 2;
    this.remainingUses = config.remainingUses !== undefined ? config.remainingUses : this.maxUses;
    this.onActivate = config.onActivate || function() {};
    this.onDeactivate = config.onDeactivate || function() {
        throwDetonator();
    };
    this.activatorKey = config.activatorKey !== undefined ? config.activatorKey : inputKeys.detonator;
    //a little something I thought I'd add
    this.sprite = "thermal_detonator";
}; //Defines detonator
ThrowDetonator.prototype = Object.create(Ability.prototype);
var emitJetpackParticles = function(count) {
    var layer = constrain(floor(playerPos.z), currentMap.killZ, currentMap.topZ + 1);
    if (!currentMap.entities[layer]) {
        currentMap.entities[layer] = [];
    }
    for (var n = 0; n < count; n++) {
        var ang = random(0, 360);
        var sp = random(0.6, 2.0);
        currentMap.entities[layer].push(new JetParticle({
            x: playerPos.x + random(-6, 6),
            y: playerPos.y + random(-6, 6),
            z: playerPos.z + 0.02 + random(-0.05, 0.05),
            xVel: cos(ang) * sp * 3,
            yVel: sin(ang) * sp * 3,
            zVel: -random(0.02, 0.09) + random(-0.01, 0.01),
            s: random(20, 34),
            life: 20 + round(random(0, 18)),
            col: color(255, random(120, 210), 40, 205)
        }));
    }
};
var Jetpack = function(config) {
    Ability.call(this, config);
    this.duration = config.duration !== undefined ? config.duration : 100;
    this.durationCount = config.durationCount !== undefined ? config.durationCount : this.duration;
    this.activatorKey = config.activatorKey !== undefined ? config.activatorKey : inputKeys.jump;
    this.whileActive = config.whileActive || function() {
        this.particleClock = (this.particleClock || 0) + 3 * tickClock.scale;
        var particleCount = floor(this.particleClock);
        this.particleClock -= particleCount;
        emitJetpackParticles(particleCount);
        var ceilingRoom = currentMap.topZ + flyCeilExtra - playerPos.z;
        if (ceilingRoom > 0.01) {
            var liftScale = constrain(ceilingRoom / flyCeilSoft, 0.18, 1);
            if (playerVel.z < 0.05 * liftScale + 0.008) {
                playerVel.z += 0.01 * liftScale * tickClock.scale;
            }
        } else if (playerVel.z > 0.012) {
            playerVel.z *= 0.55;
        }
        this.durationCount = max(0, this.durationCount - 0.4 * tickClock.scale);
    };
    this.sprite = "jetpack_icon";
};
Jetpack.prototype = Object.create(Ability.prototype);
Jetpack.prototype.update = function() {
    this.durationCount = min(this.duration, this.durationCount + 0.1 * tickClock.scale);
    if (canAcceptGameplayInput() && (keys[this.activatorKey] || gameInput.pressed[this.activatorKey]) && this.durationCount > 0) {
        this.whileActive();
    }
};
var PlantLandmine = function(placement) {
    var layer = floor(playerPos.z);
    var mine = new Landmine({
        x: placement ? placement.x : playerPos.x,
        y: placement ? placement.y : playerPos.y,
        z: placement ? placement.z + 0.05 : playerPos.z + 1,
        xVel: 0,
        yVel: 0,
        zVel: 0,
        r: random(-0.2, 0.2),
        owner: {
            isPlayer: true,
            team: playerTeam
        }
    });
    if (!currentMap.entities[layer]) {
        currentMap.entities[layer] = [];
    }
    currentMap.entities[layer].push(mine);
};
var isItemPlacementValid = function(spot, item) {
    if (!spot || !currentMap || abs(playerPos.z - spot.z) > 0.16 || abs(playerVel.z) > 0.015 || dist(playerPos.x, playerPos.y, spot.x, spot.y) > 190) {
        return false;
    }
    var radius = item.itemName === "Crate" ? 38 : 18;
    if (dist(playerPos.x, playerPos.y, spot.x, spot.y) < radius + hitboxSize + 8 || (currentMap.placedCrates && currentMap.placedCrates.length >= 20 && item.itemName === "Crate")) {
        return false;
    }
    var cols = currentMap.getNearbyCollisions(floor(spot.z), spot.x, spot.y, radius + 2) || [];
    var offsets = [
        [0, 0],
        [-radius, -radius],
        [radius, -radius],
        [-radius, radius],
        [radius, radius]
    ];
    for (var pointIndex = 0; pointIndex < offsets.length; pointIndex++) {
        var x = spot.x + offsets[pointIndex][0];
        var y = spot.y + offsets[pointIndex][1];
        var supported = false;
        for (var colIndex = 0; colIndex < cols.length; colIndex++) {
            if (cols[colIndex].plane && cols[colIndex].checkCollision(x, y, spot.z)) {
                supported = true;
                break;
            }
        }
        if (!supported || solidAt(x, y, spot.z + 0.35, 5)) {
            return false;
        }
    }
    var nearbyActors = currentMap.entities[floor(spot.z)] || [];
    for (var actorIndex = 0; actorIndex < nearbyActors.length; actorIndex++) {
        var actor = nearbyActors[actorIndex];
        if (actor.isMatchBot && actor.health > 0 && actor.pos && dist(actor.pos.x, actor.pos.y, spot.x, spot.y) < radius + (actor.colSize || hitboxSize)) {
            return false;
        }
        if (actor instanceof Landmine && actor.pos && dist(actor.pos.x, actor.pos.y, spot.x, spot.y) < radius + 22) {
            return false;
        }
    }
    return true;
};
var getItemPlacement = function(item) {
    var aim = screenToWorld(mouseX, mouseY);
    var angle = atan2(aim.y - playerPos.y, aim.x - playerPos.x);
    var reach = constrain(dist(aim.x, aim.y, playerPos.x, playerPos.y), 100, 155);
    var spot = {
        x: round((playerPos.x + cos(angle) * reach) / 20) * 20,
        y: round((playerPos.y + sin(angle) * reach) / 20) * 20,
        z: floor(playerPos.z),
        valid: false
    };
    spot.valid = isItemPlacementValid(spot, item);
    return spot;
};
var addPlacedCrate = function(spot) {
    var crate = new Box({
        x: spot.x,
        y: spot.y,
        size: 70,
        lowZ: spot.z,
        highZ: spot.z + 0.8
    });
    var layer = floor(spot.z);
    if (!currentMap.objects[layer]) {
        currentMap.objects[layer] = [];
    }
    if (!currentMap.collisionLayers[layer]) {
        currentMap.collisionLayers[layer] = [];
    }
    if (!currentMap.liveCollisionLayers[layer]) {
        currentMap.liveCollisionLayers[layer] = [];
    }
    currentMap.objects[layer].push(crate);
    for (var colIndex = 0; colIndex < crate.collisions.length; colIndex++) {
        crate.collisions[colIndex]._placedCrate = true;
        currentMap.collisionLayers[layer].push(crate.collisions[colIndex]);
        currentMap.liveCollisionLayers[layer].push(crate.collisions[colIndex]);
    }
    if (!currentMap.placedCrates) {
        currentMap.placedCrates = [];
    }
    currentMap.placedCrates.push(crate);
    currentMap.minimap = null;
};
removePlacedCrates = function(map) {
    if (!map || !map.placedCrates) {
        return;
    }
    for (var layer in map.objects) {
        if (map.objects.hasOwnProperty(layer)) {
            map.objects[layer] = map.objects[layer].filter(function(obj) {
                return map.placedCrates.indexOf(obj) < 0;
            });
            if (map.collisionLayers[layer]) {
                map.collisionLayers[layer] = map.collisionLayers[layer].filter(function(col) {
                    return !col._placedCrate;
                });
            }
            if (map.liveCollisionLayers[layer]) {
                map.liveCollisionLayers[layer] = map.liveCollisionLayers[layer].filter(function(col) {
                    return !col._placedCrate;
                });
            }
        }
    }
    map.placedCrates = [];
    map.minimap = null;
};
var PlaceCrate = function(config) {
    Ability.call(this, config);
    this.heldItem = true;
    this.itemName = "Crate";
    this.placeable = true;
    this.duration = 24;
    this.rechargeTime = 30;
    this.maxUses = config.maxUses !== undefined ? config.maxUses : 3;
    this.remainingUses = this.maxUses;
    this.canUse = function() {
        return getItemPlacement(this).valid;
    };
    this.onActivate = function() {
        this.placement = getItemPlacement(this);
    };
    this.onDeactivate = function() {
        if (isItemPlacementValid(this.placement, this)) {
            addPlacedCrate(this.placement);
        } else {
            this.remainingUses++;
        }
    };
};
PlaceCrate.prototype = Object.create(Ability.prototype);
var PlaceLandmine = function(config) {
    Ability.call(this, config);
    this.rechargeTime = config.rechargeTime !== undefined ? config.rechargeTime : 150;
    this.duration = 18;
    this.heldItem = true;
    this.itemName = "Mine";
    this.placeable = true;
    this.maxUses = config.maxUses !== undefined ? config.maxUses : 2;
    this.remainingUses = config.remainingUses !== undefined ? config.remainingUses : this.maxUses;
    this.canUse = function() {
        return getItemPlacement(this).valid;
    };
    this.onActivate = function() {
        this.placement = getItemPlacement(this);
    };
    this.onDeactivate = function() {
        if (isItemPlacementValid(this.placement, this)) {
            PlantLandmine(this.placement);
        } else {
            this.remainingUses++;
        }
    };
    this.activatorKey = config.activatorKey !== undefined ? config.activatorKey : inputKeys.landmine;
    this.sprite = "blue_landmine_sprite";
};
PlaceLandmine.prototype = Object.create(Ability.prototype);
/**Character and Save Data**/
currentGun = new Lightsaber({});
playerMaxHealth = 85;
playerHealth = playerMaxHealth;
characterData = {
    //Bought strings use 0 for unbought, 1 for bought, 2 for selected
    Assault: {
        level: 1,
        guns: [deepCopy(F_11D)],
        gunsBought: "2",
        abilities: [new Medkit({}), new ThrowDetonator({}), new PlaceLandmine({}), new PlaceCrate({})],
        equipment: new Jetpack({}),
        abilitiesBought: "2222",
        skins: [
            ["Clone Trooper"],
            [""],
            ["Rebel Trooper"],
            ["Shoretrooper"],
            [""],
            ["First Order Stormtrooper"]
        ],
        skinsBought: ["2", "2", "2", "2", "2", "2"]
    },
    Specialist: {
        level: 1,
        guns: [Sniper],
        gunsBought: "2",
        abilities: [new Medkit({}), new ThrowDetonator({}), new PlaceLandmine({}), new PlaceCrate({})],
        equipment: new Jetpack({}),
        abilitiesBought: "2222",
        skins: [
            ["First Order Stormtrooper"],
            [""],
            ["Rebel Trooper"],
            [""],
            [""],
            ["Shoretrooper"]
        ],
        skinsBought: ["2", "2", "2", "2", "2", "2"]
    },
    Heavy: {
        level: 1,
        guns: [deepCopy(F_11D)],
        gunsBought: "2",
        abilities: [new Medkit({
            maxUses: 3
        }), new ThrowDetonator({}), new PlaceLandmine({}), new PlaceCrate({
            maxUses: 4
        })],
        equipment: null,
        abilitiesBought: "2222",
        skins: [
            [""],
            [""],
            [""],
            ["Heavy Shoretrooper"],
            [""],
            [""]
        ],
        skinsBought: ["2", "2", "2", "2", "2", "2"]
    },
    Jedi: {
        level: 1,
        guns: [new Lightsaber({})],
        gunsBought: "2",
        abilities: [new Medkit({}), new ThrowDetonator({
            maxUses: 1
        }), new PlaceLandmine({}), new PlaceCrate({})],
        equipment: new Jetpack({}),
        abilitiesBought: "2222",
        skins: [
            ["Kylo Ren"],
            [""],
            [""],
            [""],
            [""],
            ["Luke Skywalker"]
        ],
        skinsBought: ["2", "2", "2", "2", "2", "2"]
    }
};
getHeldItem = function() {
    var data = getSelectedCharacterData();
    return inventoryState.selected > 0 ? data.abilities[inventoryState.selected - 1] || null : null;
};
var hotbarTop = function() {
    return height / 2 - 190;
};
var selectHeldItem = function(slot) {
    if (slot < 0 || slot > getSelectedCharacterData().abilities.length) {
        return;
    }
    if (inventoryState.selected === 0 && slot !== 0) {
        inventoryState.lastWeapon = currentGun;
    }
    inventoryState.selected = slot;
    inventoryState.readyAt = tickClock.gameMs + 180;
    inventoryState.suppressClick = !!mouseIsPressed;
    if (slot !== 0) {
        stopSaberAudio();
    }
};
returnToWeapon = function() {
    if (inventoryState.lastWeapon) {
        currentGun = inventoryState.lastWeapon;
    }
    inventoryState.selected = 0;
    inventoryState.suppressClick = true;
    inventoryState.uiConsumed = true;
};
var handleInventoryInput = function() {
    if (!mouseIsPressed && mouseClick !== true) {
        inventoryState.suppressClick = false;
    }
    inventoryState.uiConsumed = !!inventoryState.suppressClick;
    var data = getSelectedCharacterData();
    if (gameInput.pressed[inputKeys.cosmetics]) {
        inventoryState.cosmeticsOpen = !inventoryState.cosmeticsOpen;
    }
    for (var slot = 0; slot <= data.abilities.length; slot++) {
        if (gameInput.pressed[49 + slot]) {
            selectHeldItem(slot);
        }
    }
    for (var itemIndex = 0; itemIndex < data.abilities.length; itemIndex++) {
        if (gameInput.pressed[data.abilities[itemIndex].activatorKey]) {
            selectHeldItem(itemIndex + 1);
        }
    }
    var overBar = mouseX >= width - 94 && mouseX <= width - 6 && mouseY >= hotbarTop() - 8 && mouseY <= hotbarTop() + 390;
    var overGear = inventoryState.cosmeticsOpen && abs(mouseX - width / 2) <= 110 && abs(mouseY - height / 2) <= 74;
    inventoryState.uiConsumed = inventoryState.uiConsumed || overBar || overGear;
    if (mouseClick === true && (overBar || overGear)) {
        if (overGear && abs(mouseX - width / 2) <= 94 && abs(mouseY - height / 2 - 8) <= 18 && data.equipment) {
            jetpackEquipped = !jetpackEquipped;
        } else if (overBar && mouseY < hotbarTop() + 350) {
            selectHeldItem(constrain(floor((mouseY - hotbarTop()) / 70), 0, data.abilities.length));
        } else if (overBar) {
            inventoryState.cosmeticsOpen = !inventoryState.cosmeticsOpen;
        }
        inventoryState.suppressClick = true;
        mouseClick = null;
    }
};
var drawItemIcon = function(item, x, y, size) {
    if (item && item.sprite && loadedImages[item.sprite]) {
        drawImg(loadedImages[item.sprite], x - size / 2, y - size / 2, size, size);
    } else if (item && item.itemName === "Crate") {
        drawAsset("prop_Crate", x, y, size * 0.8 / 200);
    }
};
drawHeldItem = function(item) {
    var useProgress = item.durationCount > 0 ? 1 - item.durationCount / item.duration : 0;
    pushMatrix();
    pushStyle();
    translate(0, -43 - sin(useProgress * 180) * 9);
    var itemSize = item.itemName === "Crate" ? 40 : 30;
    drawItemIcon(item, 0, 0, itemSize);
    var hand = getHandColors(skin);
    stroke(hand.stroke);
    strokeWeight(3);
    fill(hand.fill);
    ellipse(-itemSize * 0.48, 6, 17, 17);
    ellipse(itemSize * 0.48, 6, 17, 17);
    popStyle();
    popMatrix();
};
drawPlacementPreview = function() {
    var item = getHeldItem();
    if (!item || !item.placeable || !canAcceptGameplayInput() || squadCommandMode) {
        return;
    }
    var spot = item.durationCount > 0 ? item.placement : getItemPlacement(item);
    if (!spot) {
        return;
    }
    var valid = isItemPlacementValid(spot, item);
    pushMatrix();
    translate(spot.x - camPos.x, spot.y - camPos.y);
    rectMode(CENTER);
    stroke(valid ? color(100, 240, 175, 230) : color(255, 85, 75, 230));
    fill(valid ? color(50, 200, 130, 65) : color(255, 60, 50, 65));
    strokeWeight(3 / zoom);
    var span = item.itemName === "Crate" ? 70 : 34;
    rect(0, 0, span, span, 4);
    line(-span / 2, -span / 2, span / 2, span / 2);
    line(span / 2, -span / 2, -span / 2, span / 2);
    popMatrix();
};
var drawInventoryHUD = function(data) {
    var x = width - 48;
    var top = hotbarTop();
    rectMode(CENTER);
    for (var slot = 0; slot <= data.abilities.length; slot++) {
        var item = slot === 0 ? null : data.abilities[slot - 1];
        var y = top + slot * 70 + 30;
        var selected = inventoryState.selected === slot;
        stroke(selected ? color(100, 200, 255, 170) : color(150, 180, 205, 65));
        strokeWeight(selected ? 3 : 1);
        fill(selected ? color(24, 64, 87, 80) : color(18, 25, 35, 32));
        rect(x, y, 78, 62, 5);
        if (item) {
            drawItemIcon(item, x, y - 5, 29);
        } else if (currentGun.isLightsaber) {
            drawImg(loadedImages[skin === "Kylo Ren" ? "saber_hotbar_red" : "saber_hotbar_blue"], x - 24, y - 29, 48, 48);
        } else {
            pushMatrix();
            translate(x - 24, y - 10);
            scale(0.42);
            currentGun.render();
            popMatrix();
        }
        noStroke();
        fill(225, 235, 245, 180);
        textSize(10);
        textAlign(LEFT, TOP);
        text(slot + 1, x - 32, y - 25);
        textAlign(CENTER, CENTER);
        if (!item || selected || (abs(mouseX - x) <= 39 && abs(mouseY - y) <= 31)) {
            text(item ? item.itemName : currentGun.isLightsaber ? "Saber" : "Blaster", x, y + 21);
        }
        if (item) {
            textAlign(RIGHT, TOP);
            fill(item.remainingUses > 0 ? color(200, 235, 255) : color(255, 115, 100));
            text(item.remainingUses, x + 31, y - 25);
            var progress = item.durationCount > 0 ? 1 - item.durationCount / item.duration : item.rechargeCount > 0 ? 1 - item.rechargeCount / item.rechargeTime : 1;
            rectMode(CORNER);
            fill(15, 20, 28, 40);
            rect(x - 33, y + 28, 66, 3);
            fill(item.durationCount > 0 ? color(110, 240, 175) : color(85, 170, 230));
            rect(x - 33, y + 28, 66 * constrain(progress, 0, 1), 3);
            rectMode(CENTER);
        }
    }
    noStroke();
    fill(18, 25, 35, 40);
    rect(x, top + 370, 78, 30, 5);
    fill(190, 220, 245);
    textAlign(CENTER, CENTER);
    textSize(10);
    text("J  HATS", x, top + 370);
    var held = getHeldItem();
    if (held && (held.durationCount > 0 || held.remainingUses <= 0)) {
        fill(18, 25, 35, 50);
        rect(width / 2, height - 26, 110, 26, 5);
        fill(220, 235, 250, 210);
        textSize(11);
        text(held.remainingUses <= 0 && held.durationCount <= 0 ? "EMPTY" : held.itemName === "Medkit" ? "HEALING" : held.placeable ? "PLACING" : "THROWING", width / 2, height - 26);
    }
    if (inventoryState.cosmeticsOpen) {
        var panelX = width / 2;
        var panelY = height / 2;
        fill(17, 25, 36, 85);
        stroke(130, 180, 215, 100);
        strokeWeight(1);
        rect(panelX, panelY, 220, 148, 6);
        noStroke();
        fill(220, 235, 250, 210);
        textSize(12);
        text("HATS", panelX, panelY - 52);
        textAlign(RIGHT, CENTER);
        textSize(10);
        text("J", panelX + 94, panelY - 52);
        textAlign(CENTER, CENTER);
        if (data.equipment) {
            drawItemIcon(data.equipment, panelX - 66, panelY + 8, 32);
            fill(35, 60, 80, 75);
            rect(panelX, panelY + 8, 188, 36, 4);
            fill(200, 230, 250, 220);
            textSize(11);
            text("JETPACK  " + (jetpackEquipped ? "ON" : "OFF"), panelX + 15, panelY + 8);
            if (jetpackEquipped) {
                fill(90, 180, 235, 160);
                rectMode(CORNER);
                rect(panelX - 80, panelY + 48, 160 * constrain(data.equipment.durationCount / data.equipment.duration, 0, 1), 3, 2);
                rectMode(CENTER);
            }
        } else {
            textSize(11);
            text("NO GEAR", panelX, panelY + 8);
        }
    }
};
startCharacterShop = function(nextCharacter) {
    if (stageTransition.active) {
        return;
    }
    mouseClick = null;
    if (!characterData[nextCharacter]) {
        getSelectedCharacterData();
        return;
    }
    character = nextCharacter;
    if (nextCharacter === "Jedi") {
        currentGun = new Lightsaber({});
        skin = "Kylo Ren";
        playerSpeed = 1.1;
        playerMaxHealth = (100 * 2) / 3;
        playerHealth = min(playerHealth, playerMaxHealth);
    } else if (nextCharacter === "Specialist") {
        currentGun = Sniper;
        skin = "First Order Stormtrooper";
        playerSpeed = 1.02;
        playerMaxHealth = 85;
        playerHealth = min(playerHealth, playerMaxHealth);
    } else if (nextCharacter === "Heavy") {
        currentGun = F_11D;
        skin = "Heavy Shoretrooper";
        playerSpeed = 0.9;
        playerMaxHealth = 100;
        playerHealth = min(playerHealth, playerMaxHealth);
    } else if (nextCharacter === "Assault") {
        currentGun = F_11D;
        skin = "First Order Stormtrooper";
        playerSpeed = 1;
        playerMaxHealth = 100;
        playerHealth = min(playerHealth, playerMaxHealth);
    }
    if (currentGun && currentGun.shootFrom) {
        currentGun.shots = 0;
        currentGun.shotTime = 0;
        currentGun.reloadTime = 0;
    }
    currentMenu = null;
    holoHeight = -25;
    startStageTrans("Shop", function() {
        currentMenu = null;
        holoHeight = -25;
    });
};
/**Main Program**/
var editorRecommendationVisible = true;
var drawEditorRecommendation = function() {
    background(12, 18, 26);
    pushStyle();
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    noStroke();
    fill(28, 40, 54, 210);
    var panelWidth = min(700, width - 32);
    rect(width / 2, height / 2, panelWidth, 190, 12);
    fill(235, 245, 255);
    textFont(basicMainFont, 22);
    text("Recommended", width / 2, height / 2 - 63);
    textSize(15);
    text("Use this link for the best view:", width / 2, height / 2 - 29);
    var playLink = "https://www.khanacademy.org/computer-programming/pjs/6054169438175232?editor=no";
    textSize(13);
    if (textWidth(playLink) > panelWidth - 32) {
        playLink = "https://www.khanacademy.org/\ncomputer-programming/pjs/6054169438175232?editor=no";
        textSize(min(13, (panelWidth - 32) * 13 / textWidth("computer-programming/pjs/6054169438175232?editor=no")));
    }
    text(playLink, width / 2, height / 2 + 8);
    fill(150, 205, 235);
    textSize(13);
    text("Click to continue", width / 2, height / 2 + 66);
    popStyle();
};
mousePressed = function() {
    if (editorRecommendationVisible && gameStage === "Menu" && !runtimeFailed) {
        editorRecommendationVisible = false;
        return;
    }
    ensureAudioContext();
    if (canAcceptGameplayInput()) {
        gameInput.mousePressed = true;
    } else if (gameStage !== "Play") {
        menuClickPending = true;
    }
};
mouseReleased = function() {
    if (gameStage === "Play") {
        gameInput.mouseReleased = true;
    }
};
keyPressed = function() {
    if (editorRecommendationVisible && gameStage === "Menu" && !runtimeFailed) {
        if (keyCode === 13 || keyCode === 27) {
            editorRecommendationVisible = false;
        }
        return;
    }
    if (soundEnabled) {
        ensureAudioContext();
    }
    if (runtimeFailed) {
        if (keyCode === inputKeys.escape) {
            runtimeFailed = false;
            tickClock.lastMs = null;
            tickClock.accumulatorMs = 0;
            clearGameInput();
            gameStage = "Menu";
            currentMenu = null;
            stageTransition.active = false;
            stageTransition.afterSwitch = null;
            squadCommandMode = false;
            mapFetch = false;
            devConsole.active = false;
            mouseClick = null;
        }
        return;
    }
    if (!keys[keyCode] && canAcceptGameplayInput()) {
        gameInput.pressed[keyCode] = true;
    }
    if (devConsole.active) {
        if (keyCode === UP) {
            consoleScroll = min(consoleScroll + 1, maxScrollLines);
        } else if (keyCode === DOWN) {
            consoleScroll = max(consoleScroll - 1, 0);
        }
    }
    if (keyCode === inputKeys.consoleOpen && !devConsole.active && !transitionD && !transitionT) {
        devConsole.active = true;
        transitionU = true;
        devConsole.input = "";
    } else if (keyCode === inputKeys.consoleClose && devConsole.active && !transitionU && !transitionT) {
        devConsole.active = false;
        transitionD = true;
        devConsole.input = "";
    } else if (devConsole.active) {
        if (devConsole.input.charAt(0) === "/") {
            filteredCommands = commands.filter(function(c) {
                return c.indexOf(devConsole.input.toLowerCase()) === 0;
            });
            if (filteredCommands.length === 0) {
                matchIndex = 0;
            } else {
                matchIndex = constrain(matchIndex, 0, filteredCommands.length - 1);
            }
        } else {
            filteredCommands = [];
            matchIndex = 0;
        }
        if (keyCode === 8) {
            devConsole.input = devConsole.input.slice(0, -1);
        } else if (keyCode === 10 || keyCode === 13) {
            GameConsole(devConsole.input.trim());
            devConsole.input = "";
        } else {
            var keyEntry = keyMap[keyCode];
            if (keyEntry) {
                var charToAdd = keys[inputKeys.sprint] && keyEntry.shift ? keyEntry.shift : keyEntry.normal;
                if (charToAdd && charToAdd !== "BACKSPACE" && charToAdd !== "ENTER") {
                    devConsole.input += charToAdd;
                }
            }
        }
    }
    if (keyCode === inputKeys.escape && (gameStage === "Play" || gameStage === "Shop" || gameStage === "FullCredits") && !devConsole.active) {
        if (gameStage === "FullCredits") {
            if (!stageTransition.active) {
                stopSound_("openingCrawl");
                startStageTrans("Menu", function() {
                    fullCreditsFrame = 0;
                    creditsSoundPlayed = false;
                    currentMenu = null;
                    if (currentMap) {
                        resetMatchForHome();
                    }
                });
            }
            keys[keyCode] = true;
            return;
        }
        startStageTrans("Menu", function() {
            currentMenu = null;
            holoHeight = -25;
            if (currentMap) {
                resetMatchForHome();
            }
        });
    }
    keys[keyCode] = true;
};
keyReleased = function() {
    keys[keyCode] = false;
};
var minimapImg;
var testCan = createGraphics(150, 150, P2D);
testCan.background(255, 0);
testCan.fill(255, 0, 0);
testCan.ellipse(75, 75, 150, 150);
//Minimap canvas
var ensureMinimapCanvas = function() {
    if (!minimapView.canvas) {
        minimapView.canvas = createGraphics(150, 150, P2D);
    }
    return minimapView.canvas;
};
minimapView.drawMap = function() {
    var canvas = ensureMinimapCanvas();
    canvas.background(0);
    canvas.image(minimapView.minimap, 75 - minimapView.size / 2 - (((playerPos.x - currentMap.offsetX) / (currentMap.width / 2)) * minimapView.size) / 2, 75 - minimapView.size / 2 - (((playerPos.y - currentMap.offsetY) / (currentMap.height / 2)) * minimapView.size) / 2, minimapView.size, minimapView.size);
    canvas.noStroke();
    if (currentMap && currentMap.entities) {
        for (var blipZ = currentMap.killZ; blipZ < currentMap.topZ + 2; blipZ++) {
            var blipList = currentMap.entities[blipZ];
            if (!blipList) {
                continue;
            }
            for (var blipI = 0; blipI < blipList.length; blipI++) {
                var blipEnt = blipList[blipI];
                if (!blipEnt || !blipEnt.isMatchBot || !blipEnt.pos || blipEnt.health <= 0 || blipEnt.team === undefined) {
                    continue;
                }
                var blipX = 75 + ((blipEnt.pos.x - playerPos.x) * minimapView.size) / currentMap.width;
                var blipY = 75 + ((blipEnt.pos.y - playerPos.y) * minimapView.size) / currentMap.height;
                if (blipX < -5 || blipX > 155 || blipY < -5 || blipY > 155) {
                    continue;
                }
                if (blipEnt.team === playerTeam) {
                    if (blipEnt.inPlayerSquad) {
                        canvas.noFill();
                        canvas.stroke(85, 170, 255, 230);
                        canvas.strokeWeight(3);
                        canvas.ellipse(blipX, blipY, 13, 13);
                        canvas.noStroke();
                    }
                    canvas.fill(70, 155, 255, 235);
                } else {
                    canvas.fill(255, 55, 45, 235);
                }
                canvas.ellipse(blipX, blipY, 5, 5);
            }
        }
    }
    canvas.fill(80, 180, 255, 255);
    canvas.ellipse(75, 75, 6, 6);
};
getMatchAliveBots = function() {
    if (!currentMap) {
        return 0;
    }
    if (currentMap._aliveCountAtMs !== undefined && tickClock.gameMs < currentMap._aliveCountAtMs) {
        return currentMap._aliveBotCount;
    }
    var count = 0;
    for (var layer = currentMap.killZ; layer < currentMap.topZ + 2; layer++) {
        var list = currentMap.entities[layer] || [];
        for (var index = 0; index < list.length; index++) {
            if (list[index].isMatchBot && list[index].health > 0) {
                count++;
            }
        }
    }
    currentMap._aliveBotCount = count;
    currentMap._aliveCountAtMs = tickClock.gameMs + 100;
    return count;
};
var updateMinimapView = function() {
    ensureMinimapCanvas();
    if (stageTransition.active || !currentMap) {
        return;
    }
    if (!currentMap.minimap) {
        currentMap.getMinimap();
    }
    if (minimapView.minimap !== currentMap.minimap || tickClock.realMs >= (minimapView.nextUpdateMs || 0)) {
        minimapView.minimap = currentMap.minimap;
        minimapView.drawMap();
        minimapView.nextUpdateMs = tickClock.realMs + 100;
    }
};
var consumeGameplayActions = function() {
    if (!canAcceptGameplayInput()) {
        return;
    }
    handleInventoryInput();
    if (gameInput.pressed[inputKeys.saber] && currentGun.isLightsaber) {
        currentGun.on = !currentGun.on;
        if (currentGun.on) {
            startSaberAudio();
        } else {
            stopSaberAudio();
        }
    }
    if (inventoryState.selected === 0 && gameInput.pressed[inputKeys.dash]) {
        triggerJediDash(null, true);
    }
    if (inventoryState.selected === 0 && gameInput.pressed[inputKeys.reload] && currentGun.tryReload) {
        currentGun.tryReload();
    }
};
var prepareRenderClock = function(now) {
    var elapsed = tickClock.lastMs === null ? 0 : max(0, now - tickClock.lastMs);
    tickClock.lastMs = now;
    if (elapsed > tickClock.maxGapMs) {
        elapsed = 0;
        tickClock.accumulatorMs = 0;
        clearGameInput();
        keys = {};
        keys[inputKeys.sprint] = false;
    }
    tickClock.renderDeltaMs = elapsed;
    tickClock.renderScale = elapsed / tickClock.baseMs;
    tickClock.realMs += elapsed;
    tickClock.accumulatorMs += elapsed;
};
var updateGameTick = function() {
    if (gameStage !== "Play" || !currentMap) {
        return;
    }
    prepMap(currentMap);
    if (!currentGun) {
        currentGun = new Lightsaber({});
    }
    var playSkinName = ("" + skin).toLowerCase();
    if (playSkinName.indexOf("rebel") >= 0 || playSkinName.indexOf("clone") >= 0) {
        playerTeam = 0;
    } else {
        playerTeam = 1;
    }
    if (matchState.phase === "countdown" && !stageTransition.active) {
        playerVel.mult(0);
        if (currentMap._matchPlayerSpawn) {
            playerPos.x = currentMap._matchPlayerSpawn.x;
            playerPos.y = currentMap._matchPlayerSpawn.y;
            playerPos.z = currentMap._matchPlayerSpawn.z;
        }
        if (!matchState.countdownStarted) {
            matchState.countdownStarted = true;
            matchState.countdownFrame = 0;
        } else {
            matchState.countdownFrame += tickClock.scale;
            if (matchState.countdownFrame >= matchState.countdownStepFrames * 4) {
                matchState.phase = "live";
                matchState.countdownFrame = 0;
            }
        }
    }
    if (matchState.phase === "ending" && !stageTransition.active) {
        matchState.endingFrame += tickClock.scale;
        if (matchState.endingFrame >= matchState.endingHoldFrames) {
            stopSaberAudio();
            startStageTrans("Menu", function() {
                resetMatchForHome();
            });
        }
    }
    var gameplayLive = gameStage === "Play" && matchState.phase === "live" && !stageTransition.active;
    var playerPhysActive = gameplayLive && !deathScreenActive;
    if (matchState.gameMode === "Battle Royale") {
        getMatchAliveBots();
    }
    if (!gameplayLive || deathScreenActive || devConsole.active || !keys[inputKeys.unstick]) {
        stuckHoldCount = 0;
        if (!keys[inputKeys.unstick]) {
            stuckHoldLock = false;
        }
    }
    if (!gameplayLive || deathScreenActive) {
        updateSaberHum();
    }
    if (gameplayLive) {
        updateForceMeter();
    }
    //Handle Keyboard Inputs
    updatePlayerAim();
    consumeGameplayActions();
    if (canAcceptGameplayInput()) {
        var heldMoveScale = getHeldItem() ? 0.78 : 1;
        if (keys[inputKeys.up] || keys[inputKeys.arrowUp]) {
            //Up / W
            playerVel.y -= (playerSpeed + 0.45 * playerSpeed * keys[inputKeys.sprint]) * heldMoveScale * tickClock.scale;
        }
        if (keys[inputKeys.down] || keys[inputKeys.arrowDown]) {
            //Down / S
            playerVel.y += (playerSpeed + 0.45 * playerSpeed * keys[inputKeys.sprint]) * heldMoveScale * tickClock.scale;
        }
        if (keys[inputKeys.left] || keys[inputKeys.arrowLeft]) {
            //Left / A
            playerVel.x -= (playerSpeed + 0.45 * playerSpeed * keys[inputKeys.sprint]) * heldMoveScale * tickClock.scale;
        }
        if (keys[inputKeys.right] || keys[inputKeys.arrowRight]) {
            //Right / D
            playerVel.x += (playerSpeed + 0.45 * playerSpeed * keys[inputKeys.sprint]) * heldMoveScale * tickClock.scale;
        }
    }
    if (gameplayLive) {
        //Change Velocity and Position, Handle Collisions
        currentMap.update();
        if (!deathScreenActive) {
            updatePlayerVitals();
        }
        if (matchState.gameMode === "Battle Royale" && matchState.phase === "live") {
            if (playerHealth <= 0) {
                matchState.phase = "ending";
                matchState.winnerTeam = -2;
                matchState.endingFrame = 0;
                stopCreditClicks();
            } else {
                var liveBattleBots = getMatchAliveBots();
                if (liveBattleBots <= 0) {
                    matchState.phase = "ending";
                    matchState.winnerTeam = playerTeam;
                    matchState.endingFrame = 0;
                    if (!matchState.creditsAwarded) {
                        matchState.lastCreditAward = floor(random(120, 181)) * 5 + matchState.playerKills * floor(random(10, 18)) * 5;
                        addCreditChange(matchState.lastCreditAward);
                        matchState.creditsAwarded = true;
                    }
                    stopCreditClicks();
                }
            }
        }
        if (matchState.gameMode === "Team Deathmatch" && gameStage === "Play" && matchState.phase === "live" && !stageTransition.active && !deathScreenActive) {
            if (matchState.teamScores[0] >= matchState.scoreLimit) {
                matchState.phase = "ending";
                matchState.winnerTeam = 0;
                matchState.endingFrame = 0;
            } else if (matchState.teamScores[1] >= matchState.scoreLimit) {
                matchState.phase = "ending";
                matchState.winnerTeam = 1;
                matchState.endingFrame = 0;
            }
        }
    }
    gameplayLive = gameStage === "Play" && matchState.phase === "live" && !stageTransition.active;
    playerPhysActive = gameplayLive && !deathScreenActive;
    if (playerPhysActive) {
        playerVel.z -= 0.005 * tickClock.scale;
        playerVel.x *= pow(0.8, tickClock.scale);
        playerVel.y *= pow(0.8, tickClock.scale);
        if (collideMode === "unstable") {
            currentMap.playerCollide();
            playerPos.x += playerVel.x * tickClock.scale;
            playerPos.y += playerVel.y * tickClock.scale;
            playerPos.z += playerVel.z * tickClock.scale;
            softCharCollide(null, true);
            currentMap.playerCollide();
        } else {
            var playerMotionScale = tickClock.scale;
            var playerMaxComp = max(max(abs(playerVel.x), abs(playerVel.y)), abs(playerVel.z)) * playerMotionScale;
            var playerSteps = max(1, ceil(playerMaxComp / 6));
            var playerStepScale = playerMotionScale / playerSteps;
            var priorPStep = playerVel._stepScale;
            var touchedPlayerFloor = false;
            for (var playerStep = 0; playerStep < playerSteps; playerStep++) {
                playerVel._stepScale = playerStepScale;
                currentMap.playerCollide();
                touchedPlayerFloor = touchedPlayerFloor || playerFloorHit;
                if (playerVel.x !== 0) {
                    playerPos.x += playerVel.x * playerStepScale;
                    currentMap.playerCollide();
                    touchedPlayerFloor = touchedPlayerFloor || playerFloorHit;
                }
                if (playerVel.y !== 0) {
                    playerPos.y += playerVel.y * playerStepScale;
                    currentMap.playerCollide();
                    touchedPlayerFloor = touchedPlayerFloor || playerFloorHit;
                }
                if (playerVel.z !== 0) {
                    playerPos.z += playerVel.z * playerStepScale;
                    currentMap.playerCollide();
                    touchedPlayerFloor = touchedPlayerFloor || playerFloorHit;
                }
                softCharCollide(null, true);
                currentMap.playerCollide();
                touchedPlayerFloor = touchedPlayerFloor || playerFloorHit;
            }
            playerFloorHit = touchedPlayerFloor;
            if (priorPStep === undefined) {
                playerVel._stepScale = 1;
            } else {
                playerVel._stepScale = priorPStep;
            }
            if (abs(playerVel.x) < 0.001) {
                playerVel.x = 0;
            }
            if (abs(playerVel.y) < 0.001) {
                playerVel.y = 0;
            }
            if (abs(playerVel.z) < 0.001) {
                playerVel.z = 0;
            }
            var playerCeiling = currentMap.topZ + flyCeilExtra;
            var pCeilSoftStart = playerCeiling - flyCeilSoft;
            if (playerPos.z > pCeilSoftStart && playerVel.z > 0) {
                playerVel.z *= 1 - constrain(
                    (playerPos.z - pCeilSoftStart) / max(0.0001, flyCeilSoft), 0, 1) * 0.82;
            }
            if (playerPos.z > playerCeiling) {
                playerPos.z = playerCeiling + (playerPos.z - playerCeiling) * 0.22;
                if (playerVel.z > 0) {
                    playerVel.z *= 0.18;
                }
                playerVel.z = min(playerVel.z, 0.012);
            }
            if (playerPos.z > playerCeiling + flyCeilBuffer) {
                playerPos.z = playerCeiling + flyCeilBuffer;
                playerVel.z = min(playerVel.z, 0);
            }
            if (gameplayLive && playerFloorHit && (keys[inputKeys.jump] || gameInput.pressed[inputKeys.jump]) && !devConsole.active) {
                playerPos.z += 0.1 * tickClock.scale;
                playerVel.z += playerJumpHeight * tickClock.scale;
            }
        }
    }
    //Some zChangers are handled here, others are parts of GameObjs
    if (gameplayLive) {
        for (var i = 0; i < currentMap.zChangers.length; i++) {
            currentMap.zChangers[i].update();
        }
    }
    //Kill the player if they are below killZ
    if (gameplayLive && !deathScreenActive && playerPos.z < currentMap.killZ) {
        playerDie();
    }
    updatePlayerAim();
    if (gameplayLive && !deathScreenActive) {
        getSelectedCharacterData();
        if (keys[inputKeys.unstick] && !devConsole.active && !stuckHoldLock) {
            stuckHoldCount = min(stuckHoldFrames, stuckHoldCount + tickClock.scale);
            if (stuckHoldCount >= stuckHoldFrames) {
                stuckHoldLock = true;
                if (solidAt(playerPos.x, playerPos.y, playerPos.z, hitboxSize * 0.84)) {
                    playerVel.mult(0);
                    var stuckRespawnDeaths = playerDeaths;
                    startStageTrans("Play", function() {
                        playerDie(true);
                        playerDeaths = stuckRespawnDeaths;
                    });
                }
                stuckHoldCount = 0;
            }
        }
        var activeCharData = characterData[character];
        if (!inventoryState.uiConsumed && matchState.gameMode !== "Battle Royale" && handleSquadClick()) {
            inventoryState.uiConsumed = true;
        }
        if (
            (inventoryState.uiConsumed || squadCommandMode || inventoryState.selected !== 0 || !canAcceptGameplayInput()) && currentGun && currentGun.tick) {
            currentGun.tick();
        } else {
            currentGun.update();
        }
        updateSaberHum();
        for (var heldIndex = 0; heldIndex < activeCharData.abilities.length; heldIndex++) {
            activeCharData.abilities[heldIndex].update();
        }
        if (jetpackEquipped && activeCharData.equipment) {
            activeCharData.equipment.update();
        }
    }
    screenShake *= pow(0.9, tickClock.scale);
    bloodScreen *= pow(0.99, tickClock.scale);
    for (var popupIndex = creditPopups.length - 1; popupIndex >= 0; popupIndex--) {
        creditPopups[popupIndex].life -= tickClock.scale;
        if (creditPopups[popupIndex].life <= 0) {
            creditPopups.splice(popupIndex, 1);
        }
    }
    if (deathScreenActive && !stageTransition.active) {
        deathScreenFrame += tickClock.wallStepMs / tickClock.baseMs;
        if (deathScreenFrame >= deathRespawnAt && !deathTransStarted) {
            deathTransStarted = true;
            startStageTrans("Play", function() {
                playerDie(true);
            });
        }
    }
    if (gameplayLive) {
        TPsec += tickClock.wallStepMs / 1000;
        if (TPsec >= 60) {
            TPmin += floor(TPsec / 60);
            TPsec %= 60;
        }
        if (TPmin >= 60) {
            TPhr += floor(TPmin / 60);
            TPmin %= 60;
        }
    }
};
var advanceGameTicks = function() {
    var renderClick = mouseClick;
    var renderRelease = mouseRelease;
    tickClock.stepsThisFrame = 0;
    while (tickClock.accumulatorMs + 0.000001 >= tickClock.stepMs) {
        tickClock.accumulatorMs = max(0, tickClock.accumulatorMs - tickClock.stepMs);
        tickClock.wallStepMs = tickClock.stepMs;
        var timeScale = gameStage === "Play" && squadCommandMode ? 0.1 : 1;
        if (gameStage === "Play" && matchState.phase === "live" && !stageTransition.active && dangerSense > 0) {
            timeScale *= forceSettings.dangerSenseSlowMoScale;
            dangerSense = max(0, dangerSense - tickClock.wallStepMs / tickClock.baseMs);
        } else if (gameStage !== "Play" || matchState.phase !== "live") {
            dangerSense = 0;
        }
        tickClock.deltaMs = tickClock.stepMs * timeScale;
        tickClock.scale = tickClock.deltaMs / tickClock.baseMs;
        tickClock.gameMs += tickClock.deltaMs;
        tickClock.tick++;
        tickClock.stepsThisFrame++;
        mouseClick = gameInput.mousePressed;
        mouseRelease = gameInput.mouseReleased;
        updateGameTick();
        clearGameInput();
    }
    mouseClick = renderClick;
    mouseRelease = renderRelease;
};
var drawRuntimeError = function() {
    resetMatrix();
    noTint();
    rectMode(CORNER);
    background(0);
    fill(255, 120, 120);
    textFont(basicMainFont, 13);
    textAlign(LEFT, TOP);
    text("Runtime error — press Escape to return to the menu", 12, 12, width - 24, 42);
    text(runtimeErrMsg, 12, 64, width - 24, height - 76);
};
draw = function() {
    if (runtimeFailed) {
        drawRuntimeError();
        return;
    }
    try {
        prepareRenderClock(millis());
        if (editorRecommendationVisible && gameStage === "Menu") {
            drawEditorRecommendation();
            return;
        }
        var creditDiff = playerCredits - creditDisplay.value;
        var creditStep = 0;
        if (abs(creditDiff) > 0.01) {
            var creditMaxStep = max(0.4, abs(creditDiff) * 0.12) * tickClock.renderScale;
            creditStep = constrain(creditDiff, -creditMaxStep, creditMaxStep);
            creditDisplay.value += creditStep;
        } else {
            creditDisplay.value = playerCredits;
        }
        var creditSoundTarget = round(creditDisplay.value);
        if (creditDisplay.scrollSoundValue === undefined) {
            creditDisplay.scrollSoundValue = creditSoundTarget;
        }
        if (creditSoundTarget !== creditDisplay.scrollSoundValue) {
            var creditSoundDir = creditSoundTarget > creditDisplay.scrollSoundValue ? 1 : -1;
            var creditSoundTicks = min(6, abs(creditSoundTarget - creditDisplay.scrollSoundValue));
            for (var creditSoundTick = 0; creditSoundTick < creditSoundTicks; creditSoundTick++) {
                creditDisplay.scrollSoundTick++;
                if (creditDisplay.scrollSoundTick % 4 === 0) {
                    playCreditClick();
                }
                creditDisplay.scrollSoundValue += creditSoundDir;
            }
        }
        creditDisplay.speed = lerp(creditDisplay.speed, creditStep, uiEase(0.25));
        //Handle clicks
        if (mouseClick) {
            mouseClick = null;
        }
        if (mouseRelease) {
            mouseRelease = null;
        }
        if (mouseIsPressed) {
            if (mouseClick === false) {
                mouseClick = true;
                mouseRelease = false;
                if (canAcceptGameplayInput()) {
                    gameInput.mousePressed = true;
                }
            }
        }
        if (!mouseIsPressed) {
            if (mouseRelease === false) {
                mouseRelease = true;
                mouseClick = false;
            }
        }
        if (menuClickPending) {
            mouseClick = true;
            menuClickPending = false;
        }
        advanceGameTicks();
        //Load Images
        if (gameStage === "ImageLoad") {
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
        } else if (gameStage === "Menu") {
            if (mouseIsPressed) {
                menuRotVel += (pmouseX - mouseX) * menuDragPower;
            }
            menu();
        } else if (gameStage === "FullCredits") {
            drawFullCredits();
        } else if (gameStage === "Shop") {
            getSelectedCharacterData();
            var shopCharacterData = characterData[character];
            var shopPreviewSkin = skin;
            if (!shopPreviewSkin) {
                for (var shopSkinRow = 0; shopSkinRow < shopCharacterData.skins.length && !shopPreviewSkin; shopSkinRow++) {
                    if (shopCharacterData.skins[shopSkinRow] && shopCharacterData.skins[shopSkinRow][0]) {
                        shopPreviewSkin = shopCharacterData.skins[shopSkinRow][0];
                    }
                }
            }
            pushStyle();
            background(240);
            noStroke();
            fill(160);
            rectMode(CENTER);
            rect(width / 2, height - 100, width, 200);
            pushMatrix();
            scale(width / 600, height / 600);
            beginShape();
            vertex(100, 0);
            bezierVertex(200, 0, 160, 400, 400, 400);
            vertex(0, 600);
            vertex(0, 0);
            endShape();
            pushMatrix();
            popMatrix();
            translate(width * 0.7, height * 0.32);
            rotate(sin((tickClock.realMs / tickClock.baseMs)) * 30 + 180);
            drawPlayer(shopPreviewSkin || "First Order Stormtrooper", 150);
            popMatrix();
            popStyle();
        }
        //Game Level
        else {
            if (!currentMap) {
                currentMap = getSelectedMap();
                if (!currentMap) {
                    gameStage = "Menu";
                    return;
                }
            }
            prepMap(currentMap);
            if (!currentGun) {
                currentGun = new Lightsaber({});
            }
            var gameplayLive = gameStage === "Play" && matchState.phase === "live" && !stageTransition.active;
            updateCamera(gameplayLive);
            updatePlayerAim();
            updateMinimapView();
            pushMatrix();
            //Render the game map
            currentMap.render();
            popMatrix();
            if (gameplayLive && inventoryState.selected === 0) {
                var playerScreen = worldToScreen(playerPos.x, playerPos.y);
                crosshair(mouseX, mouseY, playerScreen.x, playerScreen.y, atan2(mouseY - playerScreen.y, mouseX - playerScreen.x), "spread", currentGun.accuracy);
                drawForceMeter();
            }
            //This program was created by ✝ 𝕮𝕲𝕏𝕷𝕮𝕵 ✝. If the project you see was not created by them or spun off from the original, it has been stolen
            //Render UI
            pushMatrix();
            translate(width - 616, height - 660);
            //Player Health
            var chunks = 10;
            var filledChunks = ceil(playerHealth / (playerMaxHealth / chunks));
            //background
            fill(0, 40);
            noStroke();
            pushMatrix();
            translate(344, 496 - 25);
            quad(0, 20, 20, 0, 253, 0, 233, 20);
            popMatrix();
            //draw chunks
            for (var i = 0; i < chunks; i++) {
                if (i < filledChunks) {
                    fill(255, i * 10, 0, 165); //filled
                } else {
                    noFill(); //empty
                }
                pushMatrix();
                translate(356 + i * 22, 500 - 25);
                scale(0.6);
                quad(0, 20, 20, 0, 50, 0, 30, 20);
                popMatrix();
            }
            //Player Shield
            var filledChunks2 = ceil(playerShield / (playerMaxShield / chunks));
            //background
            fill(0, 40);
            noStroke();
            pushMatrix();
            translate(344, 496);
            quad(0, 20, 20, 0, 253, 0, 233, 20);
            popMatrix();
            //draw chunks
            for (var i = 0; i < chunks; i++) {
                if (i < filledChunks2) {
                    fill(130 + i * 3, 130 + i * 3, 255, 165); //filled
                } else {
                    noFill(); //empty
                }
                pushMatrix();
                translate(356 + i * 22, 500);
                scale(0.6);
                quad(0, 20, 20, 0, 50, 0, 30, 20);
                popMatrix();
            }
            popMatrix();
            pushMatrix();
            translate(width - 600, height - 650);
            //draw weapon stuff
            fill(!currentGun.isLightsaber && currentGun.shots >= currentGun.shotsAllowed ? 100 : 0, 0, 0, 70);
            strokeWeight(1);
            rectMode(CENTER);
            stroke(255, 255, 255, 100);
            rect(hudLayout.weaponX, hudLayout.weaponY, 215, 90, 5);
            line(375, 597, 565, 597);
            noStroke();
            fill(255, 5);
            quad(470 - 215 / 2, 580, 470 - 215 / 2, 555, 490, 575 + 45, 445, 575 + 45);
            rectMode(0);
            var hudWeaponSprite = currentGun.spriteId === "lightsaber" ? skin === "Kylo Ren" ? "Kylo Ren Lightsaber" : "Lightsaber" : currentGun.spriteId;
            if (hudWeaponSprite === "Sniper") {
                pushMatrix();
                translate(414, 573);
                scale(0.35);
                sniperSprite(0, 0, 100);
                popMatrix();
            } else if (hudWeaponSprite === "Lightsaber") {
                lightsaber(418, 567, 0.32, 90, skin, true);
            } else {
                weaponSprite(425, currentGun.isLightsaber ? 645 : 573, 80, currentGun.isLightsaber ? -90 : 0, hudWeaponSprite, !currentGun.isLightsaber && currentGun.shots >= currentGun.shotsAllowed ? color(255, 0, 0, 85) : color(255, 80), !currentGun.isLightsaber && currentGun.shots >= currentGun.shotsAllowed ? color(255, 0, 0) : color(255));
            }
            fill(!currentGun.isLightsaber && currentGun.shots >= currentGun.shotsAllowed ? color(255, 0, 0) : color(255));
            textSize(13);
            textAlign(LEFT, CENTER);
            text(inventoryState.selected === 0 ? currentGun.displayName.toUpperCase() : "", 492, 550);
            textSize(20);
            text(!currentGun.isLightsaber ? currentGun.shotsAllowed - currentGun.shots + "  /  " + currentGun.shotsAllowed : currentGun.on ? "ON" : "OFF", 492, 570);
            textSize(8);
            fill(!currentGun.isLightsaber && currentGun.shots >= currentGun.shotsAllowed ? color(255, 0, 0, 100) : color(255, 100));
            popMatrix();
            //Shots left
            fill(255, 255, 255);
            if (!currentGun.isLightsaber && currentGun.shots >= currentGun.shotsAllowed) {
                fill(255, 0, 0);
            }
            textSize(20);
            textAlign(CENTER, CENTER);
            textAlign(RIGHT, TOP);
            textSize(22);
            var hudCreditActivity = constrain(abs(creditDisplay.speed) / 5, 0, 1);
            if (creditDisplay.speed < -0.01) {
                fill(255, lerp(230, 80, hudCreditActivity), lerp(130, 80, hudCreditActivity));
            } else {
                fill(lerp(255, 110, hudCreditActivity), lerp(230, 255, hudCreditActivity), lerp(130, 150, hudCreditActivity));
            }
            pushMatrix();
            translate(width - 16, 16);
            scale(1 + (creditDisplay.speed > 0 ? hudCreditActivity * 0.35 : 0));
            text("₹ " + round(creditDisplay.value), 0, 0);
            popMatrix();
            textSize(16);
            fill(255, 245, 180, 210);
            text("KILLS " + matchState.playerKills, width - 16, 42);
            if (gameplayLive && stuckHoldCount > 0 && !deathScreenActive) {
                rectMode(CENTER);
                noStroke();
                fill(18, 22, 30, 220);
                rect(width / 2, 43, 170, 30, 5);
                fill(255, 235, 170, 230);
                textAlign(CENTER, CENTER);
                textSize(13);
                text("UNSTICK IN " + round((stuckHoldFrames - stuckHoldCount) / 6) / 10, width / 2, 43);
            }
            var tdmX = 16;
            var tdmY = 16;
            var tdmW = 190;
            var tdmH = 15;
            if (matchState.gameMode === "Battle Royale") {
                var aliveBots = currentMap._aliveBotCount || 0;
                rectMode(CORNER);
                noStroke();
                fill(32, 38, 48, 70);
                rect(tdmX, tdmY + 14, tdmW, 26, 3);
                fill(255, 245, 180, 220);
                textAlign(LEFT, CENTER);
                textSize(13);
                text("ALIVE " + (aliveBots + (playerHealth > 0 ? 1 : 0)) + " / 24", tdmX + 9, tdmY + 27);
            } else {
                drawSquadButton();
                var myTdmScore = matchState.teamScores[playerTeam] || 0;
                var enemyTeam = playerTeam === 0 ? 1 : 0;
                var enemyTdmScore = matchState.teamScores[enemyTeam] || 0;
                rectMode(CORNER);
                noStroke();
                fill(0, 0, 0, 135);
                fill(255, 245, 180, 220);
                textAlign(LEFT, TOP);
                textSize(11);
                fill(32, 38, 48, 70);
                rect(tdmX, tdmY + 14, tdmW, tdmH, 3);
                rect(tdmX, tdmY + 30, tdmW, tdmH, 3);
                fill(55, 155, 255, 230);
                rect(tdmX, tdmY + 14, tdmW * constrain(myTdmScore / matchState.scoreLimit, 0, 1), tdmH, 3);
                fill(255, 70, 70, 225);
                rect(tdmX, tdmY + 30, tdmW * constrain(enemyTdmScore / matchState.scoreLimit, 0, 1), tdmH, 3);
                textAlign(RIGHT, CENTER);
                textSize(10);
                fill(185, 225, 255);
                text(myTdmScore, tdmX + tdmW - 5, tdmY + 20);
                fill(255, 175, 175);
                text(enemyTdmScore, tdmX + tdmW - 5, tdmY + 37);
            }
            //Minimap
            noFill();
            stroke(0, 100);
            strokeWeight(5);
            if (mouseX <= 180 && mouseY >= height - 180) {
                tint(255, 255, 255, 100);
            }
            rectMode(CENTER);
            rect(95, height - 95, 155, 155, 5);
            hudLayout.minimapY = height - 170;
            tint(255, 255, 255, mouseX <= 180 && mouseY >= height - 180 ? 100 : 165);
            image(minimapView.canvas, hudLayout.minimapX, hudLayout.minimapY, hudLayout.minimapSize, hudLayout.minimapSize);
            noTint();
            getSelectedCharacterData();
            var hudCharacterData = characterData[character];
            drawInventoryHUD(hudCharacterData);
            fill(255, 0, 0, bloodScreen);
            rect(width / 2, height / 2, width + 40, height + 40);
            if (deathScreenActive) {
                var deathProgress = constrain(deathScreenFrame / deathRespawnAt, 0, 1);
                rectMode(CENTER);
                noStroke();
                fill(0, 0, 0, 95 + deathProgress * 90);
                rect(width / 2, height / 2, width + 40, height + 40);
                textAlign(CENTER, CENTER);
                stroke(0, 190);
                strokeWeight(7);
                fill(255, 105, 90, 235);
                textSize(62);
                text("DEAD", width / 2, height / 2 - 18);
                noStroke();
                fill(255, 230, 180, 210);
                textSize(21);
                text("RESPAWNING", width / 2, height / 2 + 43);
            }
            //Dev Console
            drawDevConsole();
            fill(255, 255, 255);
            for (var creditPopupI = creditPopups.length - 1; creditPopupI >= 0; creditPopupI--) {
                var popup = creditPopups[creditPopupI];
                var popupProgress = 1 - popup.life / popup.maxLife;
                var popupScreen = worldToScreen(popup.x, popup.y);
                var popupX = popupScreen.x;
                var popupY = popupScreen.y - popupProgress * 45;
                var popupAlpha = 255 * (1 - popupProgress);
                textAlign(CENTER, CENTER);
                textSize(22 + sin(popupProgress * 180) * 8);
                stroke(0, popupAlpha * 0.7);
                strokeWeight(5);
                if (popup.amount > 0) {
                    fill(120, 255, 150, popupAlpha);
                    text("+₹" + popup.amount, popupX, popupY);
                } else {
                    fill(255, 95, 95, popupAlpha);
                    text("-₹" + abs(popup.amount), popupX, popupY);
                }
                noStroke();
            }
            if (matchState.phase === "countdown" && matchState.countdownStarted && !stageTransition.active) {
                var countStep = matchState.countdownStepFrames;
                var countLabel = "GO";
                if (matchState.countdownFrame < countStep) {
                    countLabel = "3";
                } else if (matchState.countdownFrame < countStep * 2) {
                    countLabel = "2";
                } else if (matchState.countdownFrame < countStep * 3) {
                    countLabel = "1";
                }
                var countFrame = matchState.countdownFrame % matchState.countdownStepFrames;
                var countProgress = countFrame / matchState.countdownStepFrames;
                countProgress = constrain(countProgress, 0, 1);
                var countCenterY = height / 2 - 18;
                var countY = countProgress < 0.5 ? lerp(-120, countCenterY, 1 - pow(1 - countProgress / 0.5, 3)) : lerp(countCenterY, height + 140, pow((countProgress - 0.5) / 0.5, 3));
                textAlign(CENTER, CENTER);
                textSize(30);
                stroke(0, 170);
                strokeWeight(5);
                fill(255, 245, 180, 225);
                text(("" + matchState.gameMode).toUpperCase(), width / 2, countY - 108);
                textSize(126);
                stroke(0, 180);
                strokeWeight(8);
                fill(255, 245, 180, 235);
                pushMatrix();
                translate(width / 2, countY);
                rotate(countY + height * 1.93);
                text(countLabel, 0, 0);
                popMatrix();
                noStroke();
            }
            if (matchState.phase === "ending") {
                var winnerLabel = matchState.winnerTeam === -1 ? "DRAW" : matchState.winnerTeam === playerTeam ? "YOU WIN" : "YOU LOSE";
                if (matchState.gameMode === "Battle Royale" && matchState.winnerTeam !== playerTeam) {
                    winnerLabel = "ELIMINATED";
                }
                var winnerProgress = matchState.endingFrame / matchState.endingHoldFrames;
                winnerProgress = constrain(winnerProgress, 0, 1);
                var winnerCenterY = height / 2 - 18;
                var winnerY = winnerProgress < 0.5 ? lerp(-120, winnerCenterY, 1 - pow(1 - winnerProgress / 0.5, 3)) : lerp(winnerCenterY, height + 140, pow((winnerProgress - 0.5) / 0.5, 3));
                textAlign(CENTER, CENTER);
                textSize(72);
                stroke(0, 180);
                strokeWeight(8);
                fill(255, 245, 180, 230);
                text(winnerLabel, width / 2, winnerY);
                noStroke();
                if (matchState.lastCreditAward > 0) {
                    textSize(24);
                    fill(255, 230, 130, 220);
                    text("+₹ " + matchState.lastCreditAward, width / 2, winnerY + 70);
                }
            }
        }
        drawStageTrans();
    } catch (e) {
        runtimeErrMsg = String(e) + (e && e.stack ? "\n" + e.stack : "");
        runtimeFailed = true;
        tickClock.accumulatorMs = 0;
        clearGameInput();
        keys = {};
        keys[inputKeys.sprint] = false;
        stopSaberAudio();
        drawRuntimeError();
    }
};
/**End Code**/
