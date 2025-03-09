// Main script for ModernZork game

// Game state
const gameState = {
    currentLocation: null,
    inventory: [],
    gameFlags: {},
    moveCount: 0,
    score: 0
};

// Game preferences
const gamePreferences = {
    textColor: 'green',
    fontSize: 16,
    currentAdventure: 'demo-adventure'
};

// Current loaded adventure
let currentAdventure = null;

let mapData = {
    nodes: {},
    visited: [],
    currentLocation: null
};

// DOM Elements
const gameOutput = document.getElementById('game-output');
const commandInput = document.getElementById('command-input');
const autocompleteSuggestions = document.getElementById('autocomplete-suggestions');
const inventoryBtn = document.getElementById('inventory-btn');
const mapBtn = document.getElementById('map-btn');
const settingsBtn = document.getElementById('settings-btn');
const inventoryModal = document.getElementById('inventory-modal');
const mapModal = document.getElementById('map-modal');
const settingsModal = document.getElementById('settings-modal');
const inventoryContent = document.getElementById('inventory-content');
const adventureSelect = document.getElementById('adventure-select');
const textColorSelect = document.getElementById('text-color');
const fontSizeRange = document.getElementById('font-size');
const saveSettingsBtn = document.getElementById('save-settings');
const importAdventureBtn = document.getElementById('import-adventure-btn');
const adventureInfoContainer = document.getElementById('adventure-info');

// Initialize the game
async function initGame() {
    try {
        // First initialize the UI manager
        if (typeof uiManager !== 'undefined' && uiManager.initialize) {
            await uiManager.initialize();
        }
        
        // Set up adventure directories - choose one of these options based on your implementation:
        
        // OPTION 1: If you created adventure-directory.js
        if (typeof setupAdventureDirectories === 'function') {
            await setupAdventureDirectories();
        } 
        // OPTION 2: If you added to adventure-loader.js
        else if (typeof adventureLoader !== 'undefined' && adventureLoader.setupAdventureDirectories) {
            await adventureLoader.setupAdventureDirectories();
        }
        // Fallback - directly initialize adventure loader
        else if (typeof adventureLoader !== 'undefined' && adventureLoader.initialize) {
            await adventureLoader.initialize();
        }
        
        // Initialize the achievement system
        if (typeof achievementSystem !== 'undefined' && achievementSystem.initialize) {
            achievementSystem.initialize();
        }
        
        // Rest of your initialization code...
        if (typeof storyJournal !== 'undefined' && storyJournal.initialize) {
            storyJournal.initialize();
        }
        
        if (typeof communityHub !== 'undefined' && communityHub.initialize) {
            communityHub.initialize();
        }
        
        if (typeof saveManager !== 'undefined' && saveManager.initialize) {
            saveManager.initialize();
        }
        
        // Load settings from local storage
        loadSettings();
        
        // Apply settings
        applySettings();

        // Initialize modals
        initModals();
        
        // Initialize command input
        commandInput.focus();
        commandInput.addEventListener('keydown', handleCommandInputKeydown);
        commandInput.addEventListener('input', handleCommandInputChange);
        
        // Initialize buttons
        inventoryBtn.addEventListener('click', () => openModal(inventoryModal));
        mapBtn.addEventListener('click', () => openModal(mapModal));
        settingsBtn.addEventListener('click', () => openModal(settingsModal));
        
        // Initialize modal close buttons
        document.querySelectorAll('.close-modal').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                closeAllModals();
                commandInput.focus();
            });
        });
        
        // Initialize settings form
        textColorSelect.value = gamePreferences.textColor;
        fontSizeRange.value = gamePreferences.fontSize;
        saveSettingsBtn.addEventListener('click', saveSettings);
        
        // Initialize import adventure button if it exists
        if (importAdventureBtn) {
            importAdventureBtn.addEventListener('click', handleImportAdventure);
        }
        
        // Initialize settings tabs
        initializeTabs();
        
        // Update adventure selection dropdown
        updateAdventureSelection();
        
        // Adventure select change event
        adventureSelect.addEventListener('change', handleAdventureChange);
        
        // Close modals when clicking outside of them
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                closeAllModals();
                commandInput.focus();
            }
        });
        
        // Start the game with the current adventure
        startAdventure(gamePreferences.currentAdventure);
    } catch (error) {
        console.error('Error initializing game:', error);
        // Show error in game output
        if (gameOutput) {
            gameOutput.innerHTML = `<p class="text-error">Error initializing game: ${error.message}</p>`;
        }
    }
}

