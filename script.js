let selectedRole = null; // Store the selected role
const arena = document.getElementById('arena');
const puddlePosition = { x: 200, y: 110 }; // Center for baiting puddles
const mechanics = [
    { mechanic: resolvePuddleBaiting, message: 'Move to bait puddles!' },
    { mechanic: stackOrSpread, message: 'Stack Or spread!', additionalData: { stack: null } },
    ...shuffleArray([
        { mechanic: fireMechanic, message: 'Prepare for the fire mechanic! Click When ready.' },
        { mechanic: iceMechanic, message: 'Prepare for the ice mechanic!' }
    ]),
    // Add more mechanics here as needed
];
let mechanicIndex = 0; // Track the current mechanic
let currentMechanic = null; // Tracks the active mechanic
let currentMechanicData = {}; // Stores additional data for the current mechanic
let lastRectangleIndex = null;

// Define starting positions for the grid layout
const startingPositions = {
    MT: {id:'TopCenter', x: 200, y: 40 },
    OT: {id:'BottomCenter', x: 200, y: 190 },
    H1: {id:'MiddleLeft', x: 110, y: 110 },
    H2: {id: 'MiddleRight', x: 290, y: 110 },
    M1: {id:'BottomLeft', x: 110, y: 190 },
    M2: {id:'BottomRight', x: 290, y: 190 },
    R1: {id:'TopLeft', x: 110, y: 40 },
    R2: {id:'TopRight', x: 290, y: 40 },
};

// Define possible rectangle positions (safe areas) globally
const rectanglePositions = [
    { 
        id: 'rectangle1',
        x: 0, 
        y: 30, 
        width: 25, 
        height: 85, 
        safe: { x: 0, y: 109, width: 400, height: 90 }, 
        safeArea: 'second' 
    },  // First position
    { 
        id: 'rectangle2',
        x: 0, 
        y: 110, 
        width: 25, 
        height: 85, 
        safe: { x: 0, y: 0, width: 400, height: 90 }, 
        safeArea: 'first' 
    } // Second position
];

// Position markers for fire mechanic
const positionMarkersFire = {
    first: [
        { id: 'baitLeft', x: 110, y: 90 },
        { id: 'stayLeft', x: 140, y: 100 },
        { id: 'decoyLeft', x: 110, y: 70 },
        { id: 'debuff', x: 200, y: 105 },
        { id: 'baitCenter', x: 200, y: 40 },
        { id: 'stayCenter', x: 190, y: 50 },
        { id: 'baitRight', x: 285, y: 90 },
        { id: 'stayRight', x: 255, y: 100 },
        { id: 'decoyRight', x: 285, y: 70 },
    ],
    second: [
        { id: 'baitLeft', x: 110, y: 140 },
        { id: 'stayLeft', x: 140, y: 120 },
        { id: 'decoyLeft', x: 110, y: 160 },
        { id: 'debuff', x: 200, y: 120 },
        { id: 'baitCenter', x: 200, y: 180 },
        { id: 'stayCenter', x: 190, y: 170 },
        { id: 'baitRight', x: 285, y: 140 },
        { id: 'stayRight', x: 255, y: 120 },
        { id: 'decoyRight', x: 285, y: 160 },
    ],
};

// Position markers for fire mechanic
const positionMarkersIce = {
    first: [
        { id: 'stayLeft1', x: 110, y: 90 },
        { id: 'baitLeft', x: 140, y: 100 },
        { id: 'stayLeft2', x: 110, y: 70 },
        { id: 'debuff', x: 200, y: 105 },
        { id: 'decoyCenter1', x: 200, y: 40 },
        { id: 'decoyCenter2', x: 190, y: 50 },
        { id: 'stayRight1', x: 285, y: 90 },
        { id: 'baitRight', x: 255, y: 100 },
        { id: 'stayRight2', x: 285, y: 70 },
    ],
    second: [
        { id: 'stayLeft1', x: 110, y: 140 },
        { id: 'baitLeft', x: 140, y: 120 },
        { id: 'stayLeft2', x: 110, y: 160 },
        { id: 'debuff', x: 200, y: 120 },
        { id: 'decoyCenter1', x: 200, y: 180 },
        { id: 'decoyCenter2', x: 190, y: 170 },
        { id: 'stayRight1', x: 285, y: 140 },
        { id: 'baitRight', x: 255, y: 120 },
        { id: 'stayRight2', x: 285, y: 160 },
    ],
};

// Position markers for Puddle Baiting
const positionMarkersPuddle = [
    { id: 'puddleLeft', x: 100, y: 100 },
    { id: 'puddleCenter', x: 200, y: 100 },
    { id: 'puddleRight', x: 300, y: 100 },
];

