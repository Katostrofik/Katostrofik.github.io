// Story Journal for ModernZork
// Allows players to track story events and add personal notes

const storyJournal = (() => {
    // Storage keys
    const JOURNAL_STORAGE_KEY = 'modernzork_journal';
    
    // Journal entry types
    const ENTRY_TYPE = {
        AUTO: 'auto',    // Automatically added by the game
        PLAYER: 'player' // Added by the player
    };
    
    // Journal data structure
    let journalData = {
        adventures: {} // Entries grouped by adventure ID
    };
    
    // Current adventure ID
    let currentAdventureId = null;
    
    // Journal mode
    let journalMode = {
        autoEnabled: true,  // Whether auto-entries are enabled
        playerEnabled: true // Whether player notes are enabled
    };
    
    // Frequently used game elements for autocomplete
    let autocompleteElements = {
        items: [],
        locations: [],
        characters: []
    };
    
    // Initialize the journal system
    function initialize() {
        // Load saved journal data
        loadJournalData();
        
        // Set up the journal UI
        setupJournalUI();
        
        // Add journal button to header if it doesn't exist
        if (!document.getElementById('journal-btn')) {
            const gameControls = document.querySelector('.game-controls');
            if (gameControls) {
                const journalBtn = document.createElement('button');
                journalBtn.id = 'journal-btn';
                journalBtn.className = 'control-btn';
                journalBtn.title = 'Story Journal';
                journalBtn.innerHTML = '<i class="fas fa-book-open"></i>';
                journalBtn.addEventListener('click', () => openJournalModal());
                
                // Insert after inventory button
                const inventoryBtn = document.getElementById('inventory-btn');
                if (inventoryBtn) {
                    gameControls.insertBefore(journalBtn, inventoryBtn.nextSibling);
                } else {
                    gameControls.appendChild(journalBtn);
                }
            }
        }
    }
    
    // Set up the journal UI
    function setupJournalUI() {
        // Create journal modal if it doesn't exist
        if (!document.getElementById('journal-modal')) {
            const modal = document.createElement('div');
            modal.id = 'journal-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Story Journal</h2>
                        <span class="close-modal">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="journal-top-controls">
                            <div class="journal-mode-toggle">
                                <label>
                                    <input type="checkbox" id="journal-auto-toggle" checked>
                                    Auto Entries
                                </label>
                                <label>
                                    <input type="checkbox" id="journal-player-toggle" checked>
                                    Player Notes
                                </label>
                            </div>
                            <div class="journal-buttons">
                                <button id="add-journal-entry-btn" class="btn">Add Note</button>
                            </div>
                        </div>
                        
                        <div class="journal-entries" id="journal-entries-container">
                            <!-- Journal entries will be loaded here -->
                            <p class="no-entries">No journal entries yet.</p>
                        </div>
                        
                        <div class="journal-entry-form" id="journal-entry-form" style="display:none;">
                            <textarea id="journal-entry-text" placeholder="Write your notes here..."></textarea>
                            <div class="autocomplete-container" id="journal-autocomplete-container"></div>
                            <div class="journal-form-buttons">
                                <button id="save-journal-entry-btn" class="btn">Save Note</button>
                                <button id="cancel-journal-entry-btn" class="btn">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add event listeners
            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
            
            const addEntryBtn = modal.querySelector('#add-journal-entry-btn');
            addEntryBtn.addEventListener('click', () => showJournalEntryForm());
            
            const saveEntryBtn = modal.querySelector('#save-journal-entry-btn');
            saveEntryBtn.addEventListener('click', () => savePlayerEntry());
            
            const cancelEntryBtn = modal.querySelector('#cancel-journal-entry-btn');
            cancelEntryBtn.addEventListener('click', () => hideJournalEntryForm());
            
            const autoToggle = modal.querySelector('#journal-auto-toggle');
            autoToggle.addEventListener('change', () => {
                journalMode.autoEnabled = autoToggle.checked;
                saveJournalMode();
                updateJournalDisplay();
            });
            
            const playerToggle = modal.querySelector('#journal-player-toggle');
            playerToggle.addEventListener('change', () => {
                journalMode.playerEnabled = playerToggle.checked;
                saveJournalMode();
                updateJournalDisplay();
            });
            
            // Set up journal entry text input with auto-complete
            const journalEntryText = modal.querySelector('#journal-entry-text');
            journalEntryText.addEventListener('input', handleJournalTextInput);
        }
    }
    
    // Open the journal modal
    function openJournalModal() {
        const modal = document.getElementById('journal-modal');
        if (modal) {
            // Update journal display
            updateJournalDisplay();
            
            // Update autocomplete elements from current adventure
            updateAutocompleteElements();
            
            // Set journal mode toggles
            const autoToggle = document.getElementById('journal-auto-toggle');
            const playerToggle = document.getElementById('journal-player-toggle');
            
            if (autoToggle) autoToggle.checked = journalMode.autoEnabled;
            if (playerToggle) playerToggle.checked = journalMode.playerEnabled;
            
            // Hide entry form
            hideJournalEntryForm();
            
            // Show modal
            modal.style.display = 'block';
        }
    }
    
    // Show the journal entry form
    function showJournalEntryForm() {
        const form = document.getElementById('journal-entry-form');
        const entriesContainer = document.getElementById('journal-entries-container');
        const addButton = document.getElementById('add-journal-entry-btn');
        
        if (form && entriesContainer && addButton) {
            form.style.display = 'block';
            entriesContainer.style.display = 'none';
            addButton.style.display = 'none';
            
            // Focus the text area
            const textarea = document.getElementById('journal-entry-text');
            if (textarea) {
                textarea.value = '';
                textarea.focus();
            }
        }
    }
    
    // Hide the journal entry form
    function hideJournalEntryForm() {
        const form = document.getElementById('journal-entry-form');
        const entriesContainer = document.getElementById('journal-entries-container');
        const addButton = document.getElementById('add-journal-entry-btn');
        
        if (form && entriesContainer && addButton) {
            form.style.display = 'none';
            entriesContainer.style.display = 'block';
            addButton.style.display = 'inline-block';
        }
    }
    
    // Save a player-created journal entry
    function savePlayerEntry() {
        const textarea = document.getElementById('journal-entry-text');
        
        if (textarea && textarea.value.trim()) {
            addJournalEntry({
                text: textarea.value.trim(),
                type: ENTRY_TYPE.PLAYER,
                timestamp: Date.now(),
                location: gameState.currentLocation ? currentAdventure.locations[gameState.currentLocation].name : 'Unknown Location'
            });
            
            hideJournalEntryForm();
            updateJournalDisplay();
        }
    }
    
    // Handle journal text input for autocomplete
    function handleJournalTextInput(e) {
        const text = e.target.value;
        const lastWord = getLastWord(text);
        
        if (lastWord.length >= 2) {
            showJournalAutocomplete(lastWord);
        } else {
            hideJournalAutocomplete();
        }
    }
    
    // Get the last word being typed (for autocomplete)
    function getLastWord(text) {
        const match = text.match(/\S+$/);
        return match ? match[0] : '';
    }
    
    // Show autocomplete suggestions for journal text
    function showJournalAutocomplete(word) {
        const container = document.getElementById('journal-autocomplete-container');
        if (!container) return;
        
        // Clear container
        container.innerHTML = '';
        
        // Find matching elements
        const matches = [];
        
        // Check items
        autocompleteElements.items.forEach(item => {
            if (item.toLowerCase().includes(word.toLowerCase())) {
                matches.push(item);
            }
        });
        
        // Check locations
        autocompleteElements.locations.forEach(location => {
            if (location.toLowerCase().includes(word.toLowerCase())) {
                matches.push(location);
            }
        });
        
        // Check characters
        autocompleteElements.characters.forEach(character => {
            if (character.toLowerCase().includes(word.toLowerCase())) {
                matches.push(character);
            }
        });
        
        // Limit to top 5 matches
        const topMatches = matches.slice(0, 5);
        
        if (topMatches.length === 0) {
            hideJournalAutocomplete();
            return;
        }
        
        // Add suggestions
        topMatches.forEach(match => {
            const div = document.createElement('div');
            div.className = 'journal-autocomplete-item';
            div.textContent = match;
            div.addEventListener('click', () => {
                insertAutocompleteText(match);
            });
            container.appendChild(div);
        });
        
        // Show container
        container.style.display = 'block';
    }
    
    // Hide journal autocomplete
    function hideJournalAutocomplete() {
        const container = document.getElementById('journal-autocomplete-container');
        if (container) {
            container.style.display = 'none';
        }
    }
    
    // Insert autocomplete text into journal entry
    function insertAutocompleteText(text) {
        const textarea = document.getElementById('journal-entry-text');
        if (!textarea) return;
        
        const currentText = textarea.value;
        const lastWordRegex = /\S+$/;
        const newText = currentText.replace(lastWordRegex, text);
        
        textarea.value = newText + ' ';
        hideJournalAutocomplete();
        textarea.focus();
    }
    
    // Update autocomplete elements from current adventure
    function updateAutocompleteElements() {
        if (!currentAdventure) return;
        
        // Reset elements
        autocompleteElements = {
            items: [],
            locations: [],
            characters: []
        };
        
        // Add items
        if (currentAdventure.items) {
            Object.values(currentAdventure.items).forEach(item => {
                if (item.name) {
                    autocompleteElements.items.push(item.name);
                }
            });
        }
        
        // Add locations
        if (currentAdventure.locations) {
            Object.values(currentAdventure.locations).forEach(location => {
                if (location.name) {
                    autocompleteElements.locations.push(location.name);
                }
            });
        }
        
        // Add characters (if the adventure has them)
        if (currentAdventure.characters) {
            Object.values(currentAdventure.characters).forEach(character => {
                if (character.name) {
                    autocompleteElements.characters.push(character.name);
                }
            });
        }
    }
    
    // Update the journal entries display
    function updateJournalDisplay() {
        const container = document.getElementById('journal-entries-container');
        if (!container) return;
        
        // Clear container
        container.innerHTML = '';
        
        // Get entries for current adventure
        const entries = getJournalEntries();
        
        if (entries.length === 0) {
            container.innerHTML = '<p class="no-entries">No journal entries yet.</p>';
            return;
        }
        
        // Sort entries by timestamp (newest first)
        entries.sort((a, b) => b.timestamp - a.timestamp);
        
        // Group entries by date
        const entriesByDate = groupEntriesByDate(entries);
        
        // Add each date group
        Object.keys(entriesByDate).forEach(date => {
            const dateEntries = entriesByDate[date];
            
            // Create date header
            const dateHeader = document.createElement('div');
            dateHeader.className = 'journal-date-header';
            dateHeader.textContent = date;
            container.appendChild(dateHeader);
            
            // Add entries for this date
            dateEntries.forEach(entry => {
                const entryElement = createJournalEntryElement(entry);
                container.appendChild(entryElement);
            });
        });
    }
    
    // Group entries by date
    function groupEntriesByDate(entries) {
        const groups = {};
        
        entries.forEach(entry => {
            const date = new Date(entry.timestamp).toLocaleDateString();
            
            if (!groups[date]) {
                groups[date] = [];
            }
            
            groups[date].push(entry);
        });
        
        return groups;
    }
    
    // Create a journal entry element
    function createJournalEntryElement(entry) {
        const entryDiv = document.createElement('div');
        entryDiv.className = `journal-entry ${entry.type === ENTRY_TYPE.AUTO ? 'auto-entry' : 'player-entry'}`;
        
        // Format time
        const time = new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        entryDiv.innerHTML = `
            <div class="entry-header">
                <span class="entry-time">${time}</span>
                <span class="entry-location">${entry.location || 'Unknown'}</span>
                <span class="entry-type">${entry.type === ENTRY_TYPE.AUTO ? 'Auto' : 'Note'}</span>
            </div>
            <div class="entry-content">${entry.text}</div>
        `;
        
        return entryDiv;
    }
    
    // Get journal entries for the current adventure (filtered by mode)
    function getJournalEntries() {
        if (!currentAdventure || !currentAdventure.id) return [];
        
        const adventureEntries = journalData.adventures[currentAdventure.id] || [];
        
        // Filter by mode
        return adventureEntries.filter(entry => {
            if (entry.type === ENTRY_TYPE.AUTO && !journalMode.autoEnabled) return false;
            if (entry.type === ENTRY_TYPE.PLAYER && !journalMode.playerEnabled) return false;
            return true;
        });
    }
    
    // Add a journal entry
    function addJournalEntry(entry) {
        if (!currentAdventure || !currentAdventure.id) return false;
        
        // Make sure adventures object exists for this adventure
        if (!journalData.adventures[currentAdventure.id]) {
            journalData.adventures[currentAdventure.id] = [];
        }
        
        // Add entry
        journalData.adventures[currentAdventure.id].push(entry);
        
        // Save journal
        saveJournalData();
        
        return true;
    }
    
    // Add an automatic entry (from the adventure)
    function addAutoEntry(text, locationId = null) {
        if (!currentAdventure) return false;
        
        // Only add if auto entries are enabled
        if (!journalMode.autoEnabled) return false;
        
        // Get location name
        let locationName = 'Unknown Location';
        if (locationId && currentAdventure.locations[locationId]) {
            locationName = currentAdventure.locations[locationId].name;
        } else if (gameState.currentLocation && currentAdventure.locations[gameState.currentLocation]) {
            locationName = currentAdventure.locations[gameState.currentLocation].name;
        }
        
        return addJournalEntry({
            text: text,
            type: ENTRY_TYPE.AUTO,
            timestamp: Date.now(),
            location: locationName
        });
    }
    
    // Set the current adventure
    function setCurrentAdventure(adventureId) {
        currentAdventureId = adventureId;
    }
    
    // Process adventure plot event
    function processPlotEvent(eventId, gameState) {
        if (!currentAdventure || !currentAdventure.plotEvents) return;
        
        // Find the plot event
        const plotEvent = currentAdventure.plotEvents.find(event => event.id === eventId);
        
        if (plotEvent && plotEvent.journalEntry) {
            // Add auto entry
            addAutoEntry(plotEvent.journalEntry, gameState.currentLocation);
        }
    }
    
    // Save journal data to local storage
    function saveJournalData() {
        localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(journalData));
    }
    
    // Load journal data from local storage
    function loadJournalData() {
        const data = localStorage.getItem(JOURNAL_STORAGE_KEY);
        
        if (data) {
            try {
                journalData = JSON.parse(data);
            } catch (error) {
                console.error('Error loading journal data:', error);
                journalData = { adventures: {} };
            }
        }
        
        // Load journal mode
        loadJournalMode();
    }
    
    // Save journal mode to local storage
    function saveJournalMode() {
        localStorage.setItem('modernzork_journal_mode', JSON.stringify(journalMode));
    }
    
    // Load journal mode from local storage
    function loadJournalMode() {
        const data = localStorage.getItem('modernzork_journal_mode');
        
        if (data) {
            try {
                const mode = JSON.parse(data);
                journalMode.autoEnabled = mode.autoEnabled !== undefined ? mode.autoEnabled : true;
                journalMode.playerEnabled = mode.playerEnabled !== undefined ? mode.playerEnabled : true;
            } catch (error) {
                console.error('Error loading journal mode:', error);
            }
        }
    }
    
    // Clear all journal data for testing
    function clearJournal() {
        journalData = { adventures: {} };
        saveJournalData();
    }
    
    // Public API
    return {
        initialize,
        setCurrentAdventure,
        addAutoEntry,
        processPlotEvent,
        openJournalModal,
        clearJournal
    };
})();