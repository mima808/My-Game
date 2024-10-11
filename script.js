// Global Variables
let player, walls;
let playButton, htpButton, backButton, muteButton;
let score = 0;
let screen = 0;
let overlayGraphics;
let person1img, lanternimg, mazeimg, gameimg, rulesimg, playerimg, lastimg, mushimg;
let greatVibes, lss;
let revealedAreaSize = 80;
let hasCollided1 = false;
let hasCollided2 = false;
let hasCollided3 = false;
let showOverlay = false;
let hasWon = false;
let winPlayed = false;
let isMuted = false;

// Setup for positioning and other constants
const scoreX = 348;
const scoreY = 40;
const scoreRevealWidth = 80;
const scoreRevealHeight = 16;
const muteX = 348;
const muteY = 15;
const muteRevealWidth = 60;
const muteRevealHeight = 20;
const ACCELERATION = 0.2;
const MAX_SPEED = 3;
const FRICTION = 0.9;

/* PRELOAD FUNCTION */
function preload() {
  //Images
  person1img = loadImage('assets/person1.png');
  lanternimg = loadImage('assets/lantern.png');
  mazeimg = loadImage('assets/maze.png');
  gameimg = loadImage('assets/game.png');
  rulesimg = loadImage('assets/rules.png');
  playerimg = loadImage('assets/player.png');
  lastimg = loadImage('assets/last.png');
  mushimg = loadImage('assets/mush.png');
  //Fonts
  greatVibes = loadFont('assets/greatvibes.ttf');
  lss = loadFont('assets/lss.otf');
  //Sound
  win = loadSound('assets/win.wav');
  light = loadSound('assets/light.wav');
  point = loadSound('assets/point.mp3');
  forest = loadSound('assets/forest.mp3');
  click = loadSound('assets/click.wav');
}

/* SETUP FUNCTION */
function setup() {
  createCanvas(400, 400);
  forest.loop();

  // Resize images
  person1img.resize(0, 30);
  lanternimg.resize(0, 35);
  playerimg.resize(0, 40);
  mushimg.resize(0, 60);

  // Set sound volumes
  forest.setVolume(1);
  point.setVolume(10);
  light.setVolume(10);
  win.setVolume(15);
  click.setVolume(10);

  homeScreenAssets();
  overlayGraphics = createGraphics(400, 400);

  // Create back button
  backButton = new Sprite(width - 50, height - 30, 80, 30, 'k');
  backButton.color = "#174440";
  backButton.textColor = "white";
  backButton.textSize = 14;
  backButton.text = "Back";
  backButton.pos = { x: -100, y: -100 };

  // Create mute button
  muteButton = new Sprite(348, 15, 60, 20, 'k');
  muteButton.color = "#174440";
  muteButton.textColor = "white";
  muteButton.textSize = 12;
  muteButton.text = "Mute";
}

/* DRAW LOOP FUNCTION */
function draw() {
  if (screen === 0) {
    drawHomeScreen();
  } else if (screen === 1) {
    drawGameScreen();
  } else if (screen === 2) {
    drawMuteButton();
    endScreenAssets();
  } else if (screen === 4) {
    rulesScreenAssets();
    backButton.pos = { x: 350, y: 380 };
  } else {
    backButton.pos = { x: -100, y: -100 };
  }

  handleEventListeners();
  drawMuteButton();
}

// Utility functions to draw different screens and handle events
function homeScreenAssets() {
  background(gameimg);

  // Create title
  fill("#dbe187");
  textSize(35);
  textFont(lss);
  strokeWeight(0);
  textAlign(CENTER);
  text("Light's Labyrinth", width / 2, 70);

  // Create message
  fill("#238580");
  textSize(15);
  textAlign(CENTER);
  stroke(255);
  strokeWeight(4);
  text("In a world covered \nin darkness, your journey to \nfind the light begins \nnow", width / 2, 135);
  strokeWeight(0);

  // Create play button
  textFont(lss);
  playButton = new Sprite(width / 2, 280, 100, 30, 'k');
  playButton.color = "#174440";
  playButton.textColor = "white";
  playButton.stroke = color(103, 213, 0, 0);
  playButton.textSize = 14;
  playButton.text = "Play";

  // Create How to Play button
  htpButton = new Sprite(width / 2, 230, 100, 30, 'k');
  htpButton.color = "#174440";
  htpButton.textColor = "white";
  htpButton.stroke = color(103, 230, 0, 0);
  htpButton.textSize = 14;
  htpButton.text = "How to Play";
}

