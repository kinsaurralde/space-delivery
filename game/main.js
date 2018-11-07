var windowScale, currentX, currentY, maxX, maxY, newX, newY, fireAngle;
var speed = 80;
var userShip, enemyShip;
var backgroundStars;
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
  userShip = new Ship("user", -600, 0);
  enemyShip = new Ship("enemy", 600, 0);
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
  scaleText(userShip.shieldHealth + "%", -300, -400);
  scaleText("Ship Health", 0, -500);
  scaleText(userShip.health + "%", -0, -400);
  scaleText("Generator", 300, -500);
  scaleText(userShip.energyHealth + "%", 300, -400);
  scaleText("Weapons", 600, -500);
  scaleText(userShip.weaponHealth + "%", 600, -400);

  rectMode(CORNER);
  fill(255, 25, 255);
  scaleRect(-725, -462.5, 2.5 * userShip.engineHealth, 25, 20);
  fill(0, 100, 255);
  scaleRect(-425, -462.5, 2.5 * userShip.shieldHealth, 25, 20);
  fill(255, 0, 0);
  scaleRect(-125, -462.5, 2.5 * userShip.health, 25, 20);
  fill(255, 255, 25);
  scaleRect(175, -462.5, 2.5 * userShip.energyHealth, 25, 20);
  fill(255, 125, 25);
  scaleRect(475, -462.5, 2.5 * userShip.weaponHealth, 25, 20);
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
  if (userShip.firing) {
    return
  }
  getCoords();
  userShip.firing = true;
  setTimeout(function () {
    userShip.firing = false;
  }, userShip.fireTime)
}

function getCoords() {
  currentX = constrain(round(mouseX * 1 / windowScale - 960), -800, 800);
  currentY = constrain(round(mouseY * 1 / windowScale - 540), -360, 360);
  newX = currentX - userShip.fireX;
  newY = currentY - userShip.fireY;
  fireAngle = atan(newY / newX);
  if (newX < 0) {
    fireAngle += 180;
  }
  getMaxCoords();
  //checkEnemyHit();
}

