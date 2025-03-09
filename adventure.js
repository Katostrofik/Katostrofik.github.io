// Demo Adventure for ModernZork

const demoAdventure = {
    id: 'demo-adventure',
    name: 'The Forgotten Cave',
    author: 'ModernZork Team',
    version: '1.0',
    
    // Starting location
    initialLocation: 'cave_entrance',
    
    // Introduction text
    introText: `
        <p class="text-emphasis">The Forgotten Cave</p>
        <p>After hearing rumors of an ancient treasure hidden deep within a cave system in the mountains, 
        you've decided to explore it yourself. Armed only with your wits and a small flashlight, 
        you stand at the entrance to the cave.</p>
        <p>Will you find the legendary treasures within, or will you become another victim of the cave's secrets?</p>
        <p class="text-emphasis">Type 'help' for a list of commands.</p>
    `,
    
    // Victory condition
    victoryCondition: state => state.inventory.includes('ancient_amulet') && state.currentLocation === 'cave_entrance',
    victoryText: `
        <p class="text-emphasis">Congratulations!</p>
        <p>With the ancient amulet safely in your possession, you emerge from the cave into the bright sunlight.
        You've successfully retrieved the legendary treasure and lived to tell the tale!</p>
        <p>Archaeologists will study this find for years to come, and you'll be remembered as the brave explorer
        who discovered the amulet after centuries of it being lost to history.</p>
        <p>THE END</p>
    `,
    
    // Locations
    locations: {
        cave_entrance: {
            name: 'Cave Entrance',
            description: 'You stand at the entrance to a dark cave. Sunlight filters in from the outside, but the interior quickly fades into darkness. There\'s a cool breeze coming from inside.',
            exits: {
                north: {
                    destination: 'main_cavern',
                    description: 'The cave extends into darkness.'
                },
                south: {
                    destination: 'forest_path',
                    description: 'A path leads back to the forest.'
                }
            },
            items: ['flashlight']
        },
        
        forest_path: {
            name: 'Forest Path',
            description: 'A narrow path winds through the dense forest. Birds chirp in the trees, and sunlight dapples the ground. This is the way back to civilization.',
            exits: {
                north: {
                    destination: 'cave_entrance',
                    description: 'The cave entrance looms ahead.'
                }
            }
        },
        
        main_cavern: {
            name: 'Main Cavern',
            description: 'You\'re in a large, echoing cavern. Stalactites hang from the ceiling, and the ground is uneven. Your light doesn\'t reach the highest parts of the ceiling. Water drips somewhere in the distance.',
            exits: {
                south: {
                    destination: 'cave_entrance',
                    description: 'The entrance to the cave is visible, letting in some natural light.'
                },
                east: {
                    destination: 'narrow_passage',
                    description: 'A narrow passage leads deeper into the cave.'
                },
                west: {
                    destination: 'underground_pool',
                    description: 'You can see a glimmer of water reflecting your light.'
                }
            },
            items: ['old_coin', 'rock']
        },
        
        narrow_passage: {
            name: 'Narrow Passage',
            description: 'The passage is so narrow you have to turn sideways to squeeze through. The walls are damp and slippery. It\'s much colder here than in the main cavern.',
            exits: {
                west: {
                    destination: 'main_cavern',
                    description: 'The passage opens up to the main cavern.'
                },
                north: {
                    destination: 'crystal_chamber',
                    description: 'You can see a faint, colorful glow ahead.'
                }
            }
        },
        
        crystal_chamber: {
            name: 'Crystal Chamber',
            description: 'This chamber is filled with glittering crystals of various colors. They catch your light and split it into rainbows that dance across the walls. It\'s a breathtaking sight.',
            exits: {
                south: {
                    destination: 'narrow_passage',
                    description: 'The narrow passage leads back to the main part of the cave.'
                },
                down: {
                    destination: 'hidden_chamber',
                    description: 'A small opening in the floor might be just big enough to fit through.',
                    hidden: true,
                    condition: state => state.gameFlags.crystalAligned
                }
            },
            items: ['blue_crystal', 'red_crystal'],
            commands: {
                align: (args, state, adventure) => {
                    if (args.join(' ') === 'crystals' && 
                        state.inventory.includes('blue_crystal') && 
                        state.inventory.includes('red_crystal')) {
                        state.gameFlags.crystalAligned = true;
                        return {
                            success: true,
                            message: 'You hold the blue and red crystals together. They begin to glow intensely, and a beam of purple light shoots to the floor, revealing a hidden opening!',
                            locationChanged: true
                        };
                    } else if (args.join(' ') === 'crystals') {
                        return {
                            success: false,
                            message: 'You need to have both crystals to align them properly.'
                        };
                    } else {
                        return {
                            success: false,
                            message: 'Align what?'
                        };
                    }
                }
            }
        },
        
        hidden_chamber: {
            name: 'Hidden Chamber',
            description: 'You squeeze through the opening and find yourself in a small, previously sealed chamber. The air is stale and undisturbed for what must have been centuries. There\'s a sense of reverence here, as if you\'re the first person to enter in a very long time.',
            exits: {
                up: {
                    destination: 'crystal_chamber',
                    description: 'The opening leads back to the crystal chamber.'
                }
            },
            items: ['ancient_amulet']
        },
        
        underground_pool: {
            name: 'Underground Pool',
            description: 'A still, clear pool of water fills most of this chamber. The ceiling is reflected perfectly on its surface. The water looks deep and cold. There\'s a small ledge around the pool where you can walk.',
            exits: {
                east: {
                    destination: 'main_cavern',
                    description: 'The passage leads back to the main cavern.'
                },
                north: {
                    destination: 'waterfall_chamber',
                    description: 'You can hear the sound of rushing water from that direction.',
                    blocked: true,
                    blockedMessage: 'The passage is too dark to navigate safely without more light.'
                }
            },
            items: ['empty_bottle']
        },
        
        waterfall_chamber: {
            name: 'Waterfall Chamber',
            description: 'A beautiful underground waterfall cascades from a crack in the ceiling, feeding the pool in the adjoining chamber. The sound of rushing water fills the air, and a fine mist makes everything slightly damp. There\'s a small rainbow where your light hits the mist.',
            exits: {
                south: {
                    destination: 'underground_pool',
                    description: 'The passage leads back to the underground pool.'
                }
            },
            items: ['silver_key']
        }
    },
    
    // Items
    items: {
        flashlight: {
            name: 'flashlight',
            description: 'A small but powerful LED flashlight. It\'s currently turned off.',
            takeable: true,
            usable: true,
            use: (args, state, adventure) => {
                if (state.gameFlags.flashlightOn) {
                    state.gameFlags.flashlightOn = false;
                    
                    // If in waterfall chamber, block the exit when light is off
                    if (state.currentLocation === 'waterfall_chamber') {
                        adventure.locations.underground_pool.exits.north.blocked = true;
                    }
                    
                    return {
                        success: true,
                        message: 'You turn off the flashlight.'
                    };
                } else {
                    state.gameFlags.flashlightOn = true;
                    
                    // Unblock the passage to waterfall chamber when light is on
                    adventure.locations.underground_pool.exits.north.blocked = false;
                    
                    return {
                        success: true,
                        message: 'You turn on the flashlight, illuminating the cave around you.'
                    };
                }
            }
        },
        
        old_coin: {
            name: 'old coin',
            description: 'A tarnished silver coin with unfamiliar markings. It looks very old and might be valuable to a collector.',
            takeable: true,
            points: 5
        },
        
        rock: {
            name: 'rock',
            description: 'Just an ordinary cave rock. It\'s somewhat damp and has a few sparkly mineral deposits.',
            takeable: true
        },
        
        blue_crystal: {
            name: 'blue crystal',
            description: 'A beautiful blue crystal that seems to glow with an inner light. It feels warm to the touch.',
            takeable: true,
            points: 10
        },
        
        red_crystal: {
            name: 'red crystal',
            description: 'A deep red crystal that pulses gently, like a heartbeat. It feels warm to the touch.',
            takeable: true,
            points: 10
        },
        
        ancient_amulet: {
            name: 'ancient amulet',
            description: 'A spectacular golden amulet inlaid with gemstones. It depicts a strange symbol that seems to shift slightly when you\'re not looking directly at it. This must be the legendary treasure!',
            takeable: true,
            points: 50
        },
        
        empty_bottle: {
            name: 'empty bottle',
            description: 'A glass bottle that someone must have dropped. It\'s empty but could be used to hold liquids.',
            takeable: true,
            usable: true,
            use: (args, state, adventure) => {
                if (state.currentLocation === 'underground_pool' || state.currentLocation === 'waterfall_chamber') {
                    // Replace item in inventory
                    const bottleIndex = state.inventory.indexOf('empty_bottle');
                    if (bottleIndex !== -1) {
                        state.inventory[bottleIndex] = 'water_bottle';
                    }
                    
                    return {
                        success: true,
                        inventoryChanged: true,
                        message: 'You fill the bottle with clear cave water.'
                    };
                } else {
                    return {
                        success: false,
                        message: 'There\'s nothing here to fill the bottle with.'
                    };
                }
            }
        },
        
        water_bottle: {
            name: 'water bottle',
            description: 'A glass bottle filled with clear cave water. It looks refreshingly cool.',
            takeable: true,
            usable: true,
            use: (args, state, adventure) => {
                // Replace item in inventory
                const bottleIndex = state.inventory.indexOf('water_bottle');
                if (bottleIndex !== -1) {
                    state.inventory[bottleIndex] = 'empty_bottle';
                }
                
                return {
                    success: true,
                    inventoryChanged: true,
                    message: 'You drink the cool cave water. It\'s refreshing!'
                };
            }
        },
        
        silver_key: {
            name: 'silver key',
            description: 'A small silver key with intricate engravings. It must unlock something important.',
            takeable: true,
            points: 15
        }
    }
};