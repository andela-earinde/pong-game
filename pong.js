(function(){
   
     var context = document.getElementById("pong");
     var height = window.innerHeight;
     var width = window.innerWidth;
     context.height = height;
     context.width = width;
     var con = context.getContext("2d");

     con.fillRect(0, 0, width, height);

 //function to setup the ball
   function Ball() {
		this.x         = 50;
		this.y         = 50;
		this.radius    = 5;
		this.color     = "white";
		this.velocityX = 4;
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
 
   var ball = new Ball();
   ball.drawBall();

   var bat1 = new Bat("left");
   bat1.drawBat();

   var bat2 = new Bat("rigth");
   bat2.drawBat();
})()