function getMaxCoords() {
  var iX = userShip.fireX;
  var iY = userShip.fireY;
  var r = 0;
  while (iX >= -800 && iX <= 800 && iY >= -360 && iY <= 360 && !checkEnemyHit(iX, iY)) {
    iX = r * cos(fireAngle) + userShip.fireX;
    iY = r * sin(fireAngle) + userShip.fireY;
    r += 1;
  }
  maxX = iX;
  maxY = iY;
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



/****************************** Collisions *******************************/

function checkEnemyHit(x, y) {
  if (enemyShip.checkHit(x, y)) {
    enemyShip.damage(userShip.weapon, userShip.fireTime);
    return true
  }
}



/****************************** Other *******************************/

function killShip(ship) {
  console.log("oighs", ship, 896);
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
  constructor(name, x, y) {
    this.name = name;
    this.alive = true;
    this.x = x;
    this.y = y;
    this.w = 200;
    this.h = 100;
    this.fireX = this.x + this.w / 2;
    this.fireY = this.y;
    this.sW = this.w * 1.5;
    this.sH = this.h * 1.5;
    this.yVel = 0;
    this.yAccel = 0;
    this.health = 100;
    this.shieldHealth = 100;
    this.weaponHealth = 100;
    this.energyHealth = 100;
    this.engineHealth = 100;
    this.weapon = 40;
    this.shieldDamage = 0;
    this.healthDamage = 0;
    this.damagePF = 0;
    this.fireTime = 400;
    this.firing = false;
    this.damageTicks = 0;
    this.explodeCount = -10;
    this.exploding = false;
    console.log("New Ship:", this.name, this);
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
      if (this.name != "user") {
        scaleText(this.name, this.x, this.y - this.h / 4);
      }
      scaleText(this.shieldHealth, this.x - this.w / 5, this.y + this.h / 4);
      scaleText(this.health, this.x + this.w / 5, this.y + this.h / 4);

      rectMode(CORNER);
      noStroke();
      fill(0, 100, 255);
      scaleRect(this.x - this.w / 3, this.y - this.h / 20, this.w / 4 * this.shieldHealth / 100, this.h / 10, this.h / 4);
      fill(255, 0, 0);
      scaleRect(this.x + this.w / 12, this.y-this.h/20, this.w / 4 * this.health / 100, this.h / 10, this.h / 4);
      rectMode(CENTER);

      noFill();
      scaleStrokeWeight(2);
      stroke(0);
      scaleRect(this.x - this.w / 5, this.y, this.w / 4, this.h / 10, this.h / 4); // shield health bar
      scaleRect(this.x + this.w / 5, this.y, this.w / 4, this.h / 10, this.h / 4); // ship health bar

      if (this.shieldHealth > 0) {
        noFill();
        scaleStrokeWeight(2);
        stroke(0, 100, 255);
        scaleEllipse(this.x, this.y, this.sW, this.sH);
      }

      if (this.firing) {
        getMaxCoords();
        stroke(255, 125, 25);
        scaleLine(maxX, maxY, this.fireX, this.fireY);
      }
    }
  }

  update() {
    if (this.name == "enemy") {
      if (this.y > 200) {
        move(enemyShip, 'up');
      } else {
        move(enemyShip, 'down');
      }
    }
    this.fireX = this.x + this.w / 2;
    this.fireY = this.y;
    this.yVel += this.yAccel;
    this.yVel = constrain(this.yVel, -5, 5);
    this.y += this.yVel;
    if (this.damageTicks > 0) {
      this.damageTicks -= 1;
      if (this.shieldHealth > 0) {
        this.shieldHealth -= this.damagePF;
      } else {
        this.health -= this.damagePF;
      }
    }
    if (this.shieldHealth == 0) {
      this.sW = this.w;
      this.sH = this.h;
    }
    if (this.health <= 0) {
      if (!this.exploding) {
        this.exploding = true;
        this.alive = false;
        explodeCount = 0;
        this.kill();
      }
    }
    if (this.checkCollision()) {
      move('end');
      this.yVel = -this.yVel;
    }
    this.engineHealth = constrain(this.engineHealth, 0, 100);
    this.shieldHealth = constrain(this.shieldHealth, 0, 100);
    this.health = constrain(this.health, 0, 100);
    this.energyHealth = constrain(this.energyHealth, 0, 100);
    this.weaponHealth = constrain(this.weaponHealth, 0, 100);
  }

  checkCollision() {
    if (this.y + this.sH / 2 >= 360 || this.y - this.sH / 2 <= -360) {
      if (this.shieldHealth > 0) {
        this.shieldHealth -= 60;
      } else {
        this.health -= 40;
      }
      return true
    } else {
      return false
    }
  }

  checkHit(x, y) {
    let value;
    if (this.shieldHealth > 0) {
      value = (pow(x - this.x, 2) / pow(this.sW / 2, 2)) + (pow(y - this.y, 2) / pow(this.sH / 2, 2));
    } else {
      value = (pow(x - this.x - this.w / 4, 2) / pow(this.sW / 2, 2)) + (pow(y - this.y, 2) / pow(this.sH / 2, 2));
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
      scaleEllipse(this.x, this.y, this.sW, this.sH);
    } else {
      scaleEllipse(this.x + this.w / 4, this.y, this.sW, this.sH);
      scaleRect(this.x, this.y, this.w, this.h, 0);
    }
  }

  damage(num, time) {
    this.damagePF = round((num / (.4 * frameRate())) / 2);
    this.damageTicks = round(frameRate() * .4) / 2;
    console.log("Damage", this.damagePF, this.damageTicks);
  }

  kill() {
    killShip(this.name);
  }
}