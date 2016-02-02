/**
 * Created by Mad Martigan on 1/28/2016.
 */
$(document).ready(function() {
    // initialize game creating the board game with a randomly generated cardset or

    //Data.mortyInit = Game.randomMorty(Data.totalCards/2);
    Game.createMortyMatch(Data.mortyInit);
    //create a click event on all card backs
    Game.btnMaker();
});

//game variable storage
Data = {
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
        //Card Clicked if second_card_clicked -> card_clicked  else shake card
       Game.cardBackClick();
        //THE RESET BUTTON
        $(".reset").click(function(){
            //console.log("clicked", this);
            //clear gameboard;
            $("#game-area").html("");
            //checks for premade gameboard otherwise use dynamic function to create
            Data.gameBoard ? $("#game-area").append(Data.gameBoard) : Data.mortyInit = Game.randomMorty(Data.totalCards/2);
            //resets the Data vars and initiates game
            Game.createMortyMatch(Data.mortyInit);
            Data.score = 0;
            Game.resetDataFlags();
            Game.cardBackClick();
        })
    },
    cardBackClick: function(){
        //Card Clicked if second_card_clicked -> card_clicked  else shake card
        $(".back").click(function(){
            //console.log("clicked a" , this);
            if(!Data.second_card_clicked){
                Game.card_clicked(this);
            }
            else{
                $(this).parent().effect("shake");
            }
        })
    },

    // called when a card is clicked enacts core game logic
    // arguments used (element, boolean)  targ element card and if 2nd card clicked
    card_clicked: function(targ){
        //$(targ).addClass("flip");
        $(targ).toggle();
        //if first_card_clicked is false flip this card and store this element and toggle first_card_clicked to true
        if(!Data.first_card_clicked){
            Data.first_card_clicked = targ;


        }
        //if first_card_clicked compareCards
        else{
            Game.compareCards(targ);
        }
    },
   //Second card clicked -> (*mouse click disabled) flip second card and set true and flip target card and compare img src
    compareCards: function(targ){
        Data.second_card_clicked = true;
        $(targ).addClass("flip");
        //The card src images are not equal -> use Timeout to delay a flip back and reset data variables and wait for click
        if($(targ).siblings( ".front").find("img").attr("src") != $(Data.first_card_clicked).siblings( ".front").find("img").attr("src")){
            setTimeout(function(){
                $(targ).removeClass("flip");
                $(Data.first_card_clicked).removeClass("flip");
                $(targ).toggle();
                $(Data.first_card_clicked).toggle();
                Game.resetDataFlags();
            }, 2000);
        }
        //The cards are equal -> go to matchedCards function to check if game won
        else{
           Game.matchedCards(targ);
        }
    },
    matchedCards: function(targ){
        //game is won -> clear game board and display win text and wait for reset
        if(Data.score == Data.totalCards / 2 - 1 ){
            Game.animate(targ);
            $("#game-area").html("");
            $("#game-area").append($("<h1>").html("You win").addClass('win'));
        }
        //not yet won -> increase score, fade out cards and reset data flag variables and wait for next click
        else{
            console.log(Data.score, Data.totalCards);
            Data.score++;
            Game.animate(targ);
            setTimeout(function(){
                Game.resetDataFlags();
            }, 500);

        }
    },
    //animate an elements sibling
    animate: function(element){
        $(element).siblings(".front").animate({bottom: "-=200px"}, 800).fadeOut(800);
        $(Data.first_card_clicked).siblings(".front").animate({top: "-=200px"}, 800).fadeOut(800);
    },
    // reset the card click and id values
    resetDataFlags: function(){
        Data.second_card_clicked = null;
        Data.first_card_clicked = null;
        Data.first_card_clicked = null;
    },
    //Below is for creating cards dynamically ignore
    //creates and appends 18 divs with html and img src that uses a random order array from randomMorty
    createMortyMatch : function(picIdarray) {
        if(picIdarray){
            Game.dynamicCardCreate(picIdarray);
        }
        else{
            Data.totalCards = $("#game-area").children().length;
            Data.gameBoard = $("#game-area").html();
            console.log(Data.totalCards);
        }
    },
    //create card divs with img src in the order of a number array
    dynamicCardCreate : function(numberArray){
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 2; j++) {
                var cardcontain = $("<div>", {
                    class: "card clickme",
                    html: " <div class='front'>" +
                    "<img src='image/morty" + numberArray.pop() + ".png' alt='cardfront'>" +
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
    randomMorty: function(num){
        pics = [];
        for(var i = 1; i < num + 1; i++){
            pics.push(i);
            pics.push(i);
        }
        console.log(pics);
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





