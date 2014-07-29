﻿function signum(arg) {
    if (arg > 0) {
        return 1;
    } else if (arg < 0) {
        return -1;
    } else {
        return 0;
    }
}

function randomSign(argument) {
    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    return plusOrMinus;
}

var balls = [],
    blocks = [],
    powerups = [],
    guard = null,
    player,
<<<<<<< HEAD
    ballSpeed,
    blockHeight,
    blockWidth,
    powerupHeight,
    powerupWidth,
    playerHeight,
    playerWidth,
    playerMoveSpeed,
    blocksFieldHeight;
=======
    blocksFieldHeight,
    button;
>>>>>>> 9dd6b024010c47dc3636fdb813b29b3da62fbd28

var powerupKinds = ["Longer", "Shorter", "Double", "Triple", "Octal", "SpeedUP", "SpeedDOWN", "Guard"];
window.onload = function() {
    var theCanvas = document.getElementById('field'),
        canvasCtx = theCanvas.getContext('2d'),
        started = false;
    theCanvas.height = window.innerHeight - 20;
    theCanvas.width = (theCanvas.height);
    ballSpeed = ((theCanvas.height + theCanvas.width) / (120 * 3));
    blockHeight = theCanvas.height / 30;
    blockWidth = theCanvas.width / 18;
    powerupHeight = theCanvas.height / 12;
    powerupWidth = theCanvas.width / 30;
    playerHeight = theCanvas.height /36;
    playerWidth = theCanvas.width / 8;
    playerMoveSpeed = theCanvas.width / (60*1.2); //divided by the seconds it takes to cross the screen
    canvasCtx.fillStyle = 'red';
    canvasCtx.strokeStyle = 'black';


    reader.onreadystatechange = function () {
        if (reader.responseText.length > 0) {
            if (!started) {
                field = reader.responseText;
                //console.log(reader.responseText);

                //initialize player envelope and ball
                blocks = generateBlocks();

                //extract blocks bottom border coordinates
                blocksFieldHeight = Math.ceil(blocks[blocks.length - 1]);
                blocks.splice(blocks.length - 1, 1);

                player = new Envelope(theCanvas.width / 2, theCanvas.height - 100, 3, theCanvas, canvasCtx);
                balls.push(new Ball(player.x + (player.width / 2) - 7, (player.y - 7), 7, theCanvas, ballSpeed)); //((theCanvas.height + theCanvas.width) / (120 * 6))

                addListeners();

                startScreen();
                //Start Screen test ->>>
                 startScreen();
                function startScreen() {
                    var c = document.getElementById("field");
                    var ctx = c.getContext("2d");
                    ctx.font = "50px Arial";
                    ctx.strokeText("Alphabounce",155,50);
                    
                    ctx.stroke();
                    startScreenbut();
                    function startScreenbut() {
                    var startButton = document.createElement("button"); 
                    startButton.style.width = "300px";
                    startButton.style.height = "50px";
                    startButton.innerHTML = "Start Game!";
                    startButton.style.position = "absolute";
                    startButton.style.top = "100px";
                    startButton.style.left = "525px";
                    startButton.innerText = "START";
                    startButton.onclick = function() {
                        startGame();
                        document.body.removeChild(startButton);
                    };
                    document.body.appendChild(startButton).innerText;
                
                    }
                }

                started = true;
                console.log(blocks[0].length);
                console.log(blocks[1].length);
                console.log(blocks[2].length);
            }
        }
    };
    function addListeners() {
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
    }

    function startGame() {
        canvasCtx.clearRect(0, 0, theCanvas.width, theCanvas.height);
        player.draw(canvasCtx);
        player.move();

        /*Intentional, do not edit*/
        for (var i = 0; i < balls.length; i++) {
            balls[i].draw(canvasCtx);
            balls[i].move(i);
        }

        for (var i in blocks) {
            for (var b in blocks[i]) {
                blocks[i][b].draw(canvasCtx);
            }
        }

        for (var i in powerups) {
            if (powerups[i].active) {
                powerups[i].draw(canvasCtx);
                powerups[i].move();
                powerups[i].checkPlayerCollision(player);
            }
        }
        
        if (guard !== null) {
            guard.draw(canvasCtx);
        }
        // if (Math.random() > 0.995) {
        //     powerups.push(new PowerUp(Math.floor(Math.random() * theCanvas.width), 50, powerupKinds[Math.floor(Math.random() * powerupKinds.length)], theCanvas));
        // }
        // console.log(balls.length);
        /*Debug Powerups*/

        requestAnimationFrame(startGame);
    }
};