// Position markers for Stack or Spread
const positionMarkersStackOrSpread = [
    { id: 'TopLeft', x: 110, y: 40 },
    { id: 'TopCenter', x: 200, y: 40 },
    { id: 'TopRight', x: 290, y: 40 },
    { id: 'MiddleLeft', x: 110, y: 110 },
    { id: 'MiddleCenter', x: 200, y: 110 },
    { id: 'MiddleRight', x: 290, y: 110 },
    { id: 'BottomLeft', x: 120, y: 190 },
    { id: 'BottomCenter', x: 200, y: 190 },
    { id: 'BottomRight', x: 290, y: 190 },
];

const positionMarkersStackOrSpreadPhase2 = {
    LeftSafe : [
    { id: 'LTopLeft', x: 40, y: 40 },
    { id: 'LTopCenter', x: 110, y: 40 },
    { id: 'LTopRight', x: 190, y: 40 },
    { id: 'LMiddleLeft', x: 40, y: 110 },
    { id: 'LMiddleCenter', x: 110, y: 110 },
    { id: 'LMiddleRight', x: 190, y: 110 },
    { id: 'LBottomLeft', x: 40, y: 190 },
    { id: 'LBottomCenter', x: 110, y: 190 },
    { id: 'LBottomRight', x: 190, y: 190 },
    ],
    RightSafe : [
        { id: 'RTopLeft', x: 210, y: 40 },
        { id: 'RTopCenter', x: 290, y: 40 },
        { id: 'RTopRight', x: 360, y: 40 },
        { id: 'RMiddleLeft', x: 210, y: 110 },
        { id: 'RMiddleCenter', x: 290, y: 110 },
        { id: 'RMiddleRight', x: 360, y: 110 },
        { id: 'RBottomLeft', x: 210, y: 190 },
        { id: 'RBottomCenter', x: 290, y: 190 },
        { id: 'RBottomRight', x: 360, y: 190 },
    ]
};




// Function to assign debuff to players
function assignDebuff() {
    const roles = {
        supports: ['MT', 'OT', 'H1', 'H2'], // Tanks and healers
        dps: ['M1', 'M2', 'R1', 'R2'], // Melee and ranged DPS
    };

    // Randomly choose the first player
    const allRoles = [...roles.supports, ...roles.dps];
    const firstPlayer = allRoles[getRandomInt(0, allRoles.length - 1)];

    // Determine the category of the first player
    const isSupport = roles.supports.includes(firstPlayer);
    const category = isSupport ? roles.supports : roles.dps;

    // Randomly choose the second player within the same category, ensuring it's not the first player
    let secondPlayer;
    do {
        secondPlayer = category[getRandomInt(0, category.length - 1)];
    } while (secondPlayer === firstPlayer);

    // Apply the debuff to the selected players
    document.querySelectorAll('.player').forEach(player => {
        if ([firstPlayer, secondPlayer].includes(player.id)) {
            player.classList.add('debuff');
        } else {
            player.classList.remove('debuff');
        }
    });

    // Display feedback
    document.getElementById('feedback').textContent = `Debuff assigned to: ${firstPlayer} and ${secondPlayer}.`;
}

// Handle Puddle Baiting Mechanic with Position Markers
function resolvePuddleBaiting() {
    removeIcon();
    removeRectangle();
    console.log('Executing Puddle Baiting mechanic');

    // Display position markers for puddle baiting
    createPositionMarkers(positionMarkersPuddle, handlePuddlePositionClick);

    // Update feedback
    updateFeedback('Move to bait puddles by selecting a position marker!');

    function handlePuddlePositionClick(selectedSpot) {
        console.log('Player selected puddle position:', selectedSpot);

        // Highlight the selected marker
        const markers = document.querySelectorAll('.position-marker');
        markers.forEach(marker => marker.classList.remove('selected'));
        const selectedMarker = document.getElementById(selectedSpot.id);
        if (selectedMarker) {
            selectedMarker.classList.add('selected');
        }

        // Move the selected player to the chosen position
        movePlayer(selectedSpot);
        moveEveryoneElse(puddlePosition);

        // Validate and proceed
        validatePuddlePosition(selectedSpot);
    }

    function validatePuddlePosition(selectedSpot, puddlePosition) {

        const success = selectedSpot.id === 'puddleCenter' ? true : false;
        updateMechanicFeedback(success, 'Puddle baited successfully!', 'Puddle baited unsuccessfully.');

        if (success) {
            mechanicIndex++;
            setTimeout(() => {
                removeAllPositionMarkers();
                runNextMechanic();
            }, 1000);
        } else {
            setTimeout(() => {
                removeAllPositionMarkers();
                updateFeedback('Mechanic failed. Reset to try again.');
                showResetButton();
            }, 1000);
        }
    }
}

