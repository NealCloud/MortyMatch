/**
 * Created by Mad Martigan on 2/2/2016.
 */
Match = {
    //Morty Match Game Logic
    // called when a card is clicked enacts core game logic
    // arguments used (element, boolean)  targ element card and if 2nd card clicked
    card_clicked: function(targ){
        //if (!Data.counting) {
        //   Data.counting = true;
        //   Game.stopwatch(-10, Data.time_display);
        //}
        //if first_card_clicked is false flip this card and store this element and toggle first_card_clicked to true
        if(!Data.first_card_clicked){
            $(targ).addClass("flip");
            // Data.firstcardid = targ;
            Data.first_card_clicked = targ;
        }
        //if first_card_clicked compareCards
        else{
            Match.compareCards(targ);
        }
    },
    //Second card clicked -> (*mouse click disabled) flip second card and set true and flip target card and compare img src
    compareCards: function(card){
        Data.attempts++;
        Data.second_card_clicked = card;
        $(card).addClass("flip");
        var firstSrc = $(card).siblings(".front").find("img").attr("src");
        var secondSrc = $(Data.first_card_clicked).siblings( ".front").find("img").attr("src");

        //The card src images are not equal -> use Timeout to delay a flip back and reset data variables and wait for click
        console.log(firstSrc, secondSrc);
        if(firstSrc != secondSrc){
            Match.display_stats();
            setTimeout(function(){
                $(card).removeClass("flip");
                $(Data.first_card_clicked).removeClass("flip");
                Match.resetDataFlags();
            }, 1000);
        }
        //The cards are equal -> add morty to pokedex and move to matchedCards function to check if game won
        else{
            var firstNum = /\/(.+)\.png$/gm.exec(firstSrc)[1];
            console.log(firstNum);
            console.log(firstSrc);
            //Game.addMorty(firstNum);
            Match.matchedCards(card);
        }
    },
    matchedCards: function(targ){

        console.log(Data.matches, Data.attempts);
        //game is won -> clear game board and display win text and wait for reset

        if(Data.matches == Data.totalCards / 2 - 1 ){
            Match.display_stats();
            Match.animate(targ);
            $("#game-area").html("");
            $("#game-area").append($("<h1>").html("You win").addClass('win'));

        }
        //not yet won -> increase matches, fade out cards and reset data flag variables and wait for next click
        else{
            Data.matches++;
            Data.flurbos += 100;
            Match.animate(targ);
            setTimeout(function(){
                Match.resetDataFlags();
            }, 500);
        }
        Match.display_stats();
    },
    //animates siblings exit
    animate: function(element){
        $(element).siblings(".front").animate({bottom: "-=200px"}, 800).fadeOut(800);
        $(element).html("");
        $(Data.first_card_clicked).siblings(".front").animate({top: "-=200px"}, 800).fadeOut(800);
        $(Data.first_card_clicked).html("");
    },
    //Flips every card
    flipEverything: function(duration, countdown){
        $(".back").addClass("flip").delay(duration).queue(function(next){
            $(this).removeClass("flip");
            next();
        });
    },
    // reset the card click and id values
    resetDataFlags: function(){
        Data.second_card_clicked = null;
        Data.first_card_clicked = null;
    },
    //display all side stats
    display_stats: function(){
        //check math
        var a = Data.matches;
        var b = Data.attempts;
        Data.accuracy = ( a != 0 && b != 0) ? Math.floor((a / b) * 100) + "%": 0;

        $(".attempts").find(".value").text(Data.attempts);
        $(".currency").find(".value").text("$" + Data.flurbos);
        $(".flurbs").text("$" + Data.flurbos);
        $(".fuel").find(".value").text(Data.portalFuel);
        $(".matches").find(".value").text(Data.matches);
        $(".accuracy").find(".value").text(Data.accuracy);
        $(".games-played").find(".value").text(Data.games_played);
    },
    //reset the stats in morty match
    reset_stats: function(){
        Data.accuracy = 0;
        Data.matches = 0;
        Data.attempts = 0;
        //$("#mortydex").html("<option>MortyDex</option>");
        Match.display_stats();
    }
}
