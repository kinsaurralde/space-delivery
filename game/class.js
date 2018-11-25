/****************************** Classes *******************************/

class Ship {
    constructor(name, specs, x, y) {
        this.name = name; // name of ship
        this.type = specs.name; // type of ship

        this.specs = specs;

        this.x = x; // initial x pos
        this.y = y; // initial y pos
        this.w = specs.w; // width
        this.h = specs.h; // height

        this.health = specs.health; // health
        this.maxHealth = specs.health;
        this.shieldHealth = specs.shield;
        this.weaponHealth = specs.damage;
        this.energyHealth = specs.energy;
        this.engineHealth = specs.engine;

        this.shield = specs.shield; // shield
        this.weapon = specs.damage; // damage
        this.energy = specs.energy; // energy
        this.engine = specs.engine; // engine

        this.enginePower = specs.enginePower; // initial enigne power
        this.weaponPower = specs.weaponPower; // inital weapon power
        this.shieldPower = specs.shieldPower; // initial shield power

        this.enginePowerAttempt = specs.enginePower;
        this.weaponPowerAttempt = specs.weaponPower;
        this.shieldPowerAttempt = specs.shieldPower;

        this.xVel = specs.xVel;
        this.xVelMax = specs.xVelMax;
        this.xAccel = 0;
        this.yVel = specs.yVel + random(-50, 50) / 50;
        //this.yVel = specs.yVel; // no movement on start
        this.yVelMax = specs.yVelMax;
        this.yAccel = 0

        this.fireX = specs.fireX;
        this.fireY = specs.fireY;
        this.shieldW = specs.shieldW;
        this.shieldH = specs.shieldH;

        if (this.name == "User") {
            this.maxMissle = 5;
        } else {
            this.maxMissle = 10;
        }
        this.currentMissle = 0;

        this.reload = false;

        this.damagePF = 0;
        this.fireTime = 400;
        this.firing = false;
        this.damageTicks = 0;
        this.explodeCount = -10;
        this.exploding = false;
        this.maxX = 0;
        this.maxY = 0;

        this.alive = true;

        document.getElementById("engine-power").value = this.enginePowerAttempt;
        document.getElementById("weapon-power").value = this.weaponPowerAttempt;
        document.getElementById("shield-power").value = this.shieldPowerAttempt;

        this.missles = new Array(this.maxMissle);

        console.log("New Ship:", this.name, "Type", this.type, this);
    }

    draw() {
        this.update();
        noStroke()

        if (this.alive) {
            fill(0, 100, 255); // rear engines
            scaleRect(this.x - this.w / 2.05, this.y + this.h / 4, this.h / 4, this.h / 4, this.h / 10);
            scaleRect(this.x - this.w / 2.05, this.y - this.h / 4, this.h / 4, this.h / 4, this.h / 10);

            if (this.yAccel > 0) { // side engines
                scaleRect(this.x - this.w / 4, this.y - this.h / 2.1, this.h / 4, this.h / 4, this.h / 10);
                scaleRect(this.x + this.w / 4, this.y - this.h / 2.1, this.h / 4, this.h / 4, this.h / 10);
            } else if (this.yAccel < 0) {
                scaleRect(this.x - this.w / 4, this.y + this.h / 2.1, this.h / 4, this.h / 4, this.h / 10);
                scaleRect(this.x + this.w / 4, this.y + this.h / 2.1, this.h / 4, this.h / 4, this.h / 10);
            }

            fill(200, 200, 200); // main body
            scaleRectCurve(this.x, this.y, this.w, this.h, this.h / 10, this.h / 2, this.h / 2, this.h / 10);
            scaleEllipse(this.x + this.w / 5, this.y, this.w, this.h);

            fill(0); // labels
            noStroke();
            scaleTextSize(20);
            if (this.type != "Ship-Small") {
                scaleText(this.name, this.x, this.y - this.h / 4);
            }
            scaleText(this.shieldHealth, this.x - this.w / 5, this.y + this.h / 4);
            scaleText(this.health, this.x + this.w / 5, this.y + this.h / 4);

            rectMode(CORNER);
            noStroke();
            fill(0, 100, 255);
            scaleRect(this.x - this.w / 3, this.y - this.h / 20, this.w / 4 * this.shieldHealth / this.maxHealth, this.h / 10, this.h / 4);
            fill(255, 0, 0);
            scaleRect(this.x + this.w / 12, this.y - this.h / 20, this.w / 4 * this.health / this.maxHealth, this.h / 10, this.h / 4);
            rectMode(CENTER);

            noFill();
            scaleStrokeWeight(2);
            stroke(0);
            scaleRect(this.x - this.w / 5, this.y, this.w / 4, this.h / 10, this.h / 4); // shield health bar
            scaleRect(this.x + this.w / 5, this.y, this.w / 4, this.h / 10, this.h / 4); // ship health bar

            if (this.shieldHealth > 0 && this.shieldPower > 0) {
                noFill();
                scaleStrokeWeight(2);
                stroke(0, 100, 255);
                scaleEllipse(this.x, this.y, this.shieldW, this.shieldH);
            }

            if (this.firing) {
                this.targetMaxCoords();
                stroke(255, 100, 25);
                scaleLine(this.maxX, this.maxY, this.fireX, this.fireY);
            }
        }
    }

