var reader = new XMLHttpRequest();
var field;

function loadFile() {
    reader.open('get', 'Resources/game-engine/test.txt', true);
    reader.send(null);
}

loadFile();

function generateBlocks() {
    var canvas = document.getElementById('field'),
        ctx = canvas.getContext('2d'),
        blox = [],
        firstQuad = [],
        secondQuad = [],
        thirdQuad = [],
        tmpBlock;

    if (field === '') {
        field = '\n nnn nnn nnn nnn\n  t  t   t    t \n  d  ddd ddd  d \n  t  t     t  t \n  n  nnn nnn  n ';
    }

    var width = 0,
        height = 0;

    for (var letter in field) {
        //console.log(field[letter]);
        if (field[letter] === 'n') {
            tmpBlock = new Block('n', width, height, canvas);
            width += canvas.width / 18;
        } else if (field[letter] === 'p') {  //PowerUp
            tmpBlock = new Block('p', width, height, canvas);
            width += canvas.width / 18;
        } else if (field[letter] === 'd') {  //Double
            tmpBlock = new Block('d', width, height, canvas);
            width += canvas.width / 18;
        } else if (field[letter] === 't') {  //Triple
            tmpBlock = new Block('t', width, height, canvas);
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
        }

        if (width < canvas.width / 6) {
            firstQuad.push(tmpBlock);
        } else if (width >= canvas.width / 6 && width < canvas.width - (canvas.width / 6)) {
            secondQuad.push(tmpBlock);
        } else if (width >= canvas.width - (canvas.width / 6)) {
            thirdQuad.push(tmpBlock);
        }

    //\u0020
    //\u000A
    }

    blox.push(firstQuad);
    blox.push(secondQuad);
    blox.push(thirdQuad);
    blox.push(height); //smuggle the blocks bottom border coordinates value out to main.js

    return blox;
}
