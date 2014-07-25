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
    var canvasCtx = theCanvas.getContext('2d');

    canvasCtx.fillStyle = 'red';
    canvasCtx.strokeStyle = 'black';

    function Envelope(x, y, width, height, lives) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.moveSpeed = 0;
        this.currentSpeed = 12; //some workaround for smooth animation with some initial value
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

    function Ball(cX, cY, rad, moveSpeed, directionX, directionY) {
        this.cX = cX;
        this.cY = cY;
        this.rad = rad;
        this.mainSpeed = moveSpeed;
        this.moveSpeedX = moveSpeed;
        this.moveSpeedY = moveSpeed;
        this.directionX = directionX;
        this.directionY = directionY;

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
                    this.moveSpeedX = this.mainSpeed *-2*(1 - ((this.cX-player.x)/(player.width/2))); //The values for X and Y movespeed are reciproc and equal 2* movespeed. This chooses direction dynamically.
                    this.moveSpeedY = -this.mainSpeed *2*(1 - Math.abs(1 - ((this.cX-player.x)/(player.width/2))));// player movement
                    if (Math.abs(this.moveSpeedX) > this.mainSpeed*1.5) {
                        this.moveSpeedX = this.mainSpeed*1.5*Math.signum(this.moveSpeedX);
                        this.moveSpeedY = this.mainSpeed*0.5*Math.signum(this.moveSpeedY);
                    }
            } else if (this.bottomBorder >= theCanvas.height) {
                player.lives -= 1;
                ball = new Ball(player.x + (player.width / 2), (player.y - 7), 7, 6, 'left', 'up'); // Replaces ball that spawns at player location when it's destroyed.
            }
        };

    }

    //initialize player envelope and ball
    var player = new Envelope(300, 400, 150, 20, 3);
    var ball = new Ball(player.x + (player.width / 2), (player.y - 7), 7, 6, 'left', 'up');


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

        ball.draw(canvasCtx);
        ball.move();
        requestAnimationFrame(startGame);
        generateBlocks();
    }
    requestAnimationFrame(startGame);
};