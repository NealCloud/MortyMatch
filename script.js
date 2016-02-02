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
    Game.display_stats();
    Game.modalActive();
});

//game variable storage
Data = {
    //Game Logic
    first_card_clicked: null,
    second_card_clicked: null,
    mortyInit: null,
    gameBoard: null,
    //Stats
    flurbos: 200,
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
    portalFuel: 210,
    morties_collected: [],
    backpack: { hp: 0, },
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
        GreenMorty: {},
        RedMorty: {},
        BlueMorty: {}
    },
    worlds: {
        world0:["<div> its ricks mart!</div>", "world0", 0],
        world1: ["<div> its a colorful planet!</div>", "world1"],
        world2: ["<div> its world2!</div>", "world2"],
        world3: ["<div>  its world3!</div>", "world3"],
        world4: ["<div>  its world4!!</div>", "world4"],
        world5: ["<div>  its world5!!</div>", "world5"],
        world6: ["<div>  its world6!</div>", "world6"],
        world7: ["<div>  its world7!</div>", "world7", 7]
    },
    shops: [],
    Shop: function(items, mortys){
        var mortyStock = Data.morty_list;
        var itemStock = ["health","stamina","kombobulators", "magic beans"];
        var shopName = ["NeutrinoMart", "Flips n Bitz","RickMart","Big and Bird", "TinyFood"];
        this.name = Game.randomPick(shopName, 1);
        this.item = Game.randomPick(itemStock, items);
        this.morty = Game.randomPick(mortyStock, mortys);
        this.mcost = Game.randomRange(50, 400);
    },
    missions: [],
    Mission: function(item){
        //mortyStock = Data.morty_list;
        itemStock = ["health","stamina","kombobulators", "magic beans"];
        missionName = ["a Morty in Need", "Warrior Trials","Magical Being","Visit Birdworld", "Steal Food"];
        this.name = Game.randomPick(missionName, 1);
        //this.item = Game.randomPick(itemStock, items);
    }
}