// Function to create and append the map modal 
function createMapModal() {
    console.log("Creating map modal");
    
    // Create the map modal if it doesn't exist
    let mapModal = document.getElementById('map-modal');
    
    if (!mapModal) {
        console.log("Map modal not found, creating it");
        mapModal = document.createElement('div');
        mapModal.id = 'map-modal';
        mapModal.className = 'modal';
        document.body.appendChild(mapModal);
    }
    
    // Set the map modal content
    mapModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Map</h2>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <div id="map-container">
                    <svg id="game-map" viewBox="0 0 500 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <!-- Map will be rendered here dynamically -->
                        <g id="map-paths"></g>
                        <g id="map-locations"></g>
                        <g id="map-labels"></g>
                    </svg>
                </div>
                <div id="map-legend">
                    <div class="legend-item">
                        <span class="legend-color current-location"></span>
                        <span>Current Location</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color visited-location"></span>
                        <span>Visited Locations</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color unvisited-location"></span>
                        <span>Known Locations</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    const closeBtn = mapModal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        closeAllModals();
        commandInput.focus();
    });
    
    console.log("Map modal created successfully");
    return mapModal;
}

// Function to initialize the map modal
function initMapModal() {
    console.log("Initializing map modal");
    
    // Create map modal if needed
    const mapModal = createMapModal();
    
    // Add map button click handler if it doesn't exist
    const mapBtn = document.getElementById('map-btn');
    if (mapBtn) {
        // Remove existing event listeners to avoid duplicates
        mapBtn.replaceWith(mapBtn.cloneNode(true));
        
        // Get the new button reference
        const newMapBtn = document.getElementById('map-btn');
        
        // Add new event listener
        newMapBtn.addEventListener('click', () => {
            console.log("Map button clicked");
            openMapModal();
        });
    }
    
    console.log("Map modal initialized successfully");
}

// Function to open the map modal
function openMapModal() {
    console.log("Opening map modal");
    
    // Get the map modal
    const mapModal = document.getElementById('map-modal');
    if (!mapModal) {
        console.error("Map modal not found");
        return;
    }
    
    // Close any other open modals
    closeAllModals();
    
    // Update map
    if (typeof mapGenerator !== 'undefined' && mapGenerator.updateMap) {
        console.log("Updating map before showing modal");
        try {
            mapGenerator.updateMap(currentAdventure, gameState);
        } catch (error) {
            console.error("Error updating map:", error);
        }
    }
    
    // Show the modal
    mapModal.style.display = 'block';
    
    console.log("Map modal opened");
}

// Function to initialize all modals
function initModals() {
    initMapModal();
}

// Initialize tabs functionality
function initializeTabs() {
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            const tabsContainer = button.closest('.modal-body');
            const tabId = button.getAttribute('data-tab');
            
            // Hide all tab contents
            tabsContainer.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Remove active class from all buttons
            tabsContainer.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected tab content
            tabsContainer.querySelector(`#${tabId}`).classList.add('active');
            
            // Add active class to clicked button
            button.classList.add('active');
        });
    });
}

// Enhanced map modal opening
function openModal(modal) {
    closeAllModals();
    
    // Update content if needed
    if (modal === inventoryModal) {
        updateInventoryDisplay();
    } else if (modal === mapModal) {
        // Initialize or update map when opening the map modal
        if (typeof mapGenerator !== 'undefined' && mapGenerator.initialize) {
            // If mapData already has nodes, update it
            if (Object.keys(mapData.nodes).length > 0) {
                mapGenerator.updateMap(currentAdventure, gameState);
            } else {
                // Otherwise initialize it
                mapGenerator.initialize(currentAdventure, gameState);
            }
        }
    }
    
    modal.style.display = 'block';
}

