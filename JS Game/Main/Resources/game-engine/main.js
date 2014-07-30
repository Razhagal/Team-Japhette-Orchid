function signum(arg) {
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
    playerMovespeed,
    playerWidth,
    playerHeight,
    blockWidth,
    blockHeight,
    ballSpeed,
    levelNumber,
    powerupHeight,
    powerupWidth,
    lastHit,
    blocksFieldHeight,
    score = Math.round(0, 2);


var powerupKinds = ["Longer", "Shorter", "Double", "Triple", "Octal", "SpeedUP", "SpeedDOWN", "Guard"];

window.onload = function() {
    var theCanvas = document.getElementById('field'),
        canvasCtx = theCanvas.getContext('2d');

    theCanvas.height = window.innerHeight - 20;
    theCanvas.width = (theCanvas.height);

    canvasCtx.fillStyle = 'red';
    canvasCtx.strokeStyle = 'black';
    blockHeight = theCanvas.height / 30;
    blockWidth = theCanvas.width / 18;
    ballSpeed = (theCanvas.width + theCanvas.height)/(120*2); // multiplied by the seconds it takes the ball to travel across the screen
    playerHeight = theCanvas.height/36;
    playerWidth = theCanvas.width/7;
    playerMovespeed = theCanvas.width/60*1;
    powerupHeight = theCanvas.height/40;
    powerupWidth = theCanvas.width/20;
    levelNumber = 0;
    initializeGame();

    reader.onreadystatechange = function(){
        if (reader.readyState == 4) {

            blocksFieldHeight = Math.ceil(blocks[blocks.length - 1]);
            startGame();
        }
    };
    function initializeGame () {
            blocks.splice(blocks.length - 1, 1);

            player = new Envelope(theCanvas.width / 2, theCanvas.height - 100, 3, theCanvas, canvasCtx);
            balls.push(new Ball(player.x + (player.width / 2) - 7, (player.y - 7), 7, theCanvas, ballSpeed)); //((theCanvas.height + theCanvas.width) / (120 * 6))

            addListeners();
            startScreen();
        }
    function scoreView() {
            canvasCtx.font = 'bold 32px "Palatino Linotype", "Book Antiqua", Palatino, serif';
            canvasCtx.textAlign = 'left';  
            canvasCtx.fillStyle = 'white';
            canvasCtx.fillText("Score: " + "" + Math.round(score), 20, 570); 
    }

    function startScreen() {
        var startButton = document.createElement('button'),
        textToDraw = "ALPHABOUNCE v0.1";
        document.body.appendChild(startButton);

        startButton.className = 'button';
        startButton.innerHTML = 'START';

        startButton.style.top = (theCanvas.height/1.4 + 10).toString() + "px";

        canvasCtx.fillStyle = "#FFFFFF";
        canvasCtx.font = "3em fnt, 'fnt', Arial";
        canvasCtx.textAlign = "center"; 
        canvasCtx.fillText(textToDraw, theCanvas.width/2, theCanvas.height/8, theCanvas.width);

        document.body.style.background = 'url(Resources/images/game-background.jpg)';
        document.body.style.backgroundSize = 'cover';
        theCanvas.style.background = 'url(Resources/images/canvas-background2.png)';
		theCanvas.style.backgroundSize = 'cover';
		
        startButton.onclick = function () {
            document.body.removeChild(startButton);
            blocks = generateBlocks("test");
            console.log(reader.responseText);
            //blocks = generateBlocks("level" + levelNumber.toString());
        };
    }
    function gameOver() {
        var goTexts = ["Game Over", "You Lose!", ":(", "Try Again", "Next!"];
        var textToDraw = goTexts[Math.floor(Math.random()*goTexts.length)];
        var startButton = document.createElement('button');
        document.body.appendChild(startButton);   
        startButton.className = 'button';
        startButton.style.top = (theCanvas.height/1.4 + 10).toString() + "px";

        canvasCtx.fillStyle = "#FFFFFF";
        canvasCtx.font = "3em fnt, 'fnt', Arial";
        canvasCtx.textAlign = "center"; 
    
        startButton.innerHTML = "RETRY";
        canvasCtx.fillText(textToDraw, theCanvas.width/2, theCanvas.height/8, theCanvas.width);
        startButton.onclick = function () {
            document.body.removeChild(startButton);
            player.lives = 3;
            startGame();
        };

    }
    function levelWon (argument) {
        var lwTexts = ["You Won!", "Great", "Sucess!", "Good job!"];
        var textToDraw = lwTexts[Math.floor(Math.random()*lwTexts.length)];
        var startButton = document.createElement('button');
        document.body.appendChild(startButton);   
        startButton.className = 'button';
        startButton.style.top = (theCanvas.height/1.4 + 10).toString() + "px";

        canvasCtx.fillStyle = "#FFFFFF";
        canvasCtx.font = "3em fnt, 'fnt', Arial";
        canvasCtx.textAlign = "center"; 
    
        startButton.innerHTML = "Next!";
        canvasCtx.fillText(textToDraw, theCanvas.width/2, theCanvas.height/8, theCanvas.width);
        startButton.onclick = function () {
            document.body.removeChild(startButton);
            blocks = generateBlocks("level") + levelNumber.toString();
            player.lives = 3;
            startGame();
        };
    }
    function scoreView() {
            canvasCtx.font = 'bold 32px fnt , "Palatino Linotype", "Book Antiqua", Palatino, serif';
            canvasCtx.textAlign = 'left';  
            canvasCtx.fillStyle = 'white';
            canvasCtx.fillText("Score: " + "" + Math.round(score), 20, 570); 
    }
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
        if (player.lives >= 0) {
        player.draw(canvasCtx);
        player.move();
        scoreView();
        score -= 0.01;
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
        if (blocks[0].length === 0 && blocks[1].length === 0) {
            levelNumber += 1;
            levelWon();
        }
        else{
           requestAnimationFrame(startGame);
        }
    }
    else{
        gameOver();
    }
            
        
    }
};

