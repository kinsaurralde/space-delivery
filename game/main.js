var windowScale, currentX, currentY, maxX, maxY, newX, newY, fireAngle;
var speed = 80;
var userShip, enemyShip;
var smallShip;
var backgroundStars;
var engineSlider;
var weaponSlider;
var shieldSlider;
var maxExplode = 100, explodeCount = 200, enemyExplode = false, userExplode = false;

var hitBoxes = false;
/****************************** Setups *******************************/

function setup() {
  mainCanvas = createCanvas(1, 1);
  background(0);
  rectMode(CENTER);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  angleMode(DEGREES);
  mainCanvas.parent('sketch-holder');
  createBackground(20);
  reset();
  setWindowSize();
}

function reset() {
  // name, x, y, w, h, health, shield, damage, energy, engine, enginePower, weaponPower, shieldPower, xVel, xVelMax, yVel, yVelMax
  smallShip = new Specs("Ship-Small", -600, 0, 200, 100, 200, 170, 200, 200, 200, 50, 50, 100, 0, 5, 0, 5);
  userShip = new Ship("User",smallShip, -600, 0);
  enemyShip = new Ship("enemy", smallShip, 600,0);
}

/****************************** Create *******************************/

function create2DArray(rows, cols) {
  var tmp = new Array(rows);
  for (i = 0; i < rows; i++) {
    tmp[i] = new Array(cols);
  }
  return tmp
}

function createBackground(stars) {
  backgroundStars = create2DArray(stars, 2);
  stroke(255, 255, 0);
  scaleStrokeWeight(5);

  for (i = 0; i < backgroundStars.length; i++) {
    backgroundStars[i][0] = random(-80, 80) * 10;
    backgroundStars[i][1] = random(-36, 36) * 10;
  }
}

/****************************** Main *******************************/

function draw() {
  frameRate(30);
  background(200, 200, 200);
  translate(width / 2, height / 2);

  drawBackground();
  drawHealth();
  drawControls();
  drawShip();
  drawHitBoxes();

  whoExplode();
}


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
  scaleText("Engine", -600, -500);
  scaleText(userShip.engineHealth + "%", -600, -400);
  scaleText("Shield", -300, -500);
  scaleText(userShip.shieldHealth, -300, -400);
  scaleText("Ship Health", 0, -500);
  scaleText(userShip.health, -0, -400);
  scaleText("Generator", 300, -500);
  scaleText(userShip.energyHealth, 300, -400);
  scaleText("Weapons", 600, -500);
  scaleText(userShip.weaponHealth + "%", 600, -400);

  scaleText("Engine Power", -575, 400);
  scaleText("Weapon Power", -110, 400);
  scaleText("Missile", 210, 400);
  scaleText("Shield Power", 575, 400);

  scaleText(userShip.enginePower,-625,450);
  scaleText(userShip.enginePowerAttempt,-540,450);
  scaleText(userShip.weaponPower,-160,450);
  scaleText(userShip.weaponPowerAttempt,-75,450);
  scaleText(userShip.shieldPower,525,450);
  scaleText(userShip.shieldPowerAttempt,610,450);

  scaleTextSize(25);
  scaleText("Actual            /             Attempt",-575, 450);
  scaleText("Actual            /             Attempt",-110, 450);
  scaleText("Actual            /             Attempt",575, 450);

  rectMode(CORNER);
  fill(255, 25, 255);
  scaleRect(-725, -462.5, 2.5 * (userShip.engineHealth / userShip.maxHealth) * 100, 25, 20);
  fill(0, 100, 255);
  scaleRect(-425, -462.5, 2.5 * (userShip.shieldHealth / userShip.maxHealth) * 100, 25, 20);
  fill(255, 0, 0);
  scaleRect(-125, -462.5, 2.5 * (userShip.health / userShip.maxHealth) * 100, 25, 20);
  fill(255, 255, 25);
  scaleRect(175, -462.5, 2.5 * (userShip.energyHealth / userShip.maxHealth) * 100, 25, 20);
  fill(255, 125, 25);
  scaleRect(475, -462.5, 2.5 * (userShip.weaponHealth / userShip.maxHealth) * 100, 25, 20);
  rectMode(CENTER);

  noFill();
  stroke(0);
  scaleStrokeWeight(5);
  scaleRect(-600, -450, 250, 25, 20); // Engine
  scaleRect(-300, -450, 250, 25, 20); // Shield
  scaleRect(0, -450, 250, 25, 20); // Main
  scaleRect(300, -450, 250, 25, 20); // Energy
  scaleRect(600, -450, 250, 25, 20); // Weapons
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

}

