/**
 * Created by Mad Martigan on 1/28/2016.
 */
$(document).ready(function() {
    // initialize game creating the board game with a randomly generated cardset or
    //Data.mortyInit = Game.randomCardArray(Data.totalCards/2);
   // Game.createMortyMatch();
    //create a click event on all card backs
   // Game.btnBackMaker();
    //create reset btn

    Game.mortyInit();

});

//game variable storage
Data = {
    //Game Logic
    first_card_clicked: null,
    second_card_clicked: null,
    mortyInit: null,
    gameBoard: null,
    //Stats
    currentworld: 0,
    matches: 0,
    totalCards: 18,
    attempts: 0,
    accuracy: 0,
    games_played: 0,
    //Timers
    gameTimer: 0,
    timing: false,
    countdown: 0,
    counting: false,
    time_display: ".timer .value",
    //Items
    portalReady: true,
    portalFuel: 10,
    morties_collected: [],
    items_collected: [],
    item_list: ["morty1.png","morty2.png","morty3.png","morty4.png","morty5.png",
        "morty6.png","morty7.png","morty8.png","morty9.png"],
    morty_list: ["trueMorty","roboMorty","cyclopsMorty","rainbowMorty","businessMorty",
        "psychoMorty","wizardMorty","magicMorty","bikerMorty"],
    world_list: ["world1","world2","world3","world4","world5","world6"],
    morty_dex: {
        trueMorty: {health:200, stamina: 200, wit: 20, strength:20, speed:20, dead: false},
        roboMorty: {},
        cyclopsMorty: {},
        rainbowMorty: {},
        businessMorty: {},
        psychoMorty: {},
        wizardMorty: {},
        magicMorty: {},
        bikerMorty: {},
    },
    worlds: {
        world0:["<div> its ricks mart!</div>", "world0"],
        world1: ["<div> its a colorful planet!</div>", "world1"],
        world2: ["<div> its world2!</div>", "world2"],
        world3: ["<div>  its world3!</div>", "world3"],
        world4: ["<div>  its world4!!</div>", "world4"],
        world5: ["<div>  its world5!!</div>", "world5"],
        world6: ["<div>  its world6!</div>", "world6"]
    }
}
//game logic "engine" functions
Game = {
    mortyInit: function(){
        var world = Data.worlds.world0;
        $("#game-area").addClass(world[1]).append(world[0]);
        Game.sideBtnMaker();
    },
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
    sideBtnMaker:function(){
        $(".reset").click(function(){
            //console.log("clicked", this);
            //clear gameboard;
            $("#game-area").html("");
            //checks for premade gameboard otherwise use dynamic function to create

            //resets the Data vars and initiates game
            Game.createMortyMatch();
            Data.matches = 0;
            Data.games_played += Data.attempts > 0 ? 1: 0;
            Game.reset_stats();
            Game.resetDataFlags();
            Game.btnBackMaker();
            $('.timer .value').text("0");
        })

        $(".portal").click(function(){
            if(Data.portalReady && Data.portalFuel > 0){
                if(Data.portalFuel < 3){
                    console.log("your running low on fuel!");
                }
                Data.portalFuel--;
                Game.portal(Data.currentworld);
            }
        })

        $(".btnflip").click(function(){
            Game.flipEverything();
        })
    },
    portal: function(previousWorld){
        var world = Data.worlds["world" + previousWorld];
        $("#game-area").removeClass(world[1]);
        console.log(previousWorld);
        var r = previousWorld;
        while(r == previousWorld){
           r = Math.floor(Math.random() * Data.world_list.length + 1);
        }
        console.log(r, previousWorld);
        world = Data.worlds["world" + r];
        console.log(world);
        Data.currentworld = r;
        $("#game-area").addClass(world[1]).append(world[0]);

    },

    // called when a card is clicked enacts core game logic
    // arguments used (element, boolean)  targ element card and if 2nd card clicked
    card_clicked: function(targ){
        if (!Data.counting) {
           Data.counting = true;
           Game.stopwatch(-10, Data.time_display);
        }
        //if first_card_clicked is false flip this card and store this element and toggle first_card_clicked to true
        if(!Data.first_card_clicked){
            $(targ).addClass("flip");
           // Data.firstcardid = targ;
            Data.first_card_clicked = targ;
        }
        //if first_card_clicked compareCards
        else{
            Game.compareCards(targ);
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
            Game.display_stats();
            setTimeout(function(){
                $(card).removeClass("flip");
                $(Data.first_card_clicked).removeClass("flip");
                Game.resetDataFlags();
            }, 1000);
        }
        //The cards are equal -> add morty to pokedex and move to matchedCards function to check if game won
        else{
            var firstNum = /image/.exec(firstSrc)[0];
            Game.addMorty(firstNum);
            Game.matchedCards(card);
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
        $(element).html("");
        $(Data.first_card_clicked).siblings(".front").animate({top: "-=200px"}, 800).fadeOut(800);
        $(Data.first_card_clicked).html("");
    },
    flipEverything: function(){
        $(".back").addClass("flip").delay(2000).queue(function(next){
            $(this).removeClass("flip");
            next();
        });
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
        $("#mortydex").html("<option>MortyDex</option>");
        Game.display_stats();
    },
    stopwatch: function(duration, display){
        var timer, total, minutes, seconds, variable;
        console.log(duration);
        if(duration > 0){
            console.log(variable);
            variable = "Data.gameTimer";
            timer = 0;
            total = duration;
        }
        else{
            variable = "Data.countdown";
            timer = duration;
            total = 0;
        }
        //console.log(timer);
        window[variable] = setInterval(function () {
            console.log(timer);
            minutes = Math.abs(parseInt(timer / 60, 10));
            seconds = Math.abs(parseInt(timer % 60, 10));

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            $(display).text(minutes + ":" + seconds);

            if (++timer > total - 5) {
                if(timer >= total + 1){
                    clearInterval(window[variable]);
                    console.log("TIMER OUT");
                }
                //$(display).addClass("win");
            }
        }, 1000);
    },
    //creating cards dynamically
    createMortyMatch : function() {
        var cards = parseInt($("#cardNumber").val());

        if(cards < 9 && cards > 1){
            console.log(typeof cards, cards);
            Game.dynamicCardCreate(Game.randomCardArray(cards, Data.item_list));
        }
        else{
            console.log(Data.totalCards/2);
            //calls for a dynamic card creation  * use the randomCardArray function to create such an array
            Game.dynamicCardCreate(Game.randomCardArray(Data.totalCards / 2, Data.item_list));
        }
    },
    //create card divs with img src in the order of a number array
    dynamicCardCreate : function(numberArray){
        var numLen = numberArray.length/2;
        console.log(numLen);
        for (var i = 0; i < numLen; i++) {
            for (var j = 0; j < 2; j++) {
                var cardcontain = $("<div>", {
                    class: "card",
                    html: " <div class='front'>" +
                    "<img src='image/" + numberArray.pop() + "' alt='cardfront'>" +
                    "</div>" +
                    "<div class='back'> " +
                    "<img src='image/cardback.png' alt='cardback'>" +
                    "</div>"
                });
                $(cardcontain).appendTo("#game-area");
            }
        }
    },
    //take in an array of images doubles and randomizes them;
    randomCardArray: function(num, items){
        console.log("randomCardArray array:", num, items);
        pics = [];
        for(var i = 0; i < num ; i++){
            pics.push(items[i]);
            pics.push(items[i]);
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
    },
    //add Morty to index
    addMorty: function(morty){
        console.log(morty + " added");
        var mortyName = Data.morty_list[morty - 1];
        console.log(mortyName);
        Data.morties_collected.push(Data.morty_dex[mortyName]);
        $("<option>").text(mortyName).appendTo("#mortydex");
        console.log(Data.morties_collected);
    },
    addItem: function(item){
        console.log(morty + " added");
        var mortyName = Data.morty_list[morty - 1];
        console.log(mortyName);
        Data.morties_collected.push(Data.morty_dex[mortyName]);
        $("<option>").text(mortyName).appendTo("#mortydex");
        console.log(Data.morties_collected);
    }
}





