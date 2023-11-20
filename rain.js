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

    // Event listener for when the raindrop animation iterates
    raindrop.addEventListener("animationiteration", () => {
        if (!draining) {
            waterLevel += randomHeight * waterRiseRate;

            // Check if water level is above the threshold
            if (waterLevel >= bubbleCreationThreshold) {
                bubblesEnabled = true;
            }
        }

        // Limit water level to the top of the page
        if (waterLevel >= window.innerHeight) {
            waterLevel = window.innerHeight;
        }

        // Update the height of the line (water level)
        const line = document.querySelector(".line");
        line.style.height = `${waterLevel}px`;

        raindrop.remove(); // Remove the raindrop after it falls

        // Check if bubble creation is enabled
        if (bubblesEnabled) {
            createRandomBubble();
        }
    });
}

// Function to generate a random light blue or grey color
function getRandomColor() {
    const colors = ["lightblue", "lightblue", "lightblue", "lightgray", "lightgray"];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

// Function to toggle the drain plug and control water draining
function toggleDrain() {
    const plug = document.querySelector('.plug');
    const line = document.querySelector('.line');

    if (!draining) {
        // Start draining
        draining = true;
        bubblesEnabled = false; // Stop bubble creation
        plug.style.transform = 'translateY(60px)'; // Move the plug down

        const drainInterval = setInterval(() => {
            if (waterLevel > 0) {
                waterLevel -= 5; // Adjust the drainage rate
                line.style.height = `${waterLevel}px`;

                // Remove bubbles as water level decreases
                for (let i = activeBubbles.length - 1; i >= 0; i--) {
                    const bubble = activeBubbles[i];
                    const bubbleBottom = parseFloat(getComputedStyle(bubble).bottom.replace('px', ''));
                    if (bubbleBottom >= waterLevel) {
                        bubble.remove();
                        activeBubbles.splice(i, 1);
                    }
                }
            } else {
                clearInterval(drainInterval); // Stop draining when water level is 0
                plug.style.transform = 'translateY(0)'; // Move the plug back
                draining = false;
            }
        }, 100); // Adjust the interval as needed
    } else {
        // Stop draining
        clearInterval(drainInterval);
        plug.style.transform = 'translateY(0)'; // Move the plug back
        draining = false;
        if (waterLevel < bubbleCreationThreshold) {
            bubblesEnabled = true; // Resume bubble creation if water level is below the threshold
        }
    }
}

// Function to create random bubbles
function createRandomBubble() {
    if (bubblesEnabled && activeBubbles.length < maxBubbles) {
        const bubble = document.createElement('img');
        bubble.src = './images/bubble.png';
        bubble.classList.add('random-bubble');
        document.body.appendChild(bubble);

        const size = Math.random() * 60 + 10; // Random size between 10px and 70px
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;

        const maxBubbleHeight = Math.min(window.innerHeight, waterLevel); // Bubble should not go beyond water level
        const randomX = Math.random() * window.innerWidth;
        bubble.style.left = `${randomX}px`;
        bubble.style.bottom = '0px'; // Start bubbles at the bottom

        const duration = Math.random() * (maxBubbleHeight / 100 * 5000) + 2000; // Random duration based on water level

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

// Create more raindrops at shorter intervals (adjust the interval as needed)
setInterval(createRaindrop, 100); // Shorter interval for more raindrops

const drain = document.querySelector('.drain');
drain.addEventListener('click', toggleDrain);
