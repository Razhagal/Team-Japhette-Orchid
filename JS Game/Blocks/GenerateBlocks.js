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

            var width = 0;
            var height = 0;
            for(letter in field) {
                if (field[letter] == '-') {
                    //Current char is a dash
                    ctx.fillStyle = "#252525";
                    ctx.fillRect(width, height, 50, 20);
                    width += 51;
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
    $(document).ready(function () {
       loadFile();
    });