// Enhanced display location function
function displayLocation(locationId) {
    const location = currentAdventure.locations[locationId];
    if (!location) {
        uiManager.printHTML('Error: Location not found.', 'text-error');
        return;
    }
    
    // Track location visited for achievements and journal
    if (!gameState.visitedLocations.includes(locationId)) {
        gameState.visitedLocations.push(locationId);
        
        // Track for achievements
        if (typeof achievementSystem !== 'undefined' && achievementSystem.trackRoomVisited) {
            achievementSystem.trackRoomVisited(locationId);
        }
    }
    
    // Check for plot events at this location
    checkPlotEvents();
    
    // Update map data
    if (!mapData.visited.includes(locationId)) {
        mapData.visited.push(locationId);
    }
    mapData.currentLocation = locationId;
    
    // Update map regardless of whether the map modal is open
    if (typeof mapGenerator !== 'undefined' && mapGenerator.updateMap) {
        mapGenerator.updateMap(currentAdventure, gameState);
    }
    
    // Print location name
    uiManager.printHTML(`<span class="text-location">${location.name}</span>`, 'text-emphasis');
    
    // Print location description
    uiManager.printHTML(location.description);
    
    // Print visible exits
    const exits = Object.keys(location.exits).filter(dir => {
        const exit = location.exits[dir];
        return !exit.hidden || (exit.condition && evaluateCondition(exit.condition));
    });
    
    if (exits.length > 0) {
        uiManager.printHTML(`Obvious exits: ${exits.join(', ')}`);
    } else {
        uiManager.printHTML('There are no obvious exits.');
    }
    
    // Print visible items
    const items = location.items || [];
    items.forEach(itemId => {
        const item = currentAdventure.items[itemId];
        if (item && (!item.hidden || (item.condition && evaluateCondition(item.condition)))) {
            uiManager.printHTML(`There is a <span class="text-item">${item.name}</span> here.`);
        }
    });
    
    // Check for achievements
    if (typeof achievementSystem !== 'undefined' && achievementSystem.checkAdventureAchievements) {
        achievementSystem.checkAdventureAchievements(currentAdventure.id, gameState);
    }
}

// Helper function to calculate position from direction
function calculateMapPosition(direction) {
    const center = { x: 250, y: 250 };
    const distance = 80;
    
    const vectors = {
        north: { x: 0, y: -1 },
        south: { x: 0, y: 1 },
        east: { x: 1, y: 0 },
        west: { x: -1, y: 0 },
        northeast: { x: 0.7, y: -0.7 },
        northwest: { x: -0.7, y: -0.7 },
        southeast: { x: 0.7, y: 0.7 },
        southwest: { x: -0.7, y: 0.7 },
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        // Shortcuts
        n: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        e: { x: 1, y: 0 },
        w: { x: -1, y: 0 },
        ne: { x: 0.7, y: -0.7 },
        nw: { x: -0.7, y: -0.7 },
        se: { x: 0.7, y: 0.7 },
        sw: { x: -0.7, y: 0.7 },
        u: { x: 0, y: -1 },
        d: { x: 0, y: 1 }
    };
    
    const vector = vectors[direction.toLowerCase()] || { x: 0, y: 0 };
    
    return {
        x: center.x + (vector.x * distance),
        y: center.y + (vector.y * distance)
    };
}

