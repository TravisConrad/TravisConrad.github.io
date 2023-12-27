// script.js
let wordsOfTheDay = [];
let wordOfTheDay;
const maxGuesses = 6;
let currentGuess = [];
let currentRow = 0;
let currentCell = 0;
let guesses = 0;
let gamesWon = 0;
let gamesPlayed = 0;

// Start the game when the 'Begin' button is clicked
document.getElementById("beginButton").addEventListener("click", function() {
    document.getElementById("landingPage").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";
    initializeGame();
});

document.addEventListener('DOMContentLoaded', () => {
    loadWordBank();
});

function loadWordBank() {
    fetch('wordBank.json')
        .then(response => response.json())
        .then(data => {
            wordsOfTheDay = data;
            initializeGame();
        })
        .catch(error => console.error('Error loading word bank:', error));
}

function displayAlphabet() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const alphabetContainer = document.getElementById("alphabetContainer");
    alphabetContainer.innerHTML = ""; // Clear previous content

    for (let i = 0; i < alphabet.length; i++) {
        let letter = document.createElement("span");
        letter.className = "alphabetLetter";
        letter.textContent = alphabet[i];
        letter.setAttribute('data-letter', alphabet[i]); // Set data attribute for each letter
        alphabetContainer.appendChild(letter);
    }
}

function initializeGame() {
    wordOfTheDay = wordsOfTheDay[Math.floor(Math.random() * wordsOfTheDay.length)];
    currentGuess = [];
    currentRow = 0;
    currentCell = 0;
    guesses = 0;
    document.getElementById("grid").innerHTML = "";
    updateScoreboard();
    displayAlphabet();

    for (let i = 0; i < maxGuesses * 5; i++) {
        let cell = document.createElement("div");
        let letterDiv = document.createElement("div");
        let backDiv = document.createElement("div");

        cell.className = "cell";
        letterDiv.className = "letter";
        backDiv.className = "back";

        cell.appendChild(letterDiv);
        cell.appendChild(backDiv);
        document.getElementById("grid").appendChild(cell);
    }

    // Focus on the grid or another visible element
    document.getElementById("grid").focus();

    // Focus on hidden input and setup event listeners
    let hiddenInput = document.getElementById("hiddenInput");
    hiddenInput.focus();
    hiddenInput.addEventListener("input", function(event) {
        let value = event.target.value.toUpperCase();
        event.target.value = ""; // Clear the input field
        handleInput(value);
    });

    // Handle keydown for special keys (Backspace and Enter)
    document.addEventListener("keydown", function(event) {
        if (event.key === "Backspace" || event.key === "Enter") {
            handleInput(event.key.toUpperCase());
        }
    });
}

function handleInput(value) {
    if (value === "BACKSPACE" && currentGuess.length > 0) {
        currentGuess.pop();
        currentCell--;
        updateGrid(true);
    } else if (value.length === 1 && /^[A-Za-z]$/.test(value) && currentGuess.length < 5) {
        currentGuess.push(value);
        updateGrid();
    } else if (value === "ENTER" && currentGuess.length === 5) {
        checkGuess();
    }
}

function updateGrid(isBackspace = false) {
    let letters = document.querySelectorAll('.cell .letter');
    if (isBackspace) {
        letters[currentCell].innerText = '';
    } else {
        letters[currentCell].innerText = currentGuess[currentGuess.length - 1];
        currentCell++;
    }
}

function checkGuess() {
    let start = currentRow * 5;
    let wordOfTheDayArray = [...wordOfTheDay];
    let isWordGuessedCorrectly = true;

    for (let i = 0; i < 5; i++) {
        let cell = document.querySelectorAll('.cell')[start + i];
        let back = cell.querySelector('.back');
        back.innerText = currentGuess[i];

        if (currentGuess[i] === wordOfTheDay[i]) {
            back.classList.add("correct");
        } else if (wordOfTheDay.includes(currentGuess[i])) {
            back.classList.add("present");
            isWordGuessedCorrectly = false;
        } else {
            back.classList.add("absent");
            isWordGuessedCorrectly = false;
        }
    }

    updateAlphabetTiles();

    // Flip animation for each cell
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            document.querySelectorAll('.cell')[start + i].classList.add("flip");
        }, i * 300);
    }

    // Delayed check for game status
    setTimeout(() => {
        guesses++;
        if (isWordGuessedCorrectly || guesses === maxGuesses) {
            handleGameOver(isWordGuessedCorrectly);
        } else {
            currentRow++;
            currentCell = currentRow * 5;
            currentGuess = [];
        }
    }, 5 * 300 + 500);
}

function updateAlphabetTiles() {
    currentGuess.forEach((letter, index) => {
        let alphabetTile = document.querySelector('.alphabetLetter[data-letter="' + letter + '"]');
        if (alphabetTile) {
            alphabetTile.classList.remove('correct', 'present', 'absent');
            if (letter === wordOfTheDay[index]) {
                alphabetTile.classList.add('correct');
            } else if (wordOfTheDay.includes(letter)) {
                alphabetTile.classList.add('present');
            } else {
                alphabetTile.classList.add('absent');
            }
        }
    });
}

function handleGameOver(isWin) {
    gamesPlayed++;
    if (isWin) {
        gamesWon++;
    }
    updateScoreboard();

    let message = isWin ? "Congratulations! You guessed the word!" : "Game over! The word was " + wordOfTheDay + ".";
    if (confirm(message + " Would you like to play again?")) {
        initializeGame();
    }
}

function updateScoreboard() {
    document.getElementById("gamesWon").textContent = gamesWon;
    document.getElementById("gamesPlayed").textContent = gamesPlayed;
}