    update() {
        this.drawMissle();
        if (this.name == "enemy") {
            if (this.y > 200) {
                move(enemyShip, 'up');
            } else if (this.y < -200) {
                move(enemyShip, 'down');
            } else {
                move(enemyShip, 'end');
            }
            if (frameCount % 120 == 100) {
                fire(enemyShip, userShip.x, userShip.y+random(-80,80));
            } else if (frameCount % 150 == 130) {
                this.newMissle();
            }
        }
        this.fireX = this.x + this.w / 2;
        this.fireY = this.y;
        this.yVel += this.yAccel;
        this.yVel = constrain(this.yVel, -this.yVelMax, this.yVelMax);
        this.y += this.yVel;
        if (this.damageTicks > 0) {
            console.log(this.damageTicks, this.damagePF);
            this.damageTicks -= 1;
            if (this.shieldHealth > 0) {
                this.shieldHealth -= round(this.damagePF * this.shieldPower / 100);
                this.health -= round(this.damagePF * (100 - this.shieldPower) / 100);
            } else {
                this.health -= this.damagePF;
            }
        }
        if (this.shieldHealth == 0) {
            this.shieldW = this.w;
            this.shieldH = this.h;
        }
        if (this.health <= 0) {
            if (!this.exploding) {
                this.exploding = true;
                this.alive = false;
                explodeCount = 0;
                this.kill();
            }
        }
        if (this.checkCollisionWall()) {
            move('end');
            this.yVel = -this.yVel;
        }
        this.engineHealth = constrain(this.engineHealth, 0, this.maxHealth);
        this.shieldHealth = constrain(this.shieldHealth, 0, this.maxHealth);
        this.health = constrain(this.health, 0, this.maxHealth);
        this.energyHealth = constrain(this.energyHealth, 0, this.maxHealth);
        this.weaponHealth = constrain(this.weaponHealth, 0, this.maxHealth);
    }

    drawMissle() {
        for (this.i = 0; this.i < this.currentMissle; this.i++) {
            this.missles[this.i].draw();
            this.missles[this.i].update();
        }
    }

    newMissle() {
        if (this.name == "enemy") {
            this.direction = -1;
        } else {
            this.direction = 1;
        }
        if (this.currentMissle < this.maxMissle && this.weaponPower > 10) {
            this.missles[this.currentMissle] = new Missle(this.fireX, this.fireY, this.weaponPower / 6 * this.direction, this.yVel, this.name);
            this.currentMissle++;
        }
    }