// Enhanced start adventure function with proper map initialization
async function startAdventure(adventureId) {
    // Reset game state
    gameState.inventory = [];
    gameState.gameFlags = {};
    gameState.moveCount = 0;
    gameState.score = 0;
    gameState.visitedLocations = []; // Track visited locations for achievements
    gameState.collectedItems = []; // Track collected items for achievements
    
    // Reset map data
    mapData = {
        nodes: {},
        visited: [],
        currentLocation: null
    };
    
    // Clear game output
    uiManager.clearOutput();
    
    // Display loading message
    uiManager.printHTML("Loading adventure...", 'text-normal');
    
    // Disable input while loading
    uiManager.disableInput();
    
    try {
        // Load the adventure
        const adventure = await adventureLoader.loadAdventure(adventureId);
        
        if (!adventure) {
            throw new Error(`Adventure '${adventureId}' not found.`);
        }
        
        currentAdventure = adventure;
        
        // Set initial location
        gameState.currentLocation = adventure.initialLocation;
        
        // Add initial location to visited locations
        gameState.visitedLocations.push(adventure.initialLocation);
        mapData.visited.push(adventure.initialLocation);
        mapData.currentLocation = adventure.initialLocation;
        
        // Create initial node for the current location
        const initialLocation = adventure.locations[adventure.initialLocation];
        if (initialLocation) {
            mapData.nodes[adventure.initialLocation] = {
                id: adventure.initialLocation,
                name: initialLocation.name,
                x: 250,
                y: 250,
                connections: []
            };
            
            // Add any visible connected nodes
            if (initialLocation.exits) {
                Object.entries(initialLocation.exits).forEach(([direction, exit]) => {
                    if (!exit.hidden && adventure.locations[exit.destination]) {
                        const destLocation = adventure.locations[exit.destination];
                        const position = calculateMapPosition(direction);
                        
                        // Add the node
                        mapData.nodes[exit.destination] = {
                            id: exit.destination,
                            name: destLocation.name,
                            x: position.x,
                            y: position.y,
                            connections: []
                        };
                        
                        // Add the connection
                        mapData.nodes[adventure.initialLocation].connections.push({
                            to: exit.destination,
                            direction: direction
                        });
                    }
                });
            }
        }
        
        // Clear loading message
        uiManager.clearOutput();
        
        // Display intro text
        uiManager.printHTML(adventure.introText);
        
        // Display current location
        displayLocation(gameState.currentLocation);
        
        // Initialize map if available
        if (typeof mapGenerator !== 'undefined' && mapGenerator.initialize) {
            mapGenerator.initialize(adventure, gameState);
        }
        
        // Set current adventure for journal
        if (typeof storyJournal !== 'undefined' && storyJournal.setCurrentAdventure) {
            storyJournal.setCurrentAdventure(adventureId);
        }
        
        // Track adventure started for achievements
        if (typeof achievementSystem !== 'undefined' && achievementSystem.trackAdventureStarted) {
            achievementSystem.trackAdventureStarted(adventureId);
        }
        
        // Re-enable input
        uiManager.enableInput();
        
    } catch (error) {
        uiManager.printHTML(`Error loading adventure: ${error.message}`, 'text-error');
        console.error('Error loading adventure:', error);
        uiManager.enableInput();
    }
}

// Enhanced display location function
function displayLocation(locationId) {
    const location = currentAdventure.locations[locationId];
    if (!location) {
        uiManager.printHTML('Error: Location not found.', 'text-error');
        return;
    }
    
    // Track location visited for achievements and journal
    if (!gameState.visitedLocations.includes(locationId)) {
        gameState.visitedLocations.push(locationId);
        
        // Track for achievements
        if (typeof achievementSystem !== 'undefined' && achievementSystem.trackRoomVisited) {
            achievementSystem.trackRoomVisited(locationId);
        }
    }
    
    // Check for plot events at this location
    checkPlotEvents();
    
    // Update map if available
    if (typeof mapGenerator !== 'undefined' && mapGenerator.updateMap) {
        mapGenerator.updateMap(currentAdventure, gameState);
    }
    
    // Print location name
    uiManager.printHTML(`<span class="text-location">${location.name}</span>`, 'text-emphasis');
    
    // Print location description
    uiManager.printHTML(location.description);
    
    // Print visible exits
    const exits = Object.keys(location.exits).filter(dir => {
        const exit = location.exits[dir];
        return !exit.hidden || (exit.condition && evaluateCondition(exit.condition));
    });
    
    if (exits.length > 0) {
        uiManager.printHTML(`Obvious exits: ${exits.join(', ')}`);
    } else {
        uiManager.printHTML('There are no obvious exits.');
    }
    
    // Print visible items
    const items = location.items || [];
    items.forEach(itemId => {
        const item = currentAdventure.items[itemId];
        if (item && (!item.hidden || (item.condition && evaluateCondition(item.condition)))) {
            uiManager.printHTML(`There is a <span class="text-item">${item.name}</span> here.`);
        }
    });
    
    // Check for achievements
    if (typeof achievementSystem !== 'undefined' && achievementSystem.checkAdventureAchievements) {
        achievementSystem.checkAdventureAchievements(currentAdventure.id, gameState);
    }
}

// Check for plot events
function checkPlotEvents() {
    if (!currentAdventure.plotEvents) return;
    
    currentAdventure.plotEvents.forEach(event => {
        if (!event.triggered && event.condition && event.condition(gameState)) {
            // Mark as triggered
            event.triggered = true;
            
            // Add to journal if it has a journal entry
            if (event.journalEntry && typeof storyJournal !== 'undefined' && storyJournal.addAutoEntry) {
                storyJournal.addAutoEntry(event.journalEntry, gameState.currentLocation);
            }
        }
    });
}

