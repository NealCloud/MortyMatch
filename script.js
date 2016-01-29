/**
 * Created by Mad Martigan on 1/28/2016.
 */
$(document).ready(function() {
    // initialize game creating the board game with a randomly generated cardset or

    //Data.mortyInit = Game.randomMorty();

    Game.createMorty(Data.mortyInit);
    //create a click event on all card backs
    Game.btnMaker();
});

//game variable storage
Data = {
    srcNumbers: [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9],
    first_card_clicked: null,
    second_card_clicked: null,
    mortyInit: null,
    score: 0,
    firstcardId: null,
    gameBoard: null,
    totalCards: 18,
    attempt: 0,
    accuracy: 0
}

//game logic "engine" functions
Game = {
    //assign clicks to buttons and card backs;
    btnMaker: function(){
        $(".back").click(function(){
            //console.log("clicked a" , this);
            if(!Data.second_card_clicked){
                Game.card_clicked(this);
            }
        })
        $(".reset").click(function(){
            //console.log("clicked", this);
            $("#game-area").html("");
            if(Data.gameBoard){
                $("#game-area").append(Data.gameBoard);
            }
            Game.createMorty(Data.mortyInit);
            Data.score = 0;
            Game.resetDataFlags();
            Game.btnMaker();
        })
    },
    // called when a card is clicked enacts core game logic
    // arguments used (element, boolean)  targ element card and if 2nd card clicked
    card_clicked: function(targ){
        //if first_card_clicked is false flip this card and store this element and toggle first_card_clicked to true
        if(!Data.first_card_clicked){
            $(targ).addClass("flip");
            Data.firstcardid = targ;
            Data.first_card_clicked = true;
        }
        //if first_card_clicked compareCards
        else{
            Game.compareCards(targ);
        }
    },
   // disable playing(mouse clicks) on second card true and flip target card and compareCards with previous card
    compareCards: function(targ){
        Data.second_card_clicked = true;
        $(targ).addClass("flip");
        //if card src images are not equal use Timeout to delay flip back and reset data variables
        if($(targ).siblings( ".front").find("img").attr("src") != $(Data.firstcardid).siblings( ".front").find("img").attr("src")){
            setTimeout(function(){
                $(targ).removeClass("flip");
                $(Data.firstcardid).removeClass("flip");
                Game.resetDataFlags();
            }, 2000);
        }
        //cards are equal go to matchedCards function
        else{
           Game.matchedCards(targ);
        }
    },
    matchedCards: function(targ){
        //check if game is won and clear game board and display win text
        if(Data.score == Data.totalCards / 2 - 1 ){
            Game.animate(targ);
            $("#game-area").html("");
            $("#game-area").append($("<h1>").html("You win").addClass('win'));

        }
        //matchedCards found but not won, increase score, fade out cards and reset data flag variables
        else{
            console.log(Data.score, Data.totalCards)
            $(targ).removeClass("clickme");
            $(Data.firstcardid).removeClass("clickme");
            Data.score++;
            Game.animate(targ);
            Game.resetDataFlags();
        }
    },
    //animate an elements sibling
    animate: function(element){
        $(element).siblings(".front").animate({width: "0%"}, 500).fadeOut(500);
        $(Data.firstcardid).siblings(".front").animate({width: "0%"}, 500).fadeOut(500);
    },
    // reset the card click and id values
    resetDataFlags: function(){
        Data.second_card_clicked = null;
        Data.firstcardid = null;
        Data.first_card_clicked = null;

    },
    //Below is for creating cards dynamically ignore
    //creates and appends 18 divs with html and img src that uses a random order array from randomMorty
    createMorty : function(picIdarray) {

        if(picIdarray){
            Game.dynamicMorty(picIdarray);
        }
        else{
            Data.totalCards = $("#game-area").children().length;
            Data.gameBoard = $("#game-area").html();
            console.log(Data.totalCards);
        }
    },
    dynamicMorty : function(rpics){
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 2; j++) {
                var cardcontain = $("<div>", {
                    class: "card clickme",
                    html: " <div class='front'>" +
                    "<img src='image/morty" + rpics.pop() + ".png' alt='cardfront'>" +
                    "</div>" +
                    "<div class='back'> " +
                    "<img src='image/cardback.png' alt='cardback'>" +
                    "</div>"
                });
                $(cardcontain).appendTo("#game-area");
            }
        }
    },
    //returns an array of predefined numbers in a random order;
    randomMorty: function(){
        var pics = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9];
        return pics;
        var randomnums = [];
        var picslen = pics.length;
        for(var i = 0; i < picslen; i++){
            var curlen = pics.length;
            var num = Math.floor(Math.random() * curlen);
            var temp = ((pics.splice(num, 1)));
            randomnums.push(temp[0]);
        }
        return randomnums;
    }
}