function drawShip() {
  userShip.draw();
  enemyShip.draw();
}

function drawHitBoxes() {
  if (hitBoxes) {
    userShip.drawHitBox();
    enemyShip.drawHitBox();
  }
}



/****************************** Inputs *******************************/

function clicked() {
  currentX = constrain(round(mouseX * 1 / windowScale - 960), -800, 800);
  currentY = constrain(round(mouseY * 1 / windowScale - 540), -360, 360);
  fire(userShip, currentX, currentY);
}

function keyPressed() {
  if (keyCode == UP_ARROW) {
    move(userShip, 'up');
  } else if (keyCode == DOWN_ARROW) {
    move(userShip, 'down');
  }
}

function keyReleased() {
  if (keyCode == UP_ARROW || keyCode == DOWN_ARROW) {
    move(userShip, 'end');
  }
}

function energyChange(type) {
  var tmp;
  var engineSlider = document.getElementById("engine-power");
  var weaponSlider = document.getElementById("weapon-power");
  var shieldSlider = document.getElementById("shield-power");
  userShip.enginePowerAttempt = engineSlider.value;
  userShip.weaponPowerAttempt = weaponSlider.value;
  userShip.shieldPowerAttempt = shieldSlider.value;
  if (type == "engine") {
    tmp = userShip.enginePower;
    userShip.enginePower = int(engineSlider.value);
    engineSlider.value = userShip.enginePowerAttempt;
  } else if (type == "weapon") {
    tmp = userShip.weaponPower;
    userShip.weaponPower = int(weaponSlider.value);
    weaponSlider.value = userShip.weaponPowerAttempt;
  } else if (type == "shield") {
    tmp = userShip.shieldPower;
    userShip.shieldPower = int(shieldSlider.value);
    shieldSlider.value = userShip.shieldPowerAttempt;
  }
  if (checkEnergyOver()) {
    if (type == "engine") {
      userShip.enginePower = tmp;
      engineSlider.value = tmp;
    } else if (type == "weapon") {
      userShip.weaponPower = tmp;
      weaponSlider.value = tmp;
    } else if (type == "shield") {
      userShip.shieldPower = tmp;
      shieldSlider.value = tmp;
    }
  }

}

function checkEnergyOver() {
  console.log("Engine:",userShip.enginePower,"Weapon:",userShip.weaponPower,"Shield:",userShip.shieldPower,"Max:",userShip.energyHealth);
  if (userShip.enginePower + userShip.weaponPower + userShip.shieldPower > userShip.energyHealth) {
    console.log("OVER");
    return true;
  }
  return false;
}


/****************************** Collisions *******************************/

function checkEnemyHit(x, y, senderShip) {
  if (senderShip != "enemy") {
    if (enemyShip.checkHit(x, y)) {
      enemyShip.damage(userShip.weapon);
      return true
    }
  }
  if (senderShip != "User") {
    if (userShip.checkHit(x, y)) {
      userShip.damage(enemyShip.weapon);
      return true
    }
  }
}



/****************************** Other *******************************/

function killShip(ship) {
  if (ship == "enemy") {
    setTimeout(function () {
      enemyShip = new Ship("enemy", 1500, 0);
    }, 600)
  } else if (ship == "user") {
    setTimeout(function () {
      userShip = new Ship("user", -1500, 0);
    }, 600)
  }
}

