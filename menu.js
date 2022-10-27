// game selectors
const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    movesPlayer1: document.querySelector('.moves-player1'),
    movesPlayer2: document.querySelector('.moves-player2'),
    matchesPlayer1: document.querySelector('.matches-player1'),
    matchesPlayer2: document.querySelector('.matches-player2'),
    winsPlayer1: document.querySelector('.wins-player1'),
    winsPlayer2: document.querySelector('.wins-player2'),
    namePlayer1: document.querySelector('.player1'),
    namePlayer2: document.querySelector('.player2'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('.button-start'),
    win: document.querySelector('.win'),
    singlePlayer: document.querySelector('.button-single-player'),
    multiPlayer: document.querySelector('.button-multi-player'),

}

// game variables
const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null,
    turn: 0,
    totalMovesPlayer1: 0,
    totalMovesPlayer2: 0,
    matchesFoundPlayer1: 0,
    matchesFoundPlayer2: 0,
    winsPlayer1: 0,
    winsPlayer2: 0,
    namePlayer1: "",
    namePlayer2: "",
}

//game dimensions
const game = {
    height: 0,
    lenght: 4,
}

        // FUNCTIONS TO GENERATE GAME BOARD
// function that picks random items from an array
function pickRandom  (array, items) {
    let clonedArray = [...array]
    let randomPicks = []
    for (let index = 0; index < items; index++) {
        let randomIndex = Math.floor(Math.random() * clonedArray.length)
        
        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
    }
    return randomPicks
}

// function that shuffle the cards
function shuffle ([...array]) {
    let clonedArray = [...array]
    for (let index = clonedArray.length - 1; index > 0; index--) {
        let randomIndex = Math.floor(Math.random() * (index + 1))
        let original = clonedArray[index]
        clonedArray[index] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }
    return clonedArray
}

// function that generates the cards 
function generateGame () {
    const emojis = ['🥔', '🍒', '🥑', '🌽', '🥕', '🍇', '🍉', '🍌', '🥭', '🍍'];
    let picks = pickRandom(emojis, (game.height * game.lenght) / 2);
    let items = shuffle([...picks, ...picks]);
    console.log(items);
    let cards = `
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
    `
    selectors.board.style.gridTemplateColumns = `repeat(${game.lenght}, auto)`
    selectors.board.innerHTML = cards
}

            // FUNCTIONS FOR GAME FUNCTIONALITY
// function that flips the cards, checks for matches and display win
function flipCardSingleplayer (card) {
    state.flippedCards++
    if (!state.gameStarted) {
        startGameSingleplayer()
    }
    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }
    if (state.flippedCards === 2) {
            state.totalFlips++
            const flippedCards = document.querySelectorAll('.flipped:not(.matched)')
            if (flippedCards[0].innerText === flippedCards[1].innerText) {
                flippedCards[0].classList.add('matched')
                flippedCards[1].classList.add('matched')
            }
    }

    // If there are no more cards that we can flip, we won the game
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        state.gameStarted = false;
        state.win = 1;
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped')
            selectors.win.innerHTML = `
                <span class="win-text">
                    You won!<br />
                    with <span class="highlight">${state.totalFlips}</span> moves<br />
                    under <span class="highlight">${state.totalTime}</span> seconds
                    <br />
                    <button class="col-6 btn btn-outline-dark my-3 button-restart">Restart</button>
                </span>
            `
            clearInterval(state.loop)
        }, 2000)
    }
}

