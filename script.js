// Audio Class
class AudioController {
    constructor(){
        this.bgMusic = new Audio('Assets/Audio/creepy.mp3');
        this.flipSound = new Audio('Assets/Audio/flip.wav');
        this.matchSound = new Audio('Assets/Audio/match.wav');
        this.victorySound = new Audio('Assets/Audio/victory.wav');
        this.gameOverSound = new  Audio('Assets/Audio/gameover.wav');
        this.bgMusic.volume = 0.1;
        this.bgMusic.loop = true;
    }

    startMusic(){
        this.bgMusic.play();
    }
    
    stopMusic(){
        // Cuz we cant stop music in JS, we have to
        // pause it, and set time to 0;
        this.bgMusic.pasuse();
        this.bgMusic.currentTime = 0;
    }
    // Flip card sound
    flip(){
        this.flipSound.play();
    }
    // Match card sound
    matchSound(){
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
        this.totalTime = totalTime;
        this.cardsArray = cards;
        this.timeReamaining = totalTime;
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();
        
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
            this.countdown = this.startCountdown();
            this.busy = false
        },500)

    }
    flipCard(card){
        if(this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            // if statement

        }
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
        return true;
        // return (!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck)
        

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
            // let audioController = new AudioController();
            // audioController.startMusic();
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