// Enhanced process command function
function processCommand(command) {
    // Increment move count
    gameState.moveCount++;
    
    // Track command for achievements
    if (typeof achievementSystem !== 'undefined' && achievementSystem.trackCommandEntered) {
        achievementSystem.trackCommandEntered();
    }
    
    try {
        // Parse and handle the command
        const result = commandHandler.handleCommand(command, gameState, currentAdventure);
        
        // Display result
        if (result.message) {
            uiManager.printHTML(result.message, result.success ? 'text-success' : 'text-error');
        }
        
        // If location changed, display new location
        if (result.locationChanged) {
            displayLocation(gameState.currentLocation);
        }
        
        // Update inventory if needed
        if (result.inventoryChanged) {
            updateInventoryDisplay();
        }
        
        // If an item was taken, track it for achievements
        if (result.itemTaken && typeof achievementSystem !== 'undefined' && achievementSystem.trackItemTaken) {
            achievementSystem.trackItemTaken();
            
            // Add to collected items for achievement tracking
            if (!gameState.collectedItems.includes(result.itemId)) {
                gameState.collectedItems.push(result.itemId);
            }
        }
        
        // Check for game over or victory conditions
        checkGameConditions();
        
        // Check for achievements
        if (typeof achievementSystem !== 'undefined' && achievementSystem.checkAdventureAchievements) {
            achievementSystem.checkAdventureAchievements(currentAdventure.id, gameState);
        }
    } catch (error) {
        uiManager.printHTML(`Error processing command: ${error.message}`, 'text-error');
        console.error(error);
    }
}

// Show autocomplete suggestions
function showAutocompleteSuggestions(inputText) {
    const suggestions = autoCompleteHandler.getSuggestions(inputText, gameState, currentAdventure);
    
    if (suggestions.length === 0) {
        hideAutocompleteSuggestions();
        return;
    }
    
    autocompleteSuggestions.innerHTML = '';
    suggestions.forEach(suggestion => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = suggestion;
        div.addEventListener('click', () => {
            // Track autocomplete usage for achievements when clicked
            if (typeof achievementSystem !== 'undefined' && achievementSystem.trackAutocompleteUsed) {
                achievementSystem.trackAutocompleteUsed();
            }
            
            commandInput.value = suggestion;
            hideAutocompleteSuggestions();
            commandInput.focus();
        });
        autocompleteSuggestions.appendChild(div);
    });
    
    // Select the first suggestion by default
    const firstSuggestion = autocompleteSuggestions.firstElementChild;
    if (firstSuggestion) {
        firstSuggestion.classList.add('selected');
    }
    
    autocompleteSuggestions.style.display = 'block';
}

// Enhanced check game conditions function
function checkGameConditions() {
    // Check victory condition
    if (currentAdventure.victoryCondition && evaluateCondition(currentAdventure.victoryCondition)) {
        uiManager.printHTML(currentAdventure.victoryText || 'Congratulations! You have won!', 'text-success');
        uiManager.printHTML(`Your score: ${gameState.score} in ${gameState.moveCount} moves.`);
        
        // Track adventure completed for achievements
        if (typeof achievementSystem !== 'undefined' && achievementSystem.trackAdventureCompleted) {
            achievementSystem.trackAdventureCompleted(currentAdventure.id);
        }
    }
    
    // Check game over condition
    if (currentAdventure.gameOverCondition && evaluateCondition(currentAdventure.gameOverCondition)) {
        const gameOverText = typeof currentAdventure.gameOverText === 'function' 
            ? currentAdventure.gameOverText(gameState) 
            : currentAdventure.gameOverText || 'Game Over!';
            
        uiManager.printHTML(gameOverText, 'text-error');
    }
}

// Handle adventure selection change
function handleAdventureChange() {
    // Preview the selected adventure
    const selectedId = adventureSelect.value;
    previewAdventure(selectedId);
}