function rulesScreenAssets() {
  background(rulesimg);

  // Move play and how to play buttons offscreen
  htpButton.pos = { x: -100, y: -100 };
  playButton.pos = { x: -100, y: -100 };

  // Create message
  fill("#2a4d11");
  textSize(16);
  textAlign(CENTER);
  stroke(255);
  strokeWeight(3);
  text(
    "Objective: \nFind all the lanterns to light up \nthe maze, \nand remove the mushroom \nblocking the maze's end.\n\nGameplay: \nThe screen will start covered in darkness. \nYou'll have the maze revealed for 4 seconds \nat the beginning to quickly navigate \nand get your bearings. \n\n Mechanics: \nMove using your arrow keys.",
    width / 2,
    60
  );
  strokeWeight(0);
}

function playScreenAssets() {
  background(mazeimg);

  // Move play and how to play buttons offscreen
  playButton.pos = { x: -200, y: -100 };
  htpButton.pos = { x: -200, y: -100 };

  // Create player sprite
  player = new Sprite(playerimg, 370, 50, 15, 15);
  player.color = color(255);
  player.rotationLock = true;

  // Create lanterns
  lantern1 = new Sprite(lanternimg, 220, 130, 's');
  lantern2 = new Sprite(lanternimg, 125, 275, 's');
  lantern3 = new Sprite(lanternimg, 180, 80, 's');

  // Create end sprite
  endSprite = new Sprite(mushimg, 45, 365, 60, 30, 'k');
  endSprite.color = "#7fae11";
  strokeWeight(0);

  // Create the maze
  walls = new Group();
  walls.stroke = color(103, 213, 0, 0);
  walls.color = color(103, 212, 0, 0);
  walls.collider = "s";

  // Maze Walls creation
  //Borders
  new walls.Sprite(150, 4.9, 340, 10);
  new walls.Sprite(4.9, height / 2, 10, height);
  new walls.Sprite(235, 394.9, 330, 10);
  new walls.Sprite(395, 195, 10, 390);
  //Walls
  new walls.Sprite(54, 249, 10, 206);
  new walls.Sprite(110, 151, 100, 10);
  new walls.Sprite(80, 347, 60, 10);
  new walls.Sprite(107, 366, 10, 48);
  new walls.Sprite(104, 102, 188, 10);
  new walls.Sprite(202, 298, 185, 10);
  new walls.Sprite(155, 328, 10, 48);
  new walls.Sprite(184, 347, 48, 10);
  new walls.Sprite(203, 370, 10, 48);
  new walls.Sprite(106, 253, 10, 100);
  new walls.Sprite(203, 154, 10, 190);
  new walls.Sprite(155, 54, 202, 10);
  new walls.Sprite(130, 200, 58, 10);
  new walls.Sprite(155, 225, 10, 57);
  new walls.Sprite(225, 151, 53, 10);
  new walls.Sprite(227, 249, 57, 10);
  new walls.Sprite(251, 175, 10, 58);
  new walls.Sprite(299, 70, 10, 172);
  new walls.Sprite(327, 151, 51, 10);
  new walls.Sprite(276, 200, 58, 10);
  new walls.Sprite(327, 54, 58, 10);
  new walls.Sprite(275, 102, 40, 10);
  new walls.Sprite(370, 102, 58, 10);
  new walls.Sprite(299, 298, 10, 108);
  new walls.Sprite(370, 298, 58, 10);
  new walls.Sprite(300, 347, 105, 10);
  new walls.Sprite(325, 249, 55, 10);
  new walls.Sprite(347, 225, 10, 57);

  // Set a timeout to show the overlay after 4 seconds
  setTimeout(() => {
    showOverlay = true;
  }, 4000);
}

