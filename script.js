/**
 * Created by Mad Martigan on 1/28/2016.
 */
$(document).ready(function() {
    // initialize game creating the board game with a randomly generated cardset or
    //var mortypics = Game.randomMorty();
    Game.createMorty(Game.randomMorty());
    //create a click event on all card backs
    Game.btnMaker();
});

//game variable storage
Data = {
    srcNumbers: [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9],
    play:true,
    score: 0,
    secondcard: false,
    firstcardId: null,
    totalCard: 18,
    attempt: 0,
    accuracy: 0
}

//game logic "engine" functions
Game = {
    //creates and appends 18 divs with html and img src that uses a random order array from randomMorty
    createMorty : function(rpics) {
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
    },
    btnMaker: function(){
        $(".back").click(function(){
            console.log("clicked");
            if(Data.play){
                Game.flipCard(this, Data.secondcard);
            }
        })
        $(".reset").click(function(){
            console.log("clicked");
            $("#game-area").html("");
            Game.createMorty(Game.randomMorty());
            Data.score = 0;
            Game.resetData();
            Game.btnMaker();
        })
    },
    // called when a card is clicked enacts core game logic
    // arguments used (element, boolean)  targ element card and if 2nd card clicked
    flipCard: function(targ, card2){
        console.log(Data.srcNumbers);
        //if secondcard is false flip this card and store this element and toggle secondcard to true
        if(!card2){
            $(targ).addClass("flip");
            Data.firstcardid = targ;
            Data.secondcard = true;
        }
        //if secondcard is true disable playing(mouse clicks) and flip this card and compare with previous card
        else{
            Data.play = false;
            $(targ).addClass("flip");

            //if card src images are not equal  use Timeout to delay flip back and reset data variables
            if($(targ).siblings( ".front").find("img").attr("src") != $(Data.firstcardid).siblings( ".front").find("img").attr("src")){
                setTimeout(function(){
                    $(targ).removeClass("flip");
                    $(Data.firstcardid).removeClass("flip");
                    Game.resetData();
                }, 500);
            }
            //cards are equal check if game is won
            else{
                //game is won append win text and clear game board
                if(Data.score == Data.totalCard / 2 - 1 ){
                    $("#game-area").html("");
                    $("#game-area").append($("<h1>").html("You win").addClass('win'));
                    Game.animate(targ);

                    console.log("you win");
                }
                //match found increase score fade out cards and reset data flag variables
                else{
                    console.log(Data.score, Data.totalCard)
                    $(targ).removeClass("clickme");
                    $(Data.firstcardid).removeClass("clickme");
                    Data.score++;
                    Game.animate(targ);
                    Game.resetData();
                }
            }
        }
    },
    //TODO: compare match animate and reset functions
    compare: function(){

    },
    match: function(){

    },
    animate: function(targ){
        $(targ).siblings(".front").animate({width: "0%"}, 500).fadeOut(500);
        $(Data.firstcardid).siblings(".front").animate({width: "0%"}, 500).fadeOut(500);
    },
    resetData: function(){
        Data.firstcardid = null;
        Data.secondcard = false;
        Data.play = true;
    }
}





