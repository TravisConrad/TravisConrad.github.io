// Initialize the water level variable
let waterLevel = 0;
const waterRiseRate = 0.1; // Rate of water rise (smaller values make it slower)
let draining = false; // Track whether draining is active
let bubblesEnabled = false; // Track whether bubble creation is enabled
const bubbleCreationThreshold = window.innerHeight * 0.25; // Set the threshold to 25% of the page height
const maxBubbles = 5; // Maximum number of bubbles
const activeBubbles = []; // Array to track active bubbles

// Function to create and position a raindrop with random size and color
function createRaindrop() {
    const raindrop = document.createElement("div");
    raindrop.classList.add("raindrop");
    document.querySelector(".rain-container").appendChild(raindrop);

    const randomX = Math.random() * window.innerWidth;
    const randomWidth = Math.random() * (5 - 1) + 1; // Random width between 1px and 5px
    const randomHeight = Math.random() * (20 - 10) + 10; // Random height between 10px and 20px
    const randomColor = getRandomColor(); // Generate a random color

    raindrop.style.left = `${randomX}px`;
    raindrop.style.width = `${randomWidth}px`;
    raindrop.style.height = `${randomHeight}px`;
    raindrop.style.backgroundColor = randomColor;

    raindrop.addEventListener("animationiteration", () => {
        if (!draining) {
            waterLevel += randomHeight * waterRiseRate;
            if (waterLevel >= bubbleCreationThreshold) {
                bubblesEnabled = true;
            }
        }
        if (waterLevel >= window.innerHeight) {
            waterLevel = window.innerHeight;
        }
        const line = document.querySelector(".line");
        line.style.height = `${waterLevel}px`;
        raindrop.remove();
        if (bubblesEnabled) {
            createRandomBubble();
        }
    });
}

function getRandomColor() {
    const colors = ["lightblue", "lightblue", "lightblue", "lightgray", "lightgray"];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

function toggleDrain() {
    const plug = document.querySelector('.plug');
    const line = document.querySelector('.line');
    if (!draining) {
        draining = true;
        bubblesEnabled = false;
        plug.style.transform = 'translateY(60px)';
        const drainInterval = setInterval(() => {
            if (waterLevel > 0) {
                waterLevel -= 5;
                line.style.height = `${waterLevel}px`;
                for (let i = activeBubbles.length - 1; i >= 0; i--) {
                    const bubble = activeBubbles[i];
                    const bubbleBottom = parseFloat(getComputedStyle(bubble).bottom.replace('px', ''));
                    if (bubbleBottom >= waterLevel) {
                        bubble.remove();
                        activeBubbles.splice(i, 1);
                    }
                }
            } else {
                clearInterval(drainInterval);
                plug.style.transform = 'translateY(0)';
                draining = false;
            }
        }, 100);
    } else {
        clearInterval(drainInterval);
        plug.style.transform = 'translateY(0)';
        draining = false;
        if (waterLevel < bubbleCreationThreshold) {
            bubblesEnabled = true;
        }
    }
}

function createRandomBubble() {
    if (bubblesEnabled && activeBubbles.length < maxBubbles) {
        const bubble = document.createElement('img');
        bubble.src = './images/bubble.png';
        bubble.classList.add('random-bubble');
        document.body.appendChild(bubble);

        const size = Math.random() * 60 + 10;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;

        const maxBubbleHeight = Math.min(window.innerHeight, waterLevel);
        const randomX = Math.random() * window.innerWidth;
        bubble.style.left = `${randomX}px`;
        bubble.style.bottom = '0px';

        const duration = Math.random() * (maxBubbleHeight / 100 * 5000) + 2000;

        bubble.animate([
            { bottom: '0px' },
            { bottom: `${maxBubbleHeight}px` }
        ], { duration: duration });

        activeBubbles.push(bubble);

        setTimeout(() => {
            if (bubblesEnabled) {
                bubble.remove();
                activeBubbles.splice(activeBubbles.indexOf(bubble), 1);
                createRandomBubble();
            }
        }, duration);
    }
}

setInterval(createRaindrop, 100);

const drain = document.querySelector('.drain');
drain.addEventListener('click', toggleDrain);

// Added functionality for card flipping on click (suitable for mobile devices)
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('is-flipped');
    });
});
