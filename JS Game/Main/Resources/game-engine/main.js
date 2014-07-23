window.onload = function () {
    var theCanvas = document.getElementById('field');
    var canvasCtx = theCanvas.getContext('2d');

    canvasCtx.fillStyle = 'red';
    canvasCtx.strokeStyle = 'black';

    function Envelope(x, y, width, height, moveSpeed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.moveSpeed = moveSpeed;
        this.image; //when we include graphix


        this.draw = function (canvasCtx) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(this.x, this.y);
            canvasCtx.rect(this.x, this.y, this.width, this.height);
            canvasCtx.fill();
            canvasCtx.lineWidth = 2;
            canvasCtx.stroke();
        };

        this.moveLeft = function () {
            this.x -= moveSpeed;
        };

        this.moveRight = function () {
            this.x += moveSpeed;
        };


    }

    function Ball(cX, cY, rad, moveSpeed, direction) {
        this.cX = cX;
        this.cY = cY;
        this.rad = rad;
        this.moveSpeed = moveSpeed;
        this.moveDirection = direction;

        this.draw = function (canvasCtx) {
            canvasCtx.beginPath();
            canvasCtx.arc(this.cX, this.cY, this.rad, 0, 2 * Math.PI);
            canvasCtx.fill();
            canvasCtx.stroke();
        };

        this.move = function () {
            switch (this.moveDirection) {
                case 'down-left':
                    this.cX -= this.moveSpeed;
                    this.cY += this.moveSpeed;
                    break;
                case 'down-right':
                    this.cX += this.moveSpeed;
                    this.cY += this.moveSpeed;
                    break;
                case 'up-left':
                    this.cX -= this.moveSpeed;
                    this.cY -= this.moveSpeed;
                    break;
                case 'up-right':
                    this.cX += this.moveSpeed;
                    this.cY -= this.moveSpeed;
                    break;
            }

            this.checkCollision();
        };

        this.checkCollision = function () {
            if (this.cX + this.rad >= 800) {
                this.moveDirection = this.moveDirection.substring(0, this.moveDirection.indexOf('-') + 1) + 'left';
            } else if (this.cX - this.rad <= 0) {
                this.moveDirection = this.moveDirection.substring(0, this.moveDirection.indexOf('-') + 1) + 'right';
            }

            if (this.cY - this.rad <= 0) {
                this.moveDirection = 'down' + this.moveDirection.substring(this.moveDirection.indexOf('-'));
            } else {
                if (this.cY + this.rad > player.x &&
                    this.cY + this.rad < player.x + player.width &&
                    this.cY + this.rad === player.y) {
                    this.moveDirection = 'up' + this.moveDirection.substring(this.moveDirection.indexOf('-'));
                } else if (this.cY + this.rad >= 500){
                    ball = new Ball((player.x + player.width) / 2, player.y - 7, 7, 4, 'up-left');
                }
            }
        };
            
    }


    var player = new Envelope(300, 400, 150, 20, 0);
    var ball = new Ball((player.x + player.width) / 2, player.y - 7, 7, 4, 'up-left');

    document.body.addEventListener('keydown', function (e) {
        if (!e) {
            e = window.event;
        }

        switch (e.keyCode) {
            case 37:
                player.moveSpeed = -6;
                break;
            case 39:
                player.moveSpeed = 6;
                break;
        }
    });

    document.body.addEventListener('keyup', function (e) {
        if (!e) {
            e = window.event;
        }
        player.moveSpeed = 0;
    });

    function startGame() {
        canvasCtx.clearRect(0, 0, theCanvas.width, theCanvas.height);
        player.x += player.moveSpeed;
        player.draw(canvasCtx);
        ball.draw(canvasCtx);
        ball.move();
        requestAnimationFrame(startGame);
    }

    requestAnimationFrame(startGame);
};