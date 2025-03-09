// Space Odyssey - A sci-fi adventure for ModernZork

const spaceAdventure = {
    // Adventure Metadata
    id: 'space-adventure',
    title: 'Space Odyssey',
    author: 'ModernZork',
    version: '1.0',
    
    // Initial location when starting the adventure
    initialLocation: 'cryo_chamber',
    
    // Introduction text displayed when the adventure starts
    introText: `
    SPACE ODYSSEY
    =============
    A Sci-Fi Adventure in Text
    
    The year is 2291. You awaken from cryosleep to blaring alarms and flashing red lights. The colony ship Hyperion seems deserted, and something has gone terribly wrong during your long journey to Alpha Centauri.
    
    With no memory of how long you've been asleep and no sign of the crew, you must discover what happened and find a way to survive.
    
    (Type 'help' for a list of commands)
    `,
    
    // Victory conditions
    victoryCondition: (gameState) => {
        return gameState.gameFlags.escapePodLaunched;
    },
    
    victoryText: `
    The escape pod's engines roar to life as it detaches from the doomed Hyperion. Through the viewport, you watch as the massive colony ship grows smaller behind you.
    
    Your emergency beacon is transmitting, and the pod's life support systems are functional. You've survived the catastrophe aboard the Hyperion, and with luck, a rescue ship will pick up your signal within a few weeks.
    
    What exactly happened to the ship and its crew remains a mystery, but at least you've escaped with your life.
    
    Congratulations! You have completed "Space Odyssey"!
    `,
    
    // Game over condition
    gameOverCondition: (gameState) => {
        return gameState.gameFlags.oxygenDepleted || gameState.gameFlags.radiationExposure;
    },
    
    gameOverText: (gameState) => {
        if (gameState.gameFlags.oxygenDepleted) {
            return "As the ship's oxygen levels reach critical lows, you find it increasingly difficult to breathe. Your vision blurs, and your thoughts become fuzzy. The last thing you see is the oxygen warning light blinking on your wrist computer before consciousness slips away forever...";
        } else if (gameState.gameFlags.radiationExposure) {
            return "The radiation warnings come too late. You feel a wave of nausea as the invisible killer does its work. Within hours, your body begins to shut down as radiation poisoning claims another victim among the stars...";
        } else {
            return "Game Over!";
        }
    },
    
    // Locations in the adventure
    locations: {
        // Cryo Chamber
        cryo_chamber: {
            name: "Cryogenic Chamber",
            description: "The room is filled with rows of cryogenic pods, most still sealed with their occupants in suspended animation. Your pod stands open, its emergency release having activated. Red emergency lights cast an eerie glow across the sterile white surfaces, and frost still clings to parts of your skin.",
            exits: {
                north: {
                    destination: "main_corridor",
                    description: "The main corridor leads away from the cryogenic chamber."
                }
            },
            items: ["crew_manifest", "emergency_oxygen_pack"]
        },
        
        // Main Corridor
        main_corridor: {
            name: "Main Corridor",
            description: "A wide corridor connects the ship's primary systems. The overhead lights flicker, and occasional sparks fly from damaged wall panels. A digital display shows ship schematics with multiple red areas indicating damage or malfunction.",
            exits: {
                south: {
                    destination: "cryo_chamber",
                    description: "The cryogenic chamber is back to the south."
                },
                north: {
                    destination: "bridge",
                    description: "The bridge lies to the north."
                },
                east: {
                    destination: "medical_bay",
                    description: "The medical bay is to the east."
                },
                west: {
                    destination: "engineering",
                    description: "Engineering is to the west."
                }
            },
            items: ["damaged_tablet"]
        },
        
        // Bridge
        bridge: {
            name: "Bridge",
            description: "The command center of the Hyperion is in disarray. Multiple control panels are damaged, and the main viewscreen displays only static. A single emergency console remains operational, casting a soft blue glow. Through the reinforced windows, you can see the vastness of space and an unfamiliar star system.",
            exits: {
                south: {
                    destination: "main_corridor",
                    description: "The main corridor is back to the south."
                },
                west: {
                    destination: "captains_quarters",
                    description: "The captain's private quarters are to the west."
                }
            },
            items: ["captains_keycard", "ship_log_terminal"]
        },
        
        // Captain's Quarters
        captains_quarters: {
            name: "Captain's Quarters",
            description: "The captain's private quarters are surprisingly spartan. A neatly made bed, a small desk, and a few personal items are all that occupy the space. A secure terminal is built into the desk, requiring authentication.",
            exits: {
                east: {
                    destination: "bridge",
                    description: "The bridge is back to the east."
                }
            },
            items: ["personal_journal", "secure_terminal"]
        },
        
        // Medical Bay
        medical_bay: {
            name: "Medical Bay",
            description: "The ship's medical facility contains several examination tables and advanced diagnostic equipment. Medical supplies are scattered across the floor, suggesting a hasty evacuation or struggle. A quarantine chamber in the back is sealed, its contents obscured by frosted glass.",
            exits: {
                west: {
                    destination: "main_corridor",
                    description: "The main corridor is back to the west."
                }
            },
            items: ["medkit", "research_notes"]
        },
        
        // Engineering
        engineering: {
            name: "Engineering",
            description: "The massive engineering section houses the ship's antimatter reactor, currently running on emergency power. Warning lights indicate multiple system failures, and radiation levels are elevated in some areas. A maintenance robot works tirelessly to repair a damaged coolant line.",
            exits: {
                east: {
                    destination: "main_corridor",
                    description: "The main corridor is back to the east."
                },
                north: {
                    destination: "maintenance_tunnels",
                    description: "A narrow maintenance access leads north.",
                    blocked: true,
                    blockedMessage: "The maintenance access requires engineering authorization."
                }
            },
            items: ["radiation_suit", "engineering_toolkit"]
        },
        
        // Maintenance Tunnels
        maintenance_tunnels: {
            name: "Maintenance Tunnels",
            description: "A labyrinth of narrow tunnels provides access to the ship's vital systems. The air is hot and filled with the smell of ozone. Through gaps in the walls, you can see pulsing conduits and data lines that form the nervous system of the Hyperion.",
            exits: {
                south: {
                    destination: "engineering",
                    description: "Engineering is back to the south."
                },
                north: {
                    destination: "escape_pod_bay",
                    description: "The tunnels lead to the escape pod bay."
                }
            }
        },
        
        // Escape Pod Bay
        escape_pod_bay: {
            name: "Escape Pod Bay",
            description: "The ship's emergency escape system consists of twelve single-person pods. Eleven launch tubes are empty, their status lights indicating successful deployment. Only one pod remains, its hatch open and ready for use. A control terminal manages the launch sequence.",
            exits: {
                south: {
                    destination: "maintenance_tunnels",
                    description: "The maintenance tunnels are back to the south."
                }
            },
            items: ["navigation_data", "emergency_rations", "escape_pod_terminal"]
        }
    },
    
    // Items in the adventure
    items: {
        // Cryo Chamber Items
        crew_manifest: {
            id: "crew_manifest",
            name: "Crew Manifest",
            aliases: ["manifest", "crew list"],
            description: "A digital document listing all 500 crew members and 1,500 colonists aboard the Hyperion. Your name appears among the colonists, with your profession listed as an exobiologist.",
            takeable: true
        },
        
        emergency_oxygen_pack: {
            id: "emergency_oxygen_pack",
            name: "Emergency Oxygen Pack",
            aliases: ["oxygen", "air pack", "o2"],
            description: "A portable oxygen supply designed for emergencies. It can provide up to 30 minutes of breathable air in hazardous environments.",
            takeable: true,
            usable: true,
            useMessage: "You check the oxygen pack's gauge. It's fully charged and ready for use if needed."
        },
        
        // Main Corridor Items
        damaged_tablet: {
            id: "damaged_tablet",
            name: "Damaged Tablet",
            aliases: ["tablet", "pad"],
            description: "A personal computing device with a cracked screen. Despite the damage, you can make out fragments of a message: \"...reactor containment... evacuation order... rendezvous at Proxima Station...\"",
            takeable: true
        },
        
        // Bridge Items
        captains_keycard: {
            id: "captains_keycard",
            name: "Captain's Keycard",
            aliases: ["keycard", "card", "key"],
            description: "An advanced security credential belonging to Captain Elena Vasquez. It grants access to restricted areas of the ship.",
            takeable: true,
            points: 10
        },
        
        ship_log_terminal: {
            id: "ship_log_terminal",
            name: "Ship Log Terminal",
            aliases: ["terminal", "log", "computer"],
            description: "A specialized terminal for accessing the ship's official logs. The last entries detail a cascade of system failures following an encounter with an unknown spatial anomaly.",
            takeable: false,
            takeFailMessage: "The terminal is built into the bridge console and cannot be removed.",
            usable: true,
            useMessage: "You access the ship logs. The final entry, dated three days ago, reads: \"Emergency evacuation ordered. All personnel to escape pods. Reactor containment failing. May whoever finds this log learn from our mistake: the anomaly at coordinates 47-23-89 is not a wormhole as we thought, but something else entirely...\""
        },
        
        // Captain's Quarters Items
        personal_journal: {
            id: "personal_journal",
            name: "Personal Journal",
            aliases: ["journal", "diary"],
            description: "Captain Vasquez's private thoughts and observations. The final entries express concern about unusual readings from the ship's long-range sensors and mention tensions among the senior staff regarding a change in course.",
            takeable: true
        },
        
        secure_terminal: {
            id: "secure_terminal",
            name: "Secure Terminal",
            aliases: ["terminal", "computer"],
            description: "A high-security terminal requiring captain-level authorization. It likely contains sensitive information.",
            takeable: false,
            takeFailMessage: "The terminal is built into the desk and cannot be removed.",
            usable: true,
            useMessage: "The terminal requires the captain's keycard for access."
        },
        
        // Medical Bay Items
        medkit: {
            id: "medkit",
            name: "Advanced Medkit",
            aliases: ["medkit", "medical kit", "first aid"],
            description: "A comprehensive medical kit containing treatments for common space-related injuries and illnesses, including radiation exposure.",
            takeable: true,
            usable: true,
            useMessage: "You don't need medical attention right now, but it's good to have the medkit available if needed."
        },
        
        research_notes: {
            id: "research_notes",
            name: "Research Notes",
            aliases: ["notes", "research"],
            description: "Scientific observations about an unknown biological sample. The notes mention unusual properties that allow the organism to survive in the vacuum of space and potentially harmful effects on human tissue.",
            takeable: true
        },
        
        // Engineering Items
        radiation_suit: {
            id: "radiation_suit",
            name: "Radiation Suit",
            aliases: ["suit", "hazmat"],
            description: "A protective suit designed to shield the wearer from harmful radiation. Essential for work near the antimatter reactor or in areas with radiation leaks.",
            takeable: true,
            wearable: true,
            points: 5
        },
        
        engineering_toolkit: {
            id: "engineering_toolkit",
            name: "Engineering Toolkit",
            aliases: ["toolkit", "tools"],
            description: "A collection of specialized tools for maintaining and repairing the ship's systems. It includes a universal access chip that can override certain security protocols.",
            takeable: true,
            usable: true,
            useMessage: "You use the toolkit to gain access to the maintenance tunnels."
        },
        
        // Escape Pod Bay Items
        navigation_data: {
            id: "navigation_data",
            name: "Navigation Data",
            aliases: ["nav data", "coordinates", "nav"],
            description: "A data crystal containing coordinates for Proxima Station, the nearest human outpost. It can be loaded into an escape pod's navigation system.",
            takeable: true,
            points: 10
        },
        
        emergency_rations: {
            id: "emergency_rations",
            name: "Emergency Rations",
            aliases: ["rations", "food"],
            description: "A compact package of high-calorie food and water purification tablets, sufficient for several weeks of survival.",
            takeable: true
        },
        
        escape_pod_terminal: {
            id: "escape_pod_terminal",
            name: "Escape Pod Terminal",
            aliases: ["terminal", "console", "pod terminal"],
            description: "The control system for the remaining escape pod. It requires a launch sequence and destination coordinates before activation.",
            takeable: false,
            takeFailMessage: "The terminal is built into the wall and cannot be removed.",
            usable: true,
            useMessage: "The escape pod system requires navigation data before launch sequence can be initiated."
        }
    }
};

// If running in a Node.js environment (for testing)
if (typeof module !== 'undefined') {
    module.exports = spaceAdventure;
}