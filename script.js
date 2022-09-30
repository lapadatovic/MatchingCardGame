// Audio Class
class AudioController {
    constructor(){
        this.bgMusic = new Audio('Assets/Audio/creepy.mp3');
        this.flipSound = new Audio('Assets/Audio/flip.wav');
        this.matchSound = new Audio('Assets/Audio/match.wav');
        this.victorySound = new Audio('Assets/Audio/victory.wav');
        this.gameOverSound = new  Audio('Assets/Audio/gameover.wav');
        this.bgMusic.volume = 0;
        this.bgMusic.loop = true;
    }

    startMusic(){
        this.bgMusic.play();
    }
    
    stopMusic(){
        // Cuz we cant stop music in JS, we have to
        // pause it, and set time to 0;
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    // Flip card sound
    flip(){
        this.flipSound.play();
    }
    // Match card sound
    match(){
        this.matchSound.play();
    }
    // Victory sound
    victory() {
        this.stopMusic();
        this.victorySound.play();
    }
    // Game over sound
    gameOver(){
        this.startMusic();
        this.gameOverSound.play()
    }
    
}

class MixOrMatch{
    constructor(totalTime, cards){
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();
        this.totalTime = totalTime;
        this.cardsArray = cards;
        this.timeReamaining = totalTime;
    }
    startGame(){
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeReamaining = this.totalTime;
        this.matchedCards = [];
        this.busy = true;

        // Create timeout
        setTimeout(()=>{
            this.audioController.startMusic();
            this.shuffleCards();
            this.countDown = this.startCountDown();
            this.busy = false;
        },500);

        this.hideCards();
        this.timer.innerText = this.timeReamaining;
        this.ticker.innerText = this.totalClicks;

    }

    hideCards(){
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched')
        })
    }

    flipCard(card){
        if(this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            // if statement
            if(this.cardToCheck){
                // check for match
                this.checkForCardMatch(card);
            }else {
                this.cardToCheck = card;
            }

        }
    }

    checkForCardMatch(card){
        if(this.getCardType(card) === this.getCardType(this.cardToCheck)){
            //match
            this.cardMatch(card, this.cardToCheck);
        }else{
            this.cardMisMatch(card, this.cardToCheck);
        }

        this.cardToCheck = null;
    }
    getCardType(card){
        return card.getElementsByClassName('card-value')[0].src;
    }

    cardMatch(card1, card2){
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched')
        card2.classList.add('matched')
        this.audioController.match();
        if(this.matchedCards.length === this.cardsArray.length){
            this.victory();
        }
    }

    cardMisMatch(card1, card2){
        this.busy = true;
        setTimeout(()=>{
            card1.classList.remove('visible')
            card2.classList.remove('visible')
            this.busy = false;
        },500)
    }

    shuffleCards(){
        // We are using Fisher-Yates-Shuffle-Algorithm
        for(let i = this.cardsArray.length - 1; i > 0; i--){
            let randIndex = Math.floor(Math.random() * (i + 1))
            this.cardsArray[randIndex].style.order = i;
            this.cardsArray[i].style.order = randIndex;
        }
    }

    canFlipCard(card){
        // 3 scenarios
        // 1st - if its not busy
        // 2nd - if the card we flip its not in a matchedCards array
        // 3rd - if card we flip its not cardToCheck  
        return (!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck)
    }

    startCountDown(){
        return setInterval(() =>{
            this.timeReamaining--;
            this.timer.innerText = this.timeReamaining;
            if(this.timeReamaining === 0){
                this.gameOver();
            }
        },1000) 
    }

    victory() {
        clearInterval(this.countDown);
        this.audioController.victory();
        document.getElementById('victory-text').classList.add('visible');
    }

    gameOver(){
        clearInterval(this.countDown);
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
    }
}

// ready Function 
function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MixOrMatch(100, cards);
    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });

    cards.forEach(card => {
        card.addEventListener('click', () =>{
            game.flipCard(card);
        });
    });
}

if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ready())
}else{
    ready();
}



// new MixOrMatch(100, cardsArray);