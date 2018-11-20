/****************************** Draws *******************************/

function drawBackground() {
    noStroke();
    fill(0);
    scaleRect(0, 0, 1600, 720, 0);
    fill(255, 255, 0);
    for (i = 0; i < backgroundStars.length; i++) {
        backgroundStars[i][0] -= (speed / 40);
        if (backgroundStars[i][0] < -800) {
            backgroundStars[i][0] += 1600;
        }
        scaleEllipse(backgroundStars[i][0], backgroundStars[i][1], 5, 5);
    }
}

function drawHealth() {
    noStroke();
    fill(0);
    scaleTextSize(40);
    //scaleText("Timer", -600, -500);
    //scaleText(  mainTimer.getTime(), -600, -400);
    scaleText("Shield Health", -300, -500);
    scaleText(userShip.shieldHealth, -300, -400);
    scaleText("Ship Health", 0, -500);
    scaleText(userShip.health, -0, -400);
    scaleText("Energy Usage", 300, -500);
    scaleText(int(userShip.enginePower) + int(userShip.shieldPower) + int(userShip.weaponPower), 300, -400);
    //scaleText("Weapons", 600, -500);
    //scaleText(userShip.weaponHealth + "%", 600, -400);

    scaleText("Engine Power", -575, 400);
    scaleText("Weapon Power", -110, 400);
    scaleText("Missile", 205, 400);
    scaleText("Shield Power", 575, 400);

    scaleText(userShip.enginePower, -625, 450);
    scaleText(userShip.enginePowerAttempt, -540, 450);
    scaleText(userShip.weaponPower, -160, 450);
    scaleText(userShip.weaponPowerAttempt, -75, 450);
    scaleText(userShip.maxMissle - userShip.currentMissle, 155, 450);
    scaleText("/", 205, 450);
    scaleText(userShip.maxMissle, 255, 450);
    scaleText(userShip.shieldPower, 525, 450);
    scaleText(userShip.shieldPowerAttempt, 610, 450);

    scaleTextSize(25);
    scaleText("Actual            /             Attempt", -575, 450);
    scaleText("Actual            /             Attempt", -110, 450);
    scaleText("Actual            /             Attempt", 575, 450);

    rectMode(CORNER);
    //fill(255, 25, 255);
    //scaleRect(-725, -462.5, 2.5 * (userShip.engineHealth / userShip.maxHealth) * 100, 25, 20);
    fill(0, 100, 255);
    scaleRect(-425, -462.5, 2.5 * (userShip.shieldHealth / userShip.maxHealth) * 100, 25, 20);
    fill(255, 0, 0);
    scaleRect(-125, -462.5, 2.5 * (userShip.health / userShip.maxHealth) * 100, 25, 20);
    fill(255, 255, 25);
    scaleRect(175, -462.5, 2.5 * (int(userShip.enginePower) + int(userShip.shieldPower) + int(userShip.weaponPower)) / 200 * 100, 25, 20);
    //fill(255, 125, 25);
    //scaleRect(475, -462.5, 2.5 * (userShip.weaponHealth / userShip.maxHealth) * 100, 25, 20);
    rectMode(CENTER);

    noFill();
    stroke(0);
    scaleStrokeWeight(5);
    //scaleRect(-600, -450, 250, 25, 20); // Engine
    scaleRect(-300, -450, 250, 25, 20); // Shield
    scaleRect(0, -450, 250, 25, 20); // Main
    scaleRect(300, -450, 250, 25, 20); // Energy
    //scaleRect(600, -450, 250, 25, 20); // Weapons
}

function drawExplode(x, y) {
    noStroke();
    if (explodeCount < maxExplode) {
        for (i = 0; i < explodeCount; i++) {
            noFill();
            stroke(255, i * 5, 0);
            scaleStrokeWeight(5);
            scaleEllipse(x, y, (explodeCount - i) * 3, (explodeCount - i) * 3);
        }
        explodeCount += 10;
    } else if (explodeCount < maxExplode * 2) {
        for (i = 0; i < explodeCount; i++) {
            noFill();
            stroke(255, i * 5, 0, 500 - (explodeCount * 255 / maxExplode));
            scaleStrokeWeight(5);
            scaleEllipse(x, y, (explodeCount - i) * 3, (explodeCount - i) * 3);
        }
        explodeCount += 10;
    }
}

function drawControls() {
    fill(255, 255, 0);
    noStroke();
    scaleTextSize(20);
    scaleText("FPS: " + round(frameRate()) + "     AVR FPS: " + round(frameCount / (millis() / 1000)) + "     Y Accel: " + userShip.yAccel + "     Y Vel: " + round(userShip.yVel * 1000) / 1000, 0, -350);
    scaleTextSize(40);
    fill(0);
    scaleText("Timer", -600, -500);
    scaleText(msToTime(mainTimer.getTime()), -600, -425);
    scaleText("Score", 600, -500);
    scaleText(score, 600, -425);
}

function drawShip() {
    userShip.draw();
    enemyShip.draw();
    asteriods[0].draw();
}

function drawHitBoxes() {
    if (hitBoxes) {
        userShip.drawHitBox();
        enemyShip.drawHitBox();
    }
}