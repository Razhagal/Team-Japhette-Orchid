var reader = new XMLHttpRequest();
var field;

function loadFile() {
    reader.open('get', 'Resources/game-engine/Level-1.txt', true);
    reader.send(null);
}

loadFile();

function generateBlocks() {
    var canvas = document.getElementById('field'),
        ctx = canvas.getContext('2d'),
        blox = [],
        firstQuad = [],
        secondQuad = [],
        tmpBlock;

    if (field === '') {
        field = '\n nnn nnn nnn nnn\n  t  t   t    t \n  d  ddd ddd  d \n  t  t     t  t \n  n  nnn nnn  n ';
    }

    var width = 0,
        height = 0;

    for (var letter in field) {

        if (field[letter] === 'n') {
            tmpBlock = new Block('n', width, height, canvas);
            width += canvas.width / 18;
        } else if (field[letter] === 'b') {  //Bonus points
            tmpBlock = new Block('b', width, height, canvas);
            width += canvas.width / 18;
        } else if (field[letter] === 'p') { //Extra life block
            tmpBlock = new Block('p', width, height, canvas);
            width += canvas.width / 18;
        } else if (field[letter] === 'd') {  //Double
            tmpBlock = new Block('d', width, height, canvas);
            width += canvas.width / 18;
        } else if (field[letter] === 't') {  //Triple
            tmpBlock = new Block('t', width, height, canvas);
            width += canvas.width / 18;
        } else if (field[letter] === 'l') { //Extra life block
            tmpBlock = new Block('l', width, height, canvas);
            width += canvas.width / 18;
        } else if (field[letter] === '\u0020') {
            //Current char is a blank space
            width += canvas.width / 18;
            continue;
        } else if (field[letter] === '\u000A') {
            //Current char is a new line
            width = 0;
            height += canvas.height / 30;
            continue;
        } else {
            continue;
        }

        if (width <= canvas.width / 2) {
            firstQuad.push(tmpBlock);
        } else if (width > canvas.width / 2) {
            secondQuad.push(tmpBlock);
        }
    }

    blox.push(firstQuad);
    blox.push(secondQuad);
    blox.push(height + canvas.height / 30); //smuggle the blocks bottom border coordinates value out to main.js

    return blox;
}