// Preview adventure info
function previewAdventure(adventureId) {
    if (adventureInfoContainer) {
        const adventures = adventureLoader.getAvailableAdventures();
        const adventure = adventures.find(a => a.id === adventureId);
        
        if (adventure) {
            adventureInfoContainer.innerHTML = `
                <h3>${adventure.title} v${adventure.version}</h3>
                <p><em>By ${adventure.author}</em></p>
                <p>${adventure.description || 'No description available.'}</p>
            `;
        } else {
            adventureInfoContainer.innerHTML = '<p>Adventure information not available.</p>';
        }
    }
}

// Update adventure selection dropdown
function updateAdventureSelection() {
    // Clear existing options
    adventureSelect.innerHTML = '';
    
    // Get available adventures
    const adventures = adventureLoader.getAvailableAdventures();
    
    // Add options
    adventures.forEach(adventure => {
        const option = document.createElement('option');
        option.value = adventure.id;
        option.textContent = adventure.title;
        adventureSelect.appendChild(option);
    });
    
    // Set current adventure
    if (adventureLoader.hasAdventure(gamePreferences.currentAdventure)) {
        adventureSelect.value = gamePreferences.currentAdventure;
    } else if (adventures.length > 0) {
        adventureSelect.value = adventures[0].id;
    }
    
    // Preview the selected adventure
    previewAdventure(adventureSelect.value);
}

// Handle import adventure
function handleImportAdventure() {
    // Here you would typically show a file picker or text area
    // For simplicity, we'll use a prompt
    const jsonData = prompt("Paste adventure JSON data:");
    if (jsonData) {
        const adventureId = adventureLoader.importAdventure(jsonData);
        if (adventureId) {
            updateAdventureSelection();
            adventureSelect.value = adventureId;
            previewAdventure(adventureId);
            alert("Adventure imported successfully!");
        } else {
            alert("Failed to import adventure. Check console for errors.");
        }
    }
}

// Load settings from local storage
function loadSettings() {
    const savedPreferences = localStorage.getItem('zorkPreferences');
    if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences);
        Object.assign(gamePreferences, parsed);
    }
}

// Save settings to local storage
function saveSettings() {
    gamePreferences.textColor = textColorSelect.value;
    gamePreferences.fontSize = parseInt(fontSizeRange.value);
    gamePreferences.currentAdventure = adventureSelect.value;
    
    localStorage.setItem('zorkPreferences', JSON.stringify(gamePreferences));
    
    applySettings();
    closeAllModals();
    
    // If adventure changed, restart with new adventure
    if (currentAdventure && gamePreferences.currentAdventure !== currentAdventure.id) {
        startAdventure(gamePreferences.currentAdventure);
    }
    
    commandInput.focus();
}

// Apply visual settings
function applySettings() {
    document.documentElement.style.setProperty('--text-color', getColorValue(gamePreferences.textColor));
    document.documentElement.style.setProperty('--font-size', `${gamePreferences.fontSize}px`);
}

// Get actual color value from setting name
function getColorValue(colorName) {
    const colorMap = {
        'green': '#33ff33',
        'amber': '#ffb000',
        'white': '#ffffff',
        'blue': '#66ccff'
    };
    return colorMap[colorName] || colorMap.green;
}

// Start a specific adventure
async function startAdventure(adventureId) {
    // Reset game state
    gameState.inventory = [];
    gameState.gameFlags = {};
    gameState.moveCount = 0;
    gameState.score = 0;
    
    // Clear game output
    gameOutput.innerHTML = '';
    
    // Display loading message
    printToGameOutput("Loading adventure...", 'text-normal');
    
    // Disable input while loading
    commandInput.disabled = true;
    
    try {
        // Load the adventure
        const adventure = await adventureLoader.loadAdventure(adventureId);
        
        if (!adventure) {
            throw new Error(`Adventure '${adventureId}' not found.`);
        }
        
        currentAdventure = adventure;
        
        // Set initial location
        gameState.currentLocation = adventure.initialLocation;
        
        // Clear loading message
        gameOutput.innerHTML = '';
        
        // Display intro text
        printToGameOutput(adventure.introText);
        
        // Display current location
        displayLocation(gameState.currentLocation);
        
        // Re-enable input
        commandInput.disabled = false;
        commandInput.focus();
        
    } catch (error) {
        printToGameOutput(`Error loading adventure: ${error.message}`, 'text-error');
        console.error('Error loading adventure:', error);
    }
}