function whoExplode() {
  if (enemyShip.exploding) {
    drawExplode(enemyShip.x, enemyShip.y);
  }
  if (userShip.exploding) {
    drawExplode(userShip.x, userShip.y);
  }
}

function fire(ship, x, y) {
  if (ship.firing) {
    return
  }
  ship.targetCoords(x, y);
  ship.firing = true;
  setTimeout(function () {
    ship.firing = false;
  }, ship.fireTime)
}


/****************************** Buttons *******************************/

function move(ship, dir) {
  if (dir == 'up') {
    ship.yAccel = -speed / 4000;
  } else if (dir == 'down') {
    ship.yAccel = speed / 4000;
  } else if (dir == 'end') {
    ship.yAccel = 0;
  }
}


/****************************** Scaled Shapes *******************************/

function scaleTriangle(x1, y1, x2, y2, x3, y3) {
  triangle(x1 * windowScale, y1 * windowScale, x2 * windowScale, y2 * windowScale, x3 * windowScale, y3 * windowScale);
}

function scaleRect(x, y, w, h, c) {
  rect(x * windowScale, y * windowScale, w * windowScale, h * windowScale, c * windowScale);
}

function scaleRectCurve(x, y, w, h, c, d, e, f) {
  rect(x * windowScale, y * windowScale, w * windowScale, h * windowScale, c * windowScale, d * windowScale, e * windowScale, f * windowScale);
}

function scaleLine(x1, y1, x2, y2) {
  line(x1 * windowScale, y1 * windowScale, x2 * windowScale, y2 * windowScale);
}

function scaleEllipse(x, y, w, h) {
  ellipse(x * windowScale, y * windowScale, w * windowScale, h * windowScale);
}

function scalePoint(x, y) {
  point(x * windowScale, y * windowScale);
}

function scaleCurve(x1, y1, x2, y2, x3, y3, x4, y4) {
  curve(x1 * windowScale, y1 * windowScale, x2 * windowScale, y2 * windowScale, x3 * windowScale, y3 * windowScale, x4 * windowScale, y4 * windowScale);
}

function scaleStrokeWeight(num) {
  strokeWeight(num * windowScale);
}

function scaleText(txt, x, y) {
  text(txt, x * windowScale, y * windowScale);
}

function scaleTextSize(num) {
  textSize(num * windowScale);
}



/****************************** Window Resizing *******************************/

function windowResized() { // js function runs when window is resized
  setWindowSize();
  redraw();
}

function setWindowSize() { // Resizes canvas and sets windowScale
  windowScale = windowWidth / 1920;
  resizeCanvas(windowWidth, (windowWidth * 9 / 16) - 10);
}

function fullScreen() {
  fs = fullscreen();
  fullscreen(!fs);
}



