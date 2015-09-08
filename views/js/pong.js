'use strict';
var socket = io('http://localhost:7000');

socket.on('connect', function() {
  console.log('connected to socket server');
});

socket.on('batmoved', function(data) {

});

var startSocket = function() {};

(function() {
  startSocket();

  var context = document.getElementById("pong");
  var height = window.innerHeight;
  var width = window.innerWidth;
  context.height = height;
  context.width = width;
  var con = context.getContext("2d");
  var bat = [];
  var keyPress = [];
  var firstScore = 0;
  var secondScore = 0;
  var score = 10;
  var spacePress = false;
  var player1 = "Player1";
  var player2 = "Player2";
  var init;
  var wall = document.getElementById("wall"),
    hit = document.getElementById("hit"),
    p1Score = document.getElementById("p1"),
    p2Score = document.getElementById("p2"),
    over = document.getElementById("over"),
    start = document.getElementById("start");

  //function to setup the ball
  function Ball() {
    this.x = 100;
    this.y = 100;
    this.radius = 30;
    this.color = "lightgreen";
    this.velocityX = 15;
    this.velocityY = 8;
  }

  Ball.prototype.drawBall = function() {
    con.beginPath();
    con.fillStyle = this.color;
    con.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    con.fill();
  };

  //function to set up bat
  function Bat(position) {
    this.width = 20;
    this.height = 150;
    this.color = "lightgreen"
    this.x = position === "left" ? 0 : width - this.width;
    this.y = height - 3 * this.height;
  }

  Bat.prototype.drawBat = function() {
    con.fillStyle = this.color;
    con.fillRect(this.x, this.y, this.width, this.height);
  }

  //push two ball objects into the  bat array;
  bat.push(new Bat("left"));
  bat.push(new Bat("right"));
  var ball = new Ball();

  function setCanvas() {
    //set up background
    con.fillStyle = "#0a181c";
    con.fillRect(0, 0, width, height);
    //setup middle line

    for (var i = -20; i < 1000; i += 100) {
      con.strokeStyle = "white";
      con.lineWidth = 10;
      con.lineCap = 'round';
      con.beginPath();
      con.moveTo(width / 2, i + 50);
      con.lineTo(width / 2, i + 100);
      con.stroke();
      con.closePath();
    }

    text();
  }

  function text() {
    //set up scores
    con.font = "100px serif";
    con.fillStyle = "white";
    con.fillText(firstScore, width / 2 - 100, 150);
    //set up second
    con.font = "100px serif";
    con.fillStyle = "white";
    con.fillText(secondScore, width / 2 + 100, 150);
    //set up player font
    con.font = "50px monotype corsiva, serif";
    con.fillStyle = "white";
    con.fillText(player2, width / 2 + 250, 50);
    //set up second player
    con.font = "50px monotype corsiva, serif";
    con.fillStyle = "white";
    con.fillText(player1, width / 2 - 250, 50);
    //add pong text to the middle of the canvas;
    con.font = "150px monotype corsiva, serif";
    con.fillStyle = "white";
    con.fillText("Pong Andela", width / 2, height / 2);
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
    if (firstScore >= score || secondScore >= score) {
      con.fillStlye = "white";
      con.font = "70px monotype corsiva, sans-serif";
      con.textAlign = "center";
      con.textBaseline = "middle";

      if (firstScore > secondScore)
        con.fillText("Game Over! " + player1 + " wins!", width / 2 + 20, height / 2 - 100);
      else
        con.fillText("Game Over! " + player2 + " wins!", width / 2 + 20, height / 2 - 100);
      over.play();
      restartButton.draw();
      cancelRequestAnimFrame(init);
    }
  }

  //function to check if the ball as collided with the bat
  function batCollision(bal, bati) {
    if (bal.y + bal.radius >= bati.y && bal.y - bal.radius <= bati.y + bati.height) {
      if (bal.x >= (bati.x - bati.width - 10) && bati.x > 0) {
        return true;
      } else if (bal.x <= bati.width && bati.x === 0) {
        return true;
      } else return false;
    }
  }

  //function to call the request animation frame
  function gameLoop() {
    init = requestAnimFrame(gameLoop);
    drawSurfaces();
  }

  //function to hold the game logic
  function animate() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    //listen to keybord event
    if (keyPress[38] || keyPress[40]) {
      if (keyPress[38] && bat[1].y >= 0) {
        bat[1].y -= 24;
      } else if (keyPress[40] && bat[1].y <= (height - bat[1].height)) {
        bat[1].y += 24;
      } //keyPress[38] ? bat[1].y -= 24 : bat[1].y += 24;
    }
    if (keyPress[87] || keyPress[90]) {
      // keyPress[87] ? bat[0].y -= 24 : bat[0].y += 24;
      if (keyPress[87] && bat[0].y >= 0) {
        bat[0].y -= 24;
      } else if (keyPress[90] && bat[0].y <= (height - bat[0].height)) {
        bat[0].y += 24;
      }
    }

    //change ball direction if there is a wall collision
    if (ball.y - ball.radius <= 0) {
      wall.play();
      ball.velocityY = -ball.velocityY;
    } else if ((ball.y + ball.radius) >= height - 15) {
      wall.play();
      ball.velocityY = -ball.velocityY;
    }
    //for collison on the left and right hand side
    else if (ball.x + ball.radius > width) {
      p1Score.play();
      firstScore++;
      ball.x = width / 2;
      ball.y = height / 2;
      ball.velocityY = Math.random() * ball.velocityY;
    } else if (ball.x + ball.radius < 0) {
      p2Score.play();
      secondScore++;
      ball.x = width / 2;
      ball.y = height / 2;
      ball.velocityY = Math.random() * ball.velocityY;
    }

    //check for collision with the bat
    if (batCollision(ball, bat[0])) {
      hit.play();
      ball.velocityX = -ball.velocityX;
      ball.velocityY = ball.velocityY + 5;
    } else if (batCollision(ball, bat[1])) {
      hit.play();
      ball.velocityX = -ball.velocityX;
      ball.velocityY = ball.velocityY + 5;
    }
  }

  //////////////////////////
  // Event listening block  //
  //////////////////////////

  //handle key press
  function moveBat(event) {
    keyPress[event.keyCode] = true;

    //listening to spacebar press
    if (event.keyCode === 32 && !spacePress) {
      spacePress = true;
      pause.draw();
      cancelRequestAnimFrame(init);
    } else if (event.keyCode === 32 && spacePress) {
      spacePress = false;
      gameLoop();
    }
  }

  //clear the keys object
  function stopBat(event) {
    keyPress[event.keyCode] = false;
  }


  //listen to mouse click events
  function mouseClick(event) {

    var px = event.pageX,
      py = event.pageY;

    if (px >= startButton.x && px <= startButton.x + 150) {
      start.play();
      //ball.velocityX = 15;
      //ball.velocityY = 8;
      bat[0].y = height - 3 * bat[0].height;
      bat[1].y = height - 3 * bat[0].height;
      drawSurfaces();
      gameLoop();
      startButton = {};
    } else if (px >= restartButton.x && px <= restartButton.x + 150) {
      start.play();
      ball.x = width / 2;
      ball.y = height / 2;
      //ball.velocityX = 15;
      //ball.velocityY = 8;
      bat[0].y = height - 3 * bat[0].height;
      bat[1].y = height - 3 * bat[0].height;
      firstScore = 0;
      secondScore = 0;
      drawSurfaces();
      gameLoop();
    } else if (px >= changeVelBut.x && px <= changeVelBut.x + 50) {
      ball.velocityX--;
      ball.velocityY--;
    } else if (px >= (changeVelBut.x + 50) && px <= changeVelBut.x + 100) {
      ball.velocityX++;
      ball.velocityY++;
    }
  }

  addEventListener("keydown", moveBat);

  addEventListener("keyup", stopBat);
  addEventListener("click", mouseClick);
  //////////////////////////////////
  //  End of event listening block //
  /////////////////////////////////

  // start and restart button block and pause text
  //
  var pause = {
    x: width / 2,
    y: height / 2 + 200,
    draw: function() {
      con.font = "150px monotype corsiva, serif";
      con.fillStyle = "lightgreen";
      con.fillText("Paused", this.x, this.y);
    }
  }

  var startButton = {
    x: width / 2 - 150,
    y: height / 2,
    w: 250,
    h: 100,
    draw: function() {
      con.strokeStyle = "white";
      con.lineWidth = "2";
      con.strokeRect(this.x, this.y, this.w, this.h);

      con.font = "100px monotype corsiva, serif";
      con.textAlign = "center";
      con.textBaseline = "middle";
      con.fillStlye = "white";
      con.fillText("Start", this.x + 110, this.y + 45);
    }
  }

  var changeVelBut = {
    x: width / 2 - 350,
    y: height / 2 - 200,
    w: 50,
    h: 50,
    draw: function() {
      con.font = "30px monotype corsiva, serif";
      con.textAlign = "center";
      con.textBaseline = "middle";
      con.fillStlye = "white";
      con.fillText("Change velocity: " + ball.velocityX + "x " + ball.velocityY + "y", this.x - 130, this.y + 20);

      con.strokeStyle = "white";
      con.lineWidth = "2";
      con.strokeRect(this.x, this.y, this.w, this.h);

      con.font = "100px monotype corsiva, serif";
      con.textAlign = "center";
      con.textBaseline = "middle";
      con.fillStlye = "white";
      con.fillText("-", this.x + 20, this.y + 20);

      con.strokeStyle = "white";
      con.lineWidth = "2";
      con.strokeRect(this.x + this.w, this.y, this.w, this.h);

      con.font = "90px monotype corsiva, serif";
      con.textAlign = "center";
      con.textBaseline = "middle";
      con.fillStlye = "white";
      con.fillText("+", this.x + 65, this.y + 30);
    }
  }

  var restartButton = {
      w: 150,
      h: 50,
      x: width / 2 - 500,
      y: height / 2 - 200,

      draw: function() {
        con.strokeStyle = "white";
        con.lineWidth = "2";
        con.strokeRect(this.x, this.y, this.w, this.h);

        con.font = "50px monotype corsiva, Arial";
        con.textAlign = "center";
        con.textBaseline = "middle";
        con.fillStlye = "white";
        con.fillText("Restart", this.x + 70, this.y + 20);
      }
    }
    //
    //End of start and restart button block


  //block to handle initializing the game
  //
  function drawStartSurfaces() {
    //set up background
    con.fillStyle = "#0a181c";
    con.fillRect(0, 0, width, height);

    //pong
    con.font = "200px monotype corsiva";
    con.fillStyle = "white";
    con.fillText("Pong", width / 2 - 250, height / 2 - 200);

    //title
    con.font = "40px monotype corsiva";
    con.fillStyle = "white";
    con.fillText("By Eni, for Andela class-V project", width / 2 - 100, height / 2 - 100);

    //player1
    con.font = "30px monotype corsiva";
    con.fillStyle = "white";
    con.fillText("Player 1: use keys W to move UP and Z to move DOWN", width / 2 - 300, height / 2 + 200);

    //player 2
    con.font = "30px monotype corsiva";
    con.fillStyle = "white";
    con.fillText("Player 2: use the UP and DOWN keys to move", width / 2 - 300, height / 2 + 250);

    //spacebar
    con.font = "30px monotype corsiva";
    con.fillStyle = "white";
    con.fillText("Use spacebar to pause the game", width / 2 - 300, height / 2 + 300);

    changeVelBut.draw();
  }


  function startGame() {
    //draw the surfaces
    drawStartSurfaces();
    var number = prompt("Enter the number of points to score to End the game.     default = 10");
    if (number && !isNaN(Number(number))) {
      score = number;
    } else {
      score = 10;
    }

    var name = prompt("Player1 enter your name");
    if (typeof name === "string") {
      player1 = name || "Player1";
      startButton.draw();
      var name2 = prompt("Player2 enter your name");
      if (name2 && typeof name2 === "string") {
        player2 = name2;
      } else {
        player2 = "Player 2";
        startButton.draw();
      }
    } else {
      player1 = "Player 1";
      startButton.draw();
    }
  }

  startGame();
  //
  //End of block

})();
