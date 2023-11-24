document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const startButton = document.getElementById('start-button');
    const scoreDisplay = document.getElementById('score');
    const welcomeScreen = document.getElementById('welcome-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const finalScoreDisplay = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-button');
    const returnButton = document.getElementById('return-button');

    let gridSize = 20;
    let tileSize = gameContainer.clientWidth / gridSize;
    let snake;
    let food;
    let direction;
    let score;
    let gameInterval;

    function initializeGame() {
        snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
        food = generateFood();
        direction = 'right';
        score = 0;
        scoreDisplay.textContent = `Score: ${score}`;
        scoreDisplay.style.display = 'block'; // Show the score initially
        clearInterval(gameInterval);
        gameInterval = null;
        drawGame();
    }

    function drawGame() {
        gameContainer.innerHTML = '';

        // Draw food
        const foodElement = createTile(food.x, food.y);
        foodElement.classList.add('food');
        gameContainer.appendChild(foodElement);

        // Draw snake
        snake.forEach(segment => {
            const snakeElement = createTile(segment.x, segment.y);
            snakeElement.classList.add('snake-segment');
            gameContainer.appendChild(snakeElement);
        });
    }

    function createTile(x, y) {
        const tile = document.createElement('div');
        tile.style.width = `${tileSize}px`;
        tile.style.height = `${tileSize}px`;
        tile.style.gridColumn = x;
        tile.style.gridRow = y;
        return tile;
    }

    function generateFood() {
        let foodX, foodY;
        do {
            foodX = Math.floor(Math.random() * gridSize) + 1;
            foodY = Math.floor(Math.random() * gridSize) + 1;
        } while (snake.some(segment => segment.x === foodX && segment.y === foodY));
        return { x: foodX, y: foodY };
    }

    function moveSnake() {
        const head = { ...snake[0] };

        switch (direction) {
            case 'up':
                head.y--;
                break;
            case 'down':
                head.y++;
                break;
            case 'left':
                head.x--;
                break;
            case 'right':
                head.x++;
                break;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreDisplay.textContent = `Score: ${score}`;
            food = generateFood();
        } else {
            snake.pop();
        }

        if (checkCollision()) {
            endGame();
        }

        drawGame();
    }

    function checkCollision() {
        const head = snake[0];
        return (
            head.x < 1 ||
            head.y < 1 ||
            head.x > gridSize ||
            head.y > gridSize ||
            snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
        );
    }

    function endGame() {
        clearInterval(gameInterval);
        gameInterval = null;
        finalScoreDisplay.textContent = `Final Score: ${score}`;
        gameOverScreen.style.display = 'flex';
    }

    startButton.addEventListener('click', () => {
        initializeGame();
        gameInterval = setInterval(moveSnake, 150);
        startButton.style.display = 'none'; // Hide the start button
        scoreDisplay.style.display = 'block'; // Show the score
    });

    restartButton.addEventListener('click', () => {
        gameOverScreen.style.display = 'none';
        initializeGame();
        gameInterval = setInterval(moveSnake, 150);
        scoreDisplay.style.display = 'block'; // Show the score
    });

    returnButton.addEventListener('click', () => {
        window.location.href = "./index.html"; // Replace with the URL of your portfolio
    });

    // Listen for arrow key presses to change direction
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                if (direction !== 'down') direction = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') direction = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') direction = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') direction = 'right';
                break;
        }
    });
});