    checkCollisionWall() {
        if (this.y + this.shieldH / 2 >= 360 || this.y - this.shieldH / 2 <= -360) {
            if (this.shieldHealth > 0 && this.shieldPower > 0) {
                this.shieldHealth -= 80;
                this.health -= 20
            } else {
                this.health -= 80;
            }
            return true
        } else {
            return false
        }
    }

    checkHit(x, y) {
        let value;
        if (this.shieldHealth > 0) {
            value = (pow(x - this.x, 2) / pow(this.shieldW / 2, 2)) + (pow(y - this.y, 2) / pow(this.shieldH / 2, 2));
        } else {
            value = (pow(x - this.x - this.w / 4, 2) / pow(this.shieldW / 2, 2)) + (pow(y - this.y, 2) / pow(this.shieldH / 2, 2));
            if (x > this.x - this.w / 2 && x < this.x + this.w / 2 && y > this.y - this.h / 2 && y < this.y + this.h / 2) {
                return true;
            }
        }
        if (value <= 1) {
            return true
        }
    }

    drawHitBox() {
        noFill();
        stroke(0, 255, 0);
        scaleStrokeWeight(5);
        if (this.shieldHealth > 0) {
            scaleEllipse(this.x, this.y, this.shieldW, this.shieldH);
        } else {
            scaleEllipse(this.x + this.w / 4, this.y, this.shieldW, this.shieldH);
            scaleRect(this.x, this.y, this.w, this.h, 0);
        }
    }

    targetCoords(x, y) {
        this.newX = x - this.fireX;
        this.newY = y - this.fireY;
        this.fireAngle = atan(this.newY / this.newX);
        if (this.newX < 0) {
            this.fireAngle += 180;
        }
        this.targetMaxCoords();
        //checkEnemyHit();
    }

    targetMaxCoords() {
        var tX = this.fireX;
        var tY = this.fireY;
        var tR = 0;
        while (tX >= -800 && tX <= 800 && tY >= -360 && tY <= 360 && !checkEnemyHit(tX, tY, this.name, this.weaponPower)) {
            tX = tR * cos(this.fireAngle) + this.fireX;
            tY = tR * sin(this.fireAngle) + this.fireY;
            tR += 1;
        }
        this.maxX = tX;
        this.maxY = tY;
    }

    damage(num) {
        console.log("Apply", num, "damage");
        this.damagePF = round((num / (.4 * frameRate())) / 2);
        this.damageTicks = round(frameRate() * .4) / 2;
    }

    kill() {
        killShip(this.name);
    }
}



class Specs {
    constructor(name, x, y, w, h, health, shield, damage, energy, engine, enginePower, weaponPower, shieldPower, xVel, xVelMax, yVel, yVelMax) {
        this.name = name; // name of ship type

        this.x = x; // initial x pos
        this.y = y; // initial y pos
        this.w = w; // width
        this.h = h; // height

        this.health = health; // max health

        this.shield = shield; // max shield
        this.damage = damage; // max damage
        this.energy = energy; // max energy
        this.engine = engine; // max engine

        this.enginePower = enginePower; // initial enigne power
        this.weaponPower = weaponPower; // inital weapon power
        this.shieldPower = shieldPower; // initial shield power

        this.xVel = xVel; // initial x velocity
        this.xVelMax = xVelMax; // max x velocity
        this.yVel = yVel; // initial y velocity
        this.yVelMax = yVelMax; // max y velocity

        if (name == "Ship-Small") {
            this.fireX = this.x + this.w / 2;
            this.fireY = this.y;
            this.shieldW = this.w * 1.5;
            this.shieldH = this.h * 1.5;
            this.hullColor = color(200, 200, 200);
            this.weaponColor = color(255, 100, 25);
            this.shieldColor = color(0, 100, 255);
            this.engineColor = color(0, 100, 255);
        }

        console.log("New Ship Specs:", name, this);
    }
}

class Missle {
    constructor(x, y, xVel, yVel, caller) {
        this.x = x;
        this.y = y;
        this.xVel = xVel;
        this.yVel = yVel;
        this.name = caller;
    }