//game logic "engine" functions
Game = {
    mortyInit: function(){
        var startingMorty = ["RedMorty", "BlueMorty", "GreenMorty"];
        var world = Data.worlds.world0;
        $("#game-area").addClass(world[1]).append(world[0]);
        var morty;
        for(var i = 0; i < startingMorty.length; i++){
            morty = startingMorty[i];
            //append shop Icons
            console.log(typeof morty);
            $("<div>", {
                class: "people",
                attr: { onclick: "Game.start('" + morty + "');"},
                html: "<img src='image/me.jpg'>" + morty
            }).appendTo("#game-area");
        }
        Game.sideBtnMaker();
    },
    start : function(morty){
        Game.clearGameArea();
        $("<option>").text(morty).appendTo("#mortydex");
        Data.morties_collected.push(morty);

        $("<div>", {
            class: "people",
            html: "<img src='image/me.jpg'> Excellent Choice Now head out and collect more mortys"
        }).appendTo("#game-area");

    },
    randomRange : function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    randomPick: function(arry,num){
        var newarry = [];
        var random;
        for(var i = 0; i < num; i++){
            random = Math.floor(Math.random() * arry.length);
            newarry.push(arry[random]);
        }
        return newarry;
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
    //useful buttons on side of screen
    sideBtnMaker:function(){
        //reset button TODO fix it
        $(".reset").click(function(){
            $("#game-area").html("");
            Data.matches = 0;
            Data.games_played += Data.attempts > 0 ? 1: 0;
            Game.reset_stats();
            $('.timer .value').text("0");
        })
        //activates portal to random place;
        $(".portal").click(function(){
            if(Data.portalReady && Game.fuelCheck()){
                Game.portalRandom(Data.currentworld);
                Game.reset_stats();
                Game.createMission(2);
            }
        })
        //activate portal to the market;
        $(".market").click(function(){
            if(Data.currentworld != 0 && Data.portalReady && Game.fuelCheck()){
                Game.reset_stats();
                Game.portalPlace(Data.currentworld, Data.worlds.world0);
            }
        })
        //activate portal to prison break
        $(".prison").click(function(){
            if(Data.currentworld != 7 && Data.portalReady && Game.fuelCheck()){
                Game.reset_stats();
                Game.portalPlace(Data.currentworld, Data.worlds.world7);
            }
        })
        $("#btnMode1").click(function(){
            Game.modalActive("mode1");
        })
        //activate to flip board cheat;
        $(".btnflip").click(function(){
            Game.flipEverything(1000);
        })
    },
    //start mission phase after portal to a world

    //activate to finish a mission and start morty match reward phase
    missionComplete: function(num){
      $("#game-area").html("");
       Game.startMortyMatch(num);
    },
    //starts morty match game
    startMortyMatch: function(num){
        Data.portalReady = false;
        Game.resetDataFlags();
        var divo = $("<div>");

        $("#game-area").append($("<h1>").html("GET READY!").addClass('win'));
        setTimeout(function(){
            $("#game-area").html("");
            Game.createMortyMatch(num);
            Game.btnBackMaker();
            Game.flipEverything(4000);
            Game.stopwatch(-10, ".timer .value", Game.endMortyMatch);

        }, 2000);
    },
    //end morty match game
    endMortyMatch: function(){
        Data.portalReady = true;
        $("#game-area").html("");
        console.log("morty match over");
    },
    //portal to random world takes previous world int to compare and go to different world
    portalRandom: function(previousWorld){
        Game.clearGameArea();
        //remove previous world class
        var world = Data.worlds["world" + previousWorld];
        $("#game-area").removeClass(world[1]);
        //find a random number different to previous world number
        var r = previousWorld;
        while(r == previousWorld){
           r = Math.floor(Math.random() * Data.world_list.length) + 1;
        }
        console.log("previous: " + previousWorld + " new: " + r);
        //access world objects and append html to page;
        world = Data.worlds["world" + r];
        Data.currentworld = r;
        $("#game-area").addClass(world[1]).append(world[0]);
    },
    //portal to a specific world
    portalPlace: function(previousWorld, destination){
        Game.clearGameArea();
        //check previous world and remove class
        var world = Data.worlds["world" + previousWorld];
        $("#game-area").removeClass(world[1]);
        //assign to destination set current and append class to bg
        world = destination;
        Data.currentworld = world[2];
        $("#game-area").addClass(world[1]).append(world[0]);
        console.log(world[1]);
        if(world[1] == "world0"){
            console.log("opening market");
            Game.openMarket(Game.randomRange(1,2));
        }
    },
    createMission: function(num){
        var ritem;
        for(var i = 0; i < num; i++){
            //ritem = Math.floor(Math.random() * 6) + 1;
            Data.missions.push(new Data.Mission());
        }
        Game.appendMissions();
    },
    appendMissions: function(){
        var mission;
        for(var i = 0; i < Data.missions.length; i++){
            mission = Data.missions[i];
            //append shop Icons
            $("<div>", {
                class: "people",
                attr: { onclick: "Game.modalActive('mode" + i + "');"},
                html: "<img src='image/me.jpg'>" + mission.name
            }).appendTo("#game-area");
            //append shop name to first modal;
            $("#mode" + i + " h2").text(mission.name);
            $("#mode" + i + " .modal-body").html("<button class='close' onclick='Game.missionComplete()'>Completed!!</button>");
            //append a list of items in the shop
            //var items = $("<ul>");
            //var body = $("#mode" + i + " .modal-body");

            //for(var j = 0; j < shop.item.length; j++){
            //    var x = $("<li>").text(shop.item[j]);
            //    items.append(x);
            //}
            //body.append(items);
        }
    },
    openMarket: function(num){
        var ritem;
        var rmorty;
        for(var i = 0; i < num; i++){
            rmorty = Math.floor(Math.random() * 2);
            ritem = Math.floor(Math.random() * 6) + 1;
            Data.shops.push(new Data.Shop(ritem, rmorty));
        }
        Game.appendMarket();
    },
    appendMarket: function(){
        var shop;
        for(var i = 0; i < Data.shops.length; i++){
            shop = Data.shops[i];
            //append shop Icons
            $("<div>", {
                class: "people",
                attr: { onclick: "Game.modalActive('mode" + i + "');"},
                html: "<img src='image/me.jpg'>" + shop.name
            }).appendTo("#game-area");
            //append shop name to first modal;
            $("#mode" + i + " h2").text(shop.name);
            //append a list of items in the shop
            var items = $("<ul>");
            var body = $("#mode" + i + " .modal-body");

            for(var j = 0; j < shop.item.length; j++){
                var x = $("<li>").text(shop.item[j]);
                items.append(x);
            }
            body.append(items);
        }
    },
    clearGameArea: function(){
        Data.missions = [];
        Data.shops = [];
        $(".modal-header").html("<span class='close'>×</span> <h2></h2>");
        $(".modal-body").html("");
        $(".modal-footer").html("<h3></h3>");
        $("#game-area").html("");
    },
    //check portal gun charges
    fuelCheck: function(){
        if( --Data.portalFuel > 0){
            if(Data.portalFuel < 3){
                console.log("your running low on fuel!");
            }
            return true;
        }
        console.log("your out of fuel!");
        return false;
    },
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
        Game.display_stats();
    },
    //a countdown and regular timer, a bit wonky
    // negative duration to count down and positive to start from 0 to duration
    stopwatch: function(duration, display, callback){
        var timer, total, minutes, seconds, variable;
        console.log(duration);
        if(duration > 0){
            variable = "Data.gameTimer";
            timer = 0;
            total = duration;
        }
        else{
            variable = "Data.countdown";
            timer = duration;
            total = 0;
        }
        window[variable] = setInterval(function () {
            console.log(timer);
            //uses abs to clear - sign
            minutes = Math.abs(parseInt(timer / 60, 10));
            seconds = Math.abs(parseInt(timer % 60, 10));
            //adds a zero if less then 10 for uniformity
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            $(display).text(minutes + ":" + seconds);

            if (++timer > total - 5) {
                if(timer >= total + 1){
                    //activate callback and clear timer
                    callback();
                    clearInterval(window[variable]);
                    console.log("TIMER OUT");
                }
                //$(display).addClass("win");
            }
        }, 1000);
    },
    //creating cards dynamically
    createMortyMatch : function(cards) {
        //var cards = parseInt($("#cardNumber").val());
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
    },
    modalActive: function(modeid){
        console.log(modeid);
        var modal = $("#" + modeid);
        var span = $(".close");
        modal.css("display" , "block");
       // var modal2 = $('#mode2');
       // var btn1 = $("#btnMode1");
       // var btn2 = $("#btnMode2");

       //var window1 = document.getElementById(modeid);
       // var window2 = document.getElementById('mode2');
       // $(btn1).click(function() {
       //     modal1.css("display","block");
       // });
       // $(btn2).click(function() {
       //     modal2.css("display","block");
       // });
       // // close the inventory
        $(span).click(function() {
           close();
        });
       // // TODO: fix When the user clicks anywhere outside of the inventory, close it
       // window.addEventListener("click", checkwindow);
       //
       // function checkwindow(event) {
       //     console.log(event.target);
       //     if (event.target == window1) {
       //         close();
       //     }
       // }

        function close(){
            modal.css( "display", "none");
           // window.removeEventListener("click", checkwindow);
        }

    }

}





