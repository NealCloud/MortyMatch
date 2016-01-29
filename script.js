/**
 * Created by Mad Martigan on 1/28/2016.
 */
$(document).ready(function() {
    // initialize game creating the board game with a randomly generated cardset or

    Data.mortyInit = Game.randomMorty(Data.totalCards/2);
    Game.createMortyMatch(Data.mortyInit);
    //create a click event on all card backs
    Game.btnBackMaker();
    //create reset btn
    Game.resetBtn();
});

//game variable storage
Data = {
    first_card_clicked: null,
    second_card_clicked: null,
    mortyInit: null,
    matches: 0,
    firstcardId: null,
    gameBoard: null,
    totalCards: 18,
    attempts: 0,
    accuracy: 0,
    games_played: 0
}

//game logic "engine" functions
Game = {
    //assign clicks to buttons and card backs;
    btnBackMaker: function(){
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
        //THE RESET BUTTON
    },
    resetBtn:function(){
        $(".reset").click(function(){
            //console.log("clicked", this);
            //clear gameboard;
            $("#game-area").html("");
            //checks for premade gameboard otherwise use dynamic function to create
            Data.mortyInit = Game.randomMorty(Data.totalCards/2);
            //resets the Data vars and initiates game
            Game.createMortyMatch(Data.mortyInit);
            Data.matches = 0;
            Data.games_played++;
            Game.reset_stats();
            Game.resetDataFlags();
            Game.btnBackMaker();
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
   //Second card clicked -> (*mouse click disabled) flip second card and set true and flip target card and compare img src
    compareCards: function(targ){
        Data.attempts++;
        Data.second_card_clicked = true;
        $(targ).addClass("flip");
        //The card src images are not equal -> use Timeout to delay a flip back and reset data variables and wait for click
        if($(targ).siblings( ".front").find("img").attr("src") != $(Data.firstcardid).siblings( ".front").find("img").attr("src")){
            Game.display_stats();
            setTimeout(function(){
                $(targ).removeClass("flip");
                $(Data.firstcardid).removeClass("flip");
                Game.resetDataFlags();
            }, 2000);
        }
        //The cards are equal -> go to matchedCards function to check if game won
        else{
           Game.matchedCards(targ);
        }
    },
    matchedCards: function(targ){
        console.log(Data.matches, Data.attempts);
        //game is won -> clear game board and display win text and wait for reset

        if(Data.matches == Data.totalCards / 2 - 1 ){
            Game.display_stats();
            Game.animate(targ);
            $("#game-area").html("");
            $("#game-area").append($("<h1>").html("You win").addClass('win'));

        }
        //not yet won -> increase matches, fade out cards and reset data flag variables and wait for next click
        else{
            Data.matches++;
            Game.animate(targ);
            setTimeout(function(){
                Game.resetDataFlags();
            }, 500);
        }
        Game.display_stats();
    },
    //animate an elements sibling
    animate: function(element){
        $(element).siblings(".front").animate({bottom: "-=200px"}, 800).fadeOut(800);
        $(Data.firstcardid).siblings(".front").animate({top: "-=200px"}, 800).fadeOut(800);
    },
    // reset the card click and id values
    resetDataFlags: function(){
        Data.second_card_clicked = null;
        Data.firstcardid = null;
        Data.first_card_clicked = null;
    },
    display_stats: function(){
        //check math
        var a = Data.matches;
        var b = Data.attempts;
        Data.accuracy = ( a != 0 && b != 0) ? Math.floor((a / b) * 100) + "%": 0

        $(".attempts").find(".value").text(Data.attempts);
        $(".matches").find(".value").text(Data.matches);
        $(".accuracy").find(".value").text(Data.accuracy);
        $(".games-played").find(".value").text(Data.games_played);
    },
    reset_stats: function(){
        Data.accuracy = 0;
        Data.matches = 0;
        Data.attempts = 0;
        Game.display_stats();
    },
    //Below is for creating cards dynamically ignore

    createMortyMatch : function(picIdarray) {
        //calls for a dynamic card creation  * use the randomMorty function to create such an array
        if(picIdarray){
            Game.dynamicCardCreate(picIdarray);
        }
        //if no random number array is used copy game board inside game-area
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
        //remove to have random card placement
        return pics;
        var randomnums = [];
        var picslen = pics.length;
        for(var i = 0; i < picslen; i++){
            var curlen = pics.length;
            var num = Math.floor(Math.random() * curlen);
            var temp = ((pics.splice(num, 1)));
            randomnums.push(temp[0]);
        }
        //console.log(randomnums);
        return randomnums;
    }
}





