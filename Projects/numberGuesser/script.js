// Generate a random number between 1 and 100
const randomNumber = Math.floor(Math.random() * 100) + 1;

// Get HTML elements
const userGuessInput = document.getElementById("userGuess");
const guessButton = document.getElementById("guessButton");
const message = document.getElementById("message");
const attempts = document.getElementById("attempts");

let attemptsCount = 0;

// Function to check the user's guess
function checkGuess() {
    const userGuess = parseInt(userGuessInput.value);

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        message.textContent = "Please enter a valid number between 1 and 100.";
        return;
    }

    attemptsCount++;

    if (userGuess === randomNumber) {
        message.textContent = `Congratulations! You guessed the number ${randomNumber} in ${attemptsCount} attempts.`;
        guessButton.disabled = true;
    } else if (userGuess < randomNumber) {
        message.textContent = "Try higher!";
    } else {
        message.textContent = "Try lower!";
    }

    attempts.textContent = `Attempts: ${attemptsCount}`;
}

// Event listener for the guess button
guessButton.addEventListener("click", checkGuess);

// Reset the game
function resetGame() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    userGuessInput.value = "";
    message.textContent = "";
    attempts.textContent = "";
    attemptsCount = 0;
    guessButton.disabled = false;
}