function endScreenAssets() {
  background(lastimg);
  if (!winPlayed) {
    win.play();
    winPlayed = true;
  }

  // Draw sprites off the screen
  player.vel.x = 0;
  player.vel.y = 0;
  player.pos = { y: 4000 };
  walls.x = -1000;

  fill("#184656");
  textSize(17);
  textAlign(CENTER);
  stroke(255);
  strokeWeight(3);
  text("Congratulations! \n\nYou've conquered the darkness \nand found the light. \n\nThank you for playing Light's Labyrinth. \nUntil next time, keep seeking the light!", width / 2, 120);
}

/* DRAW FUNCTIONS FOR INDIVIDUAL SCREENS */
function drawHomeScreen() {
  if (playButton.mouse.presses()) {
    screen = 1;
    playScreenAssets();
    click.play();
  }
  if (htpButton.mouse.presses()) {
    screen = 4;
    rulesScreenAssets();
    click.play();
  }
}

function drawGameScreen() {
  background(mazeimg);

  // Handle player movement with acceleration
  if (kb.pressing("left")) {
    player.vel.x = max(player.vel.x - ACCELERATION, -MAX_SPEED);
  } else if (kb.pressing("right")) {
    player.vel.x = min(player.vel.x + ACCELERATION, MAX_SPEED);
  } else {
    player.vel.x *= FRICTION;
  }
  if (kb.pressing("up")) {
    player.vel.y = max(player.vel.y - ACCELERATION, -MAX_SPEED);
  } else if (kb.pressing("down")) {
    player.vel.y = min(player.vel.y + ACCELERATION, MAX_SPEED);
  } else {
    player.vel.y *= FRICTION;
  }

  // Lantern collision logic
  handleLanternCollisions();

  // Ensure player remains within maze boundaries
  if (player.y < 20) {
    player.y = 20;
  }

  // Display score
  fill("white");
  textSize(16);
  strokeWeight(0);
  text("Score = " + score, 348, 43);

  // Win conditions
  if (score >= 3 && !hasWon) {
    endSprite.pos = { x: 65, y: 365 };
    light.play();
    hasWon = true;
    endSprite.vel.x = -0.5;
  }

  // Player wins
  if (player.y > 400 && player.x <= 64) {
    screen = 2; // Switch to end screen
    endScreenAssets();
  }

  // Draw all sprites
  drawSprites();

  // Draw overlay
  if (showOverlay && score !== 3) {
    drawOverlay();
  }
}

function handleLanternCollisions() {
  if (player.collides(lantern1) && !hasCollided1) {
    revealedAreaSize += 40;
    hasCollided1 = true;
    score++; //score + 1
    if (score < 3) {
      point.play();
    }
  }
  if (player.collides(lantern2) && !hasCollided2) {
    revealedAreaSize += 40;
    hasCollided2 = true;
    score++; //score + 1
    if (score < 3) {
      point.play();
    }
  }
  if (player.collides(lantern3) && !hasCollided3) {
    revealedAreaSize += 40;
    hasCollided3 = true;
    score++; //score + 1
    if (score < 3) {
      point.play();
    }
  }
}

function drawOverlay() {
  overlayGraphics.clear();
  overlayGraphics.background(0);
  overlayGraphics.erase();
  overlayGraphics.ellipse(player.x, player.y, revealedAreaSize, revealedAreaSize);
  overlayGraphics.rect(scoreX - scoreRevealWidth / 2, scoreY - scoreRevealHeight / 2, scoreRevealWidth, scoreRevealHeight);
  overlayGraphics.rect(muteX - muteRevealWidth / 2, muteY - muteRevealHeight / 2, muteRevealWidth, muteRevealHeight);
  overlayGraphics.noErase();
  image(overlayGraphics, 0, 0);
}

function handleEventListeners() {
  if (backButton.mouse.presses()) {
    screen = 0;
    backButton.pos = { x: -100, y: -100 };
    homeScreenAssets();
    hasWon = false;
    winPlayed = false;
    click.play();
  }
}

  function drawMuteButton() {
    muteButton.pos = { x: 348, y: 15 }; // Consistent position
    if (muteButton.mouse.presses()) {
      isMuted = !isMuted;
      muteButton.text = isMuted ? "Unmute" : "Mute";
      forest.setVolume(isMuted ? 0 : 1);
    }
  }