function Envelope(x, y, lives, theCanvas, context) {
    this.x = x;
    this.y = y;
    this.width = playerWidth;
    this.height = playerHeight;
    this.moveSpeed = 0;
    //this.currentSpeed = ((theCanvas.width + theCanvas.height) / (120 * 2)); //some workaround for smooth animation with some initial value
    this.currentSpeed = playerMovespeed; //some workaround for smooth animation with some initial value
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
        canvasCtx.stroke();
    };

    this.destroy = function (collection, index) {
        collection.splice(index, 1);
        if (this.powerUP > Math.random()) {
            powerups.push(new PowerUp(this.x + this.width / 2, this.y - this.height / 2, powerupKinds[Math.floor(Math.random() * powerupKinds.length)], theCanvas));
            console.log(powerups);
            score += 500;
        }
        score += 100;
    };

    this.init();
}

function PowerUp(x, y, kind, theCanvas) {
    this.x = x;
    this.y = y;
    this.height = powerupHeight;
    this.width = powerupWidth;
    this.image = new Image();
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
                this.image.src = "Resources/images/Expand.png";
                break;

            case "Shorter":
                this.activate = function() {
                    if (player.elongated > -2) {
                        player.width = player.width / 1.5;
                        player.elongated -= 1;
                    }
                };
                this.fillColor = "#F05";
                this.image.src = "Resources/images/Retract.png";
                break;

            case "Double":
                this.activate = function() {
                    for (var ball in balls) {
                        balls[ball].multiply(1);
                    }
                };
                this.fillColor = "#9A5";
                this.image.src = "Resources/images/2xBalls.png";
                break;

            case "Triple":
                this.activate = function() {
                    balls[0].multiply(3);
                };
                this.fillColor = "#FA5";
                this.image.src = "Resources/images/3xBalls.png";
                break;

            case "Octal":
                this.activate = function() {
                    balls[0].multiply(8);
                };
                this.fillColor = "#dad";
                this.image.src = "Resources/images/8XBalls2.png";
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
                this.image.src = "Resources/images/SpeedUP.png";
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
                this.image.src = "Resources/images/SpeedDown.png";
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
                this.image.src = "Resources/images/Guard.png";
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
        canvasCtx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };

    this.init();
}

