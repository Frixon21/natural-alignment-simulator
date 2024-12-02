// Initialize players in their starting positions
function initializePlayers() {
    const players = document.querySelectorAll('.player');
    players.forEach(player => {
        const position = startingPositions[player.id];
        moveElement(player, position.x, position.y);
    });
}

// Handle role selection
function selectRole(role) {
    selectedRole = role;

    // Highlight the selected button
    const buttons = document.querySelectorAll('.role-button');
    buttons.forEach(button => button.classList.remove('selected'));
    const selectedButton = Array.from(buttons).find(btn => btn.textContent === role);
    selectedButton.classList.add('selected');

    // Update feedback
    const feedbackContainer = document.getElementById('feedback-container');
    feedbackContainer.innerHTML = `<p id="feedback">You have selected: ${role}.</p>`;
    
    // Highlight the selected player's marker
    const players = document.querySelectorAll('.player');
    players.forEach(player => {
        player.classList.remove('selected-player');
        if (player.id === role) {
            player.classList.add('selected-player');
        }
    });

    // Add the "Begin" button if not already present
    if (!document.getElementById('begin-button')) {
        const beginButton = document.createElement('button');
        beginButton.id = 'begin-button';
        beginButton.className = 'button';
        beginButton.textContent = 'Begin';
        beginButton.onclick = startMechanic;
        feedbackContainer.appendChild(beginButton);
    }
}



// Move players to their positions
function moveEveryoneElse(position) {
    document.querySelectorAll('.player:not(.selected-player)').forEach(player => {
        moveElement(player, position.x, position.y);
    });
}

function movePlayer(playerPosition) {
    const players = document.querySelectorAll('.player');
    players.forEach(player => {
        if (player.id == selectedRole) {
            moveElement(player, playerPosition.x, playerPosition.y);
        }
    });
}

function moveDebuffedPlayers(position) {
    const separation = 20; // Total separation in pixels
    const halfSeparation = separation / 2; // 5 pixels above and below
    const debuffedPlayers = Array.from(document.querySelectorAll('.player.debuff'));
    debuffedPlayers.forEach((player, index) => {
        const offsetY = index === 0 ? -halfSeparation : halfSeparation;
        const newY = position.y + offsetY;
        moveElement(player, position.x, newY);
    });
    // document.querySelectorAll('.player.debuff').forEach(player => {
    //     moveElement(player, position.x, position.y);
    // });
}

// Function to move all players to their designated positions
function moveAllPlayersToPositions(correctPositions) {
    Object.keys(correctPositions).forEach(role => {
        const player = document.querySelector(`.player#${role}`);
        const position = correctPositions[role];
        if (player && position) {
            moveElement(player, position.x, position.y);
        } else {
            console.warn(`Player or position not found for role: ${role}`);
        }
    });
}

function showRangeRing(position, range, time=3000) {
    const ring = document.createElement('div');
    ring.className = 'range-ring';
    ring.style.width = `${2 * range}px`; // Diameter = 2 * radius
    ring.style.height = `${2 * range}px`; // Diameter = 2 * radius
    ring.style.left = `${position.x}px`; // Position at the clicked X
    ring.style.top = `${position.y}px`; // Position at the clicked Y
    arena.appendChild(ring);

    // Remove the ring after the specified time
    setTimeout(() => {
        ring.remove();
    }, time);
}

function showResetButton() {
    const feedbackContainer = document.getElementById('feedback-container');
    if (!document.getElementById('reset-button')) {
        const resetButton = document.createElement('button');
        resetButton.id = 'reset-button';
        resetButton.className = 'button';
        resetButton.textContent = 'Reset';
        resetButton.onclick = resetSimulation;
        feedbackContainer.appendChild(resetButton);
    }
}

function resetSimulation() {
    // Clear debuffs
    document.querySelectorAll('.player').forEach(player => {
        player.classList.remove('debuff', 'selected-player');
    });
    removeAllPositionMarkers();
    removeIcon();
    removeRectangle();
    // Reset positions
    initializePlayers();

    // Clear feedback
    updateFeedback('Select your role to begin!');

    // Remove dynamic buttons
    const beginButton = document.getElementById('begin-button');
    const resetButton = document.getElementById('reset-button');
    if (beginButton) beginButton.remove();
    if (resetButton) resetButton.remove();

    // Clear selected role
    currentMechanic = null;
    selectedRole = null;
}

