/**
 * Created by Mad Martigan on 1/28/2016.
 */
$(document).ready(function() {
    // initialize game creating the board game with a randomly generated cardset or preset array
    //randomMorty function returns a randomized array of numbers and their duplicates
    //accepts an integer between 1 - 9;
    Data.mortyInit = Game.randomMorty(Data.totalCards/2);
    //
    Game.createMortyMatch(Data.mortyInit);
    //create a click event on all card backs
    //Game.btnBackMaker();
    //create reset btn
    Game.resetBtn();
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
            "<div class='back' onclick='!Data.second_card_clicked ? Game.card_clicked(this) : $(this).parent().effect(\"shake\")' >" +
            "<img src='image/" + back + "' alt='cardback'>" +
            "</div>"
        });
        this.image = "image/morty" + imgNum + ".png";
    }
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
            Data.games_played += Data.attempts > 0 ? 1:0;
            Data.matches = 0;
            Game.reset_stats();
            Game.resetDataFlags();
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
            Game.compareCards(targ);
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
            Game.display_stats();
            setTimeout(function(){
                $(targ).removeClass("flip");
                $(Data.first_card_clicked).removeClass("flip");
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
// dan start
//   Define function that creates the Morty Match game

        //calls a function that adds cards to the board with number array input and cardback image parameters;


    //Define function that adds cards to game board taking in a randomized number array input and cardback image input

        //get total number of cards to make

        //loop through the array

                //pops an item from from the array

                //creates a new card object using the img from the pop and cardbackimg as parameters

                //appends the card to the #game-area


    //creates a function that takes in a number and out puts out a random array  between 1-9; ex: input:3 -> [1,1,2,2,3,3] --> [1,2,1,3,2,1,3]

        //create a default var value of 9;

        // if check input is between 1 - 9;

            //assign card to input


        //create an empty array for pic index

        //create a loop depending on card number

            //push the number  an array

            //push the number  to an array again


        //create another array to hold a randomization of previous array

        //use the first created array as a length check

        //loop through the initial length

            //update the length as it grows shorter

            //create a random number depending on shorter length

            //take out a random item from the first array making it shorter using splice and the random number

            //push the random item that was spliced to the randomized array;


        //check out the random array in console

        //return the randomized array for dynamic card creation


}

//dan end



