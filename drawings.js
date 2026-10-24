var lightsaber;
var drawPlayerVector = function(skin, size, hideHands) {
    var drawSpriteHands = !hideHands;
    pushMatrix();
    scale(size / 212);
    translate(-212, -203);
    rectMode(CENTER);
    switch (skin) {
        case "First Order Stormtrooper": {
            strokeWeight(5);
            pushMatrix();
            translate(200, 200);
            rotate(5);
            fill(230);
            stroke(196, 196, 196);
            beginShape();
            curveVertex(-68, -86);
            curveVertex(-32, -91);
            curveVertex(-21, -92);
            curveVertex(-14, -90);
            curveVertex(9, -92);
            curveVertex(21, -95);
            curveVertex(24, -97);
            curveVertex(60, -98);
            curveVertex(100, -30);
            curveVertex(99, 54);
            curveVertex(33, 105);
            curveVertex(-51, 84);
            curveVertex(-84, 9);
            curveVertex(-68, -86);
            curveVertex(-32, -91);
            curveVertex(-21, -67);
            endShape();
            popMatrix();
            pushMatrix();
            translate(216, 168);
            scale(0.65, 0.78);
            rotate(0);
            fill(50);
            stroke(31, 31, 31);
            strokeWeight(5);
            beginShape();
            curveVertex(-84, -15);
            curveVertex(-1, -51);
            curveVertex(49, -51);
            curveVertex(82, 18);
            curveVertex(72, 58);
            curveVertex(56, -21);
            curveVertex(26, -44);
            curveVertex(-74, -35);
            curveVertex(-80, 55);
            curveVertex(-90, 56);
            curveVertex(-84, -49);
            curveVertex(-1, -51);
            curveVertex(68, -90);
            endShape();
            popMatrix();
            pushMatrix();
            translate(202, 207);
            scale(0.78);
            rotate(5);
            fill(242, 242, 242);
            stroke(237, 237, 237);
            strokeWeight(5);
            beginShape();
            curveVertex(-68, -86);
            curveVertex(-32, -73);
            curveVertex(-21, -73);
            curveVertex(-14, -71);
            curveVertex(9, -77);
            curveVertex(21, -75);
            curveVertex(24, -76);
            curveVertex(60, -74);
            curveVertex(100, -30);
            curveVertex(99, 54);
            curveVertex(33, 105);
            curveVertex(-51, 84);
            curveVertex(-84, 9);
            curveVertex(-68, -58);
            curveVertex(-32, -71);
            curveVertex(-21, -85);
            endShape();
            popMatrix();
            //hands
            if (drawSpriteHands) {
                fill(250);
                stroke(214, 214, 214);
                strokeWeight(10);
                ellipse(163, 41, 70, 70);
                ellipse(249, -34, 70, 70);
            }
        }
        break;
        case "Shadowtrooper": {
            strokeWeight(5);
            pushMatrix();
            translate(200, 200);
            rotate(5);
            fill(26);
            stroke(23, 23, 23);
            beginShape();
            curveVertex(-68, -86);
            curveVertex(-32, -91);
            curveVertex(-21, -92);
            curveVertex(-14, -90);
            curveVertex(9, -92);
            curveVertex(21, -95);
            curveVertex(24, -97);
            curveVertex(60, -98);
            curveVertex(100, -30);
            curveVertex(99, 54);
            curveVertex(33, 105);
            curveVertex(-51, 84);
            curveVertex(-84, 9);
            curveVertex(-68, -86);
            curveVertex(-32, -91);
            curveVertex(-21, -67);
            endShape();
            popMatrix();
            pushMatrix();
            translate(216, 168);
            scale(0.65, 0.78);
            rotate(0);
            fill(0, 0, 0);
            stroke(0, 0, 0);
            strokeWeight(6);
            beginShape();
            curveVertex(-84, -15);
            curveVertex(-1, -51);
            curveVertex(49, -51);
            curveVertex(82, 18);
            curveVertex(72, 58);
            curveVertex(56, -21);
            curveVertex(26, -44);
            curveVertex(-74, -35);
            curveVertex(-80, 55);
            curveVertex(-90, 56);
            curveVertex(-84, -49);
            curveVertex(-1, -51);
            curveVertex(68, -90);
            endShape();
            popMatrix();
            pushMatrix();
            translate(202, 207);
            scale(0.78);
            rotate(5);
            fill(15, 15, 15);
            stroke(15, 15, 15);
            strokeWeight(5);
            beginShape();
            curveVertex(-68, -86);
            curveVertex(-32, -73);
            curveVertex(-21, -73);
            curveVertex(-14, -71);
            curveVertex(9, -77);
            curveVertex(21, -75);
            curveVertex(24, -76);
            curveVertex(60, -74);
            curveVertex(100, -30);
            curveVertex(99, 54);
            curveVertex(33, 105);
            curveVertex(-51, 84);
            curveVertex(-84, 9);
            curveVertex(-68, -58);
            curveVertex(-32, -71);
            curveVertex(-21, -85);
            endShape();
            popMatrix();
            //hands
            if (drawSpriteHands) {
                fill(38, 38, 38);
                stroke(23);
                strokeWeight(10);
                ellipse(90, 103, 70, 70);
                ellipse(326, 103, 70, 70);
            }
        }
        break;
        case "Heavy Shoretrooper": {
            strokeWeight(5);
            pushMatrix();
            translate(200, 200);
            rotate(5);
            fill(222, 213, 162);
            stroke(202, 193, 136);
            beginShape();
            curveVertex(-68, -114);
            curveVertex(-32, -106);
            curveVertex(-24, -107);
            curveVertex(-14, -108);
            curveVertex(9, -113);
            curveVertex(21, -111);
            curveVertex(24, -110);
            curveVertex(60, -83);
            curveVertex(100, -30);
            curveVertex(99, 54);
            curveVertex(33, 105);
            curveVertex(-51, 84);
            curveVertex(-84, 9);
            curveVertex(-68, -55);
            curveVertex(-32, -106);
            curveVertex(-21, -134);
            endShape();
            popMatrix();
            fill(117, 117, 117);
            noStroke();
            rect(205, 131, 40, 86);
            pushMatrix();
            translate(216, 172);
            scale(0.65, 0.78);
            rotate(0);
            fill(50);
            stroke(31, 31, 31);
            strokeWeight(5);
            beginShape();
            curveVertex(-84, -15);
            curveVertex(-1, -51);
            curveVertex(49, -51);
            curveVertex(82, 18);
            curveVertex(72, 58);
            curveVertex(56, -21);
            curveVertex(26, -44);
            curveVertex(-74, -35);
            curveVertex(-80, 55);
            curveVertex(-90, 56);
            curveVertex(-84, -49);
            curveVertex(-1, -51);
            curveVertex(68, -90);
            endShape();
            popMatrix();
            pushMatrix();
            translate(202, 207);
            scale(0.78);
            rotate(5);
            fill(202, 193, 136);
            stroke(173, 162, 109);
            strokeWeight(5);
            beginShape();
            curveVertex(-68, -86);
            curveVertex(-32, -73);
            curveVertex(-21, -73);
            curveVertex(-14, -71);
            curveVertex(9, -77);
            curveVertex(21, -75);
            curveVertex(24, -76);
            curveVertex(60, -74);
            curveVertex(100, -30);
            curveVertex(99, 54);
            curveVertex(33, 105);
            curveVertex(-51, 84);
            curveVertex(-84, 9);
            curveVertex(-68, -58);
            curveVertex(-32, -71);
            curveVertex(-21, -85);
            endShape();
            popMatrix();
            //hands
            if (drawSpriteHands) {
                fill(56, 56, 56);
                stroke(15, 15, 15);
                strokeWeight(10);
                ellipse(90, 103, 70, 70);
                ellipse(326, 103, 70, 70);
                fill(202, 193, 136);
                stroke(184, 176, 128);
                arc(90, 103, 70, 70, -14, 175);
                arc(326, 103, 70, 70, 9, 194);
                fill(112, 112, 112);
                stroke(23, 23, 23);
                strokeWeight(5);
                rect(204, 105, 23, 31, 0, 0, 100, 100);
                fill(133, 133, 133);
                noStroke();
                rect(205, 220, 40, 151, 10);
            }
        }
        break;
        case "Shoretrooper": {
            strokeWeight(5);
            pushMatrix();
            translate(200, 200);
            rotate(5);
            fill(222, 213, 162);
            stroke(202, 193, 136);
            beginShape();
            curveVertex(-68, -114);
            curveVertex(-32, -106);
            curveVertex(-24, -107);
            curveVertex(-14, -108);
            curveVertex(9, -113);
            curveVertex(21, -111);
            curveVertex(24, -110);
            curveVertex(60, -83);
            curveVertex(100, -30);
            curveVertex(99, 54);
            curveVertex(33, 105);
            curveVertex(-51, 84);
            curveVertex(-84, 9);
            curveVertex(-68, -55);
            curveVertex(-32, -106);
            curveVertex(-21, -134);
            endShape();
            popMatrix();
            pushMatrix();
            translate(216, 172);
            scale(0.65, 0.78);
            rotate(0);
            fill(50);
            stroke(31, 31, 31);
            strokeWeight(5);
            beginShape();
            curveVertex(-84, -15);
            curveVertex(-1, -51);
            curveVertex(49, -51);
            curveVertex(82, 18);
            curveVertex(72, 58);
            curveVertex(56, -21);
            curveVertex(26, -44);
            curveVertex(-74, -35);
            curveVertex(-80, 55);
            curveVertex(-90, 56);
            curveVertex(-84, -49);
            curveVertex(-1, -51);
            curveVertex(68, -90);
            endShape();
            popMatrix();
            pushMatrix();
            translate(202, 207);
            scale(0.78);
            rotate(5);
            fill(202, 193, 136);
            stroke(173, 162, 109);
            strokeWeight(5);
            beginShape();
            curveVertex(-68, -86);
            curveVertex(-32, -73);
            curveVertex(-21, -73);
            curveVertex(-14, -71);
            curveVertex(9, -77);
            curveVertex(21, -75);
            curveVertex(24, -76);
            curveVertex(60, -74);
            curveVertex(100, -30);
            curveVertex(99, 54);
            curveVertex(33, 105);
            curveVertex(-51, 84);
            curveVertex(-84, 9);
            curveVertex(-68, -58);
            curveVertex(-32, -71);
            curveVertex(-21, -85);
            endShape();
            popMatrix();
            //hands
            if (drawSpriteHands) {
                fill(56, 56, 56);
                stroke(15, 15, 15);
                strokeWeight(10);
                ellipse(90, 103, 70, 70);
                ellipse(326, 103, 70, 70);
                fill(202, 193, 136);
                stroke(184, 176, 128);
                arc(90, 103, 70, 70, -14, 175);
                arc(326, 103, 70, 70, 9, 194);
                fill(112, 112, 112);
                stroke(23, 23, 23);
                strokeWeight(5);
                rect(204, 105, 23, 31, 0, 0, 100, 100);
            }
        }
        break;
        case "Luke Skywalker": {
            popMatrix();
            pushMatrix();
            scale(size / 200);
            pushMatrix();
            scale(0.85);
            rectMode(CENTER);
            strokeWeight(10);
            fill(219, 197, 143);
            stroke(173, 155, 114);
            ellipse(0, 0, 200, 200);
            noStroke();
            fill(210, 180, 140);
            ellipse(0, 35, 200, 150);
            ellipse(0, -5, 139, 91);
            ellipse(-37, 2, 139, 91);
            ellipse(37, 2, 139, 91);
            fill(0);
            ellipse(-44, -53, 20, 16);
            ellipse(44, -53, 20, 16);
            noFill();
            stroke(0);
            arc(0, 0, 150, 150, -100, -80);
            popMatrix();
            //hands
            if (drawSpriteHands) {
                fill(219, 197, 143);
                stroke(173, 155, 114);
                strokeWeight(10);
                ellipse(-110, -97, 70, 70);
                ellipse(110, -97, 70, 70);
            }
        }
        break;
        case "Kylo Ren": {
            strokeWeight(5);
            pushMatrix();
            translate(200, 200);
            rotate(5);
            fill(26);
            stroke(23, 23, 23);
            beginShape();
            curveVertex(-68, -86);
            curveVertex(-32, -101);
            curveVertex(-21, -105);
            curveVertex(-14, -107);
            curveVertex(9, -110);
            curveVertex(21, -108);
            curveVertex(24, -109);
            curveVertex(60, -98);
            curveVertex(100, -30);
            curveVertex(99, 54);
            curveVertex(33, 105);
            curveVertex(-51, 84);
            curveVertex(-84, 9);
            curveVertex(-68, -80);
            curveVertex(-32, -100);
            curveVertex(-21, -94);
            endShape();
            popMatrix();
            pushMatrix();
            translate(216, 168);
            scale(0.65, 0.78);
            rotate(0);
            fill(0, 0, 0);
            stroke(184, 184, 184);
            strokeWeight(37);
            beginShape();
            curveVertex(-84, -15);
            curveVertex(-1, -51);
            curveVertex(49, -51);
            curveVertex(82, 18);
            curveVertex(72, 58);
            curveVertex(56, -21);
            curveVertex(26, -44);
            curveVertex(-74, -35);
            curveVertex(-80, 55);
            curveVertex(-90, 56);
            curveVertex(-84, -49);
            curveVertex(-1, -51);
            curveVertex(68, -90);
            endShape();
            popMatrix();
            pushMatrix();
            translate(216, 168);
            scale(0.73, 0.91);
            rotate(0);
            fill(184);
            stroke(0, 0, 0);
            strokeWeight(1);
            beginShape();
            curveVertex(-84, -15);
            curveVertex(-1, -51);
            curveVertex(49, -51);
            curveVertex(82, 18);
            curveVertex(72, 58);
            curveVertex(56, -21);
            curveVertex(26, -44);
            curveVertex(-74, -35);
            curveVertex(-80, 55);
            curveVertex(-90, 56);
            curveVertex(-84, -49);
            curveVertex(-1, -51);
            curveVertex(68, -90);
            endShape();
            popMatrix();
            pushMatrix();
            translate(216, 179);
            scale(0.56, 0.91);
            rotate(0);
            fill(184);
            stroke(0, 0, 0);
            strokeWeight(1);
            beginShape();
            curveVertex(-84, -15);
            curveVertex(-1, -51);
            curveVertex(49, -51);
            curveVertex(82, 18);
            curveVertex(72, 58);
            curveVertex(56, -21);
            curveVertex(26, -44);
            curveVertex(-74, -35);
            curveVertex(-80, 55);
            curveVertex(-90, 56);
            curveVertex(-84, -49);
            curveVertex(-1, -51);
            curveVertex(68, -90);
            endShape();
            popMatrix();
            pushMatrix();
            translate(216, 169);
            scale(0.65, 0.78);
            rotate(0);
            fill(0, 0, 0);
            stroke(0, 0, 0);
            strokeWeight(6);
            beginShape();
            curveVertex(55, -15);
            curveVertex(-1, -51);
            curveVertex(49, -51);
            curveVertex(54, -35);
            curveVertex(51, -41);
            curveVertex(56, -33);
            curveVertex(26, -38);
            curveVertex(-74, -35);
            curveVertex(-80, -32);
            curveVertex(-90, -33);
            curveVertex(-70, -52);
            curveVertex(-1, -51);
            curveVertex(68, -90);
            endShape();
            popMatrix();
            pushMatrix();
            translate(202, 207);
            scale(0.78);
            rotate(5);
            fill(15, 15, 15);
            stroke(15, 15, 15);
            strokeWeight(5);
            beginShape();
            curveVertex(-68, -86);
            curveVertex(-32, -73);
            curveVertex(-21, -73);
            curveVertex(-14, -71);
            curveVertex(9, -77);
            curveVertex(21, -75);
            curveVertex(24, -76);
            curveVertex(60, -74);
            curveVertex(100, -30);
            curveVertex(99, 54);
            curveVertex(33, 105);
            curveVertex(-51, 84);
            curveVertex(-84, 9);
            curveVertex(-68, -58);
            curveVertex(-32, -71);
            curveVertex(-21, -85);
            endShape();
            popMatrix();
            //hands
            if (drawSpriteHands) {
                fill(38, 38, 38);
                stroke(23);
                strokeWeight(10);
                ellipse(90, 103, 70, 70);
                ellipse(326, 103, 70, 70);
            }
        }
        break;
        case "Clone Trooper": {
            strokeWeight(5);
            pushMatrix();
            translate(200, 200);
            rotate(5);
            fill(230);
            stroke(196, 196, 196);
            beginShape();
            curveVertex(-68, -90);
            curveVertex(-32, -106);
            curveVertex(-21, -110);
            curveVertex(-14, -111);
            curveVertex(9, -114);
            curveVertex(21, -112);
            curveVertex(24, -111);
            curveVertex(60, -98);
            curveVertex(100, -30);
            curveVertex(99, 54);
            curveVertex(33, 105);
            curveVertex(-51, 84);
            curveVertex(-84, 9);
            curveVertex(-68, -77);
            curveVertex(-32, -106);
            curveVertex(-21, -67);
            endShape();
            popMatrix();
            pushMatrix();
            translate(225, 230);
            scale(0.79, 1.33);
            rotate(0);
            fill(18, 18, 18);
            noStroke();
            beginShape();
            curveVertex(-77, -103);
            curveVertex(-27, -90);
            curveVertex(-10, -90);
            curveVertex(32, -100);
            curveVertex(-14, -77);
            curveVertex(18, -53);
            curveVertex(-23, -38);
            curveVertex(-59, -52);
            curveVertex(-28, -77);
            curveVertex(-77, -103);
            curveVertex(-27, -90);
            curveVertex(-10, -90); /**/
            endShape();
            popMatrix();
            pushMatrix();
            translate(202, 207);
            scale(0.78);
            rotate(5);
            fill(242, 242, 242);
            stroke(237, 237, 237);
            strokeWeight(5);
            beginShape();
            curveVertex(-68, -86);
            curveVertex(-32, -73);
            curveVertex(-21, -73);
            curveVertex(-14, -71);
            curveVertex(9, -77);
            curveVertex(21, -75);
            curveVertex(24, -76);
            curveVertex(60, -74);
            curveVertex(100, -30);
            curveVertex(99, 54);
            curveVertex(33, 105);
            curveVertex(-51, 84);
            curveVertex(-84, 9);
            curveVertex(-68, -58);
            curveVertex(-32, -71);
            curveVertex(-21, -85);
            endShape();
            popMatrix();
            //hands
            if (drawSpriteHands) {
                fill(250);
                stroke(214, 214, 214);
                strokeWeight(10);
                ellipse(90, 103, 70, 70);
                ellipse(326, 103, 70, 70);
                strokeWeight(5);
                fill(217, 217, 217);
                noStroke();
            }
        }
        break;
        case "Rebel Trooper": {
            popMatrix();
            pushMatrix();
            scale(size / 200);
            pushMatrix();
            scale(0.85);
            rectMode(CENTER);
            strokeWeight(10);
            fill(207, 185, 135);
            stroke(173, 155, 114);
            ellipse(0, 0, 200, 200);
            noStroke();
            fill(245, 245, 245);
            ellipse(0, 35, 217, 150);
            ellipse(-48, 14, 139, 91);
            ellipse(48, 13, 139, 91);
            fill(0);
            ellipse(-44, -53, 20, 16);
            ellipse(44, -53, 20, 16);
            ellipse(0, 38, 171, 100);
            fill(10);
            ellipse(0, 56, 158, 107);
            noFill();
            stroke(10);
            strokeWeight(8);
            arc(0, 0, 211, 211, -168, -11);
            fill(250);
            noStroke();
            ellipse(0, -104, 59, 23);
            popMatrix();
            //hands
            if (drawSpriteHands) {
                fill(209, 188, 140);
                stroke(173, 155, 114);
                strokeWeight(10);
                ellipse(-110, -97, 70, 70);
                ellipse(110, -97, 70, 70);
            }
        }
        break;
    }
    popMatrix();
};
var drawSkinHands = function(skinName, size) {
    pushMatrix();
    if (skinName === "Rebel Trooper" || skinName === "Luke Skywalker") {
        scale(size / 200);
        if (skinName === "Luke Skywalker") {
            fill(219, 197, 143);
        } else {
            fill(209, 188, 140);
        }
        stroke(173, 155, 114);
        strokeWeight(10);
        ellipse(-110, -97, 70, 70);
        ellipse(110, -97, 70, 70);
    } else {
        scale(size / 212);
        translate(-212, -203);
        if (skinName === "First Order Stormtrooper" || skinName === "Clone Trooper") {
            fill(250);
            stroke(214, 214, 214);
            strokeWeight(10);
            if (skinName === "First Order Stormtrooper") {
                ellipse(163, 41, 70, 70);
                ellipse(249, -34, 70, 70);
            } else {
                ellipse(90, 103, 70, 70);
                ellipse(326, 103, 70, 70);
            }
        } else if (skinName === "Shoretrooper" || skinName === "Heavy Shoretrooper") {
            fill(56, 56, 56);
            stroke(15, 15, 15);
            strokeWeight(10);
            ellipse(90, 103, 70, 70);
            ellipse(326, 103, 70, 70);
            fill(202, 193, 136);
            stroke(184, 176, 128);
            arc(90, 103, 70, 70, -14, 175);
            arc(326, 103, 70, 70, 9, 194);
            fill(112, 112, 112);
            stroke(23, 23, 23);
            strokeWeight(5);
            rect(204, 105, 23, 31, 0, 0, 100, 100);
            if (skinName === "Heavy Shoretrooper") {
                fill(133, 133, 133);
                noStroke();
                rect(205, 220, 40, 151, 10);
            }
        } else {
            fill(38, 38, 38);
            stroke(23);
            strokeWeight(10);
            ellipse(90, 103, 70, 70);
            ellipse(326, 103, 70, 70);
        }
    }
    popMatrix();
};
var weaponSprite = function(x, y, s, r, type, c) {
    if (!c) {
        fill(0);
        stroke(0);
    } else {
        fill(c);
        stroke(255);
    }
    strokeWeight(2);
    pushMatrix();
    translate(x, y);
    scale(s / 400);
    translate(-200, -200);
    rotate(r);
    switch (type) {
        case "F_11D":
            var shapes = [
                [
                    [35, 188],
                    [37, 177],
                    [58, 176],
                    [63, 181],
                    [80, 182],
                    [87, 179],
                    [96, 179],
                    [96, 176],
                    [98, 174],
                    [104, 174],
                    [106, 178],
                    [117, 177],
                    [117, 169],
                    [93, 168],
                    [90, 163],
                    [91, 158],
                    [94, 156],
                    [110, 156],
                    [119, 159],
                    [120, 157],
                    [123, 157],
                    [123, 153],
                    [128, 153],
                    [128, 156],
                    [130, 157],
                    [162, 155],
                    [166, 156],
                    [167, 165],
                    [165, 167],
                    [138, 167],
                    [136, 171],
                    [137, 175],
                    [154, 177],
                    [171, 176],
                    [176, 177],
                    [180, 182],
                    [191, 182],
                    [193, 179],
                    [196, 178],
                    [262, 180],
                    [277, 179],
                    [286, 180],
                    [291, 185],
                    [323, 186],
                    [325, 172],
                    [328, 169],
                    [336, 168],
                    [339, 169],
                    [344, 175],
                    [346, 179],
                    [347, 189],
                    [357, 190],
                    [358, 192],
                    [363, 193],
                    [364, 205],
                    [361, 209],
                    [357, 209],
                    [354, 212],
                    [347, 212],
                    [343, 215],
                    [340, 215],
                    [351, 220],
                    [355, 224],
                    [355, 227],
                    [352, 228],
                    [352, 230],
                    [349, 232],
                    [349, 235],
                    [337, 234],
                    [336, 232],
                    [326, 233],
                    [325, 246],
                    [319, 250],
                    [307, 249],
                    [294, 245],
                    [274, 243],
                    [261, 240],
                    [253, 240],
                    [246, 238],
                    [230, 238],
                    [222, 234],
                    [216, 228],
                    [214, 228],
                    [208, 222],
                    [208, 218],
                    [194, 217],
                    [192, 215],
                    [166, 215],
                    [165, 220],
                    [161, 226],
                    [142, 225],
                    [140, 241],
                    [137, 244],
                    [127, 249],
                    [124, 249],
                    [114, 239],
                    [113, 231],
                    [120, 215],
                    [128, 213],
                    [126, 210],
                    [108, 208],
                    [106, 204],
                    [107, 200],
                    [96, 200],
                    [92, 196],
                    [90, 199],
                    [86, 199],
                    [83, 201],
                    [69, 201],
                    [65, 209],
                    [64, 217],
                    [44, 220],
                    [37, 206]
                ],
                [
                    [328, 179],
                    [328, 186],
                    [332, 186],
                    [332, 181],
                    [335, 177],
                    [337, 177],
                    [337, 173],
                    [334, 170],
                    [331, 170]
                ],
                [
                    [123, 149],
                    [130, 149],
                    [130, 152],
                    [123, 152]
                ]
            ];
            for (var i = 0; i < shapes.length; i++) {
                beginShape();
                for (var j = 0; j < shapes[i].length; j++) {
                    vertex(shapes[i][j][0], shapes[i][j][1]);
                }
                endShape(CLOSE);
            }
            break;
        case "E11":
            var shapes = [
                [
                    [12.5, 200.6],
                    [17.4, 196.9],
                    [28.7, 195.6],
                    [27.4, 178.2],
                    [33.6, 164.5],
                    [38.6, 158.3],
                    [46.1, 159.5],
                    [48.6, 164.5],
                    [162, 163.2],
                    [164.5, 164.5],
                    [164.5, 169.5],
                    [180.7, 169.5],
                    [181.9, 158.3],
                    [184.4, 153.3],
                    [190.7, 152],
                    [195.6, 148.3],
                    [205.6, 153.3],
                    [216.8, 153.3],
                    [218.1, 158.3],
                    [226.8, 157],
                    [226.8, 153.3],
                    [219.3, 152],
                    [218.1, 148.3],
                    [221.8, 143.3],
                    [226.8, 142.1],
                    [226.8, 133.3],
                    [229.3, 128.3],
                    [255.5, 128.3],
                    [266.7, 130.8],
                    [276.6, 130.8],
                    [282.9, 128.3],
                    [310.3, 128.3],
                    [311.5, 148.3],
                    [309, 153.3],
                    [286.6, 153.3],
                    [269.2, 149.5],
                    [267.9, 158.3],
                    [337.7, 158.3],
                    [340.2, 164.5],
                    [343.9, 164.5],
                    [343.9, 162],
                    [347.7, 158.3],
                    [353.9, 158.3],
                    [358.9, 168.2],
                    [376.3, 168.2],
                    [381.3, 169.5],
                    [385, 174.5],
                    [382.6, 195.6],
                    [377.6, 200.6],
                    [362.6, 199.4],
                    [360.1, 196.9],
                    [356.4, 196.9],
                    [353.9, 201.9],
                    [347.7, 203.1],
                    [332.7, 203.1],
                    [332.7, 196.9],
                    [294.1, 196.9],
                    [289.1, 199.4],
                    [272.9, 200.6],
                    [266.7, 206.9],
                    [266.7, 215.6],
                    [292.8, 256.7],
                    [291.6, 261.7],
                    [276.6, 272.9],
                    [269.2, 272.9],
                    [267.9, 259.2],
                    [261.7, 253],
                    [256.7, 243],
                    [253, 240.5],
                    [248, 230.5],
                    [238, 221.8],
                    [231.8, 219.3],
                    [228, 226.8],
                    [220.6, 233],
                    [206.9, 234.3],
                    [198.1, 231.8],
                    [196.9, 229.3],
                    [203.1, 231.8],
                    [219.3, 231.8],
                    [230.5, 220.6],
                    [230.5, 218.1],
                    [228, 218.1],
                    [226.8, 215.6],
                    [220.6, 215.6],
                    [218.1, 224.3],
                    [215.6, 224.3],
                    [214.3, 230.5],
                    [211.8, 230.5],
                    [213.1, 219.3],
                    [208.1, 206.9],
                    [193.1, 208.1],
                    [193.1, 225.5],
                    [196.9, 228],
                    [194.4, 229.3],
                    [191.9, 225.5],
                    [191.9, 208.1],
                    [100.9, 208.1],
                    [97.2, 210.6],
                    [96, 214.3],
                    [91, 216.8],
                    [68.5, 216.8],
                    [19.9, 213.1],
                    [16.2, 209.3],
                    [13.7, 209.3]
                ],
                [
                    [33.6, 196.9],
                    [39.9, 200.6],
                    [46.1, 200.6],
                    [62.3, 205.6],
                    [67.3, 205.6],
                    [73.5, 201.9],
                    [72.3, 198.1]
                ]
            ];
            for (var i = 0; i < shapes.length; i++) {
                beginShape();
                for (var j = 0; j < shapes[i].length; j++) {
                    vertex(shapes[i][j][0], shapes[i][j][1]);
                }
                endShape(CLOSE);
            }
            break;
        case "Sniper":
            var shapes = [
                [
                    [6.7, 194.8],
                    [39, 193.8],
                    [44.8, 192.9],
                    [46.7, 190],
                    [61.9, 189],
                    [59, 186.2],
                    [35.2, 188.1],
                    [31.4, 184.3],
                    [33.3, 176.7],
                    [36.2, 175.7],
                    [41, 178.6],
                    [60, 176.7],
                    [61.9, 174.8],
                    [61.9, 167.1],
                    [113.3, 167.1],
                    [117.1, 171],
                    [128.6, 169],
                    [130.5, 171.9],
                    [135.2, 171.9],
                    [141.9, 168.1],
                    [144.8, 168.1],
                    [146.7, 171],
                    [155.2, 171],
                    [159, 167.1],
                    [161.9, 167.1],
                    [163.8, 170],
                    [174.3, 170],
                    [178.1, 166.2],
                    [181, 166.2],
                    [181.9, 169],
                    [194.3, 169],
                    [197.1, 165.2],
                    [200, 165.2],
                    [203.8, 169],
                    [215.2, 168.1],
                    [217.1, 164.3],
                    [221, 164.3],
                    [221.9, 167.1],
                    [244.8, 167.1],
                    [252.4, 164.3],
                    [254.3, 165.2],
                    [253.3, 174.8],
                    [221.9, 174.8],
                    [220, 177.6],
                    [220, 187.1],
                    [219, 178.6],
                    [216.2, 174.8],
                    [202.9, 174.8],
                    [199, 180.5],
                    [194.3, 174.8],
                    [182.9, 175.7],
                    [180, 180.5],
                    [175.2, 175.7],
                    [167.6, 175.7],
                    [163.8, 176.7],
                    [161, 180.5],
                    [161, 185.2],
                    [160, 179.5],
                    [157.1, 176.7],
                    [147.6, 176.7],
                    [143.8, 181.4],
                    [139, 176.7],
                    [130.5, 177.6],
                    [127.6, 182.4],
                    [121.9, 177.6],
                    [118.1, 178.6],
                    [113.3, 184.3],
                    [101.9, 186.2],
                    [101.9, 191],
                    [106.7, 192.9],
                    [107.6, 197.6],
                    [124.8, 196.7],
                    [126.7, 195.7],
                    [126.7, 191],
                    [127.6, 195.7],
                    [137.1, 197.6],
                    [142.9, 194.8],
                    [142.9, 191],
                    [144.8, 194.8],
                    [154.3, 196.7],
                    [160, 193.8],
                    [160, 190],
                    [161.9, 193.8],
                    [175.2, 194.8],
                    [178.1, 193.8],
                    [179, 190],
                    [180, 193.8],
                    [197.1, 193.8],
                    [198.1, 190],
                    [201, 193.8],
                    [217.1, 193.8],
                    [220, 189],
                    [220, 192.9],
                    [246.7, 193.8],
                    [250.5, 198.6],
                    [365.7, 195.7],
                    [366.7, 197.6],
                    [380, 196.7],
                    [381, 199.5],
                    [386.7, 199.5],
                    [391.4, 196.7],
                    [391.4, 207.1],
                    [380, 205.2],
                    [379, 208.1],
                    [347.6, 209],
                    [336.2, 207.1],
                    [254.3, 205.2],
                    [255.2, 211],
                    [205.7, 211],
                    [199, 218.6],
                    [198.1, 225.2],
                    [192.4, 221.4],
                    [169.5, 220.5],
                    [143.8, 220.5],
                    [142.9, 222.4],
                    [95.2, 221.4],
                    [92.4, 216.7],
                    [87.6, 214.8],
                    [140, 214.8],
                    [141.9, 209],
                    [139, 207.1],
                    [108.6, 206.2],
                    [107.6, 208.1],
                    [101.9, 208.1],
                    [100, 211],
                    [100, 209],
                    [86.7, 208.1],
                    [84.8, 210],
                    [82.9, 208.1],
                    [79, 213.8],
                    [64.8, 214.8],
                    [58.1, 230],
                    [58.1, 234.8],
                    [61, 238.6],
                    [59, 241.4],
                    [54.3, 241.4],
                    [42.9, 232.9],
                    [46.7, 221.4],
                    [51.4, 216.7],
                    [50.5, 212.9],
                    [38.1, 216.7],
                    [36.2, 209],
                    [27.6, 197.6],
                    [21, 204.3],
                    [21, 222.4],
                    [11.4, 223.3]
                ],
                [
                    [142.9, 209],
                    [142.9, 213.8],
                    [147.6, 218.6],
                    [181.9, 219.5],
                    [187.6, 213.8],
                    [186.7, 211],
                    [156.2, 210],
                    [155.2, 207.1]
                ],
                [
                    [82.9, 187.1],
                    [82.9, 192.9],
                    [97.1, 192.9],
                    [99, 190],
                    [98.1, 185.2],
                    [94.3, 184.3],
                    [83.8, 184.3]
                ],
                [
                    [81, 204.3],
                    [81.9, 207.1],
                    [85.7, 205.2],
                    [84.8, 202.4]
                ]
            ];
            for (var i = 0; i < shapes.length; i++) {
                beginShape();
                for (var j = 0; j < shapes[i].length; j++) {
                    vertex(shapes[i][j][0], shapes[i][j][1]);
                }
                endShape(CLOSE);
            }
            break;
        case "Kylo Ren Lightsaber":
            var shapes = [
                [
                    [107, 57.3],
                    [111.4, 46.5],
                    [118.9, 38.9],
                    [120, 27],
                    [162.2, 27],
                    [163.2, 23.8],
                    [169.7, 23.8],
                    [170.8, 27],
                    [182.7, 27],
                    [181.6, 11.9],
                    [187, 8.6],
                    [213, 8.6],
                    [218.4, 10.8],
                    [218.4, 25.9],
                    [228.1, 25.9],
                    [229.2, 22.7],
                    [235.7, 22.7],
                    [235.7, 25.9],
                    [276.8, 24.9],
                    [280, 27],
                    [280, 35.7],
                    [284.3, 36.8],
                    [293, 55.1],
                    [291.9, 57.3],
                    [271.4, 58.4],
                    [238.9, 58.4],
                    [231.4, 55.1],
                    [231.4, 130.8],
                    [234.6, 134.1],
                    [231.4, 136.2],
                    [231.4, 147],
                    [222.7, 149.2],
                    [222.7, 152.4],
                    [227, 153.5],
                    [225.9, 280],
                    [223.8, 281.1],
                    [223.8, 291.9],
                    [227, 293],
                    [229.2, 299.5],
                    [231.4, 364.3],
                    [234.6, 378.4],
                    [229.2, 380.5],
                    [225.9, 387],
                    [218.4, 390.3],
                    [188.1, 391.4],
                    [178.4, 387],
                    [176.2, 382.7],
                    [168.6, 380.5],
                    [171.9, 357.8],
                    [173, 298.4],
                    [178.4, 293],
                    [178.4, 281.1],
                    [176.2, 280],
                    [175.1, 191.4],
                    [175.1, 154.6],
                    [178.4, 153.5],
                    [178.4, 150.3],
                    [177.3, 148.1],
                    [168.6, 147],
                    [168.6, 135.1],
                    [166.5, 135.1],
                    [166.5, 131.9],
                    [168.6, 131.9],
                    [168.6, 56.2],
                    [164.3, 58.4],
                    [138.4, 59.5],
                    [107, 59.5]
                ],
                [
                    [218.4, 351.4],
                    [218.4, 366.5],
                    [219.5, 368.6],
                    [227, 368.6],
                    [227, 349.2]
                ],
                [
                    [176.2, 350.3],
                    [177.3, 369.7],
                    [180.5, 369.7],
                    [183.8, 365.4],
                    [184.9, 351.4]
                ]
            ];
            for (var i = 0; i < shapes.length; i++) {
                beginShape();
                for (var j = 0; j < shapes[i].length; j++) {
                    vertex(shapes[i][j][0], shapes[i][j][1]);
                }
                endShape(CLOSE);
            }
            break;
    }
    popMatrix();
};
var headerFont = createFont("Magneto", 25);
var backupHeaderFont = createFont("Arial Bold Italic", 25);
var basicHeaderFont = createFont("sans-serif", 25);
var mainFont = createFont("Cascadia Code", 30);
var backupMainFont = createFont("Source Code Pro", 30);
var basicMainFont = createFont("monospace", 30);
var titleFont = createFont("CASTELLAR", 45);
var backupTitleFont = createFont("Times New Roman", 45);
var basicTitleFont = createFont("serif", 45);
var imagesToLoad = [{
    //Menu Title
    display: function() {
        textAlign(CENTER, CENTER);
        background(0);
        fill(255);
        textFont(basicHeaderFont);
        textFont(backupHeaderFont);
        textFont(headerFont);
        text("S T A R   W A R S", 295, 150);
        textFont(basicTitleFont);
        textFont(backupTitleFont);
        textFont(titleFont);
        text("BATTLEFRONT", 300, 190);
        textFont(basicMainFont, 20);
        textFont(backupMainFont, 20);
        textFont(mainFont, 20);
        fill(220);
        text("By @KingCobraVenom\nand @LemoncelloJr", 300, 280);
        stroke(230);
        strokeWeight(5);
        line(135, 215, 465, 215);
    },
    w: 600,
    h: 600,
    name: "MenuMain"
}, {
    //Play menu
    display: function() {
        textAlign(CENTER, CENTER);
        background(0);
        fill(100);
        stroke(220);
        strokeWeight(4);
        rectMode(CENTER);
        rect(300, 170, 250, 50);
        rect(300, 240, 210, 50);
        rect(300, 310, 170, 50);
        fill(255);
        textFont(basicHeaderFont, 35);
        textFont(backupHeaderFont, 35);
        textFont(headerFont, 35);
        text("Game Selection", 295, 105);
        textFont(basicMainFont, 25);
        textFont(backupMainFont, 25);
        textFont(mainFont, 25);
        text("Quick Match", 300, 170);
        text("Custom Game", 300, 240);
        text("Campaigns", 300, 310);
    },
    w: 600,
    h: 600,
    name: "MenuPlay"
}, {
    //Custom Game Screen
    display: function() {
        background(0);
        fill(255);
        textFont(basicHeaderFont, 35);
        textFont(backupHeaderFont, 35);
        textFont(headerFont, 35);
        text("Custom Match", 295, 105);
        rectMode(CENTER);
        fill(100);
        stroke(220);
        strokeWeight(4);
        rect(300, 160, 200, 30);
        rect(300, 190, 150, 25);
        ellipse(300, 260, 110, 90);
        rect(300, 345, 70, 50);
        rect(300, 400, 90, 25);
        fill(130);
        stroke(255);
        triangle(180, 180, 180, 140, 150, 160);
        triangle(420, 180, 420, 140, 450, 160);
        triangle(220, 280, 220, 240, 190, 260);
        triangle(380, 280, 380, 240, 410, 260);
        fill(255);
        textFont(basicMainFont, 20);
        textFont(backupMainFont, 20);
        textFont(mainFont, 20);
        text("Advanced ⚙️", 300, 190);
        text("Start", 300, 400);
    },
    w: 600,
    h: 600,
    name: "MenuPlayCustom"
}, {
    //Shop
    display: function() {
        background(0);
        fill(255);
        textFont(basicHeaderFont, 35);
        textFont(backupHeaderFont, 35);
        textFont(headerFont, 35);
        text("Select Character", 295, 105);
        //Trooper Classes
        stroke(255);
        strokeWeight(4);
        fill(100);
        rect(212.5, 150, 150, 30);
        rect(387.5, 150, 150, 30);
        rect(227.5, 190, 120, 30);
        rect(372.5, 190, 120, 30);
        //Reinforcements
        rect(300, 240, 210, 30);
        rect(300, 285, 180, 30);
        rect(300, 330, 150, 30);
        rect(300, 375, 120, 30);
        fill(255);
        textFont(mainFont, 20);
        textAlign(CENTER, CENTER);
        text("Assault", 212.5, 150);
        text("Specialist", 387.5, 150);
        text("Officer", 227.5, 190);
        text("Heavy", 372.5, 190);
        text("Jedi", 300, 240);
        text("Infiltrator", 300, 285);
        text("Enforcer", 300, 330);
        text("Aerial", 300, 375);
    },
    w: 600,
    h: 600,
    name: "MenuShop"
}, {
    //Credits
    display: function() {
        background(0);
        textFont(basicHeaderFont, 35);
        textFont(backupHeaderFont, 35);
        textFont(headerFont, 35);
        fill(255);
        text("Main Development By", 295, 185);
        text("With Thanks To", 295, 280);
        stroke(255);
        strokeWeight(3);
        fill(100);
        rect(300, 125, 230, 42);
        fill(255);
        textFont(mainFont, 20);
        text("Full Credits", 300, 125);
        textFont(mainFont, 20);
        fill(220);
        text("LemoncelloJr\nCoder Guy", 300, 230);
        text("DebugRanger\nBristleFrost\nGreenGhost\nEA\nSwankyMan", 300, 360);
    },
    w: 600,
    h: 600,
    name: "MenuCredits"
}, {
    //Achievements
    display: function() {},
    w: 600,
    h: 600,
    name: "MenuAchievements"
}, {
    //Minimap
    display: function() {
        background(0);
        fill(255);
        ellipse(75, 75, 150, 150);
    },
    w: 150,
    h: 150,
    name: "MinimapMask"
}, {
    //AT-AT
    display: function() {
        strokeWeight(lowDetailMode ? 8 : 2);
        var metalColor = color(95, 98, 95);
        var rustColor = color(133, 94, 66);
        var mossColor = color(77, 89, 72);
        for (var y = -298; y < 300; y += lowDetailMode ? 3 : 1) {
            for (var x = -147; x < 105; x += lowDetailMode ? 3 : 1) {
                var n = noise(x * 0.014, y * 0.012);
                if (n > 0.55) {
                    stroke(rustColor);
                    point(x, y);
                } else if (n > 0.45) {
                    stroke(mossColor);
                    point(x, y);
                }
            }
        }
    },
    w: 600, //Size of the image you're loading
    h: 600,
    name: "AT_AT_Moss"
}, {
    //Sand
    display: function() {
        strokeWeight(lowDetailMode ? 8 : 2);
        for (var i = 0; i < 600; i += lowDetailMode ? 6 : 2) {
            for (var j = 0; j < 600; j += lowDetailMode ? 6 : 2) {
                if (!(i > 59 && i < 121 && j > 89 && j < 361)) {
                    stroke(map(noise(i / 100, j / 100), 0, 1, 180, 255), map(noise(i / 100 + 1000, j / 100 + 1000), 0, 1, 150, 200), map(noise(i / 100 + 3000, j / 100 + 3000), 0, 1, 10, 40));
                    point(i, j);
                }
            }
        }
        noStroke();
        for (var i = 0; i < 5000; i += lowDetailMode ? 3 : 1) {
            var Size = random(0.2, 1.2);
            fill(random(200, 255), random(150, 200), random(0, 75));
            var x = random(0, 600);
            var y = random(0, 600);
            if (!(x > 60 && x < 120 && y > 90 && y < 360)) {
                ellipse(x, y, Size, Size);
            }
        }
    },
    w: 600,
    h: 600,
    name: "Jakku_Sand"
}, {
    //Sandy AT-AT
    display: function() {
        strokeWeight(lowDetailMode ? 10 : 3);
        var metalColor = color(95, 98, 95);
        var ATATrustColor = color(200, 94, 70);
        var ATATsandColor = color(200, 180, 80);
        for (var y = -298; y < 300; y += lowDetailMode ? 3 : 1) {
            for (var x = -147; x < 105; x += lowDetailMode ? 3 : 1) {
                stroke(map(noise(x * 0.014, y * 0.012), 0, 1, 100, 220), map(noise(x * 0.014 + 1000, y * 0.012 + 1000), 0, 1, 50, 190), map(noise(x * 0.014 - 1000, y * 0.012 - 1000), 0, 1, 0, 80), map(noise(x * 0.014 - 15214, y * 0.012 + 43633), 0, 1, -180, 255));
                point(x, y);
            }
        }
    },
    w: 600,
    h: 600,
    name: "AT_AT_Sand"
}, {
    display: function() {
        strokeWeight(lowDetailMode ? 8 : 2);
        for (var x = 0; x < 600; x += lowDetailMode ? 6 : 2) {
            for (var y = 0; y < 300; y += lowDetailMode ? 6 : 2) {
                if (noise(x / 70, y / 70) > 0.57) {
                    stroke(180, 80, 50, map(noise(x / 70, y / 70), 0, 1, 150, 300));
                    point(x, y);
                } else if (noise(x / 70, y / 70) > 0.45) {
                    stroke(170, 140, 30, map(noise(x / 70, y / 70), 0, 1, 150, 300));
                    point(x, y);
                }
            }
        }
    },
    w: 600,
    h: 300,
    name: "Jakku_Platform_Sand"
}, {
    display: function() {
        var x = 300;
        var y = 300;
        var s = 600;
        var r = 0;
        rectMode(CENTER);
        pushMatrix();
        translate(x, y + 16);
        scale(s / 600, s / 670);
        rotate(r);
        noStroke();
        fill(189, 189, 189);
        rect(228, 34, 52, 25);
        fill(130);
        ellipse(0, 0, 500, 500);
        fill(189, 189, 189);
        arc(0, -40, 550, 520, -179, 0);
        arc(0, 40, 550, 520, 0, 180);
        rect(-174, 79, 160, 107);
        rect(-178, -79, 152, 107);
        rect(79, 79, 160, 107);
        rect(79, -79, 160, 107);
        rect(-78, 113, 50, 200);
        rect(-27, -113, 52, 200);
        rect(182, 113, 50, 200);
        rect(233, -52, 46, 79);
        fill(255, 0, 0);
        stroke(140, 0, 0);
        strokeWeight(7);
        pushMatrix();
        translate(-174, -177);
        rotate(31);
        ellipse(0, 0, 38, 50);
        popMatrix();
        fill(166, 166, 166);
        stroke(148, 148, 148);
        strokeWeight(5);
        pushMatrix();
        translate(-222, -1);
        ellipse(0, 0, 24, 30);
        ellipse(42, 0, 25, 30);
        ellipse(91, 0, 26, 30);
        popMatrix();
        noFill();
        stroke(60);
        strokeWeight(1);
        arc(0, -42, 514, 510, -90, 0);
        arc(0, -38, 418, 526, -90, 0);
        arc(0, -38, 320, 526, -90, 0);
        arc(0, -29, 1, 571, -180, -90);
        arc(0, -44, 107, 540, -180, -90);
        arc(0, -44, 202, 540, -180, -90);
        arc(0, -44, 508, 521, -180, -90);
        pushMatrix();
        translate(300, 300);
        scale(1, -1);
        translate(-300, 300);
        arc(0, -42, 514, 517, -90, 0);
        arc(0, -39, 415, 520, -90, 0);
        arc(0, -27, 313, 547, -90, 0);
        arc(0, -45, 4, 509, -180, -90);
        arc(0, -44, 106, 512, -180, -90);
        arc(0, -31, 208, 537, -180, -90);
        arc(0, -44, 508, 513, -180, -90);
        popMatrix();
        pushMatrix();
        translate(0, -309);
        scale(1.5, 1);
        rotate(0);
        fill(158, 158, 158);
        stroke(133, 133, 133);
        strokeWeight(8);
        beginShape();
        curveVertex(-90, 18);
        curveVertex(-42, -20);
        curveVertex(35, -10);
        curveVertex(99, 44);
        curveVertex(98, 49);
        curveVertex(35, 16);
        curveVertex(-21, 24);
        curveVertex(-58, 65);
        curveVertex(-67, 71);
        curveVertex(-100, 62);
        curveVertex(-109, 50);
        curveVertex(-42, -20);
        curveVertex(33, -22);
        endShape();
        popMatrix();
        popMatrix();
    },
    w: 600,
    h: 600,
    name: "thermal_detonator"
}, {
    display: function() {
        var x = 200;
        var y = 200;
        var s = 200;
        var r = 0;
        rectMode(CENTER);
        pushMatrix();
        translate(x, y);
        scale(s / 200, s / 200);
        rotate(r);
        noStroke();
        fill(240);
        stroke(230);
        strokeWeight(10);
        rect(0, 0, 200, 100, 10);
        fill(255, 30, 30);
        stroke(255, 0, 0);
        rect(0, 0, 60, 20, 5);
        rect(0, 0, 20, 60, 5);
        noStroke();
        rect(0, 0, 50, 11);
        fill(153, 144, 144);
        quad(48, -45, 68, -45, 95, 4, 95, 40);
        quad(-87, -45, -65, -45, -34, 45, -54, 45);
        popMatrix();
    },
    w: 400,
    h: 400,
    name: "medkit_1"
}, {
    display: function() {
        var jetpackIcon = function(x, y, s, r) {
            pushStyle();
            rectMode(CENTER);
            noStroke();
            pushMatrix();
            translate(x, y);
            scale(s / 400);
            fill(130, 130, 130);
            rect(-30, 10, 30, 100, 100);
            rect(30, 10, 30, 100, 100);
            fill(100);
            rect(-30, 58, 30, 10, 50);
            rect(30, 58, 30, 10, 50);
            fill(153, 153, 153);
            rect(0, 0, 60, 100, 20);
            stroke(100);
            strokeWeight(6);
            arc(-18, 4, 15, 60, -270, -90);
            arc(18, 4, 15, 60, -90, 90);
            noStroke();
            fill(255, 200, 0);
            triangle(-43, 63, -17, 63, -30, 100);
            triangle(43, 63, 17, 63, 30, 100);
            fill(255, 0, 0);
            triangle(-40, 63, -20, 63, -30, 80);
            triangle(40, 63, 20, 63, 30, 80);
            popMatrix();
            popStyle();
        };
        jetpackIcon(95, 80, 600, 0);
    },
    w: 200,
    h: 230,
    name: "jetpack_icon"
}, {
    //jetpack sprite
    display: function() {
        var jetpackSprite = function(x, y, s, r) {
            pushStyle();
            pushMatrix();
            translate(x, y);
            scale(s / 400);
            noStroke();
            rectMode(CENTER);
            fill(130);
            ellipse(-30, 0, 40, 40);
            ellipse(30, 0, 40, 40);
            fill(153);
            rect(0, 0, 60, 50, 100);
            popMatrix();
            popStyle();
        };
        jetpackSprite(95, 80, 600, 0);
    },
    w: 200,
    h: 230,
    name: "jetpack_sprite"
}, {
    //red landmine
    display: function() {
        var redLandmineSprite = function(x, y, s, r) {
            pushStyle();
            pushMatrix();
            translate(x, y);
            scale(s / 400);
            rectMode(CENTER);
            fill(130, 130, 130);
            noStroke();
            ellipse(0, 0, 60, 60);
            stroke(102, 102, 102);
            ellipse(0, 0, 50, 50);
            ellipse(0, 0, 40, 40);
            ellipse(0, 0, 30, 30);
            noStroke();
            fill(143, 143, 143);
            rect(0, 0, 70, 13, 5);
            rect(0, 0, 13, 75, 5);
            fill(99, 99, 99);
            rect(0, 0, 50, 13, 5);
            rect(0, 0, 13, 50, 5);
            fill(255, 122, 122);
            ellipse(0, 0, 10, 10);
            popMatrix();
            popStyle();
        };
        redLandmineSprite(100, 100, 600, 0);
    },
    w: 200,
    h: 200,
    name: "red_landmine_sprite"
}, {
    //blue landmine
    display: function() {
        var blueLandmineSprite = function(x, y, s, r) {
            pushStyle();
            pushMatrix();
            translate(x, y);
            scale(s / 400);
            rectMode(CENTER);
            fill(130, 130, 130);
            noStroke();
            ellipse(0, 0, 60, 60);
            stroke(102, 102, 102);
            ellipse(0, 0, 50, 50);
            ellipse(0, 0, 40, 40);
            ellipse(0, 0, 30, 30);
            noStroke();
            fill(143, 143, 143);
            rect(0, 0, 70, 13, 5);
            rect(0, 0, 13, 75, 5);
            fill(99, 99, 99);
            rect(0, 0, 50, 13, 5);
            rect(0, 0, 13, 50, 5);
            fill(122, 122, 255);
            ellipse(0, 0, 10, 10);
            popMatrix();
            popStyle();
        };
        blueLandmineSprite(100, 100, 800, 0);
    },
    w: 200,
    h: 200,
    name: "blue_landmine_sprite"
}];
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
for (var playerSkinImageIndex = 0; playerSkinImageIndex < skinImgsToBake.length; playerSkinImageIndex++) {
    imagesToLoad.push({
        skinName: skinImgsToBake[playerSkinImageIndex][0],
        display: function() {
            background(255, 0);
            pushMatrix();
            translate(212, 212);
            drawPlayerVector(this.skinName, 212, true);
            popMatrix();
        },
        w: 424,
        h: 424,
        name: skinImgsToBake[playerSkinImageIndex][1]
    });
}
var starWarsLogo = function(x, y, s, alpha) {
    alpha = alpha === undefined ? 255 : alpha;
    pushMatrix();
    scale(s);
    noFill();
    stroke(255, 204, 0, alpha);
    strokeWeight(5);
    //S
    line(x, y + 28, x, y - 4);
    line(x, y + 28, x + 85, y + 28);
    line(x, y - 4, x + 64, y - 4);
    line(x + 67, y - 5, x + 40, y - 42);
    arc(x + 88, y + 10, 35, 35, -35, 97);
    line(x + 102, y, x + 78, y - 36);
    arc(x + 58, y - 49, 37, 37, 158, 276);
    //T
    line(x + 81, y - 36, x + 130, y - 36);
    line(x + 51, y - 68, x + 205, y - 68);
    line(x + 130, y + 28, x + 130, y - 34);
    line(x + 160, y + 28, x + 160, y - 34);
    line(x + 130, y + 28, x + 160, y + 28);
    line(x + 160, y - 36, x + 205, y - 36);
    line(x + 205, y - 67, x + 205, y - 38);
    //A
    line(x + 278, y - 68, x + 235, y - 68);
    line(x + 234, y - 68, x + 192, y + 28);
    line(x + 192, y + 28, x + 221, y + 28);
    line(x + 221, y + 28, x + 229, y + 11);
    line(x + 229, y + 11, x + 270, y + 11);
    line(x + 274, y + 11, x + 281, y + 28);
    line(x + 281, y + 28, x + 310, y + 28);
    line(x + 280, y - 68, x + 310, y + 28);
    line(x + 238, y - 8, x + 268, y - 8);
    line(x + 238, y - 8, x + 253, y - 40);
    line(x + 268, y - 8, x + 253, y - 40);
    //R
    line(x + 323, y - 68, x + 323, y + 28);
    line(x + 323, y - 68, x + 390, y - 68);
    line(x + 323, y + 28, x + 353, y + 28);
    line(x + 353, y + 28, x + 353, y - 2);
    line(x + 353, y - 2, x + 389, y + 27);
    line(x + 389, y + 28, x + 452, y + 28);
    line(x + 452, y + 28, x + 452, y + 1);
    line(x + 452, y + 1, x + 389, y + 1);
    arc(x + 387, y - 33, 68, 70, -78, 90);
    line(x + 355, y - 26, x + 383, y - 26);
    line(x + 355, y - 41, x + 383, y - 41);
    line(x + 355, y - 26, x + 355, y - 41);
    arc(x + 383, y - 33, 14, 14, -78, 90);
    //W
    line(x, y + 58, x + 30, y + 58);
    line(x + 45, y + 58, x + 75, y + 58);
    line(x + 90, y + 58, x + 120, y + 58);
    line(x + 77, y + 150, x + 94, y + 150);
    line(x + 27, y + 150, x + 45, y + 150);
    line(x, y + 58, x + 27, y + 150);
    line(x + 120, y + 58, x + 94, y + 150);
    line(x + 47, y + 150, x + 60, y + 105);
    line(x + 60, y + 105, x + 77, y + 150);
    line(x + 30, y + 58, x + 38, y + 84);
    line(x + 38, y + 84, x + 45, y + 58);
    line(x + 75, y + 58, x + 83, y + 84);
    line(x + 90, y + 58, x + 83, y + 84);
    //A
    line(x + 146, y + 58, x + 186, y + 58);
    line(x + 146, y + 58, x + 121, y + 150);
    line(x + 186, y + 58, x + 214, y + 150);
    line(x + 121, y + 150, x + 139, y + 150);
    line(x + 214, y + 150, x + 192, y + 150);
    line(x + 192, y + 150, x + 185, y + 138);
    line(x + 141, y + 150, x + 148, y + 138);
    line(x + 148, y + 138, x + 185, y + 138);
    line(x + 154, y + 116, x + 179, y + 116);
    line(x + 154, y + 116, x + 168, y + 91);
    line(x + 179, y + 116, x + 168, y + 93);
    //R
    line(x + 230, y + 58, x + 230, y + 150);
    line(x + 230, y + 58, x + 300, y + 58);
    line(x + 230, y + 150, x + 261, y + 150);
    line(x + 261, y + 150, x + 261, y + 123);
    line(x + 261, y + 123, x + 294, y + 150);
    line(x + 297, y + 122, x + 305, y + 129);
    line(x + 281, y + 82, x + 263, y + 82);
    line(x + 281, y + 94, x + 263, y + 94);
    line(x + 262, y + 94, x + 262, y + 82);
    arc(x + 294, y + 89, 59, 63, -78, 90);
    arc(x + 283, y + 88, 10, 12, -78, 90);
    //S
    line(x + 294, y + 150, x + 401, y + 150);
    line(x + 304, y + 130, x + 372, y + 130);
    line(x + 373, y + 130, x + 356, y + 104);
    line(x + 419, y + 126, x + 392, y + 87);
    line(x + 395, y + 87, x + 452, y + 87);
    line(x + 370, y + 58, x + 452, y + 58);
    line(x + 452, y + 84, x + 452, y + 58);
    arc(x + 374, y + 84, 53, 53, -220, -85);
    arc(x + 406, y + 134, 32, 32, -24, 109);
    popMatrix();
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
    var drawnBladeLength = bladeLength !== undefined ? bladeLength : on ? 1 : 0;
    rectMode(CENTER);
    pushMatrix();
    translate(x, y);
    scale(s / 390);
    rotate(r);
    if (type === "Kylo Ren") {
        var kyloLength = drawnBladeLength;
        if (kyloLength > 0.01) {
            glowLine(0, -43, 0, -36 - 300 * kyloLength, color(255, 0, 0, 20), true);
            glowLine(0, -19, 0 + 50 * kyloLength, -19, color(255, 0, 0, 20), false);
            glowLine(0, -19, 0 - 50 * kyloLength, -19, color(255, 0, 0, 20), false);
        }
        strokeWeight(4);
        fill(41, 41, 41);
        stroke(20);
        rect(0, 0, 15, 80, 5);
        rect(0, -19, 40, 15, 5);
        noStroke();
        rect(0, 0, 12, 77, 5);
    } else {
        pushMatrix();
        translate(0, 10);
        var lukeLength = drawnBladeLength;
        if (lukeLength > 0.01) {
            glowLine(0, -43, 0, -36 - 300 * lukeLength, color(100, 150, 255, 20), true);
        }
        strokeWeight(4);
        fill(41, 41, 41);
        stroke(20);
        rect(0, 0, 15, 80, 5);
        popMatrix();
    }
    popMatrix();
};
imagesToLoad.push({
    name: "saber_hotbar_blue",
    w: 64,
    h: 64,
    display: function() {
        lightsaber(23, 48, 48, 35, "Luke Skywalker", true, 1);
    }
}, {
    name: "saber_hotbar_red",
    w: 64,
    h: 64,
    display: function() {
        lightsaber(23, 48, 48, 35, "Kylo Ren", true, 1);
    }
});
var sniperSprite = function(x, y, s) {
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
var propDraw = {
"AT_AT": function() {
    rectMode(CENTER);
    fill(this.color);
    stroke(this.borderColor);
    strokeWeight(this.borderSize);
    pushMatrix();
    translate(this.x, this.y);
    rotate(this.rotation);
    strokeWeight(20);
    stroke(95, 98, 95);
    line(-110, -530, -110, -610);
    noStroke();
    fill(91, 94, 91);
    rect(-24, -339, 124, 132); //neck
    fill(95, 98, 95);
    rect(-23, -456, 189, 161, 20, 100, 10, 10); //head
    {
        fill(91, 94, 91);
        pushMatrix();
        translate(-235, -203);
        rotate(10);
        rect(0, 0, 215, 90); //top leg
        popMatrix();
        pushMatrix();
        translate(-415, -203);
        rotate(-10);
        rect(0, 0, 183, 90); //top leg
        popMatrix();
        pushMatrix();
        translate(-514, -188);
        rotate(-10);
        fill(95, 98, 95);
        rect(0, 0, 80, 164, 0, 30, 30, 0); //top foot
        popMatrix();
    } //Top leg
    {
        fill(91, 94, 91);
        pushMatrix();
        translate(0, 377);
        pushMatrix();
        translate(-188, -203);
        rotate(33);
        rect(0, 0, 215, 90); //bottom leg
        popMatrix();
        pushMatrix();
        translate(-309, -210);
        rotate(-33);
        rect(0, 0, 183, 90); //bottom leg
        popMatrix();
        pushMatrix();
        translate(-386, -151);
        rotate(-40);
        fill(95, 98, 95);
        rect(0, 0, 80, 164, 0, 30, 30, 0); //bottom foot
        popMatrix();
        popMatrix();
    } //Bottom leg
    {
        fill(95, 98, 95);
        pushMatrix();
        translate(89, -184);
        rotate(-24);
        rect(0, 0, 123, 198);
        popMatrix();
        pushMatrix();
        translate(89, 180);
        rotate(24);
        rect(0, 0, 123, 198);
        popMatrix();
        rect(57, 0, 254, 275, 20); //back
        rect(-22, 0, 254, 600, 20); //body
    } //Body
    drawImg(loadedImages[this.imgName], -149, -300, 1407, 1200);
    pushMatrix();
    translate(-347, -177);
    rotate(-80);
    drawImg(loadedImages[this.imgName], 0, 0, 523, 499);
    popMatrix();
    pushMatrix();
    translate(-332, -264);
    rotate(80);
    drawImg(loadedImages[this.imgName], 0, 0, 523, 306);
    popMatrix();
    pushMatrix();
    translate(-308, 151);
    rotate(-57);
    drawImg(loadedImages[this.imgName], 0, 0, 523, 499);
    popMatrix();
    pushMatrix();
    translate(-259, 80);
    rotate(57);
    drawImg(loadedImages[this.imgName], 0, 0, 523, 306);
    popMatrix();
    pushMatrix();
    translate(-113, -379);
    rotate(-90);
    drawImg(loadedImages[this.imgName], 0, 0, 883, 357);
    popMatrix();
    popMatrix();
},
"CrashedTIE": function() {
    pushMatrix();
    translate(this.x, this.y);
    rotate(this.rotation);
    //Broken Wing
    stroke(50, 20, 30);
    strokeWeight(6);
    fill(180, 180, 190);
    quad(180, 150, 200, -120, 360, -210, 320, 240);
    triangle(360, -210, 520, -120, 340, 45);
    line(340, 45, 200, -120);
    line(340, 45, 180, 150);
    fill(155);
    triangle(400, 180, 460, 90, 630, 30);
    triangle(550, -170, 620, -130, 620, -10);
    //Base
    strokeWeight(3);
    if (this.type === "sf") {
        stroke(50, 20, 30);
        fill(40, 40, 50);
        ellipse(0, 0, 200, 200);
        quad(-100, -30, -100, 30, -150, 25, -150, -25);
        fill(130, 0, 0);
        ellipse(75, 0, 50, 130);
        quad(100, -30, 100, 30, 150, 25, 150, -25);
        ellipse(340, 45, 70, 70);
    } else if (this.type === "ln") {
        stroke(20, 30, 50);
        fill(120, 120, 130);
        ellipse(0, 0, 200, 200);
        quad(-100, -30, -100, 30, -150, 25, -150, -25);
        quad(100, -30, 100, 30, 150, 25, 150, -25);
        ellipse(340, 45, 70, 70);
    }
    //Window
    stroke(120);
    strokeWeight(4.5);
    fill(60, 60, 70);
    ellipse(0, 75, 140, 45);
    line(0, 85, 0, 50);
    line(0, 85, 60, 63);
    line(0, 85, -60, 63);
    line(0, 85, 60, 90);
    line(0, 85, -60, 90);
    noStroke();
    fill(60, 60, 70, 150);
    quad(20, 120, 35, 105, 55, 140, 30, 160);
    triangle(-90, 120, -20, 130, -65, 135);
    triangle(-20, 160, -5, 150, 15, 185);
    //Wing
    stroke(50, 20, 30);
    strokeWeight(6);
    fill(180, 180, 190);
    quad(-110, -145, -110, 145, -170, 240, -170, -240);
    quad(-210, -115, -210, 115, -170, 240, -170, -240);
    line(-170, 0, -110, -145);
    line(-170, 0, -110, 145);
    strokeWeight(4);
    line(-170, 0, -210, -115);
    line(-170, 0, -210, 115);
    popMatrix();
},
"CrashedXwing": function() {
    pushMatrix();
    translate(this.x, this.y);
    rotate(this.rotation);
    //Body, Engines
    fill(200);
    stroke(0);
    strokeWeight(3);
    quad(-70, 0, 70, 0, 50, 220, -50, 220);
    rect(0, -125, 140, 250);
    rect(0, -105, 100, 240);
    line(50, -225, 70, -250);
    line(-50, -225, -70, -250);
    rect(-100, -250, 40, 150);
    arc(-100, -325, 40, 20, 180, 360);
    rect(100, -250, 40, 150);
    arc(100, -325, 40, 20, 180, 360);
    fill(175);
    rect(-100, -75, 60, 240);
    arc(-100, -195, 60, 30, 180, 360);
    rect(100, -75, 60, 240);
    arc(100, -195, 60, 30, 180, 360);
    fill(60);
    ellipse(100, 50, 60, 30);
    ellipse(-100, 50, 60, 30);
    //y 50 through -325  height 375, y -138
    //Wings
    fill(195);
    quad(-130, -190, -130, 50, -230, 35, -230, -175);
    fill(210);
    quad(130, -190, 130, 50, 380, 20, 380, -160);
    triangle(-130, -190, -150, -70, -130, -60);
    triangle(-130, -60, -140, -50, -130, -40);
    triangle(-130, -40, -160, 10, -130, 50);
    quad(-300, 420, -440, 400, -430, 120, -220, 140);
    triangle(-430, 120, -432, 90, -330, 130);
    triangle(-330, 130, -325, 120, -305, 132);
    triangle(-305, 132, -285, 110, -240, 137);
    triangle(-240, 137, -220, 110, -220, 140);
    fill(230);
    rect(400, -60, 40, 200);
    arc(400, -160, 40, 20, 180, 360);
    quad(30, 520, 60, 540, 25, 560, 20, 530);
    fill(210);
    ellipse(400, 40, 40, 30);
    stroke(220);
    strokeWeight(8);
    line(400, 40, 400, 240);
    line(45, 530, 200, 350);
    fill(255, 0);
    arc(400, 220, 50, 30, 180, 360);
    arc(-70, 375, 40, 60, 130, 280);
    //Windshield
    stroke(0);
    strokeWeight(3);
    fill(140);
    quad(-55, 50, 55, 50, 50, 10, -50, 10);
    fill(70, 70, 90, 200);
    stroke(140);
    strokeWeight(5);
    quad(-55, 50, 55, 50, 40, 220, -40, 220);
    //Sand
    fill(160, 140, 70);
    noStroke();
    ellipse(-50, 240, 90, 50);
    ellipse(40, 230, 130, 40);
    ellipse(10, 250, 100, 50);
    ellipse(-230, -75, 50, 230);
    ellipse(-260, -120, 70, 180);
    ellipse(-250, -30, 40, 200);
    ellipse(10, 540, 40, 90);
    ellipse(0, 540, 30, 60);
    //Wing Paint
    fill(this.color);
    quad(380, 20, 320, 25, 320, -80, 380, -80);
    triangle(380, -80, 240, -80, 240, -100);
    stroke(this.color);
    strokeWeight(8);
    line(240, -100, 240, -175);
    line(270, -95, 270, -170);
    quad(-305, 420, -370, 410, -365, 360, -288, 360);
    triangle(-370, 410, -360, 280, -375, 280);
    line(-375, 280, -430, 275);
    line(-375, 310, -430, 305);
    popMatrix();
},
"JunkPile": function() {
    pushMatrix();
    translate(this.x, this.y);
    rotate(-this.rotation);
    switch (this.type) {
        case 1:
            noStroke();
            fill(180);
            rect(20, 20, 50, 50);
            stroke(0);
            strokeWeight(2);
            fill(200, 100, 50);
            ellipse(-10, -25, 40, 40);
            ellipse(-30, 15, 35, 35);
            break;
        case 2:
            stroke(0);
            strokeWeight(2);
            fill(200, 100, 50);
            ellipse(0, 0, 55, 55);
            ellipse(50, 0, 40, 40);
            break;
        case 3:
            stroke(200);
            strokeWeight(20);
            line(-180, 60, 15, -170);
            line(-150, -85, 50, -115);
            fill(150);
            noStroke();
            rect(0, 0, 170, 90);
            rect(30, -60, 80, 50);
            break;
        case 4:
            stroke(200, 100, 50);
            strokeWeight(70);
            line(0, -40, 0, 40);
            fill(200, 100, 50);
            stroke(0);
            strokeWeight(2);
            ellipse(-80, 30, 70, 70);
            fill(225, 225, 50);
            textSize(50);
            textAlign(CENTER, CENTER);
            text("☣\n☠", 0, 0);
            textSize(80);
            text("☢", -80, 30);
            break;
        case 5:
            noStroke();
            fill(170);
            rect(0, 0, 180, 180);
            fill(200, 90, 50);
            quad(-50, -30, 30, 10, 40, 40, -40, 10);
            quad(80, -80, 60, 20, 0, 30, 20, -40);
            fill(120);
            ellipse(45, 45, 70, 70);
            rect(-30, -50, 100, 60);
            stroke(120, 25, 0);
            strokeWeight(12);
            line(-80, 80, 30, -20);
            line(-60, 70, 50, -10);
            break;
    }
    popMatrix();
},
"Box": function() {
    rectMode(CENTER);
    fill(97, 76, 23);
    stroke(77, 60, 17);
    strokeWeight(7);
    pushMatrix();
    translate(this.x, this.y);
    rotate(this.rotation);
    rect(0, 0, this.size, this.size);
    line(-this.size / 2, -this.size / 2, this.size / 2, this.size / 2);
    line(-this.size / 2, this.size / 2, this.size / 2, -this.size / 2);
    popMatrix();
},
"Tree": function() {
    //Draw trunk
    strokeWeight(4);
    stroke(15, 15, 15);
    fill(0);
    ellipse(this.x, this.y, this.width / 5, this.height / 5);
    //Draw canopy
    pushMatrix();
    translate(this.x, this.y);
    rotate(this.rotation);
    noStroke();
    fill(this.canopyColor, this.translucent);
    stroke(this.canopyColor, this.translucent - 70);
    if (this.shape === "tri") {
        pushMatrix();
        scale(this.width / 123);
        beginShape();
        vertex(0, 47);
        vertex(39, 63);
        vertex(42, 26);
        vertex(74, 17);
        vertex(53, -16);
        vertex(57, -47);
        vertex(26, -47);
        vertex(0, -75);
        vertex(-26, -47);
        vertex(-59, -47);
        vertex(-55, -18);
        vertex(-70, 15);
        vertex(-41, 28);
        vertex(-39, 63);
        vertex(0, 47);
        endShape();
        popMatrix();
    } else {
        ellipse(0, 0, this.width, this.width);
    }
    popMatrix();
    //Draw platform
    if (dist(playerPos.x, playerPos.y, this.x, this.y) < this.width / 1.78 && playerPos.z < this.zValue) {
        this.translucent = lerp(this.translucent, 175, 0.1);
    } else {
        this.translucent = lerp(this.translucent, 255, 0.1);
    }
}
};
var gunDraw = {
"F_11D": function() {
        translate(0, -11);
        pushStyle();
        noStroke();
        rectMode(CORNER);
        fill(30);
        rect(87, 6, 29, 9, 5);
        rect(111, 5, 5, 11, 50);
        rect(99, 5, 13, 11, 50);
        rect(59, -7, 28, 10, 5);
        rect(15, 13, 28, 10, 5);
        rect(-7, 1, 28, 18, 5);
        fill(255);
        rect(0, 0, 100, 20, 5);
        fill(30);
        rect(41, 3, 60, 2, 5);
        rect(41, 9, 62, 2, 5);
        rect(41, 15, 59, 2, 5);
        rect(8, 3, 28, 14, 5);
        popStyle();
    },
"Sniper": function() {
        sniperSprite(0, 0, 100);
    },
"E11": function() {
        noStroke();
        fill(30);
        rect(87, 4, 29, 12, 5);
        rect(59, -7, 28, 10, 5);
        rect(15, 13, 28, 10, 5);
        rect(-7, 1, 28, 18, 5);
        fill(48, 48, 48);
        rect(0, 0, 100, 20, 5);
        fill(30);
        rect(41, 3, 60, 2, 5);
        rect(41, 9, 62, 2, 5);
        rect(41, 15, 59, 2, 5);
        rect(8, 3, 28, 14, 5);
    }
};