// Handle Stack or Spread Mechanic with Position Markers
function stackOrSpread(additionalData) {
    
    console.log('Executing Stack or Spread mechanic');

    const isStack = additionalData.stack;
    // Phase 1: Display position markers for initial phase
    createPositionMarkers(positionMarkersStackOrSpread, (selectedSpot) => handleStackOrSpreadClick(selectedSpot, isStack));

    // Update feedback
    updateFeedback('Choose a position marker to Stack or Spread!');

    function handleStackOrSpreadClick(selectedSpot, isStack) {
        console.log(`Player selected position: ${selectedSpot.id} (${isStack ? 'Stack' : 'Spread'})`);
        removeIcon();
        removeRectangle();
        // Highlight the selected marker
        const markersElements = document.querySelectorAll('.position-marker');
        markersElements.forEach(marker => marker.classList.remove('selected'));
        const selectedMarker = document.getElementById(selectedSpot.id);
        if (selectedMarker) {
            selectedMarker.classList.add('selected');
        }       

        // Validate and proceed
        if (isStack) {
            validateStackPosition(selectedSpot);
        } else {
            validateSpreadPosition(selectedSpot);
        }
    }

    function validateStackPosition(selectedSpot) {
        // Correct position for stack is BottomCenter if player doesnt have debuff
        const correctPosition = { x: 200, y: 190 };
        moveEveryoneElse(correctPosition);
        moveDebuffedPlayers({x: 200, y: 40 });
        movePlayer(selectedSpot);
        const playerElement = document.querySelector(`.player#${selectedRole}`);
        var success = null

        //IF player has debuff he needs to move to TopCenter else BottomCenter
        if (playerElement.classList.contains('debuff')) {
            success = selectedSpot.id === 'TopCenter' ? true : false;
        } else {
            success = selectedSpot.id === 'BottomCenter' ? true : false;
        }     

        showRangeRing(correctPosition, 40, 4000);


        updateMechanicFeedback(success, 'Stack successful!', 'Stack unsuccessful.');

        if (success) {
            setTimeout(() => {
                removeAllPositionMarkers();
                // runNextMechanic();
                phase2("Spread");
            }, 1000);
        } else {
            setTimeout(() => {
                removeAllPositionMarkers();
                updateFeedback('Mechanic failed. Reset to try again.');
                showResetButton();
            }, 1000);
        }
    }

    function validateSpreadPosition(selectedSpot) {
        var success = null; 
        //Correct Position for player is his starting position
        const correctPosition = startingPositions[selectedRole];
        const players = document.querySelectorAll('.player:not(.selected-player)');
        players.forEach(player => {
            const position = startingPositions[player.id];
            moveElement(player, position.x, position.y);
        });
        movePlayer(selectedSpot);
        success = selectedSpot.id === correctPosition.id ? true : false;



        if (success) {
            updateMechanicFeedback(true, 'Spread successful!', 'Spread unsuccessful.');
            setTimeout(() => {
                removeAllPositionMarkers();
                // runNextMechanic();
                phase2("Stack");
            }, 1000);
        } else {
            updateMechanicFeedback(false, 'Spread unsuccessful.', 'Spread unsuccessful.');
            setTimeout(() => {
                removeAllPositionMarkers();
                updateFeedback('Mechanic failed. Reset to try again.');
                showResetButton();
            }, 1000);
        }
    }

    function phase2(stackOrSpread) {
        const cleaveSide = Math.random() > 0.5 ? 'left' : 'right'; // Randomly choose cleave side
        updateFeedback("Look for the cleave side and click on the safe spot!!");
        console.log(`Cleaving on: ${cleaveSide}`);
        console.log('Timt to :', stackOrSpread);
    
        // Define positions for cleave areas
        const leftCleaveShow = { x: 0, y: 0, width: 200, height: 25 };
        const rightCleaveShow = { x: 200, y: 0, width: 200, height: 25 };
        const leftCleave = { x: 0, y: 0, width: 200, height: 400 };
        const rightCleave = { x: 200, y: 0, width: 200, height: 400 };
    
        // Define the safe zone
        const safeZone = cleaveSide === 'left'
            ? { x: 200, y: 0, width: 200, height: 400 } // Right side is safe
            : { x: 0, y: 0, width: 200, height: 400 }; // Left side is safe
    
        // Show the cleave area
        const cleaveArea = cleaveSide === 'left' ? leftCleaveShow : rightCleaveShow;
        showRectangle(cleaveArea);
        console.log('Rectangle for cleave shown');
        createPositionMarkers(positionMarkersStackOrSpreadPhase2.LeftSafe,(selectedSpot) => handleStackOrSpreadClick2(selectedSpot, stackOrSpread, cleaveSide));
        createPositionMarkers(positionMarkersStackOrSpreadPhase2.RightSafe,(selectedSpot) => handleStackOrSpreadClick2(selectedSpot, stackOrSpread, cleaveSide));
        
        function handleStackOrSpreadClick2(selectedSpot, stackOrSpread, cleaveSide) {
            let success = false;
            if (stackOrSpread === "Stack") {
                if (cleaveSide === "left") {
                    //If cleave is on left side, then the safe stack is on right side 
                    const stackPosition = { id: 'RBottomLeft', x: 210, y: 190 };
                    const debuffPosition = { id: 'RTopLeft', x: 210, y: 40 };

                    const playerElement = document.querySelector(`.player#${selectedRole}`);
                    if (playerElement.classList.contains('debuff')) {
                        success = selectedSpot.id === debuffPosition.id;
                    } else {
                        success = selectedSpot.id === stackPosition.id;
                    }   
                    movePlayersToStack(stackPosition, cleaveSide);
                }
                else {
                    //If cleave is on right side, then the safe stack is on left side
                    const stackPosition = { id: 'LBottomRight', x: 190, y: 190 };
                    const debuffPosition = { id: 'LTopRight', x: 190, y: 40 };

                    const playerElement = document.querySelector(`.player#${selectedRole}`);
                    if (playerElement.classList.contains('debuff')) {
                        success = selectedSpot.id === debuffPosition.id;
                    }
                    else {
                        success = selectedSpot.id === stackPosition.id;
                    }
                    movePlayersToStack(stackPosition, cleaveSide);
                }
                
            }
            else if (stackOrSpread === "Spread"){
                const spreadPositionsLeft = {
                    MT: { id: 'MT', x: 110, y: 40 },
                    OT: { id: 'OT', x: 40, y: 40 },
                    H1: { id: 'H1', x: 190, y: 110 },
                    H2: { id: 'H2', x: 110, y: 110 },
                    M1: { id: 'M1', x: 110, y: 190 },
                    M2: { id: 'M2', x: 40, y: 110 },
                    R1: { id: 'R1', x: 190, y: 190 },
                    R2: { id: 'R2', x: 40, y: 190 },
                    Debuff: { id: 'DebuffSpreadLeft', x: 190, y: 40 }
                };
                
                const spreadPositionsRight = {
                    MT: { id: 'MT', x: 290, y: 40 },
                    OT: { id: 'OT', x: 360, y: 40 },
                    H1: { id: 'H1', x: 210, y: 110 },
                    H2: { id: 'H2', x: 290, y: 110 },
                    M1: { id: 'M1', x: 290, y: 190 },
                    M2: { id: 'M2', x: 360, y: 110 },
                    R1: { id: 'R1', x: 210, y: 190 },
                    R2: { id: 'R2', x: 360, y: 190 },
                    Debuff: { id: 'DebuffSpreadRight', x: 210, y: 40 }
                };
                let spreadPosition;
                if (cleaveSide === "left") {
                    const playerElement = document.querySelector(`.player#${selectedRole}`);                    
                    if (playerElement.classList.contains('debuff')) {
                        // If player has debuff
                        spreadPosition = spreadPositionsRight.Debuff;
                        success = selectedSpot.x === spreadPosition.x && selectedSpot.y === spreadPosition.y;
                    }
                    else{
                        // If player doenst have debuff
                        spreadPosition = spreadPositionsRight[selectedRole];
                        success = selectedSpot.x === spreadPosition.x && selectedSpot.y === spreadPosition.y;
                    }
                }
                else {
                    const playerElement = document.querySelector(`.player#${selectedRole}`);
                    if (playerElement.classList.contains('debuff')) {
                        // If player has debuff
                        spreadPosition = spreadPositionsLeft.Debuff;
                        success = selectedSpot.x === spreadPosition.x && selectedSpot.y === spreadPosition.y;
                    }
                    else{
                        // If player doenst have debuff
                        spreadPosition = spreadPositionsLeft[selectedRole];
                        success = selectedSpot.x === spreadPosition.x && selectedSpot.y === spreadPosition.y;
                    }
                }
                movePlayersToSpreadSide(cleaveSide);        
            
            }

            if (success) {
                updateMechanicFeedback(true, 'Success!', 'Failure!');
                mechanicIndex++;
                setTimeout(() => {
                    removeAllPositionMarkers();
                    runNextMechanic();
                }, 1000);
            } else {
                updateMechanicFeedback(true, 'Success!', 'Failure!');
                setTimeout(() => {
                    removeAllPositionMarkers();
                    updateFeedback('Mechanic failed. Reset to try again.');
                    showResetButton();
                }, 1000);
            }
        }

        function movePlayersToSpreadSide(cleaveSide) {
            const spreadPositionsLeft = {
                MT: { x: 110, y: 40 },
                OT: { x: 40, y: 40 },
                H1: { x: 190, y: 110 },
                H2: { x: 110, y: 110 },
                M1: { x: 110, y: 190 },
                M2: { x: 40, y: 110 },
                R1: { x: 190, y: 190 },
                R2: { x: 40, y: 190 },
            };
            
            const spreadPositionsRight = {
                MT: { x: 290, y: 40 },
                OT: { x: 360, y: 40 },
                H1: { x: 210, y: 110 },
                H2: { x: 290, y: 110 },
                M1: { x: 290, y: 190 },
                M2: { x: 360, y: 110 },
                R1: { x: 210, y: 190 },
                R2: { x: 360, y: 190 },
                
            };        
        
            const positions = cleaveSide === 'left' ? spreadPositionsRight : spreadPositionsLeft;
        
            // Move each player to their designated position
            const players = document.querySelectorAll('.player');
            players.forEach(player => {
                const position = positions[player.id];
                moveElement(player, position.x, position.y);
            });
            const c = cleaveSide === 'right' ? -10 : +10;
            moveDebuffedPlayers({ x: 200+c, y: 40 });
        }
    
        function movePlayersToStack(position, side) {
            const threshold = 40; // Allowable leeway in pixels
            const c = side === 'right' ? -10 : +10;
            showRangeRing(position, threshold);
            
    
            console.log('Moving players to stack position:', position);
            // Move all players to the designated stack position
            const players = document.querySelectorAll('.player');
            players.forEach(player => {
                moveElement(player, position.x, position.y);
            });
            moveDebuffedPlayers({ x: 200+c, y: 40 });
        }
    }
}