function Ball(cX, cY, rad, theCanvas, mainSpeed) {
    this.cX = cX;
    this.cY = cY;
    this.rad = rad;
    this.mainSpeed = ballSpeed;

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
            if (this.bottomBorder >= guard.y) {
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
                balls[0] = new Ball(player.x + (player.width / 2) - this.rad, (player.y - 7), 7, theCanvas, 5); // Replaces ball that spawns at player location when it's destroyed.
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
            blockHit = false,
            index;

        if (this.topBorder <= blocksFieldHeight + 10) {
            if (this.leftBorder <= theCanvas.width / 2) { //first quadrant check
                index = -1;

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
            }

            if (this.rightBorder >= theCanvas.width / 3) {
                index = -1;

                for (var b in blocks[1]) { //blocks[1] == second quadrant
                    currentBlock = blocks[1][b];
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
                    if (blocks[1][index] !== undefined) {
                        if (blocks[1][index].health <= 0) {
                            blocks[1][index].destroy(blocks[1], index);
                        }
                    }                    
                }

            }
        }
    };

    this.changeDirections = function (currentBlock, currentBlockBottomBorder, currentBlockRightBorder) {
        if (lastHit != currentBlock) {  
            if (Math.abs(this.moveSpeedY) > Math.abs(this.moveSpeedX)) {                    
                if (this.topBorder <= currentBlockBottomBorder && this.topBorder >= currentBlock.y &&
                    this.cX >= currentBlock.x && this.cX <= currentBlockRightBorder) { //hit from bellow

                    this.moveSpeedY = -this.moveSpeedY;
                    lastHit = currentBlock;
                    return true;

                } else if (this.bottomBorder >= currentBlock.y && this.bottomBorder <= currentBlockBottomBorder &&
                           this.cX >= currentBlock.x && this.cX <= currentBlockRightBorder) { //hit from top

                    this.moveSpeedY = -this.moveSpeedY;
                    lastHit = currentBlock;
                    return true;

                } else if (this.rightBorder >= currentBlock.x && this.rightBorder <= currentBlockRightBorder &&
                           this.cY >= currentBlock.y && this.cY <= currentBlockBottomBorder) { //hit from left

                    this.moveSpeedX = -this.moveSpeedX;
                    lastHit = currentBlock;
                    return true;

                } else if (this.leftBorder <= currentBlockRightBorder && this.leftBorder >= currentBlock.x &&
                           this.cY >= currentBlock.y && this.cY <= currentBlockBottomBorder) { //hit from right

                    this.moveSpeedX = -this.moveSpeedX;
                    lastHit = currentBlock;
                    return true;
                }
        }
        else if (Math.abs(this.moveSpeedX) > Math.abs(this.moveSpeedY)) {
            if (this.rightBorder >= currentBlock.x && this.rightBorder <= currentBlockRightBorder &&
                       this.cY >= currentBlock.y && this.cY <= currentBlockBottomBorder) { //hit from left

                this.moveSpeedX = -this.moveSpeedX;
                lastHit = currentBlock;
                return true;

            }
            else if (this.leftBorder <= currentBlockRightBorder && this.leftBorder >= currentBlock.x &&
                       this.cY >= currentBlock.y && this.cY <= currentBlockBottomBorder) { //hit from right

                this.moveSpeedX = -this.moveSpeedX;
                lastHit = currentBlock;
                return true;
            }
            else if (this.bottomBorder >= currentBlock.y && this.bottomBorder <= currentBlockBottomBorder &&
                       this.cX >= currentBlock.x && this.cX <= currentBlockRightBorder) { //hit from top

                this.moveSpeedY = -this.moveSpeedY;
                lastHit = currentBlock;
                return true;

            } else if (this.topBorder <= currentBlockBottomBorder && this.topBorder >= currentBlock.y &&
                this.cX >= currentBlock.x && this.cX <= currentBlockRightBorder) { //hit from bellow

                this.moveSpeedY = -this.moveSpeedY;
                lastHit = currentBlock;
                return true;

            } 
        }
}
    };
}