// Add these achievements to the demo adventure object

// First, create the achievements array
const demoAchievements = [
    {
        id: 'first_step',
        title: 'First Steps',
        description: 'Leave the cave entrance for the first time',
        icon: 'fas fa-shoe-prints',
        secret: false,
        trigger: (gameState) => gameState.gameFlags.leftCaveEntrance
    },
    {
        id: 'treasure_hunter',
        title: 'Treasure Hunter',
        description: 'Find the ancient amulet',
        icon: 'fas fa-gem',
        secret: false,
        trigger: (gameState) => gameState.inventory.includes('ancient_amulet')
    },
    {
        id: 'crystal_master',
        title: 'Crystal Master',
        description: 'Collect both crystals',
        icon: 'fas fa-cubes',
        secret: false,
        trigger: (gameState) => 
            gameState.inventory.includes('blue_crystal') && 
            gameState.inventory.includes('red_crystal')
    },
    {
        id: 'hydration',
        title: 'Stay Hydrated',
        description: 'Fill a bottle with cave water',
        icon: 'fas fa-tint',
        secret: false,
        trigger: (gameState) => gameState.inventory.includes('water_bottle')
    },
    {
        id: 'align_crystals',
        title: 'Crystal Alignment',
        description: 'Discover how to align the crystals',
        icon: 'fas fa-magic',
        secret: false,
        trigger: (gameState) => gameState.gameFlags.crystalAligned
    },
    {
        id: 'lightbringer',
        title: 'Lightbringer',
        description: 'Use the flashlight to reveal a hidden path',
        icon: 'fas fa-lightbulb',
        secret: false,
        trigger: (gameState) => gameState.gameFlags.flashlightOn
    },
    {
        id: 'completionist',
        title: 'Cave Completionist',
        description: 'Visit every location in the cave',
        icon: 'fas fa-map-marked',
        secret: false,
        trigger: (gameState) => {
            const allLocations = [
                'cave_entrance', 'forest_path', 'main_cavern', 
                'narrow_passage', 'crystal_chamber', 'hidden_chamber',
                'underground_pool', 'waterfall_chamber'
            ];
            return allLocations.every(loc => gameState.visitedLocations?.includes(loc));
        }
    },
    {
        id: 'collector',
        title: 'Cave Collector',
        description: 'Find every item in the cave',
        icon: 'fas fa-shopping-bag',
        secret: false,
        trigger: (gameState) => {
            const allItems = [
                'flashlight', 'old_coin', 'rock', 'blue_crystal', 
                'red_crystal', 'ancient_amulet', 'empty_bottle', 
                'water_bottle', 'silver_key'
            ];
            return allItems.every(item => gameState.collectedItems?.includes(item));
        }
    },
    {
        id: 'speed_runner',
        title: 'Speed Runner',
        description: 'Complete the adventure in under 30 moves',
        icon: 'fas fa-running',
        secret: true,
        trigger: (gameState) => 
            gameState.inventory.includes('ancient_amulet') && 
            gameState.currentLocation === 'cave_entrance' &&
            gameState.moveCount < 30
    },
    {
        id: 'efficient_explorer',
        title: 'Efficient Explorer',
        description: 'Complete the adventure without backtracking more than twice',
        icon: 'fas fa-route',
        secret: true,
        trigger: (gameState) => 
            gameState.inventory.includes('ancient_amulet') && 
            gameState.currentLocation === 'cave_entrance' &&
            gameState.gameFlags.backtrackCount <= 2
    }
];

// Also add some plot events for the journal
const demoPlotEvents = [
    {
        id: 'enter_cave',
        description: 'Entered the cave for the first time',
        condition: (gameState) => gameState.currentLocation === 'main_cavern',
        triggered: false,
        journalEntry: "I've entered the main cavern of the cave. The air is damp and cool, with strange echoes all around. There must be something valuable hidden in these depths."
    },
    {
        id: 'find_crystal_chamber',
        description: 'Discovered the crystal chamber',
        condition: (gameState) => gameState.currentLocation === 'crystal_chamber',
        triggered: false,
        journalEntry: "I've found an incredible chamber filled with glowing crystals of various colors. The light they emit seems almost magical. There's something important about this place."
    },
    {
        id: 'align_crystals',
        description: 'Aligned the crystals',
        condition: (gameState) => gameState.gameFlags.crystalAligned,
        triggered: false,
        journalEntry: "When I aligned the blue and red crystals together, they emitted a powerful beam of purple light that revealed a hidden opening in the floor. This could lead to the treasure I'm seeking!"
    },
    {
        id: 'find_amulet',
        description: 'Found the ancient amulet',
        condition: (gameState) => gameState.inventory.includes('ancient_amulet'),
        triggered: false,
        journalEntry: "Success! I've found the legendary ancient amulet. It's a magnificent golden piece with strange symbols and inlaid gemstones. Now I need to get back to the entrance safely."
    },
    {
        id: 'adventure_complete',
        description: 'Completed the adventure',
        condition: (gameState) => 
            gameState.inventory.includes('ancient_amulet') && 
            gameState.currentLocation === 'cave_entrance',
        triggered: false,
        journalEntry: "I've done it! I've escaped the cave with the ancient amulet in my possession. This remarkable artifact will be studied for years to come, and I'll be remembered as the explorer who found it."
    }
];

// Add these to the demoAdventure object
// In practice you would insert these directly into the adventure.js file
// This code shows how to update the existing demoAdventure object:

// Add achievements
demoAdventure.achievements = demoAchievements;

// Add plot events
demoAdventure.plotEvents = demoPlotEvents;