// Fire Mechanic with Position Markers
function fireMechanic(mechanicData) {
    
    console.log('Executing fire mechanic');
    const safeArea = mechanicData.safeArea;

    // Determine which set is safe and which is unsafe
    const safeSet = safeArea === 'first' ? 'first' : 'second';
    const unsafeSet = safeArea === 'first' ? 'second' : 'first';

    // Reference to the safe and unsafe positions
    const safePositions = positionMarkersFire[safeSet];
    const unsafePositions = positionMarkersFire[unsafeSet];

    // Create clickable markers for both sets
    createPositionMarkers(
        safePositions,
        (marker) => handleFirePositionClick(marker),
        'safe'
    );
    createPositionMarkers(
        unsafePositions,
        (marker) => handleFirePositionClick(marker),
        'unsafe'
    );


    // Update feedback
    updateFeedback('Select a safe position by clicking on a position marker!');
    function handleFirePositionClick(selectedMarker) {
        removeIcon();
        console.log('Player selected fire position:', selectedMarker.id, 'from group:', selectedMarker.group);

        // Highlight the selected marker
        const markers = document.querySelectorAll('.position-marker');
        markers.forEach(marker => marker.classList.remove('selected'));
        const markerElement = document.getElementById(selectedMarker.id);
        if (markerElement) {
        markerElement.classList.add('selected');
        }

        // Validate and proceed
        validateFirePosition(selectedMarker);
    }

    function validateFirePosition(selectedMarker) {
        const correctPositions = getCorrectPositionsForMechanic();

        // Move all players to their correct positions
        moveAllPlayersToPositions(correctPositions);
        
       // Locate the central debuff position
       const debuffPosition = Object.values(correctPositions).find(pos => pos.id === 'debuff' && pos.set === 'safe');
       if (debuffPosition) {
           moveDebuffedPlayers(debuffPosition); // Spread debuffed players
       } else {
           console.warn('No debuff position found.');
       }

        const correctPositionForRole = correctPositions[selectedRole]; // Get the correct position for the current role
        if (!correctPositionForRole) {
            console.error(`No correct position found for role: ${selectedRole}`);
            updateFeedback('Failure! Incorrect position selected.');
            showResetButton();
            removeAllPositionMarkers();
            return;
        }
    
        const isValid = selectedMarker.group === 'safe' && correctPositionForRole.id === selectedMarker.id;
    
        if (isValid) {
            updateFeedback('Success! Correct position selected.');
            setTimeout(() => {
                removeAllPositionMarkers();
                mechanicIndex++;
                runNextMechanic();
            }, 2000);
        } else {
            updateFeedback('Failure! Incorrect position selected.\n For Fire G1 Always Baits, Exceptions: \n M1,R1 have NA, then M2 baits \n MT,H1 have NA, then OT baits');
            setTimeout(() => {
                removeAllPositionMarkers();
                showResetButton();
            }, 2000);
        }
    }

    function getCorrectPositionsForMechanic() {
        //There are 4 possible combinations of debuff:
        // both healers have the debuff
        // both tanks have the debuff
        // both dps have the debuff
        // one healer and one tank have the debuff

        //For Fire G1 Always Baits, Exceptions:
        // M1,R1 have NA, then M2 baits
        // MT,H1 have NA, then OT baits

        // Group definitions

        const debuffedPlayers = Array.from(document.querySelectorAll('.player.debuff')).map(player => player.id);
        const positions = {}; // To store player positions        

        // Determine debuffed categories
        const debuffedHealers = debuffedPlayers.filter(player => ['H1', 'H2'].includes(player));
        const debuffedTanks = debuffedPlayers.filter(player => ['MT', 'OT'].includes(player));
        const debuffedDPS = debuffedPlayers.filter(player => ['M1', 'M2', 'R1', 'R2'].includes(player));

        // Logic for assigning positions
        if (debuffedHealers.length === 2) {
            // Both healers are debuffed
            console.log('Both healers debuffed.');

            positions['MT'] = { ...safePositions.find(pos => pos.id === 'baitLeft'), set: 'safe' };
            positions['OT'] = { ...safePositions.find(pos => pos.id === 'stayLeft'), set: 'safe' };
            positions['M1'] = { ...safePositions.find(pos => pos.id === 'baitCenter'), set: 'safe' };
            positions['M2'] = { ...safePositions.find(pos => pos.id === 'stayCenter'), set: 'safe' };
            positions['R1'] = { ...safePositions.find(pos => pos.id === 'baitRight'), set: 'safe' };
            positions['R2'] = { ...safePositions.find(pos => pos.id === 'stayRight'), set: 'safe' };

        } else if (debuffedTanks.length === 2) {
            // Both tanks are debuffed
            console.log('Both tanks debuffed.');

            positions['H1'] = { ...safePositions.find(pos => pos.id === 'baitLeft'), set: 'safe' };
            positions['H2'] = { ...safePositions.find(pos => pos.id === 'stayLeft'), set: 'safe' };
            positions['M1'] = { ...safePositions.find(pos => pos.id === 'baitCenter'), set: 'safe' };
            positions['M2'] = { ...safePositions.find(pos => pos.id === 'stayCenter'), set: 'safe' };
            positions['R1'] = { ...safePositions.find(pos => pos.id === 'baitRight'), set: 'safe' };
            positions['R2'] = { ...safePositions.find(pos => pos.id === 'stayRight'), set: 'safe' };

        } else if (debuffedDPS.length === 2) {
            // Both DPS are debuffed
            console.log('Both DPS debuffed.');

            positions['MT'] = { ...safePositions.find(pos => pos.id === 'baitCenter'), set: 'safe' };
            positions['OT'] = { ...safePositions.find(pos => pos.id === 'stayCenter'), set: 'safe' };
            positions['H1'] = { ...safePositions.find(pos => pos.id === 'baitLeft'), set: 'safe' };
            positions['H2'] = { ...safePositions.find(pos => pos.id === 'stayLeft'), set: 'safe' };

            // Logic to determine which DPS players bait or stay
            const dpsPriority = ['M1', 'R1', 'M2', 'R2'];
            const availableDPS = dpsPriority.filter(dps => !debuffedPlayers.includes(dps)); // Exclude debuffed DPS

            if (availableDPS.length > 0) {
                positions[availableDPS[0]] = { ...safePositions.find(pos => pos.id === 'baitRight'), set: 'safe' }; // Highest priority DPS baits
                if (availableDPS.length > 1) {
                    positions[availableDPS[1]] = { ...safePositions.find(pos => pos.id === 'stayRight'), set: 'safe' }; // Second DPS stays
                }
            }
        } else {
            // One healer and one tank are debuffed
            console.log('One healer and one tank debuffed.');

            positions['M1'] = { ...safePositions.find(pos => pos.id === 'baitCenter'), set: 'safe' };
            positions['M2'] = { ...safePositions.find(pos => pos.id === 'stayCenter'), set: 'safe' };
            positions['R1'] = { ...safePositions.find(pos => pos.id === 'baitRight'), set: 'safe' };
            positions['R2'] = { ...safePositions.find(pos => pos.id === 'stayRight'), set: 'safe' };

            // Assign bait and stay positions based on debuffed roles
            const baitTank = debuffedTanks.includes('MT') ? 'OT' : 'MT';
            const stayHealer = debuffedHealers.includes('H1') ? 'H2' : 'H1';

            positions[baitTank] = { ...safePositions.find(pos => pos.id === 'baitLeft'), set: 'safe' };
            positions[stayHealer] = { ...safePositions.find(pos => pos.id === 'stayLeft'), set: 'safe' };
        }

        // Assign debuffed players to their debuff positions in the 'safe' set
        debuffedPlayers.forEach(player => {
            positions[player] = { ...safePositions.find(pos => pos.id === 'debuff'), set: 'safe' };
        });

        // Return the positions for all players
        return positions;
    }
}

