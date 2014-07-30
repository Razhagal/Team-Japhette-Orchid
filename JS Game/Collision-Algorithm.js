<!DOCTYPE html>
<html>
<head>
	<title>Game Project Beta</title>
	<meta charset="utf-8" />
</head>
<body onkeydown="setMovement(event)" onkeyUp="stopMovement(event)">

	<div id="canvas">
	<canvas width="500px" height="400px" style="height: 400px; width: 500px; " id="myCanvas"  >Canvas not supported</canvas>
	</div>

	<script>
	//VARIABLES

	var wantedMovement = 5;
	var gameCanvas = document.getElementById("myCanvas");
	var grafx = gameCanvas.getContext('2d');
	var player = new Object("avatar.png", gameCanvas.width/2, gameCanvas.height-25, 100, 25 );
	var ball = new Object("ball.png", player.X + player.Width/2, player.Y - player.Height, 25, 25)
	var block = new Object("block.png", 100, 0 , 50, 40);
	var isLeft = false;
	var isRight = false;
	player.Velocity_Y = 0;
	block.Velocity_Y = 1;


	//EVENTS
	
	function setMovement(e) {
		if (e.keyCode == 37) player.Velocity_X = -wantedMovement;
		if (e.keyCode == 39) player.Velocity_X = wantedMovement;
	}
	function stopMovement(e){
		if (player.Velocity_X == -wantedMovement) {
			if (e.keyCode == 37) player.Velocity_X = 0;	
		}
		if (player.Velocity_X == wantedMovement) {
			if (e.keyCode == 39) player.Velocity_X = 0;
		}
	}

	//MAINLOOP
	MainLoop();

	function MainLoop() {
	    //VARIABLES
		player.X += player.Velocity_X;
		player.Y += player.Velocity_Y;
		//LOGIC
		if (player.isColliding(block)) {
			player.Velocity_Y = -1;

		}
		
		//DRAW
		grafx.clearRect(0,0,gameCanvas.width,gameCanvas.height);
		grafx.drawImage(player.Sprite,player.X,player.Y,player.Width,player.Height);
		grafx.drawImage(ball.Sprite, ball.X, ball.Y, ball.Width, ball.Height);
		grafx.drawImage(block.Sprite,block.X,block.Y,block.Width,block.Height);
		setTimeout(MainLoop,1000/60);

	}
	function Object(img,x,y,width,height) {
		this.Sprite = new Image();
		this.Sprite.src = img;
		this.X = x;
		this.Y = y;
		this.Width = width;
		this.Height = height;
		this.Velocity_X = 0;
		this.Velocity_Y = 0;

		//COLLISION DETECTION
		this.isColliding = function(obj) {
			if (this.X > obj.X + obj.Width) return false;
			if (this.X + this.Width < obj.X) return false;
			if (this.Y > obj.Y + obj.Height) return false;
			if (this.Y + this.Height < obj.Y) return false;
			return true;
		}
	}
</script>
</body>
</html>
