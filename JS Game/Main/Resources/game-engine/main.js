window.onload = function () {
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
            canvasCtx.arc(this.cX, this.cY, this.rad, 0, 2 * Math.PI);
            canvasCtx.fill();
            canvasCtx.stroke();
        };

        this.move = function () {
            this.cX += this.moveSpeedX;
            this.cY += this.moveSpeedY;

            this.checkCollision();
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

            if (this.topBorder <= 0) {
                this.moveSpeedY = -this.moveSpeedY; // sets variable to move down 
            } else if (this.cX >= player.x &&
                this.cX <= (player.x + player.width) &&
                this.bottomBorder >= player.y &&
                this.bottomBorder <= player.y + player.height) {
                    this.moveSpeedX = this.mainSpeed *-2*(1 - ((this.cX-player.x)/(player.width/2)));
                    this.moveSpeedY = -this.mainSpeed *2*(1 - Math.abs(1 - ((this.cX-player.x)/(player.width/2))));// player flipper code
                    console.log(this.moveSpeedX);
                    console.log(this.moveSpeedY);
            } else if (this.bottomBorder >= theCanvas.height) {
                player.lives -= 1;
                ball = new Ball(player.x + (player.width / 2), (player.y - 7), 7, 6, 'left', 'up');
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
                if (player.moveSpeed === (player.currentSpeed * -1)) { // Checks if the correct key is pressed. 
                    player.moveSpeed = 0;
                }
                break;
            case 39:
                if (player.moveSpeed === player.currentSpeed) { // Checks if the correct key is pressed. 
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
    }

    requestAnimationFrame(startGame);
};