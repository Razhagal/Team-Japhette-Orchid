Math.signum = function(arg) {
    if(arg > 0){
        return 1;
    } else if(arg < 0){
        return -1;
    } else if(arg === 0){
        return 0;
    }

};

window.onload = function () {
    loadFile();
    var theCanvas = document.getElementById('field');
    theCanvas.height = window.innerHeight-20;
    theCanvas.width = (theCanvas.height);
    var canvasCtx = theCanvas.getContext('2d');

    canvasCtx.fillStyle = 'red';
    canvasCtx.strokeStyle = 'black';

    function Envelope(x, y, lives) {
        this.x = x;
        this.y = y;
        this.width = theCanvas.width/8;
        this.height = 25;
        this.moveSpeed = 0;
        this.currentSpeed = ((theCanvas.width+theCanvas.height)/120); //some workaround for smooth animation with some initial value
        this.sticky = true;
        this.lives = lives;
        this.image; //when we include graphix

        this.draw = function (canvasCtx) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(this.x, this.y);
            canvasCtx.fillStyle = "#FF0000";
            canvasCtx.rect(this.x, this.y, this.width, this.height);
            canvasCtx.fill();
            canvasCtx.lineWidth = 2;
            canvasCtx.stroke();
        };

        this.move = function () {
            //envelope border collision check
            if (this.x <= 0) {
                this.x = 0;
            } else if (this.x + this.width >= theCanvas.width) {
                this.x = theCanvas.width - this.width;
            }

            this.x += this.moveSpeed;
        };

    }
    function Block(kind, x, y){
        this.init = function() {
            this.height = canvasCtx.canvas.clientHeight/20;
            this.width = canvasCtx.canvas.clientWidth/18;
            switch(kind){
                case "n":{ //Normal block
                    this.health = 1;  // Hits Required for kill
                    this.fillColor = "#000000"; //Color
                    this.hittable = true; // 
                    this.powerUP = 0.01;
                    break;
                }
                case "p":{ // PowerUP dropper
                    this.health = 1;
                    this.hittable = true;
                    this.fillColor = "#00ff99";
                    this.powerUP = 1;
                    break;
                }
                case "d":{ // Double hit block
                    this.health = 2;
                    this.hittable = true;
                    this.fillColor = "#FADE00";
                    this.powerUP = 0.02;
                    break;
                }
                case "t":{ // Triple hit block
                    this.health = 3;
                    this.hittable = true;
                    this.powerUP = 0.05;
                    this.fillColor = "#DA9900";
                    break;
                }
            }
            this.draw = function() {

                canvasCtx.fillStyle = this.fillColor;
                canvasCtx.rect(this.x, this.y, this.width, this.height);
                canvasCtx.fill();
            };
        };
    }
    function Ball(cX, cY, rad) {
        this.cX = cX;
        this.cY = cY;
        this.rad = rad;
        this.mainSpeed = (theCanvas.height+theCanvas.width)/(120*2);
        this.moveSpeedX = this.mainSpeed;
        this.moveSpeedY = this.mainSpeed;
        this.draw = function (canvasCtx) {
            canvasCtx.beginPath();
            canvasCtx.arc(this.cX, this.cY, this.rad, 0, 2 * Math.PI); // Makes Arc of 2*pi = Circle
            canvasCtx.fill(); // Fills it
            canvasCtx.stroke(); // Adds the black outline
        };

        this.move = function () {
            this.cX += this.moveSpeedX; // removed switch, instead just set movespeed variable to negative.
            this.cY += this.moveSpeedY; // removed switch, instead just set movespeed variable to negative.
            this.checkCollision(); // checks if the ball collides with anything
        };

        this.checkCollision = function () {
            this.rightBorder = this.cX + this.rad; 
            this.leftBorder = this.cX - this.rad;
            this.topBorder = this.cY - this.rad;
            this.bottomBorder = this.cY + this.rad;

            //playfield border and envelope collision checks
            if (this.leftBorder <= 0) {
                this.moveSpeedX = -this.moveSpeedX; // sets variable to move right
            } else if (this.rightBorder >= theCanvas.width) {
                this.moveSpeedX = -this.moveSpeedX; //sets variable to move left
            }
            /*Bug : Sometimes the ball goes too fast , we should probably set a limit of atleast MS = 2 for X and Y.*/
            /*Bug : Somethimes the ball can go fast enough as to exit the boundaries of the level, leaving it glitched*/
            if (this.topBorder <= 0) {
                this.moveSpeedY = -this.moveSpeedY; // sets variable to move down 
            } else if (this.cX >= player.x &&
                this.cX <= (player.x + player.width) &&
                this.bottomBorder >= player.y &&
                this.bottomBorder <= player.y + player.height) {
                    if (player.sticky) {
                        if (player.x >= 0 && player.x + player.width <= theCanvas.width) {
                            this.moveSpeedX = player.moveSpeed;
                            this.moveSpeedY = 0;
                        }else{
                            this.moveSpeedX = 0;
                            this.moveSpeedY = 0;
                        }
                    }else{
                        this.moveSpeedX = this.mainSpeed *-2*(1 - ((this.cX-player.x)/(player.width/2))); //The values for X and Y movespeed are reciproc and equal 2* movespeed. This chooses direction dynamically.
                        this.moveSpeedY = -this.mainSpeed *2*(1 - Math.abs(1 - ((this.cX-player.x)/(player.width/2))));// player movement
                        if (Math.abs(this.moveSpeedX) > this.mainSpeed*1.5) {
                            this.moveSpeedX = this.mainSpeed*1.5*Math.signum(this.moveSpeedX);
                            this.moveSpeedY = this.mainSpeed*0.5*Math.signum(this.moveSpeedY);
                        }
                    }
            }
            else if (this.bottomBorder >= theCanvas.height) {
                if (balls.length > 1) {
                    var newBalls = [];
                    for(var i = 0; i < balls.length; i++){
                        if(balls[i].bottomBorder <= theCanvas.height){
                            newBalls.push(balls[i]);
                        }
                    }
                    balls = newBalls;
                }else{
                    player.lives -= 1;  
                    player.sticky = true;
                    balls.push(new Ball(player.x + (player.width / 2) - this.rad, (player.y - 7), 7)); // Replaces ball that spawns at player location when it's destroyed.
                }
            }
        };

    }

    //initialize player envelope and ball

    var balls = [];
    var blocks = [];
    var player = new Envelope(theCanvas.width/2, theCanvas.height-100, 3);
    balls.push(new Ball(player.x + (player.width / 2)-7, (player.y - 7), 7));




    //Player Controls Block
    document.body.addEventListener('keydown', function (e) {
        if (!e) {
            e = window.event;
        }

        switch (e.keyCode) {
            case 37: // Left
                player.moveSpeed = (player.currentSpeed * -1); //Sets Player Speed
                break;
            case 39: // Right
                player.moveSpeed = player.currentSpeed; //Sets Player Speed
                break;
            case 32, 38:/*space*/ {
                if (player.sticky) {
                    player.sticky = 0;
                    for(var b in balls){
                        if (b.moveSpeedX == 0 && b.moveSpeedY == 0) {
                            b.moveSpeedY = -6;
                        }
                    }
                }
                
                break;
            }
        }

    });

    document.body.addEventListener('keyup', function (e) {
        if (!e) {
            e = window.event;
        }

        switch (e.keyCode) {
            case 37:
                if (player.moveSpeed === (player.currentSpeed * -1)) { // Checks if the correct key is pressed. Else Has issues when player button mashes.
                    player.moveSpeed = 0;
                }
                break;
            case 39:
                if (player.moveSpeed === player.currentSpeed) { // Checks if the correct key is pressed. Else Has issues when player button mashes.
                    player.moveSpeed = 0;
                }
                break;
        }
    });

    //Game Loop
    function startGame() {
        canvasCtx.clearRect(0, 0, theCanvas.width, theCanvas.height);

        player.draw(canvasCtx);
        player.move();

        for (var i = 0; i < balls.length ; i++){
            balls[i].draw(canvasCtx);
            balls[i].move();
        }
        requestAnimationFrame(startGame);
        generateBlocks();
    }
    requestAnimationFrame(startGame);
};