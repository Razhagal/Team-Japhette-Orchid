var c = document.getElementById("canvas");
var ctx = c.getContext("2d");


var reader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');

function loadFile() {
    reader.open('get', 'test.txt', true);
    reader.onreadystatechange = generateBlocks;
    reader.send(null);
}

function generateBlocks() {
    if(reader.readyState==4) {

        var field = reader.responseText;

        var width = 15;
        var height = 15;
        for(letter in field) {
            if (field[letter] == '-') {
                //Current char is a dash

                ctx.beginPath();
                ctx.arc(width, height, 10, 0, 2 * Math.PI, false);
                ctx.fillStyle = 'green';
                ctx.fill();
                ctx.lineWidth = 5;
                ctx.strokeStyle = '#003300';
                ctx.stroke();

                width += 30;
            }
            else if (field[letter] == '\u0020') {
                //Current char is a blank space
                width+= 30;
            }
            else if (field[letter] == '\u000A') {
                //Current char is a new line
                width = 15;
                height += 25;
            }
        }
        //\u0020
        //\u000A
    }
}
$(document).ready(function () {
    loadFile();
});