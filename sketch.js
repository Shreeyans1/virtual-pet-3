var dog,dogImg,dogImg1;
var database;
var foodS,foodStock;

var feedButton, addButton;

var fedTime, lastFed;

var foodObj;

var garden, washroom, bedroom, currentTime, Feed, addFood, gameState, readState;

function preload(){
   dogImg=loadImage("Images/Dog.png");
   dogImg1=loadImage("Images/happy dog.png");
   garden = loadImage("Images/Garden.png")
   washroom = loadImage("Images/Wash Room.png")
   bedroom = loadImage("Images/Bed Room.png")
  }

//Function to set initial environment
function setup() {
  database=firebase.database();
  createCanvas(1000,500);

  dog=createSprite(400,300,150,150);
  dog.addImage(dogImg);
  dog.scale=0.15;

  foodObj = new Food();


  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  textSize(20); 
  fedTime = database.ref('feedTime')
  fedTime.on("value",function(data){
    lastFed = data.val()
  })

  readState = database.ref('gameState')
  readState.on("value",function(data){
    gameState = data.val()
  })

  feed = createButton("Feed The Dog")
  feed.position(700,95)
  feed.mousePressed(feedDog)

  addFood = createButton("Add Food")
  addFood.position(800,95)
  addFood.mousePressed(addFoods)
}

// function to display UI
function draw() {
  background(46,139,87);

  currentTime = hour()
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }
  else if (currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing")
    foodObj.washroom();
  }
  else{
    update("Hungry")
    foodObj.display();
  }
  if(gameState !== "Hungry"){
  feed.hide()
  addFood.hide()
  dog.remove()
  }
  else{
    feed.show()
    addFood.show()
    dog.addImage(dogImg)
  }

  drawSprites();

  
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(dogImg1);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}