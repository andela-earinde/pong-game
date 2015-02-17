 (function(){
   
     var context = document.getElementById("pong");
     var height = window.innerHeight;
     var width = window.innerWidth;
     context.height = height;
     context.width = width;
     var con = context.getContext("2d");
     var bat = [];
     var keyPress = {};

 //function to setup the ball
   function Ball() {
		this.x         = 50;
		this.y         = 50;
		this.radius    = 5;
		this.color     = "white";
		this.velocityX = 8;
		this.velocityY = 4;
   }

   Ball.prototype.drawBall = function(){
   	    con.beginPath();
   	    con.fillStyle = this.color;
   	    con.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
   	    con.fill();
   };

   //function to set up bat
   function Bat(position) {
   	    this.width = 5;
   	    this.height = 100;
   	    this.color = "white"
   	    this.x = position === "left"? 0 : width - this.width;
   	    this.y = height - 4 *this.height;
   }

   Bat.prototype.drawBat = function() {
   	    con.fillStyle = this.color;
   	    con.fillRect(this.x, this.y, this.width, this.height);
   }

   //push two ball objects into the  bat array;
   bat.push(new Bat("left"));
   bat.push(new Bat("right"));
   var ball = new Ball();

   function setCanvas(){
   	    con.fillStyle = "black";
   	    con.fillRect(0, 0, width, height);
   }

   function drawSurfaces() {
   	    setCanvas();
   	    bat[0].drawBat();
   	    bat[1].drawBat();
   	    ball.drawBall(); 
   	    animate();
   }

  //function stops the requestanimationframe
   function endGame() {
         cancelRequestAnimFrame(init);
   }
   
   //function to check if the ball as collided with the bat
   function batCollision(bal, bati) {
   	    if(bal.y + bal.radius >= bati.y && bal.y - bal.radius <= bati.y + bati.height){
            if(bal.x >= (bati.x - bati.width) && bati.x > 0){
                return true;
            }
            else if(bal.x <= bati.width && bati.x === 0){
            	return true;
            }
            else return false;
   	    }
   }
   
   //function to call the request animation frame
   function gameLoop(){
   	   init = requestAnimFrame(gameLoop);
   	   drawSurfaces();
   }

   //function to hold the game logic
   function animate() {
   	   ball.x += ball.velocityX;
   	   ball.y += ball.velocityY;
       
       //listen to keybord event
   	   if(keyPress.key === 38 || keyPress.key === 40){
   	   	     keyPress.key === 38 ? bat[1].y -= 8 : bat[1].y += 8;
   	   }
   	   else if(keyPress.key === 87 || keyPress.key === 90){
             keyPress.key === 87 ? bat[0].y -= 8 : bat[0].y += 8;
   	   }
       
       //change ball direction if there is a wall collision
   	   if(ball.y - ball.radius <= 0 ) {
           ball.velocityY = -ball.velocityY;
   	   }
   	   else if(ball.y + ball.radius >= height) {
   	   	    ball.velocityY = -ball.velocityY;
   	   }
   	   else if(ball.x + ball.radius > width){
   	   	    ball.x = width - ball.radius;
   	   	    endGame();
   	   }
   	   else if(ball.x + ball.radius < 0) {
   	   	    ball.x = ball.radius;
   	   	    endGame();
   	   }
       
       //check for collision with the bat
   	   if(batCollision(ball, bat[0])){
   	   	    ball.velocityX = -ball.velocityX;
   	   }
   	   else if(batCollision(ball, bat[1])){
   	   	    ball.velocityX = -ball.velocityX;
   	   }
   }

   function moveBat(event) {
        keyPress.key = event.keyCode;
   }

   function stopBat(event) {
   	    keyPress.key = 0;
   }

   gameLoop();

   addEventListener("keydown", moveBat);

   addEventListener("keyup", stopBat);

  
})()