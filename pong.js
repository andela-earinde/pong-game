 (function(){
   
     var context = document.getElementById("pong");
     var height = window.innerHeight;
     var width = window.innerWidth;
     context.height = height;
     context.width = width;
     var con = context.getContext("2d");
     var bat = [];
     var keyPress = {};
     var firstScore = 0;
     var secondScore = 0;

 //function to setup the ball
   function Ball() {
		this.x         = 50;
		this.y         = 50;
		this.radius    = 10;
		this.color     = "lightgreen";
		this.velocityX = 15;
		this.velocityY = 8;
   }

   Ball.prototype.drawBall = function(){
   	    con.beginPath();
   	    con.fillStyle = this.color;
   	    con.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
   	    con.fill();
   };

   //function to set up bat
   function Bat(position) {
   	    this.width = 8;
   	    this.height = 150;
   	    this.color = "lightgreen"
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
        //set up background
   	    con.fillStyle = "#0a181c";
   	    con.fillRect(0, 0, width, height);
        //setup middle line
        con.strokeStyle = "white";
        con.lineWidth = 10;
        con.lineCap = 'round';
        con.beginPath();
        con.moveTo(width/2, 0);
        con.lineTo(width/2, height);
        con.stroke();
        con.closePath();
        text();
   }

   function text() {
       //set up scores
        con.font = "100px serif";
        con.fillStyle = "white";
        con.fillText(firstScore, width/2-100, 150);
        //set up second
        con.font = "100px serif";
        con.fillStyle = "white";
        con.fillText(secondScore, width/2+50, 150);
        //set up player font
        con.font = "50px serif";
        con.fillStyle = "white";
        con.fillText("Player 2", width/2+200, 50);
        //set up second player
        con.font = "50px serif";
        con.fillStyle = "white";
        con.fillText("Player 1", width/2-250, 50);
        //add pong text to the middle of the canvas;
        con.font = "150px monotype corsiva";
        con.fillStyle = "white";
        con.fillText("Pong", width/2-150, height/2); 
   }

   function drawSurfaces() {
   	    setCanvas();
   	    bat[0].drawBat();
   	    bat[1].drawBat();
   	    ball.drawBall(); 
        endGame();
   	    animate();
   }

  //function stops the requestanimationframe
   function endGame() {
       if(firstScore >= 1 || secondScore >= 1){
            con.fillStlye = "white";
            con.font = "70px monotype corsiva, sans-serif";
            con.textAlign = "center";
            con.textBaseline = "middle";

            if(firstScore > secondScore)
                con.fillText("Game Over! Player 1 wins!", width/2+20, height/2 - 100 );
            else
                con.fillText("Game Over! Player 2 wins!", width/2+20, height/2 - 100);

            restartButton.draw();
            cancelRequestAnimFrame(init);
       } 
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
   	   	     keyPress.key === 38 ? bat[1].y -= 18 : bat[1].y += 18;
   	   }
   	   else if(keyPress.key === 87 || keyPress.key === 90){
             keyPress.key === 87 ? bat[0].y -= 18 : bat[0].y += 18;
   	   }
       
       //change ball direction if there is a wall collision
   	   if(ball.y - ball.radius <= 0 ) {
           ball.velocityY = -ball.velocityY;
   	   }
   	   else if(ball.y + ball.radius >= height) {
   	   	    ball.velocityY = -ball.velocityY;
   	   }
       //for collison on the left and right hand side
   	   else if(ball.x + ball.radius > width){
            firstScore++;
            ball.x = width/2;
            ball.y = height/2;
            ball.velocityY = Math.random() * ball.velocityY;
   	   }
   	   else if(ball.x + ball.radius < 0) {
   	   	    secondScore++;
            ball.x = width/2;
            ball.y = height/2;
            ball.velocityY = Math.random() * ball.velocityY;
   	   }
       
       //check for collision with the bat
   	   if(batCollision(ball, bat[0])){
   	   	    ball.velocityX = -ball.velocityX;
            ball.velocityY = ball.velocityY * 2*Math.random();
   	   }
   	   else if(batCollision(ball, bat[1])){
   	   	    ball.velocityX = -ball.velocityX;
            ball.velocityY = ball.velocityY * 2*Math.random();
   	   }
   }

   function moveBat(event) {
        keyPress.key = event.keyCode;
   }

   function stopBat(event) {
   	    keyPress.key = 0;
   }

   function mouseClick(event) {
        
        var px = event.pageX,
            py = event.pageY;

        if(px >= startButton.x && px <= startButton.x + 150){
             gameLoop();
             startButton = {};
        }

        if(px >= restartButton.x && px <= restartButton.x + 150){
             firstScore = 0;
             secondScore = 0;
             drawSurfaces();
             gameLoop();
        }
   }

   var startButton = {
        x: width/2-350,
        y: height/2-150,
        w: 150,
        h: 50, 
        draw: function(){
             con.strokeStyle = "white";
             con.lineWidth = "2";
             con.strokeRect(this.x, this.y, this.w, this.h);
             
             con.font = "50px monotype corsiva, serif";
             con.textAlign = "center";
             con.textBaseline = "middle";
             con.fillStlye = "white";
             con.fillText("Start", this.x+65, this.y+25);
        }
   }

   var restartButton = {
       w: 150,
       h: 50,
       x: width/2-350,
       y: height/2-200,
  
       draw: function() {
            con.strokeStyle = "white";
            con.lineWidth = "2";
            con.strokeRect(this.x, this.y, this.w, this.h);
    
            con.font = "50px monotype corsiva, Arial";
            con.textAlign = "center";
            con.textBaseline = "middle";
            con.fillStlye = "white";
            con.fillText("Restart", this.x+70, this.y+20);
        }   
   }

   function startGame() {
        //draw the surfaces
        drawSurfaces();
       //draw the start canvas onto the screen
       startButton.draw();
   }
  
   //start the game
   startGame();

   addEventListener("keydown", moveBat);

   addEventListener("keyup", stopBat);
   addEventListener("click", mouseClick);

  
})()