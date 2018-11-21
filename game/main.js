var windowScale, currentX, currentY, maxX, maxY, newX, newY, fireAngle;
var speed = 80;
var userShip, enemyShip;
var smallShip;
var backgroundStars;
var engineSlider;
var weaponSlider;
var shieldSlider;
var maxExplode = 100, explodeCount = 200, enemyExplode = false, userExplode = false;
var asteriods = new Array(10);
var hitBoxes = false;
var mainTimer;
var score = 0;
var gameStatus = "menu"



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
  gameMenu();
  reset();
  setWindowSize();
}

function reset() {
  // name, x, y, w, h, health, shield, damage, energy, engine, enginePower, weaponPower, shieldPower, xVel, xVelMax, yVel, yVelMax
  smallShip = new Specs("Ship-Small", -600, 0, 200, 100, 200, 200, 200, 200, 200, 50, 50, 100, 0, 5, 0, 5);
  userShip = new Ship("User", smallShip, -600, 0);
  enemyShip = new Ship("enemy", smallShip, 600, 0);
  asteriods[0] = new Asteroid(12, 70);
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



/****************************** Main / Control *******************************/

function draw() {
  frameRate(30);
  background(200, 200, 200);
  translate(width / 2, height / 2);

  if (gameStatus == "menu") {
    drawMenu();
  } else if (gameStatus == "playing") {
    drawBackground();
    drawHealth();
    drawControls();
    drawShip();
    drawHitBoxes();

    whoExplode();
  }
}

function gameOver() {
  gameStatus = "post";
}

function gameStart() {
  mainTimer = new Timer(120000,gameOver);
  gameStatus = "playing";
  menuSwitch("block");
  document.getElementById("start").style.display = "none";
}

function gameMenu() {
  gameStatus = "menu";
  menuSwitch("none");
  document.getElementById("start").style.display = "block";
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
  //console.log("Engine:", userShip.enginePower, "Weapon:", userShip.weaponPower, "Shield:", userShip.shieldPower, "Max:", userShip.energyHealth);
  if (userShip.enginePower + userShip.weaponPower + userShip.shieldPower > userShip.energyHealth) {
    console.log("OVER");
    return true;
  }
  return false;
}



/****************************** Collisions *******************************/

function checkEnemyHit(x, y, senderShip, amount) {
  if (senderShip != "enemy") {
    if (enemyShip.checkHit(x, y)) {
      enemyShip.damage(amount);
      return true
    }
  }
  if (senderShip != "User") {
    if (userShip.checkHit(x, y)) {
      userShip.damage(amount);
      return true
    }
  }
}



/****************************** Other *******************************/

function killShip(ship) {
  if (ship == "enemy") {
    score += 500;
    setTimeout(function () {
      enemyShip = new Ship("enemy", 1500, 0);
    }, 600)
  } else if (ship == "user") {
    setTimeout(function () {
      userShip = new Ship("user", -1500, 0);
    }, 600)
    gameOver();
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
  if (ship.firing || ship.reload) {
    return
  }
  ship.targetCoords(x, y);
  ship.firing = true;
  ship.reload = true;
  setTimeout(function () {
    ship.firing = false;
  }, ship.fireTime)
  setTimeout(function () {
    ship.reload = false;
  }, ship.fireTime * 10)
}

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24);

  //hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  //return hours + ":" + minutes + ":" + seconds + "." + milliseconds; // includes hours
  return minutes + ":" + seconds + "." + milliseconds;
}

function menuSwitch(value) {
  document.getElementById("ship-up").style.display = value;
  document.getElementById("ship-down").style.display = value;
  document.getElementById("engine-power").style.display = value;
  document.getElementById("shield-power").style.display = value;
  document.getElementById("weapon-power").style.display = value;
  document.getElementById("weapon-fire").style.display = value;
}



/****************************** Buttons *******************************/

function move(ship, dir) {
  if (dir == 'up') {
    ship.yAccel = -ship.yVelMax / 250 * ship.enginePower / 100;
  } else if (dir == 'down') {
    ship.yAccel = ship.yVelMax / 250 * ship.enginePower / 100;
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

function test() { // temporary
  console.log("timeout");
}