// Smoothly move an element to a position
function moveElement(element, x, y) {
    element.style.transition = 'transform 0.5s ease';
    element.style.transform = `translate(${x - 15}px, ${y - 15}px)`; // Adjust for player size
}

// Update mechanic feedback based on success
function updateMechanicFeedback(success, successMessage, failureMessage) {
    const message = success ? successMessage : failureMessage;
    updateFeedback(message);
}

// Update feedback message
function updateFeedback(message) {
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.textContent = message;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculateDistance(p1, p2) {
    return Math.sqrt(
        Math.pow(p1.x - p2.x, 2) +
        Math.pow(p1.y - p2.y, 2)
    );
}

function showIcon(position, iconSrc = 'icon.png') {
    const icon = document.createElement('img');
    icon.src = iconSrc;
    icon.className = 'mechanic-icon';
    icon.style.position = 'absolute';
    icon.style.width = '50px';
    icon.style.height = '50px';
    icon.style.left = `${position.x - 25}px`; // Center the icon
    icon.style.top = `${position.y - 25}px`;
    icon.id = 'mechanic-icon';
    arena.appendChild(icon);
}
// Remove the icon after it's no longer needed
function removeIcon() {
    const icon = document.getElementById('mechanic-icon');
    if (icon) icon.remove();
}

/**
 * Selects the next rectangle index.
 * If no rectangle has been selected yet, selects randomly.
 * Otherwise, selects the opposite of the last selected index.
 * @returns {number} The selected rectangle index (0 or 1)
 */
function selectNextRectangleIndex(lastRectangleIndex) {
    if (lastRectangleIndex === null) {
        // No previous selection; pick randomly
        const randomIndex = Math.floor(Math.random() * rectanglePositions.length); // 0 or 1
        lastRectangleIndex = randomIndex;
        return randomIndex;
    } else {
        // Select the opposite index
        const oppositeIndex = 1 - lastRectangleIndex;
        lastRectangleIndex = oppositeIndex;
        return oppositeIndex;
    }
}

function showRectangle(zone, color = 'rgba(255, 255, 0, 0.5)') {

    // Create a rectangle element
    const rectangle = document.createElement('div');
    rectangle.className = 'safe-zone';
    rectangle.id = 'safe-zone'; // Assign a unique ID
    rectangle.style.position = 'absolute';
    rectangle.style.left = `${zone.x}px`;
    rectangle.style.top = `${zone.y}px`;
    rectangle.style.width = `${zone.width}px`;
    rectangle.style.height = `${zone.height}px`;
    rectangle.style.backgroundColor = color; // Semi-transparent color

    rectangle.style.pointerEvents = 'none'; // Allow clicks to pass through

    // Add the rectangle to the arena
    arena.appendChild(rectangle);
}

// Function to remove the rectangle
function removeRectangle() {
    const rectangle = document.getElementById('safe-zone');
    if (rectangle) {
        rectangle.remove();
    }
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Reusable function to create position markers
function createPositionMarkers(markers, handler, setName = 'first') {
    markers.forEach(spot => {
        const marker = document.createElement('img');
        marker.src = 'img/target.png'; // Ensure this image exists
        marker.className = 'position-marker';
        marker.id = spot.id;
        marker.style.position = 'absolute';
        marker.style.left = `${spot.x - 12.5}px`; // Adjust for image size
        marker.style.top = `${spot.y - 12.5}px`;
        marker.style.width = '25px';
        marker.style.height = '25px';
        marker.style.cursor = 'pointer';

        // Add a data attribute to indicate which set it belongs to
        marker.dataset.set = setName;

        // Add click listener
        marker.addEventListener('click', () => handler({ ...spot, group: setName }));


        // Append to the arena
        arena.appendChild(marker);
    });
}

// Function to remove all position markers
function removeAllPositionMarkers() {
    const markers = document.querySelectorAll('.position-marker');
    markers.forEach(marker => marker.remove());
}