/****************************** Other *******************************/


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
    this.yVel = specs.yVel;
    this.yVelMax = specs.yVelMax;
    this.yAccel = 0

    this.fireX = specs.fireX;
    this.fireY = specs.fireY;
    this.shieldW = specs.shieldW;
    this.shieldH = specs.shieldH;

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

    console.log("New Ship:", this.name,"Type",this.type, this);
  }

  draw() {
    this.update();
    noStroke()

    if (this.alive) {
      fill(0,100,255); // rear engines
      scaleRect(this.x - this.w / 2.05, this.y + this.h / 4, this.h / 4, this.h / 4, this.h / 10);
      scaleRect(this.x - this.w / 2.05, this.y - this.h / 4, this.h / 4, this.h / 4, this.h / 10);

      if (this.yAccel > 0) { // side engines
        scaleRect(this.x - this.w / 4, this.y - this.h / 2.1, this.h / 4, this.h / 4, this.h / 10);
        scaleRect(this.x + this.w / 4, this.y - this.h / 2.1, this.h / 4, this.h / 4, this.h / 10);
      } else if (this.yAccel < 0) {
        scaleRect(this.x - this.w / 4, this.y + this.h / 2.1, this.h / 4, this.h / 4, this.h / 10);
        scaleRect(this.x + this.w / 4, this.y + this.h / 2.1, this.h / 4, this.h / 4, this.h / 10);
      }

      fill(200,200,200); // main body
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
      fill(0,100,255);
      scaleRect(this.x - this.w / 3, this.y - this.h / 20, this.w / 4 * this.shieldHealth / this.maxHealth, this.h / 10, this.h / 4);
      fill(255, 0, 0);
      scaleRect(this.x + this.w / 12, this.y - this.h / 20, this.w / 4 * this.health / this.maxHealth, this.h / 10, this.h / 4);
      rectMode(CENTER);

      noFill();
      scaleStrokeWeight(2);
      stroke(0);
      scaleRect(this.x - this.w / 5, this.y, this.w / 4, this.h / 10, this.h / 4); // shield health bar
      scaleRect(this.x + this.w / 5, this.y, this.w / 4, this.h / 10, this.h / 4); // ship health bar

      if (this.shieldHealth > 0) {
        noFill();
        scaleStrokeWeight(2);
        stroke(0,100,255);
        scaleEllipse(this.x, this.y, this.shieldW, this.shieldH);
      }

      if (this.firing) {
        this.targetMaxCoords();
        stroke(255,100,25);
        scaleLine(this.maxX, this.maxY, this.fireX, this.fireY);
      }
    }
  }

  update() {
    this.updateEnergy();
    if (this.name == "enemy") {
      if (this.y > 200) {
        move(enemyShip, 'up');
      } else if (this.y < -200) {
        move(enemyShip, 'down');
      } else {
        move(enemyShip, 'end');
      }
      if (frameCount % 240 == 100) {
        //fire(enemyShip, userShip.x, userShip.y);
      }
    }
    this.fireX = this.x + this.w / 2;
    this.fireY = this.y;
    this.yVel += this.yAccel;
    this.yVel = constrain(this.yVel, -this.yVelMax, this.yVelMax);
    this.y += this.yVel;
    if (this.damageTicks > 0) {
      this.damageTicks -= 1;
      if (this.shieldHealth > 0) {
        this.shieldHealth -= this.damagePF;
      } else {
        this.health -= this.damagePF;
      }
      this.energyHealth -= round(this.damagePF * 10) / 10;
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

  updateEnergy() {

    /*
    try {
    this.enginePowerAttempt = engineSlider.value;
    this.weaponPowerAttempt = weaponSlider.value;
    this.shieldPowerAttempt = shieldSlider.value;

    this.enginePower = round(this.enginePowerAttempt / 2);
    this.weaponPower = round(this.weaponPowerAttempt / 3);
    this.shieldPower = round(this.shieldPowerAttempt / 4);
    } catch(e) {
      console.log(e);
    }
    */
  // console.log(engineSlider);
  }

  checkCollisionWall() {
    if (this.y + this.shieldH / 2 >= 360 || this.y - this.shieldH / 2 <= -360) {
      if (this.shieldHealth > 0) {
        this.shieldHealth -= 60;
      } else {
        this.health -= 40;
      }
      this.energyHealth -= 10;
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
    while (tX >= -800 && tX <= 800 && tY >= -360 && tY <= 360 && !checkEnemyHit(tX, tY, this.name)) {
      tX = tR * cos(this.fireAngle) + this.fireX;
      tY = tR * sin(this.fireAngle) + this.fireY;
      tR += 1;
    }
    this.maxX = tX;
    this.maxY = tY;
  }

  damage(num) {
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
      this.hullColor = color(200,200,200);
      this.weaponColor = color(255,100,25);
      this.shieldColor = color(0,100,255);
      this.engineColor = color(0,100,255);
    }

    console.log("New Ship Specs:", name, this);
  }
}