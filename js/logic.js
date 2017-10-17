/**
 * Created by Zmote on 16.10.2017.
 */
$(document).ready(function(){
    let playerSymbol = "X";
    let aiSymbol = "O";
    let firstRow = "firstRow";
    let secondRow = "secondRow";
    let thirdRow = "thirdRow";
    let fields = $("#container").find("> div > div");
    let startTime = Date.now();

    function executeGameOver() {
        location.reload();
    }

    function setupGame(){
        $("#xButton").remove();
        $("#oButton").remove();
        $("#container").removeClass("gameNotStarted");
        fields.on("click",gameHandler);
        let gameTextNode =  $("#gameText");
        gameTextNode.text("It's on! Beat the AI!");
        gameTextNode.parent().append("<h3 id='player'>You:</h3>");
        gameTextNode.parent().append("<h1>" + playerSymbol + "</h1>");
        gameTextNode.parent().append("<h3 id='ai'>AI:</h3>");
        gameTextNode.parent().append("<h1>" + aiSymbol + "</h1>");
        gameTextNode.parent().append("<h4>Elapsed Time:</h4>");
        gameTextNode.parent().append("<h1 id='timer'>0 s</h1>");
        startTime = Date.now();
        setInterval(function(){
            $("#timer").text(Math.floor((Date.now() - startTime)/1000) + " s");
        },1000);
        $("#player").css("color","red");
        $("#ai").css("color","black");
    }

    $("#xButton").on("click",function(){
        playerSymbol = "X";
        aiSymbol = "O";
        setupGame()
    });

    $("#oButton").on("click",function(){
        playerSymbol = "O";
        aiSymbol = "X";
        setupGame();
    });

    function gameHandler(){
        if(!$(this).text()){
            $(this).text(playerSymbol);
            if(checkWinConditionFor(playerSymbol)){
                setTimeout(function(){
                    alert("You won");
                    executeGameOver();
                },100);
            }else{
                fields.off("click");
                $("#player").css("color","black");
                $("#ai").css("color","red");
                setTimeout(function(){
                    executeAiTurn();
                    if(checkWinConditionFor(aiSymbol)){
                        setTimeout(function(){
                            alert("AI won");
                            executeGameOver();
                        },100);
                    }else{
                        fields.on("click", gameHandler);
                        $("#player").css("color","red");
                        $("#ai").css("color","black");
                    }
                },1000);
            }
        }
    }

    function executeAiTurn (){
        let fields = $("#container").find("> div > div");
        let emptyFields = fields.filter(function(){
            return !$(this).text();
        });
        if(emptyFields.length === 0){
            setTimeout(function(){
                alert("It's a DRAW");
                executeGameOver();
            },10);
        }else{
            let fieldNumber = Math.floor(Math.random() * emptyFields.length);
            emptyFields.eq(fieldNumber).text(aiSymbol);
        }
    }

    function checkMatch(entries, symbol){
        let allSymbolsInEntries = true;
        $.each(entries,function () {
            if (allSymbolsInEntries) {
                allSymbolsInEntries = $(this).text() === symbol;
            }
        });
        return allSymbolsInEntries;
    }

    function checkAllColForMatch(symbol){
        return checkColMatch(0, symbol) || checkColMatch(1,symbol) || checkColMatch(2, symbol);
    }

    function checkColMatch(pos, symbol) {
        let selectionQuery = "#" + firstRow + ",#" + secondRow + ",#" + thirdRow;
        let rows = $(selectionQuery);
        return checkMatch(rows.find("div:eq(" + pos +")"),symbol);
    }

    function checkAllRowsForMatch(symbol){
        return checkRowMatch(firstRow, symbol) || checkRowMatch(secondRow, symbol)
            || checkRowMatch(thirdRow, symbol);
    }

    function checkRowMatch(selector, symbol) {
        let row = $("#" + selector).find("div");
        return checkMatch(row,symbol);
    }

    function checkAllDiagonalsForMatch(symbol){
        return checkDiagonalForMatch("left", symbol) || checkDiagonalForMatch("right",symbol);
    }

    function checkDiagonalForMatch(direction, symbol){
        let firstEyeTerm = "div:eq(" + (direction === "left" ? 0:2) + ")";
        let secondEyeTerm = "div:eq(" + (direction === "left" ? 2:0) + ")";
        let firstValue = $("#firstRow").find(firstEyeTerm);
        let secondValue = $("#secondRow").find("div:eq(1)");
        let thirdValue = $("#thirdRow").find(secondEyeTerm);
        return checkMatch([firstValue,secondValue,thirdValue], symbol);
    }

    function checkWinConditionFor(symbol){
       return checkAllRowsForMatch(symbol) || checkAllColForMatch(symbol) || checkAllDiagonalsForMatch(symbol);
    }
});