// Ice Mechanic (Existing Implementation)
function iceMechanic(mechanicData) {

    console.log('Executing ice mechanic');
    const safeArea = mechanicData.safeArea;
    
    // Determine which set is safe and which is unsafe
    const safeSet = safeArea === 'first' ? 'first' : 'second';
    const unsafeSet = safeArea === 'first' ? 'second' : 'first';

    // Reference to the safe and unsafe positions
    const safePositions = positionMarkersIce[safeSet];
    const unsafePositions = positionMarkersIce[unsafeSet];

    // Create clickable markers for both sets
    createPositionMarkers(
        safePositions,
        (marker) => handleIcePositionClick(marker),
        'safe'
    );
    createPositionMarkers(
        unsafePositions,
        (marker) => handleIcePositionClick(marker),
        'unsafe'
    );

    // Update feedback
    updateFeedback('Select a safe position by clicking on a position marker!');
    function handleIcePositionClick(selectedMarker) {
        removeIcon();
        console.log('Player selected ice position:', selectedMarker.id, 'from group:', selectedMarker.group);

        // Highlight the selected marker
        const markers = document.querySelectorAll('.position-marker');
        markers.forEach(marker => marker.classList.remove('selected'));
        const markerElement = document.getElementById(selectedMarker.id);
        if (markerElement) {
            markerElement.classList.add('selected');
        }

        // Validate and proceed
        validateIcePosition(selectedMarker);
    }

    function validateIcePosition(selectedMarker) {
        const correctPositions = getCorrectPositionsForIceMechanic();

        // Move all players to their correct positions
        moveAllPlayersToPositions(correctPositions);
        const debuffPosition = Object.values(correctPositions).find(pos => pos.id === 'debuff' && pos.set === 'safe');
        if (debuffPosition) {
            moveDebuffedPlayers(debuffPosition); // Spread debuffed players
        } else {
            console.warn('No debuff position found.');
        }

        const correctPositionForRole = correctPositions[selectedRole]; // Get the correct position for the current role
        if (!correctPositionForRole) {
            console.error(`No correct position found for role: ${selectedRole}`);
            updateFeedback('Failure! Incorrect position selected.');
            showResetButton();
            removeAllPositionMarkers();
            return;
        }

        const isValid = selectedMarker.group === 'safe' && correctPositionForRole.id === selectedMarker.id;

        if (isValid) {
            updateFeedback('Success! Correct position selected.');
            setTimeout(() => {
                removeAllPositionMarkers();
                mechanicIndex++;
                runNextMechanic();
            }, 2000);
        } else {
            updateFeedback('Failure! Incorrect position selected.\n For Ice M1 and M2 Always Baits, Exceptions:\n If 2 DPS have NA, then MT baits left and OT baits right');
            setTimeout(() => {
                removeAllPositionMarkers();
                showResetButton();
            }, 2000);
        }
    }

    function getCorrectPositionsForIceMechanic() {
        //There are 4 possible combinations of debuff:
        // both healers have the debuff
        // both tanks have the debuff
        // both dps have the debuff
        // one healer and one tank have the debuff

        //For FIRE M1 and M2 Always Baits, Exceptions:
        //If 2 DPS have NA, then MT baits left and OT baits right

        const debuffedPlayers = Array.from(document.querySelectorAll('.player.debuff')).map(player => player.id);
        const positions = {}; // To store player positions        

        // Determine debuffed categories
        const debuffedHealers = debuffedPlayers.filter(player => ['H1', 'H2'].includes(player));
        const debuffedTanks = debuffedPlayers.filter(player => ['MT', 'OT'].includes(player));
        const debuffedDPS = debuffedPlayers.filter(player => ['M1', 'M2', 'R1', 'R2'].includes(player));

        // Logic for assigning positions
        if (debuffedHealers.length === 2) {
            // Both healers are debuffed
            console.log('Both healers debuffed.');

            positions['MT'] = { ...safePositions.find(pos => pos.id === 'stayLeft1'), set: 'safe' };
            positions['OT'] = { ...safePositions.find(pos => pos.id === 'stayLeft2'), set: 'safe' };
            positions['M1'] = { ...safePositions.find(pos => pos.id === 'baitLeft'), set: 'safe' };
            positions['M2'] = { ...safePositions.find(pos => pos.id === 'baitRight'), set: 'safe' };
            positions['R1'] = { ...safePositions.find(pos => pos.id === 'stayRight1'), set: 'safe' };
            positions['R2'] = { ...safePositions.find(pos => pos.id === 'stayRight2'), set: 'safe' };

        } else if (debuffedTanks.length === 2) {
            // Both tanks are debuffed
            console.log('Both tanks debuffed.');

            positions['H1'] = { ...safePositions.find(pos => pos.id === 'stayLeft1'), set: 'safe' };
            positions['H2'] = { ...safePositions.find(pos => pos.id === 'stayLeft2'), set: 'safe' };
            positions['M1'] = { ...safePositions.find(pos => pos.id === 'baitLeft'), set: 'safe' };
            positions['M2'] = { ...safePositions.find(pos => pos.id === 'baitRight'), set: 'safe' };
            positions['R1'] = { ...safePositions.find(pos => pos.id === 'stayRight1'), set: 'safe' };
            positions['R2'] = { ...safePositions.find(pos => pos.id === 'stayRight2'), set: 'safe' };

        }
        else if (debuffedDPS.length === 2) {
            // Both DPS are debuffed
            console.log('Both DPS debuffed.');
            positions['H1'] = { ...safePositions.find(pos => pos.id === 'stayLeft1'), set: 'safe' };
            positions['H2'] = { ...safePositions.find(pos => pos.id === 'stayLeft2'), set: 'safe' };
            positions['MT'] = { ...safePositions.find(pos => pos.id === 'baitLeft'), set: 'safe' };
            positions['OT'] = { ...safePositions.find(pos => pos.id === 'baitRight'), set: 'safe' };
            
            // Logic to determine which DPS players is 1 or 2
            const dpsPriority = ['M1', 'R1', 'M2', 'R2'];
            const availableDPS = dpsPriority.filter(dps => !debuffedPlayers.includes(dps)); // Exclude debuffed DPS
            if (availableDPS.length > 0) {
                positions[availableDPS[0]] = { ...safePositions.find(pos => pos.id === 'stayRight1'), set: 'safe' }; // Highest priority DPS stays 1
                if (availableDPS.length > 1) {
                    positions[availableDPS[1]] = { ...safePositions.find(pos => pos.id === 'stayRight2'), set: 'safe' }; // Second DPS stays 2
                }
            }
        } else {
            // One healer and one tank are debuffed
            console.log('One healer and one tank debuffed.');
            positions['M1'] = { ...safePositions.find(pos => pos.id === 'baitLeft'), set: 'safe' };
            positions['M2'] = { ...safePositions.find(pos => pos.id === 'baitRight'), set: 'safe' };
            positions['R1'] = { ...safePositions.find(pos => pos.id === 'stayRight1'), set: 'safe' };
            positions['R2'] = { ...safePositions.find(pos => pos.id === 'stayRight2'), set: 'safe' };

            // Assign stay positions based on debuffed roles
            const stayTank = debuffedTanks.includes('MT') ? 'OT' : 'MT';
            const stayHealer = debuffedHealers.includes('H1') ? 'H2' : 'H1';

            positions[stayTank] = { ...safePositions.find(pos => pos.id === 'stayLeft1'), set: 'safe' };
            positions[stayHealer] = { ...safePositions.find(pos => pos.id === 'stayLeft2'), set: 'safe' };
        }

        // Assign debuffed players to their debuff positions in the 'safe' set
        debuffedPlayers.forEach(player => {
            positions[player] = { ...safePositions.find(pos => pos.id === 'debuff'), set: 'safe' };
        });

        // Return the positions for all players
        return positions;

    }

}





