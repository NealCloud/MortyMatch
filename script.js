/**
 * Created by Mad Martigan on 1/28/2016.
 */
$(document).ready(function() {
    // randomize an array of picture numbers and appends cards to game area;
    var mortypics = randomMorty();
    createMorty(mortypics);

    $(".card").click(function(){
        if(play){
            flipCard(this, secondcard);
        }
    })
});

var play = true;
var score = 0;
var secondcard = false;
var firstcardid = null;

function createMorty(rpics) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 2; j++) {
            var cardcontain = $("<div>", {
                class: "card",
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
}

function randomMorty(){
    var pics = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9];
    var randompic = [];
    var len = pics.length;
    for(var i = 0; i < len; i++){
        var newlen = pics.length;
        var rando = Math.floor(Math.random() * newlen);
        var temp = ((pics.splice(rando,1)));
        randompic.push(temp[0]);
    }
    return randompic;
}

function flipCard(targ, card2){
    //console.log(card2);
    if(!card2){
        $(targ).find(".back").addClass("flip");
        firstcardid = targ;
        secondcard = true;
    }
    else{
        play = false;
        $(targ).find(".back").addClass("flip");
        if($(targ).find("img").attr("src") != $(firstcardid).find("img").attr("src")){
            setTimeout(function(){
                $(targ).find(".back").removeClass("flip");
                $(firstcardid).find(".back").removeClass("flip");
                firstcardid = null;
                secondcard = false;
                play = true;
            }, 500);
        }
        else{
            if(score == 8){
                $("#game-area").append($("<h1>").html("You win").addClass('win'));
                console.log("you win");
            }
            else{
                score++;
                firstcardid = null;
                secondcard = false;
                play = true;
            }

        }

    }
}