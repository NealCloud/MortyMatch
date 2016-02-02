/**
 * Created by Mad Martigan on 2/2/2016.
 */
Card = {
    //creating cards dynamically
    createMortyMatch : function(cards) {
        //var cards = parseInt($("#cardNumber").val());
        if(cards < 9 && cards > 1){
            console.log(typeof cards, cards);
            Card.dynamicCardCreate(Card.randomCardArray(cards, Data.item_list));
        }
        else{
            console.log(Data.totalCards/2);
            //calls for a dynamic card creation  * use the randomCardArray function to create such an array
            Card.dynamicCardCreate(Card.randomCardArray(Data.totalCards / 2, Card.takefromArray(9,Data.item_list)));
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
    takefromArray:function(num, pics){
        var picsalter = [];
        for(var i = 0; i < pics.length; i++){
            picsalter.push(pics[i])
        }
        console.log(picsalter);
        var piclist = [];
        var picslen = num;
        for(var i = 0; i < picslen; i++){
            var curlen = picsalter.length;
            var random = Math.floor(Math.random() * curlen);
            var temp = ((picsalter.splice(random, 1)));
            piclist.push(temp[0]);
        }
        return piclist;
    },
    //take in an array of images doubles and randomizes them;
    randomCardArray: function(num, items){
        console.log("randomCardArray array:", num, items);
        var pics = [];
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

}