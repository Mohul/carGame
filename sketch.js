var ground, groundimg, car, carImg, carSound;

var iline, iline2;

var hurdlesImg, hurdles, hurdlesGroup;

var SERVE = 0;
var PLAY = 1;
var END = 2;
var gameState = SERVE;

var gameOver, gameOverImg, restart, restartImg;

var score = 0;

var booster, boosterImg, boosterGroup;

var b, h, c;

var ci, bi, hi;

function preload() {
  //loading images
  groundimg = loadImage("background.PNG");
  carImg = loadImage("car-removebg-preview.png");
  hurdlesImg = loadImage("download-removebg-preview.png");
  carSound = loadSound("car-starting-a1-wwwfesliyanstudioscom_hu0Yx16g.mp3");
  gameOverImg = loadImage("download (1).jfif ");
  restartImg = loadImage("Capture-removebg-preview.png");
  boosterImg = loadImage("Untitled-removebg-preview.png");
  ci = loadImage("car-removebg-preview.png");
  hi = loadImage("download-removebg-preview.png");
  bi = loadImage("Untitled-removebg-preview.png");
}

function setup() {
  createCanvas(600, 400);
  
 //to create a invisible line so that the car jumps within the screen 
  iline2 = createSprite(500, 50, 40000, 1);
  iline2.visible = false;
  
  
  //creating the ground sprite
  ground = createSprite(90, 15, 900, 600);
  ground.addAnimation("ground", groundimg);
  ground.velocityX = -17;
  
  
  //creating the car sprite
  car = createSprite(300, 250);
  car.addImage(carImg);
  car.scale = 0.3;
  //setting the collider radius so that the car can touch the body of the obstacles
  car.setCollider("rectangle", 0, 50, 500, 200);
  
  
  //creating the game over text ater the hurdles touch with the car
  gameOver = createSprite(250, 160);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 1.5;
 //To not display the game over text in play and serve state 
  gameOver.visible = false;
  
  
//creating a invisible line so that the can stay in the road and do not vanish
  iline = createSprite(300, 300, 40, 1); 
  iline.visible = false;
  
  
//creating the restart sprite
  restart = createSprite(270, 250);
  restart.addImage(restartImg);
  //To not display the restart image in play and serve state 
  restart.visible = false;
  
  
//to print the car,hurdle and booster image while writing instructions
  c = createSprite(410, 65);
  c.addImage(ci);
 //to not display the car image only in serve state 
  c.visible = false;
  c.scale = 0.09;

  h = createSprite(410, 90);
  h.addImage(hi);
  //to not display the hurdles image only in serve state 
  h.visible = false;
  h.scale = 0.05;

  b = createSprite(500, 120);
  b.addImage(bi);
  b.scale = 0.2;
   //to not display the boosters image only in serve state 
  b.visible = false;


  //creating seperate groups for hurdles and boosters
  hurdlesGroup = createGroup();
  boosterGroup = createGroup();
}

function draw() {
  //giving the color of the background white
  background("white");
  
  
 //writing the score text
  fill("orange");
  textSize("9");

  text("Score :" + score, 500, 380);
  
  //creating infinite lines

  if (iline > 0) {
    iline.x = iline.width / 2;
  }

  if (iline2 > 0) {
    iline2.x = iline.width / 2;
  }

  if (gameState === PLAY) {
    
    //The velocity Of the ground as well as the hurdles will increase with increase in score
    
    hurdlesGroup.velocityX = -(2 * score / 5);
    
    
   //creating a road
    for (var i = 50; i < 1200; i = 50 + i) {
      var line = createSprite(i, 350, 12, 2);
    }
    
    
  //the game instruction images are invisible im play state
    c.visible = false;
    h.visible = false;
    b.visible = false;
    
    
 //to increase the score as the car touches the booster
    if (boosterGroup.isTouching(car)) {
      score = score + 2;
      boosterGroup.destroyEach();
    }
  //to increase the score as the car travels further  
    if (frameCount % 60 === 2) {
      score = score + 1;
    }
   //car will bounce off line2 so that while jumping it can't go out of the screen 
    car.bounceOff(iline2);
    
    
//to make the car jumwhen space key is pressed
    if (keyDown("space")) {
      car.velocityY = -9;
      carSound.play();
    }
    
//gravity
    car.velocityY = car.velocityY + 0.5;

    
//to prevent the car from falling down and to make the car collide with the iline
    car.collide(iline);
    
    
//commands to spawn hurdles and boosters
    spawnhurdles();
    spawnBoosters();
    
//to make the ground infinite
    if (ground.x < 200) {
      ground.x = ground.width / 2;
    }
    
//to make the game over as the car touches the stone
    if (hurdlesGroup.isTouching(car)) {
      text("GameOver", 200, 200);
      background("black");
      gameState = END;
    }
  }

  if (gameState === END) {
    
 //when the game state is end background,stone,boosters will stop and game over and restart images are shown   
    ground.velocityX = 0;
    car.velocityY = 0;
    car.x = iline.x;
    hurdlesGroup.setVelocityXEach(0);
    hurdlesGroup.destroyEach();
    gameOver.visible = true;
    restart.visible = true;
    boosterGroup.setVelocityXEach(0);
    boosterGroup.destroyEach();

    reset();
  }

  if (gameState === SERVE) {
   //during serve state instructions about how to play the game appears and when space is pressed the game state will be play
    fill("pink");
    stroke("red");
    textSize(24);
    text("How to play", 200, 50);
    textSize(20);
    stroke("white");
    fill("red");
    text("1.Press Space key to jump the car", 70, 75);
    c.visible = true;
    text("2.Avoide the stones to earn points", 70, 100);
    h.visible = true;
    text("3.Collect the point booster to earn more points", 70, 120);
    text("Press space to play",200,200)
    b.visible = true;
    car.visible = false;
    ground.visible = false;
    if (keyDown("space")) {
      gameState = PLAY;
      ground.visible = true;
      car.visible = true;
    }
  }
//to draw the sprites
  drawSprites();
}

function spawnhurdles() {
 //to make the hurdles to pass through the screen after the Frame Count is 60 
  if (frameCount % 60 === 0) {
   //creating hurdles sprites 
    hurdles = createSprite(700, 285, 10, 100);
    hurdles.addImage(hurdlesImg);
    hurdles.scale = 0.1;
    hurdles.velocityX = -19;
   //to make the  y position of the hurdles random
    hurdles.y = Math.round(random(80, 300));
   //to include hurdle in the hurdles group 
    hurdlesGroup.add(hurdles);
    hurdles.lifetime = 600;
  }
}

function reset() {
 //to create a sperate function to reset the game when clicked over  
  if (mousePressedOver(restart)) {
    gameState = SERVE;
    gameOver.visible = false;
    restart.visible = false;
    ground.velocityX = -17;
    car.x = 300;
    car.y = 250;
    score = 0;
  }
}

function spawnBoosters() {
  
  //to make the boosters to pass through the screen after the Frame Count is 160 
  if (frameCount % 160 === 5) {
    booster = createSprite(700, 285, 10, 100);
    booster.addImage(boosterImg);
    booster.y = Math.round(random(80, 300));
    booster.velocityX = -18;
    booster.scale = 0.3;
    boosterGroup.add(booster);
    booster.lifetime = 600;
  }
}
