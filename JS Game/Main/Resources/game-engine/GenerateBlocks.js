 
var reader = new XMLHttpRequest();

function loadFile() {
    reader.open('get', 'Resources/game-engine/test.txt', true);
    reader.send(null);
}

function generateBlocks() {
    var c = document.getElementById("field");
    var ctx = c.getContext("2d");
    var blox = [];
        var field = reader.responseText;
        if (field == ""){
            field = "\n nnn nnn nnn nnn\n  t  t   t    t \n  d  ddd ddd  d \n  t  t     t  t \n  n  nnn nnn  n ";
        }
        var width = 0;
        var height = 0;
        for(letter in field) {
            if (field[letter] == "n") {
                blox.push(new Block("n", width, height,c));
                width+= c.width/18;
            }
            else if (field[letter] == "p"){ //PowerUp
                blox.push(new Block("p", width, height,c));
                width+= c.width/18;
            }
            else if (field[letter] == "d"){ //Double
                blox.push(new Block("d", width, height,c));
                width+= c.width/18;
            }
            else if (field[letter] == "t"){ //Triple
                blox.push(new Block("t", width, height,c));

                width+= c.width/18;
            }
            else if (field[letter] == '\u0020') {
                //Current char is a blank space
                width+= c.width/18;
            }
            else if (field[letter] == '\u000A') {
                //Current char is a new line
                width = 0;
                height += c.height/24;
            }
        //\u0020
        //\u000A
    }
    return blox;
}
