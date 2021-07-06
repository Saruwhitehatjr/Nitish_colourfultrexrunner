var PLAY = 1;
var END = 0;
var gameState = PLAY;
var heighty, widthx;

var trex, trex_running, trex_collided, trex1;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup,
  obstacle1,
  obstacle2,
  obstacle3,
  obstacle4,
  obstacle5,
  obstacle6;

var score = 0;

var gameOver, restart;
var jumpSound, checkPointSound, dieSound;

function preload() {
  trex_running = loadAnimation("fishy.png");
  trex_collided = loadAnimation("fishdead.png");

  groundImage = loadImage("bgfish1.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("rock1.png");
  obstacle2 = loadImage("rock2.png");
  obstacle3 = loadImage("rock3.png");

  gameOverImg = loadImage("gameOver-1.png");
  restartImg = loadImage("restart-1.png");

  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}
//trex.addAnimation("collided", trex_collided);
function setup() {
  createCanvas(windowWidth, windowHeight);

  trex = createSprite(50, height - 30, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.18;

  trex1 = createSprite(50, height - 30, 20, 50);
  trex1.addAnimation("collided", trex_collided);
  trex1.scale = 0.5;

  ground = createSprite(200, 180, width + 1000, 20);
  ground.addImage("ground", groundImage);
  ground.scale=2
  ground.x = ground.width / 2;
  ground.velocityX = -(6 + (3 * score) / 100);
  ground.depth = 0;

  gameOver = createSprite(width / 2, height / 2 - 100);
  gameOver.addImage(gameOverImg);

  restart = createSprite(width / 2, height / 2 - 50);
  restart.addImage(restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;

  invisibleGround = createSprite(200, height - 30, width, 10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  //trex.debug = true;

  background(0);

  if (gameState === PLAY) {
    score = score + Math.round(getFrameRate() / 60);
    ground.velocityX = -(6 + (3 * score) / 100);
    //change the trex animation
    trex.changeAnimation("running", trex_running);

    trex.visible = true;
    trex1.visible = false;
    if (touches.length > 0 || (keyDown("space") && trex.y >= 180)) {
      trex.velocityY = -15;
      jumpSound.play();
      touches = [];
    }

    //console.log(trex.y);

    trex.velocityY = trex.velocityY + 0.8;

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
      dieSound.play();
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    if (keyDown("space") || touches.length > 0) {
      touches = [];
      reset();
    }

    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    //change the trex animation
    trex1.visible = true;

    trex.visible = false;
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
  }

  drawSprites();

  textSize(22);
  text.fill = "black";
  text("Score: " + score, width - 150, 25);
}

function reset() {
  gameState = PLAY;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  restart.visible = false;
  gameOver.visible = false;
  score = 0;
  frameCount = 0;
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 120, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 200;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, Math.round(random(20,height - 30)), 10, 40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + (3 * score) / 100);

    //generate random obstacles
    var rand = Math.round(random(1, 3));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);

        break;
      case 2:
        obstacle.addImage(obstacle2);

        break;
      case 3:
        obstacle.addImage(obstacle3);

        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle
    obstacle.scale = 0.15;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}