// function that flips the cards, checks for matches and display win Multiplayer mode
function flipCardMultiplayer (card) {
    state.flippedCards++
    if (!state.gameStarted) {
        startGameMultiplayer()
    }
    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }
    if (state.flippedCards === 2) {
        let flippedCards = document.querySelectorAll('.flipped:not(.matched)')
        if ( state.turn  % 2 == 0) {
            state.totalMovesPlayer1++;
            state.turn++;
            document.querySelector(".stats-player2").classList.add("highlight-player");
            document.querySelector(".stats-player1").classList.remove("highlight-player");
            if (flippedCards[0].innerText === flippedCards[1].innerText) {
                flippedCards[0].classList.add('matched');
                flippedCards[1].classList.add('matched');
                state.matchesFoundPlayer1++;
            }
        } else {
            state.totalMovesPlayer2++;
            state.turn++;
            document.querySelector(".stats-player1").classList.add("highlight-player");
            document.querySelector(".stats-player2").classList.remove("highlight-player");
            if (flippedCards[0].innerText === flippedCards[1].innerText) {
                flippedCards[0].classList.add('matched');
                flippedCards[1].classList.add('matched');
                state.matchesFoundPlayer2++;
            }
        }
    }

    // If there are no more cards that we can flip, we won the game
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
         setTimeout(() => {
            selectors.boardContainer.classList.add('flipped')
            if (state.matchesFoundPlayer1 > state.matchesFoundPlayer2) {
                state.winsPlayer1++;
                selectors.winsPlayer1.innerHTML = `Wins: ${state.winsPlayer1}`
                selectors.win.innerHTML = `
                <span class="win-text">
                    ${state.namePlayer1} won!<br />
                    with <span class="highlight">${state.matchesFoundPlayer1}</span> matches found <br />
                    <button class="col-6 btn btn-outline-dark my-3 button-restart">Restart</button>
                </span>
            `
            }
            if (state.matchesFoundPlayer2 > state.matchesFoundPlayer1) {
                state.winsPlayer2++;
                selectors.winsPlayer2.innerHTML = `Wins: ${state.winsPlayer1}`
                selectors.win.innerHTML = `
                <span class="win-text">
                ${state.namePlayer2} won!<br />
                    with <span class="highlight">${state.matchesFoundPlayer2}</span> matches found <br />
                    <button class="col-6 btn btn-outline-dark my-3 button-restart">Restart</button>
                </span>
            `
            }
            if (state.matchesFoundPlayer2 == state.matchesFoundPlayer1) {
                selectors.win.innerHTML = `
                <span class="win-text">
                    Draw!<br />
                    with <span class="highlight">${state.matchesFoundPlayer2}</span> matches found by each player <br />
                    <button class="col-6 btn btn-outline-dark my-3 button-restart">Restart</button>
                </span> 
            `
            }
        }, 2000)
    }
}

//function that flips back the cards when there is no match
function flipBackCards () {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })
    state.flippedCards = 0
}

//function that reset cards on reset button
function resetCards () {
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('matched')
    })
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('flipped')
    })
    state.flippedCards = 0
}


// function that starts the game SYNGLEPLAYER mode
function startGameSingleplayer () {
    state.gameStarted = true
    state.loop = setInterval(() => {
        state.totalTime++
        selectors.moves.innerText = `Moves: ${state.totalFlips}`
        selectors.timer.innerText = `Time: ${state.totalTime} sec`
    }, 1000)
}

// function that starts the game MULTYPLAYER mode
function startGameMultiplayer () {
    state.gameStarted = true
    state.loop = setInterval(() => {
        selectors.movesPlayer1.innerText = `Moves: ${state.totalMovesPlayer1}`
        selectors.movesPlayer2.innerText = `Moves: ${state.totalMovesPlayer2}`
        selectors.matchesPlayer1.innerText = `Matches: ${state.matchesFoundPlayer1}`
        selectors.matchesPlayer2.innerText = `Matches: ${state.matchesFoundPlayer2}`
    }, 1000)

}

// function to attach event listener singleplayer
function attachEventListenersSingleplayer () {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement
        if (eventTarget.className.includes('button-restart')) {
            restartGame();
        }
        if (eventTarget.className.includes('button-start') && !eventTarget.className.includes('disabled')){
            startGameSingleplayer();
        }
        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCardSingleplayer(eventParent)
        }
        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped') && state.flippedCards > 2) {
            flipBackCards();
            flipCardSingleplayer(eventParent);
        }
    })
}

