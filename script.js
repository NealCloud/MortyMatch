/**
 * Created by Mad Martigan on 1/28/2016.
 */
$(document).ready(function() {
    // initialize game creating the board game with a randomly generated cardset or preset array
    //randomMorty function returns a randomized array of numbers and their duplicates
    //accepts an integer between 1 - 9;
    Data.mortyInit = MemoryMatch.randomMorty(Data.totalCards/2);
    //
    MemoryMatch.createMortyMatch(Data.mortyInit);
    //create a click event on all card backs
    //Game.btnBackMaker();
    //create reset btn
    MemoryMatch.resetBtn();
});

//game variable storage
Data = {
    first_card_clicked: null,
    second_card_clicked: null,
    mortyInit: null,
    matches: 0,
    gameBoard: null,
    totalCards: 18,
    attempts: 0,
    accuracy: 0,
    games_played: 0,
    Card: function(imgNum, back){
        this.rando = Math.floor(Math.random()* 20);
        this.html = $("<div>", {
            class: "card clickme",
            html: " <div class='front'>" +
            "<img src='image/morty" + imgNum + ".png' alt='cardfront'>" +
            "</div>" +
            "<div class='back' onclick='!Data.second_card_clicked ? MemoryMatch.card_clicked(this) : $(this).parent().effect(\"shake\")' >" +
            "<img src='image/" + back + "' alt='cardback'>" +
            "</div>"
        });
        this.image = "image/morty" + imgNum + ".png";
    }
};

//game logic "engine" functions
MemoryMatch = {
    //assign clicks to buttons and card backs;
    btnBackMaker: function(){
        //Card Clicked if second_card_clicked -> card_clicked  else shake card
        $(".back").click(function(){
            //console.log("clicked a" , this);
            if(!Data.second_card_clicked){
                MemoryMatch.card_clicked(this);
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
            Data.mortyInit = MemoryMatch.randomMorty(Data.totalCards/2);
            //resets the Data vars and initiates game
            MemoryMatch.createMortyMatch(Data.mortyInit);
            Data.games_played += Data.attempts > 0 ? 1:0;
            Data.matches = 0;
            MemoryMatch.reset_stats();
            MemoryMatch.resetDataFlags();
            //Game.btnBackMaker();
        })
    },
    // called when a card is clicked enacts core game logic
    // arguments used (element, boolean)  targ element card and if 2nd card clicked
    card_clicked: function(targ){
        //if first_card_clicked is false flip this card and store this element and toggle first_card_clicked to true
        if(!Data.first_card_clicked){
            $(targ).addClass("flip");
            Data.first_card_clicked = targ;
        }
        //if first_card_clicked compareCards
        else{
            MemoryMatch.compareCards(targ);
        }
    },
   //Second card clicked -> (*mouse click disabled) flip second card and set true and flip target card and compare img src
    compareCards: function(targ){
        Data.attempts++;
        Data.second_card_clicked = targ;
        $(targ).addClass("flip");
        //The card src images are not equal -> use Timeout to delay a flip back and reset data variables and wait for click
        if($(targ).siblings( ".front").find("img").attr("src") != $(Data.first_card_clicked).siblings( ".front").find("img").attr("src")){
        console.log(Data.second_card_clicked.image)
        //if(targ.image == Data.first_card_clicked.image){
            MemoryMatch.display_stats();
            setTimeout(function(){
                $(targ).removeClass("flip");
                $(Data.first_card_clicked).removeClass("flip");
                MemoryMatch.resetDataFlags();
            }, 1000);
        }
        //The cards are equal -> go to matchedCards function to check if game won
        else{
           MemoryMatch.matchedCards(targ);
        }
    },
    matchedCards: function(targ){
        console.log(Data.matches, Data.attempts);
        //game is won -> clear game board and display win text and wait for reset

        if(Data.matches == Data.totalCards / 2 - 1 ){
            MemoryMatch.display_stats();
            MemoryMatch.animate(targ);
            $("#game-area").html("");
            $("#game-area").append($("<h1>").html("You win").addClass('win'));

        }
        //not yet won -> increase matches, fade out cards and reset data flag variables and wait for next click
        else{
            Data.matches++;
            MemoryMatch.animate(targ);
            setTimeout(function(){
                MemoryMatch.resetDataFlags();
            }, 500);
        }
        MemoryMatch.display_stats();
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
    },
    display_stats: function(){
        //check math
        var a = Data.matches;
        var b = Data.attempts;
        Data.accuracy = ( a != 0 && b != 0) ? Math.floor((a / b) * 100) + "%": 0;

        $(".attempts").find(".value").text(Data.attempts);
        $(".matches").find(".value").text(Data.matches);
        $(".accuracy").find(".value").text(Data.accuracy);
        $(".games-played").find(".value").text(Data.games_played);
    },
    reset_stats: function(){
        Data.accuracy = 0;
        Data.matches = 0;
        Data.attempts = 0;
        MemoryMatch.display_stats();
    },
    //Below is for creating cards dynamically ignore

    createMortyMatch : function(picIdarray) {
        console.log(picIdarray);
        //calls for a dynamic card creation  * use the randomMorty function to create such an array
        MemoryMatch.dynamicCardCreate(picIdarray, "cardback.png");
    },
    //create card divs with img src in the order of a number array
    dynamicCardCreate : function(numberArray, back){
        var total = numberArray.length;
        for (var i = 0; i < total; i++) {
            var imgNum = numberArray.pop();
            var card = new Data.Card(imgNum, back);
            $(card.html).appendTo("#game-area");

        }
    },
    //returns an array of predefined numbers in a random order between 1-9;
    randomMorty: function(cardinput){
        var cards = 9;
        if(cardinput > 0 && cardinput < 10){
            cards = cardinput;
        }
        pics = [];
        for(var i = 1; i < cards + 1; i++){
            pics.push(i);
            pics.push(i);
        }
        //remove to have random card placement
        //return pics;
        var randomnums = [];
        var picslen = pics.length;
        for(var i = 0; i < picslen; i++){
            var curlen = pics.length;
            var num = Math.floor(Math.random() * curlen);
            var temp = ((pics.splice(num, 1)));
            randomnums.push(temp[0]);
        }
        console.log(randomnums);
        return randomnums;
    }
}