    draw() {
        noStroke();
        fill(0, 255, 0);

        scaleEllipse(this.x, this.y, 20, 20);
    }

    update() {
        this.x += this.xVel;
        this.y += this.yVel;
        if (checkEnemyHit(this.x, this.y, this.name, 150 * ((.4 * frameRate()) / 2) * 4 / 6)) { // first number of last parameter is damage amount
            this.xVel = 0;
            this.yVel = 0;
            this.x = 0;
            this.y = 600;
        }
    }
}



class Asteroid {
    constructor(speed, size) {
        this.alive = true;
        this.x = 1000
        this.y = random(-320, 320);
        this.size = size;
        this.speed = speed;
        this.yVel = random() / 3;
        this.rotate1 = random(0, 180);
        this.rotate2 = this.rotate1 + random(40, 140);
        this.rotate3 = this.rotate2 + random(40, 140);
        this.rotate4 = this.rotate3 + random(40, 140);
        //console.log(this.y, enemyShip.y + enemyShip.h)
        while (this.y < enemyShip.y + enemyShip.h * 2.5 && this.y > enemyShip.y - enemyShip.h * 2.5) {
            //console.log("redo");
            this.y = random(-320, 320);
        }
    }

    draw() {
        if (this.alive) {
            this.checkCollide();
            if (this.x < -1000) {
                this.kill();
            }
            noStroke();
            fill(138, 64, 0);
            push();
            translate(this.x * windowScale, this.y * windowScale);
            rotate(frameCount % 360);
            push();
            rotate(this.rotate1);
            scaleTriangle(0, 0 + this.size * 3 / 4, 0 - this.size / 2, 0, 0 + this.size / 3, 0);
            push();
            rotate(this.rotate2);
            scaleTriangle(0, 0 + this.size * 3 / 4, 0 - this.size / 2, 0, 0 + this.size / 3, 0);
            push();
            rotate(this.rotate3);
            scaleTriangle(0, 0 + this.size * 3 / 4, 0 - this.size / 2, 0, 0 + this.size / 3, 0);
            pop();
            push();
            rotate(this.rotate4);
            scaleTriangle(0, 0 + this.size * 3 / 4, 0 - this.size / 2, 0, 0 + this.size / 3, 0);
            pop();
            pop();
            pop();
            scaleEllipse(0, 0, this.size, this.size);
            pop();
            this.x -= this.speed;
            this.y += this.yVel;
        }
    }

    checkCollide() {
        for (i = 0; i < 9; i++) {
            this.checkX = this.x+this.size/2*cos(i*40);
            this.checkY = this.y+this.size/2*sin(i*40);
            noStroke()
            fill(0,255-i*22,0);
            //scaleEllipse(this.checkX,this.checkY,20,20);
            //scaleEllipse(this.x,this.y,30,30);
            if (userShip.checkHit(this.checkX,this.checkY)) {
                userShip.damage(350);
                this.kill();
                break
            }
        }
    }

    checkHit(x, y) {
        let value = (pow(x - this.x, 2) / pow(this.size / 2, 2)) + (pow(y - this.y, 2) / pow(this.size / 2, 2));
        if (value <= 1) {
            return true
        }
        return false
    }

    kill() {
        if (this.alive) {
            this.alive = false;
            score += 50;
            setTimeout(function() {
                if (gameStatus == "playing") {
                    asteriods[0] = new Asteroid(random(6,12),random(50,100))
                }
            }, random(2000,5000));
        }
    }
}



class Timer {
    constructor(duration, call) {
        this.start = Date.now();
        this.duration = duration;
        this.call = call;
        this.endTime = 0;

        this.endCall = setTimeout(function () {
            mainTimer.call();
        }, this.duration);
    }

    stop() {
        this.endTime = Date.now() - this.start;
    }

    getTime() {
        if (this.endTime == 0) {
            this.time = Date.now() - this.start;
        } else {
            this.time = this.endTime;
        }
        return this.time;
    }
}