// function to attach event listener multiplayer
function attachEventListenersMultiplayer () {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement
        if (eventTarget.className.includes('button-restart')) {
            restartGame();
        }
        if (eventTarget.className.includes('button-start') && !eventTarget.className.includes('disabled')){
            startGameMultiplayer();
        }
        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCardMultiplayer(eventParent)
        }
        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped') && state.flippedCards > 2) {
            flipBackCards();
            flipCardSingleplayer(eventParent);
        }
    })
}

        // FUNCTIONS FOR BUTTONS ONCLICK
//function that gets called on Main Menu button
function mainMenu() {
    location.reload();
}

// function that gets called on Reset button
function restartGame(){
    document.querySelector(".stats-player1").classList.add("highlight-player");
    selectors.boardContainer.classList.remove('flipped');
    generateGame();
    state.totalFlips= 0
    state.totalTime= 0
    state.turn= 0
    state.totalMovesPlayer1= 0
    state.totalMovesPlayer2= 0
    state.matchesFoundPlayer1= 0
    state.matchesFoundPlayer2= 0
    selectors.moves.innerText = `Moves: 0`
    selectors.timer.innerText = `Time: 0 sec`
    selectors.movesPlayer1.innerText = `Moves: ${state.totalMovesPlayer1}`
    selectors.movesPlayer2.innerText = `Moves: ${state.totalMovesPlayer2}`
    selectors.matchesPlayer1.innerText = `Matches: ${state.matchesFoundPlayer1}`
    selectors.matchesPlayer2.innerText = `Matches: ${state.matchesFoundPlayer2}`
 }

 // function that gets called on size buttons to set game size 
function setGameSize() {
    if (event.target == document.querySelector(".button3x4")) {
        game.height = 3;
    } 
    if (event.target == document.querySelector(".button4x4")){
        game.height = 4;
    }
    if (event.target == document.querySelector(".button2x4")){
        game.height = 2;
    } 
    document.querySelector(".game-size").classList.add("hidden");
    document.querySelector(".button-single-player").classList.remove("hidden");
    document.querySelector(".button-multi-player").classList.remove("hidden");
    console.log(game.height, game.lenght);
    return game.height
}

// function that gets called when single-player mode is selected
function buttonSingleplayer() {
    document.querySelector(".button-multi-player").classList.add("hidden");
    document.querySelector(".button-single-player").classList.add("hidden");
    document.querySelector(".instructions-single").classList.remove("hidden");   
}

// function that gets called when single-player game is started
function buttonStartSingleplayer() {
    document.querySelector(".instructions-single").classList.add("hidden");
    document.querySelector(".board-container").classList.remove("hidden");
    document.querySelector(".controls-single").classList.remove("hidden");
    generateGame();
    attachEventListenersSingleplayer();
}

// function that gets called when multi-player mode is selected
function buttonMultiplayer() {
    document.querySelector(".button-multi-player").classList.add("hidden");
    document.querySelector(".button-single-player").classList.add("hidden");
    document.querySelector(".instructions-multi").classList.remove("hidden");
    document.querySelector(".players-inputs").classList.remove("hidden");
}

// function that gets called when multi-player game is started
function buttonStartMultiplayer() {
    let inputPlayer1 = document.querySelector("#name-player1")
    let inputPlayer2 = document.querySelector("#name-player2")
   
    if (inputPlayer1.value.lenght > 0) {
        state.namePlayer1 = inputPlayer1.value;
    } else {
        state.namePlayer1 = "Player 1"
    }

    if (inputPlayer2.value.lenght > 0) {
        state.namePlayer2 = inputPlayer2.value;
    } else {
        state.namePlayer2 = "Player 2"
    }
    document.querySelector(".stats-player1").classList.add("highlight-player");
    selectors.namePlayer1.innerHTML = state.namePlayer1;
    selectors.namePlayer2.innerHTML = state.namePlayer2;
    console.log(state.namePlayer1);
    document.querySelector(".instructions-multi").classList.add("hidden");
    document.querySelector(".players-inputs").classList.add("hidden");
    document.querySelector(".board-container").classList.remove("hidden");
    document.querySelector(".controls-multi").classList.remove("hidden");
    generateGame();
    attachEventListenersMultiplayer();
}
