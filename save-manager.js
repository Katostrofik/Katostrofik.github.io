// Save Manager for ModernZork
// Handles saving and loading game states

const saveManager = (() => {
    // Save data storage key prefix
    const SAVE_KEY_PREFIX = 'modernzork_save_';
    
    // Initialize the save manager
    function initialize() {
        // Update saved games list
        updateSavedGamesList();
        
        // Set up event listeners
        const saveBtn = document.getElementById('save-game-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', handleSaveGame);
        }
        
        // Set up save-game modal button
        const saveModalBtn = document.getElementById('save-btn');
        if (saveModalBtn) {
            saveModalBtn.addEventListener('click', () => openSaveModal());
        }
    }
    
    // Handle save game button click
    function handleSaveGame() {
        const saveName = document.getElementById('save-name').value.trim();
        
        if (!saveName) {
            alert('Please enter a name for your save.');
            return;
        }
        
        saveGame(saveName);
    }
    
    // Open the save modal
    function openSaveModal() {
        const modal = document.getElementById('save-modal');
        if (modal) {
            // Update saved games list
            updateSavedGamesList();
            
            // Show modal
            modal.style.display = 'block';
            
            // Set default save name
            const saveNameInput = document.getElementById('save-name');
            if (saveNameInput) {
                const defaultName = generateDefaultSaveName();
                saveNameInput.value = defaultName;
            }
        }
    }
    
    // Generate a default save name based on adventure and date
    function generateDefaultSaveName() {
        const now = new Date();
        const date = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
        const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        // Get current adventure name
        let adventureName = 'Adventure';
        if (currentAdventure && currentAdventure.title) {
            adventureName = currentAdventure.title;
        }
        
        return `${adventureName} - ${date} ${time}`;
    }
    
    // Save the current game state
    function saveGame(saveName) {
        try {
            // Create save data object
            const saveData = {
                timestamp: Date.now(),
                adventureId: currentAdventure.id,
                gameState: {
                    currentLocation: gameState.currentLocation,
                    inventory: [...gameState.inventory],
                    gameFlags: {...gameState.gameFlags},
                    moveCount: gameState.moveCount,
                    score: gameState.score,
                    visited: mapData ? [...mapData.visited] : []
                }
            };
            
            // Generate a save key
            const saveKey = `${SAVE_KEY_PREFIX}${Date.now()}`;
            
            // Create save info
            const saveInfo = {
                key: saveKey,
                name: saveName,
                timestamp: Date.now(),
                adventureId: currentAdventure.id,
                adventureTitle: currentAdventure.title || 'Unknown Adventure',
                location: currentAdventure.locations[gameState.currentLocation].name,
                moves: gameState.moveCount,
                score: gameState.score
            };
            
            // Save game data
            localStorage.setItem(saveKey, JSON.stringify(saveData));
            
            // Add to saves index
            addToSavesIndex(saveInfo);
            
            // Update saved games list
            updateSavedGamesList();
            
            // Show success message
            uiManager.printHTML(`Game saved as "${saveName}"`, 'text-success');
            
            // Close modal if it's open
            closeModals();
            
            return true;
        } catch (error) {
            console.error('Error saving game:', error);
            alert('Failed to save game: ' + error.message);
            return false;
        }
    }
    
    // Load a saved game
    function loadGame(saveKey) {
        try {
            // Get save data
            const saveDataStr = localStorage.getItem(saveKey);
            if (!saveDataStr) {
                throw new Error('Save data not found');
            }
            
            const saveData = JSON.parse(saveDataStr);
            
            // Check if adventure exists
            if (!adventureLoader.hasAdventure(saveData.adventureId)) {
                throw new Error(`Required adventure "${saveData.adventureId}" is not available`);
            }
            
            // Load the adventure
            const adventure = adventureLoader.loadAdventure(saveData.adventureId);
            if (!adventure) {
                throw new Error('Failed to load adventure');
            }
            
            // Set current adventure
            currentAdventure = adventure;
            
            // Reset game state and copy from save
            Object.assign(gameState, saveData.gameState);
            
            // Update preferences for current adventure
            gamePreferences.currentAdventure = saveData.adventureId;
            
            // Clear game output
            uiManager.clearOutput();
            
            // Display loaded message
            uiManager.printHTML('Game loaded successfully!', 'text-success');
            
            // Display current location
            displayLocation(gameState.currentLocation);
            
            // Initialize map with saved visited locations
            if (mapGenerator && saveData.gameState.visited) {
                mapData = {
                    nodes: {},
                    visited: saveData.gameState.visited,
                    currentLocation: gameState.currentLocation
                };
                mapGenerator.initialize(currentAdventure, gameState);
            }
            
            // Close modal
            closeModals();
            
            // Focus command input
            commandInput.focus();
            
            return true;
        } catch (error) {
            console.error('Error loading game:', error);
            alert('Failed to load game: ' + error.message);
            return false;
        }
    }
    
    // Delete a saved game
    function deleteSave(saveKey) {
        try {
            // Remove from localStorage
            localStorage.removeItem(saveKey);
            
            // Remove from saves index
            removeFromSavesIndex(saveKey);
            
            // Update saved games list
            updateSavedGamesList();
            
            return true;
        } catch (error) {
            console.error('Error deleting save:', error);
            return false;
        }
    }
    
    // Get saves index
    function getSavesIndex() {
        const indexStr = localStorage.getItem('modernzork_saves_index');
        if (!indexStr) return [];
        
        try {
            return JSON.parse(indexStr);
        } catch (error) {
            console.error('Error parsing saves index:', error);
            return [];
        }
    }
    
    // Add save info to saves index
    function addToSavesIndex(saveInfo) {
        const savesIndex = getSavesIndex();
        
        // Check if save with this key already exists
        const existingIndex = savesIndex.findIndex(s => s.key === saveInfo.key);
        
        if (existingIndex >= 0) {
            // Update existing save info
            savesIndex[existingIndex] = saveInfo;
        } else {
            // Add new save info
            savesIndex.push(saveInfo);
        }
        
        // Sort by timestamp (newest first)
        savesIndex.sort((a, b) => b.timestamp - a.timestamp);
        
        // Save updated index
        localStorage.setItem('modernzork_saves_index', JSON.stringify(savesIndex));
    }
    
    // Remove save from saves index
    function removeFromSavesIndex(saveKey) {
        const savesIndex = getSavesIndex().filter(s => s.key !== saveKey);
        localStorage.setItem('modernzork_saves_index', JSON.stringify(savesIndex));
    }
    
    // Update the saved games list in the UI
    function updateSavedGamesList() {
        const savedGamesList = document.getElementById('saved-games-list');
        if (!savedGamesList) return;
        
        // Get saves index
        const savesIndex = getSavesIndex();
        
        if (savesIndex.length === 0) {
            savedGamesList.innerHTML = '<p class="no-saves">No saved games found.</p>';
            return;
        }
        
        // Clear list
        savedGamesList.innerHTML = '';
        
        // Add each save
        savesIndex.forEach(saveInfo => {
            const saveDate = new Date(saveInfo.timestamp);
            const dateStr = saveDate.toLocaleDateString();
            const timeStr = saveDate.toLocaleTimeString();
            
            const saveItem = document.createElement('div');
            saveItem.className = 'save-item';
            saveItem.innerHTML = `
                <div class="save-info">
                    <h4>${saveInfo.name}</h4>
                    <p>Adventure: ${saveInfo.adventureTitle}</p>
                    <p>Location: ${saveInfo.location}</p>
                    <p>Moves: ${saveInfo.moves} | Score: ${saveInfo.score}</p>
                    <p class="save-date">${dateStr} ${timeStr}</p>
                </div>
                <div class="save-actions">
                    <button class="btn load-btn">Load</button>
                    <button class="btn delete-btn">Delete</button>
                </div>
            `;
            
            // Add event listeners
            const loadBtn = saveItem.querySelector('.load-btn');
            const deleteBtn = saveItem.querySelector('.delete-btn');
            
            loadBtn.addEventListener('click', () => loadGame(saveInfo.key));
            deleteBtn.addEventListener('click', () => {
                if (confirm(`Are you sure you want to delete "${saveInfo.name}"?`)) {
                    deleteSave(saveInfo.key);
                }
            });
            
            savedGamesList.appendChild(saveItem);
        });
    }
    
    // Helper function to close all modals
    function closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    // Public API
    return {
        initialize,
        saveGame,
        loadGame,
        deleteSave,
        openSaveModal
    };
})();