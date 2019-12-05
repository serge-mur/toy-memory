let CardTypes = [
    { name: "card1", image: "img/card_1.jpg" },
    { name: "card2", image: "img/card_2.jpg" },
    { name: "card3", image: "img/card_3.png" },
    // { name: "card4", image: "img/card_4.jpg" },
    // { name: "card5", image: "img/card_5.jpg" },
    // { name: "card6", image: "img/card_6.jpg" },
    
    ];

let shuffleCards = () => {
    let cards = CardTypes.concat(JSON.parse(JSON.stringify(CardTypes))) //clone deep
    return cards.sort(function(a, b){return 0.5 - Math.random()}) //shuffle
};

new Vue({
    el: "#app",

    data: {
        showSplash: false,
        cards: [],
        started: false,
        startTime: 0,
        turns: 0,
        flipBackTimer: null,
        timer: null,
        time: "--:--",
        score: 0
    },


    methods: {
        resetGame() {
            this.showSplash = false;
            let cards = shuffleCards();
            this.turns = 0;
            this.score = 0;
            this.started = false;
            this.startTime = 0;

            cards.forEach(card => {
                card.flipped = false
                card.found = false                        
            })

            this.cards = cards;
        },

        flippedCards() {
            return this.cards.filter(card => card.flipped);
        },

        sameFlippedCard() {
            let flippedCards = this.flippedCards();
            if (flippedCards.length == 2) {
                if (flippedCards[0].name == flippedCards[1].name)
                    return true;
            }
        },

        setCardFounds() {

            this.cards.forEach(card => {
                if (card.flipped)
                    card.found = true;                     
            })

        },

        checkAllFound() {
            let foundCards = this.cards.filter(card => card.found);

            if (foundCards.length == this.cards.length)
                return true;
        },

        startGame() {
            this.started = true;
            this.startTime = moment();

            this.timer = setInterval(() => {
                this.time = moment(moment().diff(this.startTime)).format("mm:ss");
            }, 1000);
        },

        finishGame() {
            this.started = false;
            clearInterval(this.timer);
            let score = 1000 - (moment().diff(this.startTime, 'seconds') - CardTypes.length * 5) * 3 - (this.turns - CardTypes.length) * 5;
            this.score = Math.max(score, 0);
            this.showSplash = true;
        },

        flipCard(card) {
            if (card.found || card.flipped) return;

            if (!this.started) {
                this.startGame();
            }

            let flipCount = this.flippedCards().length;
            if (flipCount == 0) {
                card.flipped = !card.flipped;
            } else
                if (flipCount == 1) {
                    card.flipped = !card.flipped;
                    this.turns += 1;

                    if (this.sameFlippedCard()) {
                        // Match!
                        this.flipBackTimer = setTimeout(() => {
                            this.clearFlipBackTimer();
                            this.setCardFounds();
                            this.clearFlips();

                            if (this.checkAllFound()) {
                                this.finishGame();
                            }

                        }, 200);
                    } else {
                        // Wrong match
                        this.flipBackTimer = setTimeout(() => {
                            this.clearFlipBackTimer();
                            this.clearFlips();
                        }, 1000);
                    }
                }
        },

        clearFlips() {
            this.cards.map(card => card.flipped = false);
        },


        clearFlipBackTimer() {
            clearTimeout(this.flipBackTimer);
            this.flipBackTimer = null;
        }
    },


    created() {
        this.resetGame();
    }
});