// Print text to the game output
function printToGameOutput(text, className = 'text-normal') {
    const p = document.createElement('p');
    p.className = className;
    p.innerHTML = text;
    gameOutput.appendChild(p);
    
    // Scroll to bottom
    gameOutput.scrollTop = gameOutput.scrollHeight;
}

// Display the current location
function displayLocation(locationId) {
    const location = currentAdventure.locations[locationId];
    if (!location) {
        printToGameOutput('Error: Location not found.', 'text-error');
        return;
    }
    
    // Print location name
    printToGameOutput(`<span class="text-location">${location.name}</span>`, 'text-emphasis');
    
    // Print location description
    printToGameOutput(location.description);
    
    // Print visible exits
    const exits = Object.keys(location.exits).filter(dir => {
        const exit = location.exits[dir];
        return !exit.hidden || (exit.condition && evaluateCondition(exit.condition));
    });
    
    if (exits.length > 0) {
        printToGameOutput(`Obvious exits: ${exits.join(', ')}`);
    } else {
        printToGameOutput('There are no obvious exits.');
    }
    
    // Print visible items
    const items = location.items || [];
    items.forEach(itemId => {
        const item = currentAdventure.items[itemId];
        if (item && (!item.hidden || (item.condition && evaluateCondition(item.condition)))) {
            printToGameOutput(`There is a <span class="text-item">${item.name}</span> here.`);
        }
    });
}

// Handle command input keydown with enhanced autocomplete
function handleCommandInputKeydown(e) {
    if (e.key === 'Enter') {
        const command = commandInput.value.trim();
        if (command) {
            // If autocomplete is visible and command is incomplete, use the first suggestion
            if (autocompleteSuggestions.style.display === 'block') {
                const selected = autocompleteSuggestions.querySelector('.selected');
                if (selected) {
                    commandInput.value = selected.textContent;
                } else {
                    // If no suggestion is selected, use the first one
                    const firstSuggestion = autocompleteSuggestions.querySelector('.suggestion-item');
                    if (firstSuggestion) {
                        commandInput.value = firstSuggestion.textContent;
                    }
                }
            }
            
            // Process the command (now potentially replaced with autocomplete)
            const finalCommand = commandInput.value.trim();
            
            // Add command to history
            printToGameOutput(`> ${finalCommand}`, 'command-history');
            
            // Process command
            processCommand(finalCommand);
            
            // Clear input
            commandInput.value = '';
            
            // Clear autocomplete suggestions
            hideAutocompleteSuggestions();
        }
    } else if (e.key === 'Tab') {
        e.preventDefault();
        if (autocompleteSuggestions.style.display === 'block') {
            const selected = autocompleteSuggestions.querySelector('.selected');
            if (selected) {
                commandInput.value = selected.textContent;
            } else {
                // If no suggestion is selected, use the first one
                const firstSuggestion = autocompleteSuggestions.querySelector('.suggestion-item');
                if (firstSuggestion) {
                    commandInput.value = firstSuggestion.textContent;
                }
            }
            // Hide suggestions after selection
            hideAutocompleteSuggestions();
        }
    } else if (e.key === 'ArrowDown') {
        if (autocompleteSuggestions.style.display === 'block') {
            e.preventDefault();
            const selected = autocompleteSuggestions.querySelector('.selected');
            if (selected) {
                const next = selected.nextElementSibling;
                if (next) {
                    selected.classList.remove('selected');
                    next.classList.add('selected');
                }
            } else {
                const first = autocompleteSuggestions.firstElementChild;
                if (first) {
                    first.classList.add('selected');
                }
            }
        }
    } else if (e.key === 'ArrowUp') {
        if (autocompleteSuggestions.style.display === 'block') {
            e.preventDefault();
            const selected = autocompleteSuggestions.querySelector('.selected');
            if (selected) {
                const prev = selected.previousElementSibling;
                if (prev) {
                    selected.classList.remove('selected');
                    prev.classList.add('selected');
                }
            } else {
                const last = autocompleteSuggestions.lastElementChild;
                if (last) {
                    last.classList.add('selected');
                }
            }
        }
    } else if (e.key === 'Escape') {
        hideAutocompleteSuggestions();
    }
}

// Handle command input change
function handleCommandInputChange() {
    const inputText = commandInput.value.trim().toLowerCase();
    if (inputText.length > 0) {
        showAutocompleteSuggestions(inputText);
    } else {
        hideAutocompleteSuggestions();
    }
}

