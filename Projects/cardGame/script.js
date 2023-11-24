let balance = 50;
let currentBet = 0;
let originalBet = 0; // Store the original bet
const cards = document.querySelectorAll('.card');
const betButtons = document.querySelectorAll('.bet-btn');
let selectedCardIndex = -1;
let blueCardIndex = -1;
let gameInProgress = false;

// Function to update and display messages
function showMessage(messageText) {
    const messageElement = document.getElementById('message');
    messageElement.innerText = messageText;
}

// Function to update the balance display
function updateBalanceDisplay() {
    const balanceElement = document.getElementById('balance');
    balanceElement.innerText = `Balance: $${balance}`;
}

// Function to highlight the selected bet button
function highlightSelectedBetButton(button) {
    betButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
}

// Randomly assign the blue card
function assignBlueCard() {
    blueCardIndex = Math.floor(Math.random() * 3); // Assuming 3 cards
    resetCardStyles();
}

// Reset card styles
function resetCardStyles() {
    cards.forEach(card => {
        card.classList.remove('selected', 'flipped', 'blue-card', 'red-card');
        card.addEventListener('click', handleCardSelection);
    });
}

// Handle card selection
function handleCardSelection() {
    if (!gameInProgress) {
        selectedCardIndex = Array.from(cards).indexOf(this);
        cards.forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
    }
}

// Handle bet selection
function handleBetSelection(betAmount) {
    if (!gameInProgress) {
        if (betAmount > balance + currentBet) {
            showMessage('Bet amount cannot be more than available balance.');
            return;
        }

        balance += currentBet;
        currentBet = betAmount;
        balance -= currentBet;

        updateBalanceDisplay();
        highlightSelectedBetButton(betButtons[betAmount / 10 - 1]);
    }
}

// Handle bet button click events
betButtons.forEach(button => {
    button.addEventListener('click', () => {
        const betAmount = parseInt(button.getAttribute('data-bet'));
        handleBetSelection(betAmount);
    });
});

// Play game
document.getElementById('play-btn').addEventListener('click', () => {
    if (selectedCardIndex === -1 || currentBet === 0) {
        showMessage('Please select a card and a bet amount.');
        return;
    }

    if (!gameInProgress) {
        gameInProgress = true;

        revealCards();
        if (selectedCardIndex === blueCardIndex) {
            const winnings = currentBet * 3;
            balance += winnings;
            showMessage(`You won $${winnings}`);
        } else {
            showMessage(`You lost $${currentBet}`);
        }
        updateBalanceDisplay();
        checkGameOver();

        betButtons.forEach(button => {
            button.style.pointerEvents = 'none';
        });

        if (balance > 0) {
            document.getElementById('play-again-btn').style.display = 'block';
        } else {
            document.getElementById('play-again-btn').style.display = 'none';
        }
    }
});

// Reveal cards
function revealCards() {
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('flipped');
            if (index === blueCardIndex) {
                card.classList.add('blue-card');
            } else {
                card.classList.add('red-card');
            }
        }, 500 * index);
    });
}

// Check if the game is over
function checkGameOver() {
    if (balance <= 0) {
        showMessage('Game Over, click Restart to try again.');
        document.getElementById('play-again-btn').style.display = 'none';
        document.getElementById('play-btn').disabled = true;
    }
}

// Play again function
document.getElementById('play-again-btn').addEventListener('click', () => {
    resetGame();
});

// Restart game function
document.getElementById('restart-btn').addEventListener('click', () => {
    balance = 50;
    currentBet = 0;
    originalBet = 0;
    gameInProgress = false;
    selectedCardIndex = -1;
    assignBlueCard();
    resetCardStyles();
    updateBalanceDisplay();
    showMessage('');

    document.getElementById('play-btn').disabled = false;

    cards.forEach(card => {
        card.classList.remove('selected');
        card.style.pointerEvents = 'auto';
        card.addEventListener('click', handleCardSelection);
    });

    betButtons.forEach(button => {
        button.style.pointerEvents = 'auto';
        button.classList.remove('selected');
    });

    document.getElementById('play-again-btn').style.display = 'none';
});

// Reset game function
function resetGame() {
    assignBlueCard();
    selectedCardIndex = -1;
    currentBet = 0;
    originalBet = 0;
    gameInProgress = false;
    updateBalanceDisplay();
    showMessage('');

    cards.forEach(card => {
        card.classList.remove('selected');
        card.style.pointerEvents = 'auto';
        card.addEventListener('click', handleCardSelection);
    });

    betButtons.forEach(button => {
        button.style.pointerEvents = 'auto';
        button.classList.remove('selected');
    });

    if (balance > 0) {
        document.getElementById('play-again-btn').style.display = 'block';
    } else {
        document.getElementById('play-again-btn').style.display = 'none';
    }
}

// Initialize game
assignBlueCard();
updateBalanceDisplay();

// Return to portfolio function
document.getElementById('returnToPortfolio').addEventListener('click', function() {
    window.location.href = "./index.html"; // Replace with the URL of your portfolio
});

