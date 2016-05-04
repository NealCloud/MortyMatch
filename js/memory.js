/**
 * This is the base url of our app and where all of our sounds reside
 * @type {string}
 */
var baseUrl = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/19554/';

/**
 * The global game variable
 * @type {Cards}
 */
var game;

/**
 * Flags for the game to check against
 * @type {{cards_flipped: number, cards_matched: number, matching: boolean, timer: number}}
 */
var flags = {
    cards_flipped: 0,
    cards_matched: 0,
    matching: false,
    timer: 0
};

/**
 * Our sound player
 * @type {{play}}
 */
var sound = (function() {
    /**
     * Temporary storage
     * @type {Audio}
     */
    var audio;

    /**
     * A list of available sound bytes
     * @type {{good: string[], bad: string[], win: string[]}}
     */
    var bank = {
        good: ['woohoo.mp3', 'youdidit.mp3', 'yeah.mp3'],
        bad: ['uhoh.mp3', 'ohno.mp3'],
        win: ['youwon.mp3']
    };

    /**
     * One of the three banks above
     */
    var selBank;

    /**
     * Returns a random number using a specific bank
     * @access private
     * @returns {number}
     */
    function random() {
        return Math.floor(Math.random() * selBank.length);
    }

    /**
     * Returns a random sound file from the sound bank
     * @param type
     * @returns {*}
     */
    function getSound(type) {
        var idx = random();
        return typeof selBank[idx] != 'undefined' ? selBank[idx] : getSound(type);
    }

    return {

        /**
         * Plays a random file from a specific type
         * @param {string} type
         * @return void
         */
        play: function(type) {
            selBank = bank[type];

            audio = new Audio(baseUrl + getSound());
            audio.play();
        }
    }
})();

/**
 * The card object. Holds all functionality of a card
 * @param name
 * @constructor
 */
var Card = function(name) {
    this.$el = null;
    this.path = baseUrl + 'card-' + name + '.jpg';

    var resetFlip = function(a) {
        sound.play(a);
        $('.card').removeClass('matching');
        flags.cards_flipped = 0;
        flags.matching = false;
        clearTimeout(flags.timer);
    };

    this.flip = function($card) {

        if ($card.hasClass('matched') || $card.hasClass('matching') || flags.cards_flipped > 1) {
            return false;
        }

        flags.cards_flipped++;
        $card.addClass('flipped matching');

        switch (flags.cards_flipped) {
            case 1:
                flags.matching = $card.find('.back img').attr('src');
                break;
            case 2:
                if (flags.matching == $card.find('.back img').attr('src')) {
                    $card.addClass('matched flipped');
                    $('img[src="' + flags.matching + '"]').closest('.card').addClass('matched');
                    flags.cards_matched = flags.cards_matched + 2;

                    if ($('.card').length == flags.cards_matched) {
                        resetFlip('win');
                        $('.header').addClass('modal');
                    } else {
                        resetFlip('good');
                    }
                } else {
                    flags.timer = setTimeout(function() {

                        $('.card.flipped:not(.matched)').removeClass('flipped');
                        resetFlip('bad');
                    }, 400);
                }
                break;
        }
    };

    this.render = function() {
        var self = this;
        self.$el = $($('#cardTemplate').html());

        var $card = self.$el.find('.card');

        $card.addClass('card-' + name);

        $card.find('.back').append('<img src="' + self.path + '" alt="" />');
        $card.find('.front').append('<img src="' + baseUrl + 'card-back.jpg" alt="" />');

        // Add the click handler for flipping the card over
        $card.on('click', function(e) {
            e.preventDefault();
            self.flip($card);
        });

        return this.$el;
    };

};

var Cards = function() {

    // Where we're going to add the images
    this.$target = $('.game');

    this.images = [
        'luigi',
        '1up',
        'yoshi',
        'mario',
        'boo',
        'flower',
        'toad',
        'goomba'
    ];

    // The amount of times we want our array to shuffle
    this.shuffleCount = 3;

    /**
     * Shuffles an array randomly
     * @param {Array} arr
     * @return Array
     */
    this.shuffle = function(arr) {
        var m = arr.length,
            t, i;
        // While there remain elements to shuffle
        while (m) {
            // pick a remaining element
            i = Math.floor(Math.random() * m--);

            // and swap it with the current element
            t = arr[m];
            arr[m] = arr[i];
            arr[i] = t;
        }

        return arr;
    };

    this.start = function() {

        this.$target.empty();

        // start with an empty array
        var _images = [];

        // copy the cards into the array twice (we need one of each to match)
        _images = _images.concat(this.images).concat(this.images);

        // here we shuffle the cards a few times to randomize them each time
        for (var i = 0; i < this.shuffleCount; i++) {
            _images = this.shuffle(_images);
        }

        // Now we walk through our randomized array of images to add them
        // to the page
        for (var n = 0; n < _images.length; n++) {
            var card = new Card(_images[n]);
            var $card = card.render();

            $card.hide();
            this.$target.append($card);
            $card.delay(250 + ((n + 1) * 5)).fadeIn(100);
        }
    };

    this.reset = function() {
        flags = {
            cards_flipped: 0,
            cards_matched: 0,
            matching: false,
            timer: 0
        };
        game.start();
        $('.header').removeClass('modal');
    }
};

$(document).ready(function() {
    game = new Cards();
    game.start();
});