function Envelope(x, y, lives, theCanvas, context) {
    this.x = x;
    this.y = y;
    this.width = playerWidth;
    this.height = playerHeight;
    this.moveSpeed = 0;
    //this.currentSpeed = ((theCanvas.width + theCanvas.height) / (120 * 2)); //some workaround for smooth animation with some initial value
    this.currentSpeed = playerMoveSpeed; //some workaround for smooth animation with some initial value
    this.lives = lives;

    this.sticky = true;
    this.elongated = 0; //???
    
    var image = new Image();
    image.src = 'Resources/images/envelope.png';

    this.draw = function(canvasCtx) {
        canvasCtx.drawImage(image, this.x, this.y, this.width, this.height);
        canvasCtx.lineWidth = 2; //Temp
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
    this.width = blockWidth;
    this.height = blockHeight;
    this.hardness = hardness;

    this.init = function() {
        switch (type) {
            case "n": //Normal block
                this.health = 1; // Hits Required for kill
                this.fillColor = "#E0E"; //Color
                this.hittable = true;
                this.powerUP = 0.15;
                break;
            case "p": // PowerUP dropper
                this.health = 1;
                this.hittable = true;
                this.fillColor = "#00ff99";
                this.powerUP = 1;
                break;
            case "d": // Double hit block
                this.health = 2;
                this.hittable = true;
                this.fillColor = "#FADE00";
                this.powerUP = 0.02;
                break;
            case "t": // Triple hit block
                this.health = 3;
                this.hittable = true;
                this.powerUP = 0.05;
                this.fillColor = "#DA9900";
                break;
            case "g":
                this.health = 900000;
                this.hittable = true;
                this.powerUP = 0;
                this.fillColor = "red";
                break;
            case "u":
                this.health = 50;
                this.hittable = true;
                this.powerUP = 0.3;
                this.fillColor = "#794000";
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
        if (this.powerUP > Math.random()) {
            powerups.push(new PowerUp(this.x + this.width / 2, this.y - this.height / 2, powerupKinds[Math.floor(Math.random() * powerupKinds.length)], theCanvas));
            console.log(powerups);
        }
    };

    this.init();
}

function PowerUp(x, y, kind, theCanvas) {
    this.x = x;
    this.y = y;
    this.height = powerupHeight;
    this.width = powerupWidth;

    this.active = true;

    this.init = function() {
        switch (kind) {
            case "Longer":
                this.activate = function() {
                    if (player.elongated < 2) {
                        player.width = player.width * 1.5;
                        player.elongated += 1;
                    }
                };
                this.fillColor = "#50F";
                break;

            case "Shorter":
                this.activate = function() {
                    if (player.elongated > -2) {
                        player.width = player.width / 1.5;
                        player.elongated -= 1;
                    }
                };
                this.fillColor = "#F05";
                break;

            case "Double":
                this.activate = function() {
                    for (var ball in balls) {
                        balls[ball].multiply(2);
                    }
                };
                this.fillColor = "#9A5";
                break;

            case "Triple":
                this.activate = function() {
                    balls[0].multiply(3);
                };
                this.fillColor = "#FA5";
                break;

            case "Octal":
                this.activate = function() {
                    balls[0].multiply(8);
                };
                this.fillColor = "#dad";
                break;

            case "SpeedUP":
                this.activate = function() {
                    for (var ball in balls) {
                        balls[ball].moveSpeedX = balls[ball].moveSpeedX * 1.5;
                        balls[ball].moveSpeedY = balls[ball].moveSpeedY * 1.5;
                        balls[ball].mainSpeed = balls[ball].mainSpeed * 1.5;
                    }
                };
                this.fillColor = "#10AF70";
                break;

            case "SpeedDOWN":
                this.activate = function() {
                    for (var ball in balls) {
                        balls[ball].moveSpeedX = balls[ball].moveSpeedX / 1.5;
                        balls[ball].moveSpeedY = balls[ball].moveSpeedY / 1.5;
                        balls[ball].mainSpeed = balls[ball].mainSpeed / 1.5;
                    }
                };
                this.fillColor = "#100F70";
                break;
                // case "Fire":
                //     {
                //         this.activate = function() {
                //             for (var ball in balls) {
                //                 balls[ball].fire = true;
                //             }
                //         };
                //         this.fillColor = "#FF00DA";
                //         break;
                //     }
            case "Guard":
                this.activate = function() {
                    guard = new Block("g", 0, theCanvas.height - 45, 90 , theCanvas);
                    guard.width = theCanvas.width;
                    guard.height = 30;

                    setTimeout(function() {
                        guard = null;
                    }, 15000);
                };
                this.fillColor = "#0FCDFF";
                break;

            default:
                this.activate = function() {
                    console.log("I'm a broken powerup!");
                };
                this.fillColor = 'black';
                break;
        }
    };

    this.move = function() {
        if (this.active) {
            this.y += 3;
        }
    };

    this.checkPlayerCollision = function(player) {
        if (this.x >= player.x && this.x <= (player.x + player.width) &&
            this.y + this.height <= player.y + player.height && this.y + this.height > player.y) {
            this.activate();
            this.destroy();
        }
    };

    this.destroy = function() {
        this.active = false;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.activate = null;
    };

    this.draw = function(canvasCtx) {
        canvasCtx.beginPath();
        canvasCtx.fillStyle = this.fillColor;
        canvasCtx.rect(this.x, this.y, this.width, this.height);
        canvasCtx.fill();
    };

    this.init();
}

function Ball(cX, cY, rad, theCanvas, mainSpeed) {
    this.cX = cX;
    this.cY = cY;
    this.rad = rad;
    this.mainSpeed = mainSpeed;

    var image = new Image();
    image.src = 'Resources/images/ball.png';

    if (!player.sticky) {
        this.moveSpeedX = (Math.floor(Math.random() * this.mainSpeed*2)) * randomSign();
        this.moveSpeedY = (this.mainSpeed*2 - Math.abs(this.moveSpeedX)) * randomSign();
    } else{
        this.moveSpeedX = 0;
        this.moveSpeedY = 0;
    }

    this.multiply = function(times) {
        for (var i = 0; i < times; i++) {
            balls.push(new Ball(this.cX, this.cY, this.rad, theCanvas, this.mainSpeed));
        }
    };

    this.draw = function(canvasCtx) {
        canvasCtx.drawImage(image, this.cX, this.cY);
    };

    this.move = function(i) {
        this.cX += this.moveSpeedX;
        this.cY += this.moveSpeedY;
        this.checkCollision(i);
    };

    this.checkCollision = function(i) {
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

        /*Bug : Somethimes the ball can go fast enough as to exit the boundaries of the level, leaving it glitched*/
        if(guard !== null){
            if (this.bottomBorder >= guard.y+guard.height) {
                this.moveSpeedY = this.moveSpeedY*-1;
            }
        }

        if (this.topBorder <= 0) {
            this.moveSpeedY = -this.moveSpeedY; // sets variable to move down 
        } else if (this.cX >= player.x && this.cX <= (player.x + player.width) && this.bottomBorder >= player.y && this.bottomBorder <= player.y + player.height) {
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
                balls.splice(i, 1);
            } else {
                player.lives -= 1;
                player.sticky = true;
                balls[0] = new Ball(player.x + (player.width / 2) - this.rad, (player.y - 7), 7, theCanvas, ballSpeed); // Replaces ball that spawns at player location when it's destroyed.
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
                        currentBlock.health -= 1;
                        index = b;
                        blockHit = false;
                    }
                }
                if (index >= 0) {
                    if (blocks[0][index].health <= 0) {
                        blocks[0][index].destroy(blocks[0], index);
                    }
                }
            } else if (this.rightBorder > theCanvas.width / 3 && this.leftBorder <= theCanvas.width - (theCanvas.width / 3)) {
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

            } else if (this.rightBorder > theCanvas.width - (theCanvas.width / 3)) {
                for (var b in blocks[2]) { //blocks[2] == third quadrant
                    currentBlock = blocks[2][b];
                    currentBlockRightBorder = currentBlock.x + currentBlock.width;
                    currentBlockBottomBorder = currentBlock.y + currentBlock.height;

                    blockHit = this.changeDirections(currentBlock, currentBlockBottomBorder, currentBlockRightBorder);

                    if (blockHit) {
                        currentBlock.health -= 1;
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
        if (this.topBorder <= currentBlockBottomBorder && this.topBorder >= currentBlock.y &&
            this.cX >= currentBlock.x && this.cX <= currentBlockRightBorder) { //hit from bellow

            this.moveSpeedY = -this.moveSpeedY;
            return true;

        } else if (this.bottomBorder >= currentBlock.y && this.bottomBorder <= currentBlockBottomBorder &&
                   this.cX >= currentBlock.x && this.cX <= currentBlockRightBorder) { //hit from top

            this.moveSpeedY = -this.moveSpeedY;
            return true;

        } else if (this.rightBorder >= currentBlock.x && this.rightBorder <= currentBlockRightBorder &&
                   this.cY >= currentBlock.y && this.cY <= currentBlockBottomBorder) { //hit from left

            this.moveSpeedX = -this.moveSpeedX;
            return true;

        } else if (this.leftBorder <= currentBlockRightBorder && this.leftBorder >= currentBlock.x &&
                   this.cY >= currentBlock.y && this.cY <= currentBlockBottomBorder) { //hit from right

            this.moveSpeedX = -this.moveSpeedX;
            return true;
        }
    };
}