// Process a command
function processCommand(command) {
    // Increment move count
    gameState.moveCount++;
    
    try {
        // Parse and handle the command
        const result = commandHandler.handleCommand(command, gameState, currentAdventure);
        
        // Display result
        if (result.message) {
            printToGameOutput(result.message, result.success ? 'text-success' : 'text-error');
        }
        
        // If location changed, display new location
        if (result.locationChanged) {
            displayLocation(gameState.currentLocation);
        }
        
        // Update inventory if needed
        if (result.inventoryChanged) {
            updateInventoryDisplay();
        }
        
        // Check for game over or victory conditions
        checkGameConditions();
    } catch (error) {
        printToGameOutput(`Error processing command: ${error.message}`, 'text-error');
        console.error(error);
    }
}

// Check for game over or victory conditions
function checkGameConditions() {
    // Check victory condition
    if (currentAdventure.victoryCondition && evaluateCondition(currentAdventure.victoryCondition)) {
        printToGameOutput(currentAdventure.victoryText || 'Congratulations! You have won!', 'text-success');
        printToGameOutput(`Your score: ${gameState.score} in ${gameState.moveCount} moves.`);
    }
    
    // Check game over condition
    if (currentAdventure.gameOverCondition && evaluateCondition(currentAdventure.gameOverCondition)) {
        const gameOverText = typeof currentAdventure.gameOverText === 'function' 
            ? currentAdventure.gameOverText(gameState) 
            : currentAdventure.gameOverText || 'Game Over!';
            
        printToGameOutput(gameOverText, 'text-error');
    }
}

// Evaluate a condition based on game state
function evaluateCondition(condition) {
    // Simple condition evaluator
    if (typeof condition === 'function') {
        return condition(gameState);
    } else if (typeof condition === 'string') {
        // Check if item is in inventory
        if (condition.startsWith('has:')) {
            const itemId = condition.substring(4);
            return gameState.inventory.includes(itemId);
        }
        // Check if a flag is set
        else if (condition.startsWith('flag:')) {
            const flagName = condition.substring(5);
            return Boolean(gameState.gameFlags[flagName]);
        }
    }
    return false;
}

// Update inventory display
function updateInventoryDisplay() {
    inventoryContent.innerHTML = '';
    
    if (gameState.inventory.length === 0) {
        inventoryContent.innerHTML = '<p>You are not carrying anything.</p>';
        return;
    }
    
    const list = document.createElement('ul');
    gameState.inventory.forEach(itemId => {
        const item = currentAdventure.items[itemId];
        if (item) {
            const li = document.createElement('li');
            li.innerHTML = `<span class="text-item">${item.name}</span> - ${item.description}`;
            list.appendChild(li);
        }
    });
    
    inventoryContent.appendChild(list);
}

// Show autocomplete suggestions
function showAutocompleteSuggestions(inputText) {
    const suggestions = autoCompleteHandler.getSuggestions(inputText, gameState, currentAdventure);
    
    if (suggestions.length === 0) {
        hideAutocompleteSuggestions();
        return;
    }
    
    // Track autocomplete usage for achievements
    if (typeof achievementSystem !== 'undefined' && achievementSystem.trackAutocompleteUsed) {
        achievementSystem.trackAutocompleteUsed();
    }
    
    autocompleteSuggestions.innerHTML = '';
    suggestions.forEach(suggestion => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = suggestion;
        div.addEventListener('click', () => {
            commandInput.value = suggestion;
            hideAutocompleteSuggestions();
            commandInput.focus();
        });
        autocompleteSuggestions.appendChild(div);
    });
    
    // Select the first suggestion by default
    const firstSuggestion = autocompleteSuggestions.firstElementChild;
    if (firstSuggestion) {
        firstSuggestion.classList.add('selected');
    }
    
    autocompleteSuggestions.style.display = 'block';
}

// Hide autocomplete suggestions
function hideAutocompleteSuggestions() {
    autocompleteSuggestions.style.display = 'none';
    autocompleteSuggestions.innerHTML = '';
}

// Modal functions
function openModal(modal) {
    closeAllModals();
    
    // Update content if needed
    if (modal === inventoryModal) {
        updateInventoryDisplay();
    }
    
    modal.style.display = 'block';
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Initialize the game when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initGame);