// Achievement System for ModernZork
// Handles tracking, unlocking, and displaying achievements

const achievementSystem = (() => {
    // Storage keys
    const ACHIEVEMENTS_STORAGE_KEY = 'modernzork_achievements';
    
    // Achievement categories
    const CATEGORY = {
        ENGINE: 'engine',
        ADVENTURE: 'adventure'
    };
    
    // Achievement status
    const STATUS = {
        LOCKED: 'locked',
        UNLOCKED: 'unlocked'
    };
    
    // Store of all achievements
    let achievementStore = {
        engine: [], // Engine-wide achievements
        adventure: {} // Adventure-specific achievements indexed by adventure ID
    };
    
    // Player progress
    let playerAchievements = {
        engine: {}, // Engine achievements progress, keyed by achievement ID
        adventure: {} // Adventure achievements progress, keyed by adventure ID then achievement ID
    };
    
    // Stats for tracking progress
    let stats = {
        adventuresStarted: 0,
        adventuresCompleted: 0,
        commandsEntered: 0,
        autoCompleteUsed: 0,
        itemsTaken: 0,
        roomsVisited: 0
    };
    
    // Engine achievements definitions
    const engineAchievements = [
        {
            id: 'first_adventure',
            title: 'First Steps',
            description: 'Start your first adventure',
            icon: 'fas fa-flag-checkered',
            category: CATEGORY.ENGINE,
            trigger: (stats) => stats.adventuresStarted >= 1,
            secret: false
        },
        {
            id: 'adventure_enthusiast',
            title: 'Adventure Enthusiast',
            description: 'Start 5 different adventures',
            icon: 'fas fa-compass',
            category: CATEGORY.ENGINE,
            trigger: (stats) => stats.adventuresStarted >= 5,
            secret: false
        },
        {
            id: 'adventure_master',
            title: 'Adventure Master',
            description: 'Start 10 different adventures',
            icon: 'fas fa-mountain',
            category: CATEGORY.ENGINE,
            trigger: (stats) => stats.adventuresStarted >= 10,
            secret: false
        },
        {
            id: 'adventure_legend',
            title: 'Adventure Legend',
            description: 'Start 25 different adventures',
            icon: 'fas fa-crown',
            category: CATEGORY.ENGINE,
            trigger: (stats) => stats.adventuresStarted >= 25,
            secret: false
        },
        {
            id: 'first_completion',
            title: 'Mission Accomplished',
            description: 'Complete your first adventure',
            icon: 'fas fa-trophy',
            category: CATEGORY.ENGINE,
            trigger: (stats) => stats.adventuresCompleted >= 1,
            secret: false
        },
        {
            id: 'completion_master',
            title: 'Completionist',
            description: 'Complete 5 different adventures',
            icon: 'fas fa-award',
            category: CATEGORY.ENGINE,
            trigger: (stats) => stats.adventuresCompleted >= 5,
            secret: false
        },
        {
            id: 'completion_legend',
            title: 'Legendary Adventurer',
            description: 'Complete 10 different adventures',
            icon: 'fas fa-star',
            category: CATEGORY.ENGINE,
            trigger: (stats) => stats.adventuresCompleted >= 10,
            secret: false
        },
        {
            id: 'command_novice',
            title: 'Command Novice',
            description: 'Enter 50 commands',
            icon: 'fas fa-keyboard',
            category: CATEGORY.ENGINE,
            trigger: (stats) => stats.commandsEntered >= 50,
            secret: false
        },
        {
            id: 'command_expert',
            title: 'Command Expert',
            description: 'Enter 200 commands',
            icon: 'fas fa-terminal',
            category: CATEGORY.ENGINE,
            trigger: (stats) => stats.commandsEntered >= 200,
            secret: false
        },
        {
            id: 'command_master',
            title: 'Command Master',
            description: 'Enter 500 commands',
            icon: 'fas fa-code',
            category: CATEGORY.ENGINE,
            trigger: (stats) => stats.commandsEntered >= 500,
            secret: false
        },
        {
            id: 'autocomplete_user',
            title: 'Quick Typer',
            description: 'Use autocomplete 10 times',
            icon: 'fas fa-bolt',
            category: CATEGORY.ENGINE,
            trigger: (stats) => stats.autoCompleteUsed >= 10,
            secret: false
        },
        {
            id: 'autocomplete_expert',
            title: 'Efficiency Expert',
            description: 'Use autocomplete 50 times',
            icon: 'fas fa-tachometer-alt',
            category: CATEGORY.ENGINE,
            trigger: (stats) => stats.autoCompleteUsed >= 50,
            secret: false
        },
        {
            id: 'collector',
            title: 'Collector',
            description: 'Take 25 items across all adventures',
            icon: 'fas fa-shopping-bag',
            category: CATEGORY.ENGINE,
            trigger: (stats) => stats.itemsTaken >= 25,
            secret: false
        },
        {
            id: 'hoarder',
            title: 'Hoarder',
            description: 'Take 100 items across all adventures',
            icon: 'fas fa-boxes',
            category: CATEGORY.ENGINE,
            trigger: (stats) => stats.itemsTaken >= 100,
            secret: false
        },
        {
            id: 'explorer',
            title: 'Explorer',
            description: 'Visit 50 different rooms',
            icon: 'fas fa-door-open',
            category: CATEGORY.ENGINE,
            trigger: (stats) => stats.roomsVisited >= 50,
            secret: false
        },
        {
            id: 'cartographer',
            title: 'Cartographer',
            description: 'Visit 100 different rooms',
            icon: 'fas fa-map-marked-alt',
            category: CATEGORY.ENGINE,
            trigger: (stats) => stats.roomsVisited >= 100,
            secret: false
        },
        {
            id: 'world_traveler',
            title: 'World Traveler',
            description: 'Visit 200 different rooms',
            icon: 'fas fa-globe-americas',
            category: CATEGORY.ENGINE,
            trigger: (stats) => stats.roomsVisited >= 200,
            secret: false
        }
    ];
    
    // Initialize the achievement system
    function initialize() {
        // Register engine achievements
        engineAchievements.forEach(achievement => {
            registerEngineAchievement(achievement);
        });
        
        // Load saved progress
        loadProgress();
        
        // Set up the achievement UI
        setupAchievementUI();
        
        // Add achievement button to header if it doesn't exist
        if (!document.getElementById('achievements-btn')) {
            const gameControls = document.querySelector('.game-controls');
            if (gameControls) {
                const achievementsBtn = document.createElement('button');
                achievementsBtn.id = 'achievements-btn';
                achievementsBtn.className = 'control-btn';
                achievementsBtn.title = 'Achievements';
                achievementsBtn.innerHTML = '<i class="fas fa-trophy"></i>';
                achievementsBtn.addEventListener('click', () => openAchievementsModal());
                
                // Insert before settings button
                const settingsBtn = document.getElementById('settings-btn');
                if (settingsBtn) {
                    gameControls.insertBefore(achievementsBtn, settingsBtn);
                } else {
                    gameControls.appendChild(achievementsBtn);
                }
            }
        }
    }
    
    // Set up the achievement UI modal
    function setupAchievementUI() {
        // Create achievements modal if it doesn't exist
        if (!document.getElementById('achievements-modal')) {
            const modal = document.createElement('div');
            modal.id = 'achievements-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Achievements</h2>
                        <span class="close-modal">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="achievements-tabs">
                            <button class="tab-btn active" data-tab="engine-achievements">Global</button>
                            <button class="tab-btn" data-tab="adventure-achievements">Adventure</button>
                        </div>
                        
                        <div id="engine-achievements" class="tab-content active">
                            <div class="achievements-container" id="engine-achievements-container">
                                <!-- Engine achievements will be loaded here -->
                            </div>
                        </div>
                        
                        <div id="adventure-achievements" class="tab-content">
                            <div class="achievements-container" id="adventure-achievements-container">
                                <!-- Adventure achievements will be loaded here -->
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add event listener to close button
            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
            
            // Add event listeners to tabs
            const tabs = modal.querySelectorAll('.tab-btn');
            tabs.forEach(tab => {
                tab.addEventListener('click', (e) => {
                    // Remove active class from all tabs and contents
                    tabs.forEach(t => t.classList.remove('active'));
                    const tabContents = modal.querySelectorAll('.tab-content');
                    tabContents.forEach(tc => tc.classList.remove('active'));
                    
                    // Add active class to clicked tab and corresponding content
                    e.target.classList.add('active');
                    const tabId = e.target.getAttribute('data-tab');
                    document.getElementById(tabId).classList.add('active');
                });
            });
        }
    }
    
    // Open the achievements modal
    function openAchievementsModal() {
        const modal = document.getElementById('achievements-modal');
        if (modal) {
            // Update achievement displays
            updateAchievementDisplay();
            
            // Show modal
            modal.style.display = 'block';
        }
    }
    
    // Update the achievement display in the modal
    function updateAchievementDisplay() {
        updateEngineAchievementDisplay();
        updateAdventureAchievementDisplay();
    }
    
    // Update engine achievements display
    function updateEngineAchievementDisplay() {
        const container = document.getElementById('engine-achievements-container');
        if (!container) return;
        
        // Clear container
        container.innerHTML = '';
        
        // Add each engine achievement
        achievementStore.engine.forEach(achievement => {
            const achievementElement = createAchievementElement(achievement, CATEGORY.ENGINE);
            container.appendChild(achievementElement);
        });
    }
    
    // Update adventure achievements display
    function updateAdventureAchievementDisplay() {
        const container = document.getElementById('adventure-achievements-container');
        if (!container) return;
        
        // Clear container
        container.innerHTML = '';
        
        // Check if there's a current adventure
        if (!currentAdventure || !currentAdventure.id) {
            container.innerHTML = '<p class="no-achievements">No adventure is currently active.</p>';
            return;
        }
        
        // Get achievements for current adventure
        const adventureId = currentAdventure.id;
        const achievements = achievementStore.adventure[adventureId] || [];
        
        if (achievements.length === 0) {
            container.innerHTML = '<p class="no-achievements">This adventure has no achievements.</p>';
            return;
        }
        
        // Add each adventure achievement
        achievements.forEach(achievement => {
            const achievementElement = createAchievementElement(achievement, CATEGORY.ADVENTURE, adventureId);
            container.appendChild(achievementElement);
        });
    }
    
    // Create an achievement display element
    function createAchievementElement(achievement, category, adventureId = null) {
        const isUnlocked = checkAchievementUnlocked(achievement.id, category, adventureId);
        const achievementDiv = document.createElement('div');
        achievementDiv.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;
        
        // For secret achievements that aren't unlocked yet, show a mystery version
        if (achievement.secret && !isUnlocked) {
            achievementDiv.innerHTML = `
                <div class="achievement-icon">
                    <i class="fas fa-question"></i>
                </div>
                <div class="achievement-info">
                    <h3>???</h3>
                    <p>This achievement is secret until unlocked.</p>
                </div>
            `;
        } else {
            achievementDiv.innerHTML = `
                <div class="achievement-icon">
                    <i class="${achievement.icon}"></i>
                </div>
                <div class="achievement-info">
                    <h3>${achievement.title}</h3>
                    <p>${achievement.description}</p>
                </div>
            `;
        }
        
        return achievementDiv;
    }
    
    // Register an engine achievement
    function registerEngineAchievement(achievement) {
        achievementStore.engine.push(achievement);
    }
    
    // Register adventure achievements from an adventure
    function registerAdventureAchievements(adventure) {
        if (!adventure || !adventure.id) return;
        
        // Get achievements from adventure
        const adventureAchievements = adventure.achievements || [];
        
        // Initialize achievement store for this adventure if needed
        if (!achievementStore.adventure[adventure.id]) {
            achievementStore.adventure[adventure.id] = [];
        }
        
        // Add each achievement
        adventureAchievements.forEach(achievement => {
            // Make sure category is set to adventure
            achievement.category = CATEGORY.ADVENTURE;
            
            // Add to store
            achievementStore.adventure[adventure.id].push(achievement);
        });
        
        // Initialize player progress for this adventure if needed
        if (!playerAchievements.adventure[adventure.id]) {
            playerAchievements.adventure[adventure.id] = {};
        }
    }
    
    // Increment a stat and check for achievements
    function incrementStat(statName, amount = 1) {
        if (stats[statName] !== undefined) {
            stats[statName] += amount;
            saveProgress();
            checkEngineAchievements();
        }
    }
    
    // Set a stat value and check for achievements
    function setStat(statName, value) {
        if (stats[statName] !== undefined) {
            stats[statName] = value;
            saveProgress();
            checkEngineAchievements();
        }
    }
    
    // Check engine achievements for any newly unlocked ones
    function checkEngineAchievements() {
        achievementStore.engine.forEach(achievement => {
            // Skip if already unlocked
            if (playerAchievements.engine[achievement.id] === STATUS.UNLOCKED) return;
            
            // Check if achievement should be unlocked
            if (achievement.trigger && achievement.trigger(stats)) {
                unlockAchievement(achievement.id, CATEGORY.ENGINE);
            }
        });
    }
    
    // Check adventure achievements for any newly unlocked ones
    function checkAdventureAchievements(adventureId, gameState) {
        if (!adventureId || !achievementStore.adventure[adventureId]) return;
        
        achievementStore.adventure[adventureId].forEach(achievement => {
            // Skip if already unlocked
            if (playerAchievements.adventure[adventureId][achievement.id] === STATUS.UNLOCKED) return;
            
            // Check if achievement should be unlocked
            if (achievement.trigger && achievement.trigger(gameState)) {
                unlockAchievement(achievement.id, CATEGORY.ADVENTURE, adventureId);
            }
        });
    }
    
    // Unlock an achievement
    function unlockAchievement(achievementId, category, adventureId = null) {
        // Check if achievement exists
        let achievement = null;
        
        if (category === CATEGORY.ENGINE) {
            achievement = achievementStore.engine.find(a => a.id === achievementId);
            if (achievement) {
                playerAchievements.engine[achievementId] = STATUS.UNLOCKED;
            }
        } else if (category === CATEGORY.ADVENTURE && adventureId) {
            if (achievementStore.adventure[adventureId]) {
                achievement = achievementStore.adventure[adventureId].find(a => a.id === achievementId);
                if (achievement) {
                    if (!playerAchievements.adventure[adventureId]) {
                        playerAchievements.adventure[adventureId] = {};
                    }
                    playerAchievements.adventure[adventureId][achievementId] = STATUS.UNLOCKED;
                }
            }
        }
        
        if (achievement) {
            // Save progress
            saveProgress();
            
            // Show notification
            showAchievementNotification(achievement);
            
            // Update display if achievement modal is open
            if (document.getElementById('achievements-modal').style.display === 'block') {
                updateAchievementDisplay();
            }
            
            return true;
        }
        
        return false;
    }
    
    // Check if an achievement is unlocked
    function checkAchievementUnlocked(achievementId, category, adventureId = null) {
        if (category === CATEGORY.ENGINE) {
            return playerAchievements.engine[achievementId] === STATUS.UNLOCKED;
        } else if (category === CATEGORY.ADVENTURE && adventureId) {
            return playerAchievements.adventure[adventureId] && 
                   playerAchievements.adventure[adventureId][achievementId] === STATUS.UNLOCKED;
        }
        return false;
    }
    
    // Show an achievement notification
    function showAchievementNotification(achievement) {
        // Create notification element if it doesn't exist
        if (!document.getElementById('achievement-notification-container')) {
            const container = document.createElement('div');
            container.id = 'achievement-notification-container';
            document.body.appendChild(container);
        }
        
        const container = document.getElementById('achievement-notification-container');
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">
                <i class="${achievement.icon}"></i>
            </div>
            <div class="achievement-info">
                <h3>Achievement Unlocked!</h3>
                <h4>${achievement.title}</h4>
                <p>${achievement.description}</p>
            </div>
        `;
        
        // Add notification to container
        container.appendChild(notification);
        
        // Play sound if enabled
        playAchievementSound();
        
        // Remove notification after a delay
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                container.removeChild(notification);
            }, 500);
        }, 5000);
    }
    
    // Play achievement unlock sound
    function playAchievementSound() {
        // Check if sound is enabled
        const soundEnabled = localStorage.getItem('modernzork_sound_enabled') !== 'false';
        if (!soundEnabled) return;
        
        // Create audio element
        const audio = new Audio();
        audio.src = 'sounds/achievement.mp3'; // Assuming you have this file
        audio.volume = 0.5;
        audio.play().catch(error => {
            console.log('Could not play achievement sound:', error);
        });
    }
    
    // Save progress to local storage
    function saveProgress() {
        const progressData = {
            stats: stats,
            achievements: playerAchievements
        };
        
        localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(progressData));
    }
    
    // Load progress from local storage
    function loadProgress() {
        const progressData = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
        
        if (progressData) {
            try {
                const parsedData = JSON.parse(progressData);
                
                // Load stats
                if (parsedData.stats) {
                    // Merge with current stats to handle any new stats added
                    stats = { ...stats, ...parsedData.stats };
                }
                
                // Load achievements
                if (parsedData.achievements) {
                    playerAchievements = parsedData.achievements;
                }
            } catch (error) {
                console.error('Error loading achievement progress:', error);
            }
        }
    }
    
    // Track adventure started
    function trackAdventureStarted(adventureId) {
        // If this is a new adventure (not in the list), increment the counter
        const startedAdventures = localStorage.getItem('modernzork_started_adventures') || '[]';
        let adventureList = [];
        
        try {
            adventureList = JSON.parse(startedAdventures);
        } catch (error) {
            console.error('Error parsing started adventures:', error);
        }
        
        if (!adventureList.includes(adventureId)) {
            adventureList.push(adventureId);
            localStorage.setItem('modernzork_started_adventures', JSON.stringify(adventureList));
            incrementStat('adventuresStarted');
        }
        
        // Register achievements for this adventure
        if (currentAdventure && currentAdventure.achievements) {
            registerAdventureAchievements(currentAdventure);
        }
    }
    
    // Track adventure completed
    function trackAdventureCompleted(adventureId) {
        // If this is a new completion (not in the list), increment the counter
        const completedAdventures = localStorage.getItem('modernzork_completed_adventures') || '[]';
        let adventureList = [];
        
        try {
            adventureList = JSON.parse(completedAdventures);
        } catch (error) {
            console.error('Error parsing completed adventures:', error);
        }
        
        if (!adventureList.includes(adventureId)) {
            adventureList.push(adventureId);
            localStorage.setItem('modernzork_completed_adventures', JSON.stringify(adventureList));
            incrementStat('adventuresCompleted');
        }
    }
    
    // Track command entered
    function trackCommandEntered() {
        incrementStat('commandsEntered');
    }
    
    // Track autocomplete used
    function trackAutocompleteUsed() {
        incrementStat('autoCompleteUsed');
    }
    
    // Track item taken
    function trackItemTaken() {
        incrementStat('itemsTaken');
    }
    
    // Track room visited
    function trackRoomVisited(roomId) {
        // If this is a new room (not in the list), increment the counter
        const visitedRooms = localStorage.getItem('modernzork_visited_rooms') || '[]';
        let roomList = [];
        
        try {
            roomList = JSON.parse(visitedRooms);
        } catch (error) {
            console.error('Error parsing visited rooms:', error);
        }
        
        if (!roomList.includes(roomId)) {
            roomList.push(roomId);
            localStorage.setItem('modernzork_visited_rooms', JSON.stringify(roomList));
            incrementStat('roomsVisited');
        }
    }
    
    // Reset all achievement progress (mainly for testing)
    function resetProgress() {
        stats = {
            adventuresStarted: 0,
            adventuresCompleted: 0,
            commandsEntered: 0,
            autoCompleteUsed: 0,
            itemsTaken: 0,
            roomsVisited: 0
        };
        
        playerAchievements = {
            engine: {},
            adventure: {}
        };
        
        localStorage.removeItem('modernzork_started_adventures');
        localStorage.removeItem('modernzork_completed_adventures');
        localStorage.removeItem('modernzork_visited_rooms');
        
        saveProgress();
        updateAchievementDisplay();
    }
    
    // Public API
    return {
        initialize,
        trackAdventureStarted,
        trackAdventureCompleted,
        trackCommandEntered,
        trackAutocompleteUsed,
        trackItemTaken,
        trackRoomVisited,
        checkAdventureAchievements,
        openAchievementsModal,
        resetProgress
    };
})();