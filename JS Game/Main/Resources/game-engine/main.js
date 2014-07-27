function signum(arg) {
    if (arg > 0) {
        return 1;
    } else if (arg < 0) {
        return -1;
    } else {
        return 0;
    }
}

window.onload = function() {
    var theCanvas = document.getElementById('field'),
        canvasCtx = theCanvas.getContext('2d');

    theCanvas.height = window.innerHeight - 20;
    theCanvas.width = (theCanvas.height);

    canvasCtx.fillStyle = 'red';
    canvasCtx.strokeStyle = 'black';

    var balls = [],
        blocks = [],
        player,
        blocksFieldHeight;

    reader.onreadystatechange = function () {
        if (reader.readyState === 4) {
            field = reader.responseText;
            //console.log(reader.responseText);

            //initialize player envelope and ball
            balls = [];
            blocks = generateBlocks();
            
            //extract blocks bottom border coordinates
            blocksFieldHeight = Math.ceil(blocks[blocks.length - 1]);
            blocks.splice(blocks.length - 1, 1);

            player = new Envelope(theCanvas.width / 2, theCanvas.height - 100, 3, theCanvas);
            balls.push(new Ball(player.x + (player.width / 2) - 7, (player.y - 7), 7, theCanvas));
            //console.log(blocks[0].length);
            //console.log(blocks[1]);
            //console.log(blocks[2].length);
            startGame();
        }
    };

    

    function Ball(cX, cY, rad, theCanvas) {
        this.cX = cX;
        this.cY = cY;
        this.rad = rad;
        //this.mainSpeed = (theCanvas.height + theCanvas.width) / (120 * 2);
        this.mainSpeed = 4;
        this.moveSpeedX = this.mainSpeed;
        this.moveSpeedY = this.mainSpeed;

        this.draw = function(canvasCtx) {
            canvasCtx.beginPath();
            canvasCtx.arc(this.cX, this.cY, this.rad, 0, 2 * Math.PI); // Makes Arc of 2*pi = Circle
            canvasCtx.fill(); // Fills it
            canvasCtx.stroke(); // Adds the black outline
        };

        this.move = function() {
            this.cX += this.moveSpeedX; // removed switch, instead just set movespeed variable to negative.
            this.cY += this.moveSpeedY; // removed switch, instead just set movespeed variable to negative.
            this.checkCollision(); // checks if the ball collides with anything
        };

        this.checkCollision = function() {
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
            } else if (this.cX >= player.x && this.cX <= (player.x + player.width) &&
                       this.bottomBorder >= player.y && this.bottomBorder <= player.y + player.height) {
                if (player.sticky) {
                    if (player.x >= 0 && player.x + player.width <= theCanvas.width) {
                        this.moveSpeedX = player.moveSpeed;
                        this.moveSpeedY = 0;
                    } else {
                        this.moveSpeedX = 0;
                        this.moveSpeedY = 0;
                    }
                } else {
                    this.moveSpeedX = this.mainSpeed * -2 * (1 - ((this.cX - player.x) / (player.width / 2))); //The values for X and Y movespeed are reciproc and equal 2* movespeed. This chooses direction dynamically.
                    this.moveSpeedY = -this.mainSpeed * 2 * (1 - Math.abs(1 - ((this.cX - player.x) / (player.width / 2)))); // player movement

                    if (Math.abs(this.moveSpeedX) > this.mainSpeed * 1.5) {
                        this.moveSpeedX = this.mainSpeed * 1.5 * signum(this.moveSpeedX);
                        this.moveSpeedY = this.mainSpeed * 0.5 * signum(this.moveSpeedY);
                    }
                }
            } else if (this.bottomBorder >= theCanvas.height) {
                if (balls.length > 1) {
                    var newBalls = [];

                    for (var i = 0; i < balls.length; i++) {
                        if (balls[i].bottomBorder <= theCanvas.height) {
                            newBalls.push(balls[i]);
                        }
                    }

                    balls = newBalls;
                } else {
                    player.lives -= 1;
                    player.sticky = true;
                    balls[0] = new Ball(player.x + (player.width / 2) - this.rad, (player.y - 7), 7, theCanvas); // Replaces ball that spawns at player location when it's destroyed.
                }
            }

            this.checkBlockCollision();
        };

        this.checkBlockCollision = function () {
            this.rightBorder = this.cX + this.rad;
            this.leftBorder = this.cX - this.rad;
            this.topBorder = this.cY - this.rad;
            this.bottomBorder = this.cY + this.rad;
            var currentBlock,
                currentBlockRightBorder,
                currentBlockBottomBorder,
                index = -1,
                blockHit = false;

            if (this.topBorder <= blocksFieldHeight) {
                if (this.leftBorder <= theCanvas.width / 3) { //first quadrant check
                    for (var b in blocks[0]) { //blocks[0] == first quadrant
                        currentBlock = blocks[0][b];
                        currentBlockRightBorder = currentBlock.x + currentBlock.width;
                        currentBlockBottomBorder = currentBlock.y + currentBlock.height;
                        
                        blockHit = this.changeDirections(currentBlock, currentBlockBottomBorder, currentBlockRightBorder);
                        
                        if (blockHit) {
                            currentBlock.hardness -= 1;
                            index = b;
                            blockHit = false;
                        }
                        //else if (this.leftBorder > currentBlock.x && this.leftBorder < currentBlockRightBorder &&
                        //           this.topBorder > currentBlock.y && this.topBorder < currentBlockBottomBorder &&
                        //           this.cX >= currentBlockRightBorder && this.cY >= currentBlockBottomBorder) { //bottom-right corner hit
                        //    this.moveSpeedX = -this.moveSpeedX;
                        //    this.moveSpeedY = -this.moveSpeedY;
                        //    console.log('vleze dolu dqsno');
                        //} else if (this.rightBorder > currentBlock.x && this.rightBorder < currentBlockRightBorder &&
                        //           this.topBorder > currentBlock.y && this.topBorder < currentBlockBottomBorder &&
                        //           this.cX <= currentBlock.x && this.cY >= currentBlockBottomBorder) { //bottom-left corner hit
                        //    this.moveSpeedX = -this.moveSpeedX;
                        //    this.moveSpeedY = -this.moveSpeedY;
                        //    console.log('vleze dolu levo');

                        //} else if (this.leftBorder > currentBlock.x && this.leftBorder < currentBlockRightBorder &&
                        //           this.bottomBorder > currentBlock.y && this.bottomBorder < currentBlockBottomBorder &&
                        //           this.cX >= currentBlockRightBorder && this.cY <= currentBlock.y) { //top-right corner hit
                        //    this.moveSpeedX = -this.moveSpeedX;
                        //    this.moveSpeedY = -this.moveSpeedY;
                        //    console.log('vleze gore dqsno');

                        //} else if (this.rightBorder > currentBlock.x && this.rightBorder < currentBlockRightBorder &&
                        //           this.bottomBorder > currentBlock.y && this.bottomBorder < currentBlockBottomBorder &&
                        //           this.cX <= currentBlock.x && this.cY <= currentBlock.y) { //top-left corner hit
                        //    this.moveSpeedX = -this.moveSpeedX;
                        //    this.moveSpeedY = -this.moveSpeedY;
                        //    console.log('vleze gore levo');

                        //}

                    }

                    if (index >= 0) {
                        if (blocks[0][index].hardness <= 0) {
                            blocks[0][index].destroy(blocks[0], index);
                        }
                    }
                }
                if (this.rightBorder > theCanvas.width / 3 && this.leftBorder <= theCanvas.width - (theCanvas.width / 3)) {
                    for (var b in blocks[1]) { //blocks[1] == second quadrant
                        currentBlock = blocks[1][b];
                        currentBlockRightBorder = currentBlock.x + currentBlock.width;
                        currentBlockBottomBorder = currentBlock.y + currentBlock.height;

                        blockHit = this.changeDirections(currentBlock, currentBlockBottomBorder, currentBlockRightBorder);

                        if (blockHit) {
                            currentBlock.hardness -= 1;
                            index = b;
                            blockHit = false;
                        }
                    }

                    if (index >= 0) {
                        if (blocks[1][index].hardness <= 0) {
                            blocks[1][index].destroy(blocks[1], index);
                        }
                    }
                }
                if (this.rightBorder > theCanvas.width - (theCanvas.width / 3)) {
                    for (var b in blocks[2]) { //blocks[2] == third quadrant
                        currentBlock = blocks[2][b];
                        currentBlockRightBorder = currentBlock.x + currentBlock.width;
                        currentBlockBottomBorder = currentBlock.y + currentBlock.height;

                        blockHit = this.changeDirections(currentBlock, currentBlockBottomBorder, currentBlockRightBorder);

                        if (blockHit) {
                            currentBlock.hardness -= 1;
                            index = b;
                            blockHit = false;
                        }
                    }

                    //if we have a block hit - destroy it
                    if (index >= 0) {
                        if (blocks[2][index].hardness <= 0) {
                            blocks[2][index].destroy(blocks[2], index);
                        }
                    }
                }
            }
        };

        this.changeDirections = function (currentBlock, currentBlockBottomBorder, currentBlockRightBorder) {
            if (this.topBorder <= currentBlockBottomBorder &&
                            this.topBorder >= currentBlock.y &&
                            this.cX >= currentBlock.x &&
                            this.cX <= currentBlockRightBorder) { //hit from bellow
                this.moveSpeedY = -this.moveSpeedY;
                return true;
            } else if (this.bottomBorder >= currentBlock.y &&
                       this.bottomBorder <= currentBlockBottomBorder &&
                       this.cX >= currentBlock.x &&
                       this.cX <= currentBlockRightBorder) { //hit from top
                this.moveSpeedY = -this.moveSpeedY;
                return true;
            } else if (this.rightBorder >= currentBlock.x &&
                       this.rightBorder <= currentBlockRightBorder &&
                       this.cY >= currentBlock.y &&
                       this.cY <= currentBlockBottomBorder) { //hit from left
                this.moveSpeedX = -this.moveSpeedX;
                return true;
            } else if (this.leftBorder <= currentBlockRightBorder &&
                       this.leftBorder >= currentBlock.x &&
                       this.cY >= currentBlock.y &&
                       this.cY <= currentBlockBottomBorder) { //hit from right
                this.moveSpeedX = -this.moveSpeedX;
                return true;
            }
        };
    }

    document.body.addEventListener('keydown', function(e) {
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
            case 32: //Spacebar
                if (player.sticky) {
                    player.sticky = false;

                    for (var b in balls) {
                        if (balls[b].moveSpeedX === 0 && balls[b].moveSpeedY === 0) {
                            balls[b].moveSpeedY = balls[b].mainSpeed;
                        }
                    }
                }
                break;
        }
    });

    document.body.addEventListener('keyup', function(e) {
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

    function startGame() {
        canvasCtx.clearRect(0, 0, theCanvas.width, theCanvas.height);

        player.draw(canvasCtx);
        player.move();

        for (var i in balls) {
            balls[i].draw(canvasCtx);
            balls[i].move();
        }

        for (var i in blocks) {
            //blocks[i].draw(canvasCtx);
            for (var b in blocks[i]) {
                blocks[i][b].draw(canvasCtx);
            }
        }

        requestAnimationFrame(startGame);
    }
};

function Envelope(x, y, lives, theCanvas) {
    this.x = x;
    this.y = y;
    this.width = theCanvas.width / 8;
    this.height = theCanvas.height/ 36;
    this.moveSpeed = 0;
    this.currentSpeed = ((theCanvas.width + theCanvas.height) / 120); //some workaround for smooth animation with some initial value
    this.lives = lives;
    this.sticky = true;
    this.image; //when we include graphix

    this.draw = function(canvasCtx) {
        canvasCtx.beginPath();
        canvasCtx.moveTo(this.x, this.y);
        canvasCtx.fillStyle = "#FF0000";
        canvasCtx.rect(this.x, this.y, this.width, this.height);
        canvasCtx.fill();
        canvasCtx.lineWidth = 2;
        canvasCtx.stroke();
    };

    this.move = function() {
        //envelope border collision check
        if (this.x <= 0) {
            this.x = 0;
        } else if (this.x + this.width >= theCanvas.width) {
            this.x = theCanvas.width - this.width;
        }
        this.x += this.moveSpeed;
    };
}


function Block(type, x, y, hardness, theCanvas) {
    this.x = x;
    this.y = y;
    this.width = theCanvas.width / 18;
    this.height = theCanvas.height / 30;
    this.hardness = hardness;

    this.init = function() {
        switch (type) {
            case "n":  //Normal block
                this.health = 1; // Hits Required for kill
                this.fillColor = "#E0E"; //Color
                this.hittable = true; // 
                this.powerUP = 0.01;
                break;
            case "p": // PowerUP dropper
                this.health = 1;
                this.hittable = true;
                this.fillColor = "#00ff99";
                this.powerUP = 1;
                break;
            case "d":  // Double hit block
                this.health = 2;
                this.hittable = true;
                this.fillColor = "#FADE00";
                this.powerUP = 0.02;
                break;
            case "t":// Triple hit block
                this.health = 3;
                this.hittable = true;
                this.powerUP = 0.05;
                this.fillColor = "#DA9900";
                break;
        }
    };

    this.draw = function(canvasCtx) {
        canvasCtx.beginPath();
        canvasCtx.fillStyle = this.fillColor;
        canvasCtx.rect(this.x, this.y, this.width, this.height);
        canvasCtx.fill();
        //canvasCtx.lineWidth = 2;
        canvasCtx.stroke();
    };

    this.destroy = function (collection, index) {
        collection.splice(index, 1);
    }

    this.init();
}