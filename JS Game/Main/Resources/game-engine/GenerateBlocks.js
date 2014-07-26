var reader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');

function loadFile() {
    reader.open('get', 'Resources/game-engine/test.txt', true);
    reader.send(null);
}

function generateBlocks() {
    var c = document.getElementById("field");
    var ctx = c.getContext("2d");

    if(reader.readyState==4) {

        var field = reader.responseText;

        var width = 0;
        var height = 0;
        for(letter in field) {
            if (field[letter] == "n") {
                blocks.push(new Block("n", width, height));
            }
            else if (field[letter] == "p"){ //PowerUp
                blocks.push(new Block("p", width, height));
            }
            else if (field[letter] == "d"){ //Double
                blocks.push(new Block("d", width, height));
            }
            else if (field[letter] == "t"){ //Triple
                blocks.push(new Block("t", width, height));
            }
            else if (field[letter] == '\u0020') {
                //Current char is a blank space
                width+= 51;
            }
            else if (field[letter] == '\u000A') {
                //Current char is a new line
                width = 0;
                height += 25;
            }
        }
        //\u0020
        //\u000A
    }
}
