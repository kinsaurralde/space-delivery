var windowScale, currentX, currentY, maxX, maxY;
var speed = 80;
var userShip;
var backgroundStars;
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
  background(200, 200, 200);
  translate(width / 2, height / 2);

  drawBackground();
  //drawHealth();
  drawControls();
  drawShip();
  drawFire();

  fill(255);
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

function drawControls() {
  fill(255, 255, 0);
  noStroke();
  scaleTextSize(20);
  scaleText("FPS: "+round(frameRate())+"     AVR FPS: "+round(frameCount/(millis()/1000))+"     Y Accel: " + userShip.yAccel + "     Y Vel: " + round(userShip.yVel * 1000) / 1000, 0, -350);

}

function drawShip() {
  userShip.draw();
}

function drawFire() {
  if (userShip.firing) {

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
  }, 400)
}

function getCoords() {
  currentX = constrain(round(mouseX * 1 / windowScale - 960), -800, 800);
  currentY = constrain(round(mouseY * 1 / windowScale - 540), -360, 360);
  var newX = currentX - userShip.fireX;
  var newY = currentY - userShip.fireY;
  var fireAngle = atan(newY/newX);
  if (newX < 0) {
    fireAngle += 180;
  }
  var iX = userShip.fireX;
  var iY = userShip.fireY;
  var r = 0;
  while (iX >= -800 && iX <= 800 && iY >= -360 && iY <= 360) {
    iX = r * cos(fireAngle) + userShip.fireX;
    iY = r * sin(fireAngle) + userShip.fireY;
    r += 1;
  }
  maxX = iX;
  maxY = iY;
  console.log(newX,newY,fireAngle);
}



/****************************** Buttons *******************************/

function move(dir) {
  if (dir == 'up') {
    userShip.yAccel = -speed / 1000;
  } else if (dir == 'down') {
    userShip.yAccel = speed / 1000;
  } else if (dir == 'end') {
    userShip.yAccel = 0;
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
    this.x = x;
    this.y = y;
    this.w = 200;
    this.h = 100;
    this.fireX = this.x+this.w/2;
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
    this.firing = false;
  }

  draw() {
    this.update();
    noStroke()

    fill(0, 100, 255); // rear engines
    scaleRect(this.x - this.w / 2.05, this.y + this.h / 4, this.h / 4, this.h / 4, this.h / 10);
    scaleRect(this.x - this.w / 2.05, this.y - this.h / 4, this.h / 4, this.h / 4, this.h / 10);

    if (this.yAccel > 0) { //
      scaleRect(this.x - this.w / 4, this.y - this.h / 2.1, this.h / 4, this.h / 4, this.h / 10);
      scaleRect(this.x + this.w / 4, this.y - this.h / 2.1, this.h / 4, this.h / 4, this.h / 10);
    } else if (this.yAccel < 0) {
      scaleRect(this.x - this.w / 4, this.y + this.h / 2.1, this.h / 4, this.h / 4, this.h / 10);
      scaleRect(this.x + this.w / 4, this.y + this.h / 2.1, this.h / 4, this.h / 4, this.h / 10);
    }

    fill(200, 200, 200); // main body
    scaleRectCurve(this.x, this.y, this.w, this.h, this.h / 10, this.h / 2, this.h / 2, this.h / 10);
    scaleEllipse(this.x + this.w / 5, this.y, this.w, this.h);

    if (this.shieldHealth > 0) {
      noFill();
      scaleStrokeWeight(2);
      stroke(0, 100, 255);
      scaleEllipse(this.x, this.y, this.sW, this.sH);
    }

    if (this.firing) {
      stroke(255, 125, 25);

      scaleLine(maxX, maxY, this.fireX, this.fireY);
    }

  }

  update() {
    this.fireX = this.x+this.w/2;
    this.fireY = this.y;
    this.yVel += this.yAccel;
    this.y += this.yVel / 2;
    if (this.shieldHealth == 0) {
      this.sW = this.w;
      this.sH = this.h;
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
        this.health -= 10;
      }
      return true
    } else {
      return false
    }
  }
}