// Start the mechanic
function startMechanic() {
    if (!selectedRole) {
        updateFeedback('Please select a role before starting!');
        return;
    }
    removeAllPositionMarkers();
    removeIcon();
    removeRectangle();
    removeRectangle();
    initializePlayers();

    // Reset role buttons to default style
    const buttons = document.querySelectorAll('.role-button');
    buttons.forEach(button => button.classList.remove('selected'));
    const beginButton = document.getElementById('begin-button');
    if (beginButton) beginButton.remove();

    // Assign debuff and start mechanic
    assignDebuff();
    mechanicIndex = 0; // Reset the mechanic index
    runNextMechanic();
}

// Run the next mechanic in the sequence
function runNextMechanic() {
    console.log('Running next mechanic. Current mechanic index:', mechanicIndex);
    if (mechanicIndex >= mechanics.length) {
        // All mechanics completed
        updateFeedback('All mechanics completed! Great job!');
        showResetButton();
        return;
    }

    const { mechanic, message, additionalData = {} } = mechanics[mechanicIndex];
    currentMechanic = mechanic;
    currentMechanicData = additionalData;

    // Prevent "All mechanics completed" from showing early
    if (!mechanic) {
        console.error('Mechanic undefined at index:', mechanicIndex);
        return;
    }

    updateFeedback(message);
    console.log('Starting mechanic:', mechanic.name);

    if (mechanic === stackOrSpread) {
        // Randomly choose to either stack or spread
        additionalData.stack = Math.random() > 0.5;
        const iconSrc = additionalData.stack ? 'img/stack-p8s.png' : 'img/spread-p8s.png';
        showIcon({ x: 200, y: 10 }, iconSrc);
    }

    if (mechanic === fireMechanic) {
        removeRectangle();
        removeRectangle();
        showIcon({ x: 200, y: 10 }, 'img/fire-p8s.png');
        showRectangle({ x: 0, y: 200, width: 25, height: 170 });

        lastRectangleIndex = selectNextRectangleIndex(lastRectangleIndex);
        const selectedPosition = rectanglePositions[lastRectangleIndex];
        showRectangle(selectedPosition);

        currentMechanicData.safe = selectedPosition.safe;
        currentMechanicData.safeArea = selectedPosition.safeArea;
    }
    if (mechanic === iceMechanic) {
        removeRectangle();
        removeRectangle();
        showIcon({ x: 200, y: 10 }, 'img/ice-p8s.png');
        showRectangle({ x: 0, y: 200, width: 25, height: 170 });

        lastRectangleIndex = selectNextRectangleIndex(lastRectangleIndex);
        const selectedPosition = rectanglePositions[lastRectangleIndex];
        showRectangle(selectedPosition);
        
        currentMechanicData.safe = selectedPosition.safe;
        currentMechanicData.safeArea = selectedPosition.safeArea;
    }

    // Execute the mechanic
    mechanic(currentMechanicData);
}

// Initialize players on page load
document.addEventListener('DOMContentLoaded', () => {
    initializePlayers();
});
