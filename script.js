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
    Data.portalReady = false;
    Game.mortyInit();
    Match.display_stats();
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
        "morty6.png","morty7.png","morty8.png","morty9.png","morty10.png","morty11.png"],
    morty_list: ["trueMorty","roboMorty","cyclopsMorty","rainbowMorty","businessMorty",
        "psychoMorty","wizardMorty","magicMorty","bikerMorty"],
    world_list: ["world1","world2","world3","world4","world5","world6"],
    morty_dex: {
        trueMorty: {health:200, stamina: 200, wit: 20, strength:20, speed:20, dead: false, src:"morty1.png"},
        roboMorty: {src:"morty2.png"},
        cyclopsMorty: {src:"morty3.png"},
        rainbowMorty: {src:"morty4.png"},
        businessMorty: {src:"morty5.png"},
        psychoMorty: {src:"morty6.png"},
        wizardMorty: {src:"morty7.png"},
        magicMorty: {src:"morty8.png"},
        bikerMorty: {src:"morty9.png"},
        GreenMorty: {src:"morty10.png"},
        RedMorty: {src:"morty11.png"},
        BlueMorty: {src:"morty1.png"}
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
        var itemStock = ["health","stamina","kombobulators", "magic beans", "PortalGun Charger"];
        var shopName = ["NeutrinoMart", "Flips n Bitz","RickMart","Big and Bird", "TinyFood"];
        this.name = Game.randomPick(shopName, 1);
        this.item = Game.randomPick(itemStock, items);
        this.morty = Game.randomPick(mortyStock, mortys);
        this.mcost = Game.randomRange(50, 400);
    },
    missions: [],
    Mission: function(item){
        missionName = ["a Morty in Need", "Warrior Trials","Magical Being","Visit Birdworld", "Steal Food"];
        this.name = Game.randomPick(missionName, 1);
        this.difficulty = Game.randomRange(0,10);
    }
}

//game logic "engine" functions
Game = {
    mortyInit: function(){
        var startingMorty = ["RedMorty", "BlueMorty", "GreenMorty"];
        var world = Data.worlds.world0;
        $("#game-area").addClass(world[1]).append(world[0]);
        var morty, image;
        for(var i = 0; i < startingMorty.length; i++){
            morty = startingMorty[i];
            image = Data.morty_dex[morty].src;
            console.log(image);
            //append shop Icons
            console.log(typeof morty);
            $("<div>", {
                class: "people",
                attr: { onclick: "Game.start('" + morty + "');"},
                html: "<img src=image/" + image + ">" + morty
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
        Data.portalReady = true;
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
                Match.card_clicked(this);
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
                Match.reset_stats();
                Game.createMission(2);
            }
        })
        //activate portal to the market;
        $(".market").click(function(){
            if(Data.currentworld != 0 && Data.portalReady && Game.fuelCheck()){
                Match.reset_stats();
                Game.portalPlace(Data.currentworld, Data.worlds.world0);
            }
        })
        //activate portal to prison break
        $(".prison").click(function(){
            if(Data.currentworld != 7 && Data.portalReady && Game.fuelCheck()){
                Match.reset_stats();
                Game.portalPlace(Data.currentworld, Data.worlds.world7);
            }
        })
        $("#btnMode1").click(function(){
            Game.modalActive("mode1");
        })
        //activate to flip board cheat;
        $(".btnflip").click(function(){
            Match.flipEverything(1000);
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
        Match.resetDataFlags();
        var divo = $("<div>");

        $("#game-area").append($("<h1>").html("GET READY!").addClass('win'));
        setTimeout(function(){
            $("#game-area").html("");
            Card.createMortyMatch(num);
            Game.btnBackMaker();
            Match.flipEverything(4000);
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
        var mission, difficulty;
        for(var i = 0; i < Data.missions.length; i++){
            mission = Data.missions[i];
            if(mission.difficulty < 4){
                difficulty = "easy";
            }
            else if(mission.difficulty < 7){
                difficulty = "medium";
            }
            else difficulty = "hard";
            //append shop Icons
            $("<div>", {
                class: "people " + difficulty,
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
            var footer = $("#mode" + i + " .modal-footer")

            for(var j = 0; j < shop.item.length; j++){
                var x = $("<li>").text(shop.item[j]);
                Game.createBuy(x, shop.item[j]);
                items.append(x);
            }
            if(shop.morty.length) {
                var mort = $("<li>",{
                    html : "<img src='image/" + Data.morty_dex[shop.morty].src + "'> I'm also trying to get rid of this " + shop.morty
                });
                Game.createBuy(mort, shop.morty);
                mort.appendTo(footer);
            }
            body.append(items);
        }
    },
    createBuy: function(element, item){
      element.click(function(){
        console.log("clicked " + item);
        this.remove();
      })

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





