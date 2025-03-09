// The Device: Awakening - An adventure for ModernZork
// Part 1 of The System Chronicles

const alienArtifactAdventure = {
    // Adventure Metadata
    id: 'alien_artifact',
    title: 'The Device: Awakening',
    author: 'ModernZork Team',
    version: '1.0',
    description: 'A geophysicist discovers an ancient alien artifact that transforms reality itself, beginning a journey into a mysterious system of power and danger.',
    
    // Initial location when starting the adventure
    initialLocation: 'research_lab',
    
    // Introduction text displayed when the adventure starts
    introText: `
    <p class="text-emphasis">THE DEVICE: AWAKENING</p>
    <p>Part 1 of The System Chronicles</p>
    
    <p>The year is 2028. Humanity's search for new resources has led to unprecedented deep-earth exploration projects. Two teams - one in Antarctica and another at the equator in Ecuador - are using experimental technology to drill deeper than ever before.</p>
    
    <p>You are Dr. Alex Chen, a brilliant geophysicist with a troubled past and a reputation for being able to see patterns others miss. For the past three years, you've been stationed at the equatorial site, mapping anomalies in the Earth's crust.</p>
    
    <p>Yesterday, your team detected something that shouldn't exist - a hollow space 12 kilometers beneath the surface, with readings that defy explanation. Today, you'll be among the first to examine what your colleague Dr. Rivera is calling "the discovery of the century."</p>
    
    <p>As you prepare your equipment in the lab, you can't shake the feeling that something life-changing awaits below...</p>
    
    <p class="text-emphasis">Type 'help' for a list of commands.</p>
    `,
    
    // Victory condition (reaching the second artifact)
    victoryCondition: (gameState) => {
        return gameState.currentLocation === 'artifact_chamber' && gameState.gameFlags.touchedSecondArtifact;
    },
    
    // Victory text (the cliffhanger ending)
    victoryText: `
    <p class="text-emphasis">Everything changes in an instant.</p>
    
    <p>As your fingers make contact with the alien artifact, a surge of energy courses through your body. Your mind explodes with a flood of memories that aren't your own - ancient civilizations, cosmic wars, technologies beyond comprehension.</p>
    
    <p>Power unlike anything you've ever felt rushes into every cell of your being. Your body feels like it's being torn apart and rebuilt simultaneously. You see yourself from outside, glowing with energy that isn't human.</p>
    
    <p>Through the agony and ecstasy, a voice - or perhaps a thought - penetrates your consciousness:</p>
    
    <p class="text-emphasis">"CALIBRATION COMPLETE. ADMINISTRATOR INTERFACE INITIALIZED. WELCOME TO THE SYSTEM, ARCHITECT."</p>
    
    <p>And then, darkness takes you.</p>
    
    <p class="text-emphasis">To be continued in Part 2: The Architect's Awakening</p>
    `,
    
    // Game over condition
    gameOverCondition: (gameState) => {
        return gameState.gameFlags.playerDied;
    },
    
    // Game over text
    gameOverText: (gameState) => {
        if (gameState.gameFlags.killedByGuardian) {
            return "The guardian's energy beam strikes you directly in the chest. Your last thought as consciousness fades is that you were never meant to be here - you weren't ready for whatever power lies beyond. Perhaps in another life, you might have found a different path...";
        } else if (gameState.gameFlags.fallenInChasm) {
            return "As you fall into the seemingly bottomless chasm, time seems to slow. You have a strange feeling that this isn't truly the end, but merely a reset. The System doesn't tolerate errors. As darkness claims you, you wonder if anyone will ever discover what happened to Dr. Alex Chen...";
        } else {
            return "Your journey ends here, but the mysteries of The Device remain. Perhaps another will take up the mantle and discover what you could not...";
        }
    },
    
    // Locations in the adventure
    locations: {
        // =================== PRE-ACTIVATION LOCATIONS ===================
        research_lab: {
            name: "Research Laboratory",
            description: "The air hums with the sound of advanced equipment. Holographic displays show seismic readings and 3D models of the Earth's layers. Your workstation is neatly organized with research papers and a tablet computer. Through the reinforced windows, you can see the massive drilling platform that has been your home for the past three years.",
            exits: {
                east: {
                    destination: "camp_hallway",
                    description: "The hallway leads to other parts of the research facility."
                }
            },
            items: ["research_notes", "tablet", "family_photo"]
        },
        
        camp_hallway: {
            name: "Research Facility Hallway",
            description: "The sterile hallway connects the main sections of the research facility. The walls are lined with safety protocols and maps of the drilling site. Scientists and engineers walk briskly past, everyone busy with their assigned tasks.",
            exits: {
                west: {
                    destination: "research_lab",
                    description: "Your personal laboratory is to the west."
                },
                east: {
                    destination: "briefing_room",
                    description: "The mission briefing room is to the east."
                },
                north: {
                    destination: "equipment_room",
                    description: "The equipment room is to the north."
                },
                south: {
                    destination: "elevator_top",
                    description: "The elevator to the dig site is to the south."
                }
            }
        },
        
        briefing_room: {
            name: "Mission Briefing Room",
            description: "A large conference room dominated by a circular table surrounded by chairs. A sophisticated projection system displays a 3D model of the anomaly your team discovered. The room smells of coffee and anticipation.",
            exits: {
                west: {
                    destination: "camp_hallway",
                    description: "The hallway is back to the west."
                }
            },
            items: ["mission_briefing"],
            
            // Special event when entering the room for the first time
            commands: {
                look: (args, gameState, adventure) => {
                    if (!gameState.gameFlags.metRivera) {
                        gameState.gameFlags.metRivera = true;
                        return {
                            success: true,
                            message: "As you examine the room, Dr. Isabella Rivera looks up from the projection. \"Alex! Perfect timing. The latest scans are unlike anything we've seen before. This isn't just a natural formation - there are signs of... well, I don't want to say it until we're certain, but it looks artificial. The expedition team is suiting up now. We need your expertise down there.\"",
                            locationChanged: false
                        };
                    }
                    return { success: true, message: null };
                }
            }
        },
        
        equipment_room: {
            name: "Equipment Room",
            description: "Shelves and lockers line the walls, filled with specialized gear for deep earth exploration. Safety suits, scanning equipment, and communication devices are neatly organized. A sign reminds all personnel of safety protocols for descent operations.",
            exits: {
                south: {
                    destination: "camp_hallway",
                    description: "The hallway is back to the south."
                }
            },
            items: ["safety_suit", "scanner_device"]
        },
        
        elevator_top: {
            name: "Elevator Access",
            description: "A heavily reinforced elevator provides access to the dig site below. Warning signs caution about the dangers of deep earth exploration. A security terminal requires proper authorization and safety gear before operation.",
            exits: {
                north: {
                    destination: "camp_hallway",
                    description: "The hallway is back to the north."
                },
                down: {
                    destination: "elevator_descent",
                    description: "The elevator leads down to the dig site.",
                    blocked: true,
                    blockedMessage: "The elevator requires proper authorization and safety gear. You need to be properly equipped for the descent.",
                    condition: (gameState) => gameState.inventory.includes('safety_suit') && gameState.inventory.includes('scanner_device') && gameState.gameFlags.metRivera
                }
            }
        },
        
        elevator_descent: {
            name: "Descending Elevator",
            description: "The industrial elevator descends at a steady pace. The digital display shows your depth increasing rapidly: 1km... 2km... 5km... The walls of the shaft occasionally visible through small windows reveal layers of rock passing by. The deeper you go, the more the temperature rises, despite the elevator's cooling systems.",
            exits: {
                down: {
                    destination: "dig_site_entrance",
                    description: "The elevator continues its descent."
                }
            },
            commands: {
                look: (args, gameState, adventure) => {
                    if (!gameState.gameFlags.elevatorDialogue && args.length === 0) {
                        gameState.gameFlags.elevatorDialogue = true;
                        return {
                            success: true,
                            message: "Dr. Rivera's voice comes through your suit's communication system: \"Alex, I can't overstate how significant this discovery might be. The anomaly has a perfect geometric structure - it's not natural. Whatever we find down there... well, just keep an open mind. And be careful.\"",
                            locationChanged: false
                        };
                    }
                    return { success: true, message: null };
                }
            }
        },
        
        dig_site_entrance: {
            name: "Deep Excavation Site",
            description: "The elevator opens to a reinforced cavern carved directly from the bedrock. Heavy machinery and support structures maintain the integrity of this human-made chamber. The air is noticeably hotter and filled with the scent of earth and metal. A tunnel leads deeper into the excavation, illuminated by strings of powerful lights.",
            exits: {
                up: {
                    destination: "elevator_top",
                    description: "The elevator leads back to the surface."
                },
                east: {
                    destination: "excavation_tunnel",
                    description: "A tunnel leads deeper into the excavation."
                }
            },
            items: ["geological_sample"]
        },
        
        excavation_tunnel: {
            name: "Excavation Tunnel",
            description: "A long, reinforced tunnel stretches through solid rock. The walls are scored with marks from the boring machines that created this passage. Ventilation systems pump air from the surface, fighting against the increasing heat and pressure. Scientists and engineers work at various stations, monitoring the structural integrity of the tunnel.",
            exits: {
                west: {
                    destination: "dig_site_entrance",
                    description: "The tunnel leads back to the excavation site entrance."
                },
                east: {
                    destination: "anomaly_approach",
                    description: "The tunnel continues toward the anomaly."
                }
            }
        },
        
        anomaly_approach: {
            name: "Anomaly Approach",
            description: "The tunnel widens into a staging area. Equipment and monitoring stations surround what appears to be a freshly cut opening in the rock wall. The readings on the monitors are all spiking with unusual energy signatures. A palpable sense of excitement and tension fills the air as researchers hurry back and forth.",
            exits: {
                west: {
                    destination: "excavation_tunnel",
                    description: "The tunnel leads back toward the entrance."
                },
                east: {
                    destination: "device_chamber",
                    description: "The freshly cut opening leads to the anomaly chamber."
                }
            },
            items: ["energy_readings"],
            commands: {
                look: (args, gameState, adventure) => {
                    if (!gameState.gameFlags.anomalyApproachEvent && args.length === 0) {
                        gameState.gameFlags.anomalyApproachEvent = true;
                        return {
                            success: true,
                            message: "A researcher rushes up to you, eyes wide with excitement. \"Dr. Chen! You're just in time. We've broken through to the anomaly, and... well, you need to see it for yourself. It's not natural. Dr. Rivera is already inside.\"",
                            locationChanged: false
                        };
                    }
                    return { success: true, message: null };
                }
            }
        },
        
        device_chamber: {
            name: "The Device Chamber",
            description: "You stand in an impossibly perfect spherical chamber that couldn't have been created by natural processes. The walls are smooth and covered in intricate patterns that seem to shift when you're not looking directly at them. At the center of the chamber, suspended in mid-air, is what can only be described as a device - a metallic geometric structure roughly the size of a car, with pulsing lights and components that seem to phase in and out of reality.",
            exits: {
                west: {
                    destination: "anomaly_approach",
                    description: "The exit leads back to the approach tunnel."
                }
            },
            items: ["the_device", "strange_symbols", "research_equipment"],
            commands: {
                examine: (args, gameState, adventure) => {
                    if (args.join(' ').toLowerCase() === 'the device' || args.join(' ').toLowerCase() === 'device') {
                        if (!gameState.gameFlags.examinedDevice) {
                            gameState.gameFlags.examinedDevice = true;
                            return {
                                success: true,
                                message: "As you approach the device for a closer look, you notice Dr. Rivera already scanning it with specialized equipment. \"Alex, this is incredible. Carbon dating is impossible - it's giving us readings of both thousands and millions of years simultaneously. The metal isn't on our periodic table. This is definitively not of human origin.\" As she speaks, you notice one section of the device seems to respond to her proximity, glowing slightly brighter.",
                                locationChanged: false
                            };
                        }
                    }
                    return { success: true, message: null };
                },
                touch: (args, gameState, adventure) => {
                    if (args.join(' ').toLowerCase() === 'the device' || args.join(' ').toLowerCase() === 'device') {
                        if (!gameState.gameFlags.deviceActivated) {
                            gameState.gameFlags.deviceActivated = true;
                            
                            // This is where reality shifts - change the descriptions
                            adventure.locations.research_lab.description = "The lab looks mostly the same, but something feels subtly different. The equipment seems more advanced than you remember, with interfaces that respond to your thoughts as much as your touch. Through the window, the landscape has an almost hyperreal quality to it.";
                            adventure.locations.camp_hallway.description = "The hallway feels longer than before. The people walking past seem slightly off - their movements too perfect, their faces too symmetrical. The maps on the wall now include strange symbols you don't recognize alongside the familiar text.";
                            adventure.locations.briefing_room.description = "The briefing room appears empty at first glance, but you have the distinct feeling of being watched. The 3D projection now displays not just the anomaly, but a complex network spreading out from it, encompassing the entire Earth.";
                            adventure.locations.equipment_room.description = "The equipment room contains gear you don't recognize - tools with impossible geometries and devices with no obvious purpose. A new door has appeared on the far wall, one that you're certain wasn't there before.";
                            adventure.locations.elevator_top.description = "The elevator looks the same, but the security terminal now displays a message: \"SYSTEM INTEGRATION COMPLETE. INITIALIZATION PROTOCOLS ACTIVE. SEEK THE SOURCE.\"";
                            
                            // Add the mysterious door in the equipment room
                            adventure.locations.equipment_room.exits.east = {
                                destination: "mysterious_corridor",
                                description: "A door that wasn't there before leads east."
                            };
                            
                            // Change the player's location to the lab after the shift
                            gameState.currentLocation = "research_lab";
                            gameState.gameFlags.realityShifted = true;
                            
                            return {
                                success: true,
                                message: "Against Dr. Rivera's warnings, you reach out and touch the surface of the device. It's warm and seems to vibrate at a frequency you can feel in your bones. Suddenly, the patterns on its surface illuminate in sequence, and a pulse of energy expands outward. You're knocked unconscious...\n\nYou wake up in your lab. Everything looks normal, but something feels profoundly different. A strange compulsion tugs at your mind - a need to return to the device. But more than that, you have flashes of alien memories, images and knowledge that couldn't possibly be your own. You know, somehow, that everything has changed.",
                                locationChanged: true
                            };
                        }
                    }
                    return { success: true, message: null };
                }
            }
        },
        
        // =================== POST-ACTIVATION LOCATIONS ===================
        mysterious_corridor: {
            name: "Mysterious Corridor",
            description: "A corridor that defies the building's known layout stretches before you. The walls have the same shifting patterns you saw in the device chamber. The air feels charged with potential, and gravity seems slightly off, as if you could jump higher than normal.",
            exits: {
                west: {
                    destination: "equipment_room",
                    description: "The equipment room is back to the west."
                },
                east: {
                    destination: "system_anteroom",
                    description: "The corridor continues east."
                }
            },
            items: ["floating_crystal"],
            commands: {
                look: (args, gameState, adventure) => {
                    if (!gameState.gameFlags.corridorVision && args.length === 0) {
                        gameState.gameFlags.corridorVision = true;
                        return {
                            success: true,
                            message: "As you stand in the corridor, your vision briefly doubles. For a moment, you see not with your eyes but through the building itself - a blueprint of glowing lines and nodes. You see people as clusters of data, and somewhere far below, the device pulses like a heart, connected to everything. The vision passes, leaving you dizzy but filled with a strange understanding: reality has been integrated into some kind of system.",
                            locationChanged: false
                        };
                    }
                    return { success: true, message: null };
                }
            }
        },
        
        system_anteroom: {
            name: "System Anteroom",
            description: "A circular room that seems to serve as a gateway. The floor displays a slowly rotating map of the facility, with pulsing lines connecting different points. Three doorways lead onward, each with different symbols above them. In the center of the room stands a holographic interface terminal.",
            exits: {
                west: {
                    destination: "mysterious_corridor",
                    description: "The corridor leads back west."
                },
                north: {
                    destination: "tutorial_entrance",
                    description: "A doorway with basic symbols leads north.",
                    blocked: true,
                    blockedMessage: "You approach the door, but it remains sealed. The interface terminal likely controls access.",
                    condition: (gameState) => gameState.gameFlags.initializedSystem
                },
                east: {
                    destination: "maintenance_shaft",
                    description: "A small maintenance door is on the east wall.",
                    hidden: true,
                    condition: (gameState) => gameState.gameFlags.discoveredSecretPath
                }
            },
            items: ["holographic_terminal"],
            commands: {
                use: (args, gameState, adventure) => {
                    if (args.join(' ').toLowerCase().includes('terminal') || args.join(' ').toLowerCase().includes('interface')) {
                        if (!gameState.gameFlags.initializedSystem) {
                            gameState.gameFlags.initializedSystem = true;
                            gameState.gameFlags.tutorialAvailable = true;
                            return {
                                success: true,
                                message: "You place your hand on the terminal. It scans you, and text appears: \"NEW USER DETECTED. INITIALIZATION REQUIRED. PROCEED TO TRAINING PROTOCOL.\" The northern doorway illuminates, indicating it's now accessible.",
                                locationChanged: true
                            };
                        } else {
                            return {
                                success: true,
                                message: "The terminal displays your current status: \"USER: ALEX CHEN. STATUS: UNINITIATED. PROCEED TO TRAINING PROTOCOL.\""
                            };
                        }
                    }
                    return { success: true, message: null };
                },
                examine: (args, gameState, adventure) => {
                    if (args.join(' ').toLowerCase().includes('terminal') || args.join(' ').toLowerCase().includes('interface')) {
                        if (!gameState.gameFlags.discoveredSecretPath && gameState.inventory.includes('ancient_key')) {
                            gameState.gameFlags.discoveredSecretPath = true;
                            return {
                                success: true,
                                message: "As you examine the terminal with the ancient key in your possession, you notice a hidden command sequence in the interface. Your implanted memories recognize it instantly. You discreetly activate the sequence, and a small maintenance door silently slides open on the east wall. Something tells you this is not part of the standard protocol.",
                                locationChanged: true
                            };
                        }
                    }
                    return { success: true, message: null };
                }
            }
        },
        
        tutorial_entrance: {
            name: "Training Protocol Entrance",
            description: "A stark white room marks the beginning of what the system calls the 'Training Protocol.' Holographic instructions float in the air, demonstrating basic movements and actions. A voice from nowhere announces: \"Welcome, Initiate. Complete basic training to receive System access privileges.\"",
            exits: {
                south: {
                    destination: "system_anteroom",
                    description: "The exit leads back to the anteroom."
                },
                north: {
                    destination: "training_chamber",
                    description: "The training area continues to the north."
                }
            },
            items: ["training_manual"]
        },
        
        training_chamber: {
            name: "Basic Training Chamber",
            description: "A large, adaptable space designed for basic training. Parts of the room shift and reconfigure to create different scenarios. Holographic opponents materialize for combat practice, while targets appear for skills testing. Other initiates - people who must have felt the same calling you did - train alongside you, their movements robotic and focused.",
            exits: {
                south: {
                    destination: "tutorial_entrance",
                    description: "The entrance is back to the south."
                },
                north: {
                    destination: "assessment_chamber",
                    description: "The assessment chamber lies ahead to the north."
                }
            },
            items: ["training_weapon"],
            commands: {
                train: (args, gameState, adventure) => {
                    if (!gameState.gameFlags.completedBasicTraining) {
                        gameState.gameFlags.completedBasicTraining = true;
                        gameState.gameFlags.currentPowerLevel = 1;
                        return {
                            success: true,
                            message: "You spend time following the training protocols. The system guides you through basic movements, then combat stances, then simple energy manipulation. You discover you can now generate a small energy shield and basic attack pulse - abilities no human should possess. The system announces: \"BASIC TRAINING COMPLETE. POWER LEVEL 1 ACHIEVED.\""
                        };
                    } else {
                        return {
                            success: true,
                            message: "You've already completed the basic training module. The system recommends proceeding to assessment."
                        };
                    }
                }
            }
        },
        
        assessment_chamber: {
            name: "Assessment Chamber",
            description: "A circular arena with observation platforms above. The walls can generate complex holographic environments for testing initiates. In the center stands a pedestal with a glowing handprint scanner. Other initiates are being assessed in cordoned-off sections, their abilities ranked and classified by hovering drones.",
            exits: {
                south: {
                    destination: "training_chamber",
                    description: "The training chamber is back to the south."
                },
                north: {
                    destination: "tier_one_entrance",
                    description: "The entrance to Tier One challenges lies ahead.",
                    condition: (gameState) => gameState.gameFlags.passedAssessment
                }
            },
            items: ["assessment_drone"],
            commands: {
                use: (args, gameState, adventure) => {
                    if (args.join(' ').toLowerCase().includes('scanner') || args.join(' ').toLowerCase().includes('pedestal')) {
                        if (!gameState.gameFlags.passedAssessment) {
                            if (gameState.gameFlags.completedBasicTraining) {
                                gameState.gameFlags.passedAssessment = true;
                                return {
                                    success: true,
                                    message: "You place your hand on the scanner. The chamber darkens, then an announcer voice states: \"INITIATE ALEX CHEN. POTENTIAL ASSESSMENT: MODERATE. CLEARANCE GRANTED FOR TIER ONE CHALLENGES. PROCEED WHEN READY.\" The northern doorway opens, leading to the Tier One challenges.",
                                    locationChanged: true
                                };
                            } else {
                                return {
                                    success: false,
                                    message: "You place your hand on the scanner. A red light flashes, and the system announces: \"ERROR: BASIC TRAINING NOT COMPLETED. RETURN TO TRAINING CHAMBER.\""
                                };
                            }
                        } else {
                            return {
                                success: true,
                                message: "You've already been assessed. Your clearance for Tier One has been granted."
                            };
                        }
                    }
                    return { success: true, message: null };
                },
                look: (args, gameState, adventure) => {
                    if (!gameState.gameFlags.noticeOldMan && args.length === 0) {
                        gameState.gameFlags.noticeOldMan = true;
                        return {
                            success: true,
                            message: "As you survey the chamber, you notice an elderly man observing from the sidelines. Unlike the other initiates, he's not participating but watching with keen interest. When your eyes meet, he gives a subtle nod before slipping away through a door you hadn't noticed before. Something about him triggered another flash of implanted memory - a sequence of numbers and a sense of urgency.",
                            locationChanged: false
                        };
                    }
                    return { success: true, message: null };
                }
            }
        },
        
        tier_one_entrance: {
            name: "Tier One Entrance",
            description: "A staging area for the first tier of the System's challenges. Displays show various training scenarios and their difficulty ratings. A large board ranks initiates by their performance metrics. Most initiates here look nervous but determined, clutching basic energy weapons provided by the System.",
            exits: {
                south: {
                    destination: "assessment_chamber",
                    description: "The assessment chamber is back to the south."
                },
                north: {
                    destination: "challenge_hall",
                    description: "The challenge hall continues to the north."
                }
            },
            items: ["challenge_directory", "ancient_key"],
            commands: {
                look: (args, gameState, adventure) => {
                    if (args.join(' ').toLowerCase().includes('board') || args.join(' ').toLowerCase().includes('ranking')) {
                        return {
                            success: true,
                            message: "The ranking board shows hundreds of initiates. Most have designations like 'Tier 1 - Level 3' or 'Tier 2 - Level 1'. The highest-ranked visible initiate is someone named Kira Nakamura, listed as 'Tier 7 - Level 9'. There's a note that higher tiers are not displayed on public terminals."
                        };
                    }
                    return { success: true, message: null };
                }
            }
        },
        
        challenge_hall: {
            name: "Challenge Selection Hall",
            description: "A vast hall with dozens of portals leading to different challenge scenarios. Each portal displays the difficulty, rewards, and current occupancy of its challenge. System drones hover around, guiding initiates and maintaining order. The atmosphere is tense with competition.",
            exits: {
                south: {
                    destination: "tier_one_entrance",
                    description: "The entrance hall is back to the south."
                },
                north: {
                    destination: "forest_challenge",
                    description: "A portal labeled 'Wilderness Survival - Beginner' leads north."
                }
            },
            items: ["challenge_guide"],
            commands: {
                look: (args, gameState, adventure) => {
                    if (!gameState.gameFlags.challengeHallObservation && args.length === 0) {
                        gameState.gameFlags.challengeHallObservation = true;
                        return {
                            success: true,
                            message: "As you observe the hall, you notice a pattern in the portal designations - they follow the same symbolic logic as the hieroglyphs on the device. Another flash of implanted memory helps you decipher their meaning. You realize that these challenges are more than tests - they're conditioning exercises, preparing humans for some greater purpose.",
                            locationChanged: false
                        };
                    }
                    return { success: true, message: null };
                }
            }
        },
        
        forest_challenge: {
            name: "Wilderness Challenge Arena",
            description: "You stand in what appears to be a dense forest, though the occasional glitch in a tree or rock reveals its simulated nature. Animal sounds echo around you, and a path leads deeper into the woods. A floating marker indicates your first objective: eliminate three predator entities.",
            exits: {
                south: {
                    destination: "challenge_hall",
                    description: "A glowing exit portal leads back to the challenge hall."
                },
                north: {
                    destination: "forest_clearing",
                    description: "A path leads deeper into the forest."
                }
            },
            items: ["energy_pack"]
        },
        
        forest_clearing: {
            name: "Forest Clearing",
            description: "A small clearing in the simulated forest. Sunlight filters through the canopy above, illuminating a tranquil scene that would be peaceful if not for the signs of recent struggle - claw marks on trees and disturbed earth. Your objective marker points to movement in the underbrush to the north.",
            exits: {
                south: {
                    destination: "forest_challenge",
                    description: "The path leads back to the challenge entrance."
                },
                north: {
                    destination: "forest_creature_den",
                    description: "The dense brush to the north conceals what might be a creature den."
                },
                east: {
                    destination: "forest_ravine",
                    description: "A narrow gap between trees reveals a ravine to the east."
                }
            },
            commands: {
                look: (args, gameState, adventure) => {
                    if (!gameState.gameFlags.foundClearingClue && args.length === 0) {
                        gameState.gameFlags.foundClearingClue = true;
                        return {
                            success: true,
                            message: "While examining the clearing, you find a small device half-buried in the dirt. It appears to be a system access module dropped by another initiate. When you touch it, it imparts a strange piece of information: \"Maintenance bypass: Vector-7, Protocol D19.\" Your implanted memories recognize this as an access code for something important.",
                            locationChanged: false
                        };
                    }
                    return { success: true, message: null };
                }
            }
        },
        
        forest_creature_den: {
            name: "Creature Den",
            description: "A dark hollow beneath twisted tree roots houses a creature's den. Bones and remnants of previous initiates litter the ground. The air is thick with a musky animal scent. Red eyes glow from the darkness at the back of the den.",
            exits: {
                south: {
                    destination: "forest_clearing",
                    description: "The exit leads back to the forest clearing."
                }
            },
            commands: {
                look: (args, gameState, adventure) => {
                    if (!gameState.gameFlags.encounteredForestCreature && args.length === 0) {
                        gameState.gameFlags.encounteredForestCreature = true;
                        return {
                            success: true,
                            message: "As you look around the den, a massive wolf-like creature with glowing red eyes and exposed cybernetic components emerges from the shadows. It growls, sizing you up as its next meal. Your objective marker updates: Eliminate the Alpha Predator.",
                            locationChanged: false
                        };
                    }
                    return { success: true, message: null };
                },
                attack: (args, gameState, adventure) => {
                    if (args.join(' ').toLowerCase().includes('creature') || args.join(' ').toLowerCase().includes('wolf') || args.join(' ').toLowerCase().includes('predator')) {
                        if (gameState.gameFlags.encounteredForestCreature && !gameState.gameFlags.defeatedForestCreature) {
                            gameState.gameFlags.defeatedForestCreature = true;
                            gameState.gameFlags.creaturesDefeated = (gameState.gameFlags.creaturesDefeated || 0) + 1;
                            
                            let message = "You focus your energy as the training taught you and launch an attack at the creature. After a fierce battle, you manage to defeat it, though not without effort. The beast dissolves into pixels, and a notification appears: \"Target eliminated: 1/3 Predators.\"";
                            
                            // Check for challenge completion
                            if (gameState.gameFlags.creaturesDefeated >= 3) {
                                gameState.gameFlags.completedForestChallenge = true;
                                gameState.gameFlags.currentPowerLevel = (gameState.gameFlags.currentPowerLevel || 1) + 1;
                                message += " A system announcement echoes around you: \"CHALLENGE COMPLETE. POWER LEVEL INCREASED TO 2. RETURN TO HALL FOR NEXT ASSIGNMENT.\"";
                            }
                            
                            return {
                                success: true,
                                message: message
                            };
                        } else if (gameState.gameFlags.defeatedForestCreature) {
                            return {
                                success: true,
                                message: "You've already defeated the creature in this den."
                            };
                        }
                    }
                    return { success: true, message: null };
                }
            }
        },
        
        forest_ravine: {
            name: "Forest Ravine",
            description: "A deep ravine cuts through the forest. A fallen log creates a precarious natural bridge across the gap. At the bottom of the ravine, you can see the gleam of water and movement of more creatures. Your scanner detects two predator entities below.",
            exits: {
                west: {
                    destination: "forest_clearing",
                    description: "The path leads back to the forest clearing."
                },
                east: {
                    destination: "ravine_far_side",
                    description: "A fallen log bridges to the far side of the ravine.",
                    blocked: true,
                    blockedMessage: "The predators below would attack you while you're vulnerable on the log. You should deal with them first.",
                    condition: (gameState) => gameState.gameFlags.ravineCreaturesDefeated
                },
                down: {
                    destination: "ravine_bottom",
                    description: "A steep path leads down to the bottom of the ravine."
                }
            }
        },
        
        ravine_bottom: {
            name: "Ravine Bottom",
            description: "The bottom of the ravine is cool and damp, with a small stream flowing through moss-covered rocks. The walls rise steeply on either side, filtering the light to a dim glow. The confined space feels dangerous, with limited escape routes.",
            exits: {
                up: {
                    destination: "forest_ravine",
                    description: "A steep path leads back up to the ravine edge."
                }
            },
            commands: {
                look: (args, gameState, adventure) => {
                    if (!gameState.gameFlags.encounteredRavineCreatures && args.length === 0) {
                        gameState.gameFlags.encounteredRavineCreatures = true;
                        return {
                            success: true,
                            message: "Two sleek, panther-like creatures with glowing circuitry patterns emerge from the shadows upstream and downstream, attempting to trap you between them. Their movements are coordinated and predatory. Your objective marker updates: Eliminate 2 Stalker Predators.",
                            locationChanged: false
                        };
                    }
                    return { success: true, message: null };
                },
                attack: (args, gameState, adventure) => {
                    if (args.join(' ').toLowerCase().includes('creatures') || args.join(' ').toLowerCase().includes('panthers') || args.join(' ').toLowerCase().includes('stalkers') || args.join(' ').toLowerCase().includes('predators')) {
                        if (gameState.gameFlags.encounteredRavineCreatures && !gameState.gameFlags.ravineCreaturesDefeated) {
                            if (gameState.gameFlags.currentPowerLevel >= 2) {
                                gameState.gameFlags.ravineCreaturesDefeated = true;
                                gameState.gameFlags.creaturesDefeated = (gameState.gameFlags.creaturesDefeated || 0) + 2;
                                
                                let message = "Using your newly enhanced powers, you engage both creatures in combat. The battle is intense, but you manage to eliminate both stalkers. They dissolve into pixels, and your objective updates: \"Targets eliminated: 3/3 Predators.\"";
                                
                                // Check for challenge completion
                                if (gameState.gameFlags.creaturesDefeated >= 3) {
                                    gameState.gameFlags.completedForestChallenge = true;
                                    gameState.gameFlags.currentPowerLevel = (gameState.gameFlags.currentPowerLevel || 1) + 1;
                                    message += " A system announcement echoes around you: \"CHALLENGE COMPLETE. POWER LEVEL INCREASED TO 3. NEW ABILITY UNLOCKED: ENERGY PROJECTION. RETURN TO HALL FOR NEXT ASSIGNMENT.\"";
                                }
                                
                                return {
                                    success: true,
                                    message: message
                                };
                            } else {
                                return {
                                    success: false,
                                    message: "You attempt to fight both creatures but quickly realize they're too coordinated and powerful for your current abilities. You barely manage to escape back up the ravine slope. Perhaps you need more training or to defeat the alpha predator first to increase your power level."
                                };
                            }
                        } else if (gameState.gameFlags.ravineCreaturesDefeated) {
                            return {
                                success: true,
                                message: "You've already defeated the creatures in the ravine."
                            };
                        }
                    }
                    return { success: true, message: null };
                }
            }
        },
        
        ravine_far_side: {
            name: "Ravine Far Side",
            description: "The far side of the ravine is darker, with denser vegetation. Strange luminescent fungi grow on the trees here, providing an eerie blue glow. A path disappears into the underbrush, and your system interface indicates this is outside the designated challenge area.",
            exits: {
                west: {
                    destination: "forest_ravine",
                    description: "The fallen log leads back across the ravine."
                },
                east: {
                    destination: "forest_boundary",
                    description: "A faint path leads deeper into the undesignated area."
                }
            },
            items: ["strange_fungi"]
        },
        
        forest_boundary: {
            name: "Forest Boundary",
            description: "You've reached what appears to be the edge of the simulation. The forest stops abruptly at a shimmering wall of code and energy. System warnings flash in your vision: \"BOUNDARY VIOLATION. RETURN TO DESIGNATED AREA.\" Yet there seems to be a fluctuation in the barrier, a weak point that might be exploitable.",
            exits: {
                west: {
                    destination: "ravine_far_side",
                    description: "The path leads back toward the challenge area."
                },
                east: {
                    destination: "system_backdoor",
                    description: "A fluctuation in the boundary might allow passage.",
                    blocked: true,
                    blockedMessage: "You need some way to exploit the fluctuation in the boundary. Perhaps the access code you discovered would help.",
                    condition: (gameState) => gameState.gameFlags.foundClearingClue
                }
            }
        },
        
        system_backdoor: {
            name: "System Backdoor",
            description: "You've slipped through a flaw in the simulation into what appears to be a maintenance area. The walls are transparent wireframes showing the system's architecture. Streams of data flow overhead like rivers of light. This is clearly not an area initiates are meant to access.",
            exits: {
                west: {
                    destination: "forest_boundary",
                    description: "The boundary fluctuation leads back to the forest simulation."
                },
                north: {
                    destination: "maintenance_shaft",
                    description: "A data stream pathway leads deeper into the system architecture."
                }
            },
            commands: {
                look: (args, gameState, adventure) => {
                    if (!gameState.gameFlags.backdoorRealization && args.length === 0) {
                        gameState.gameFlags.backdoorRealization = true;
                        return {
                            success: true,
                            message: "As you examine this strange space, another implanted memory surfaces - you see a map of interconnected systems, and recognize that you've found a maintenance backdoor. This could potentially allow you to bypass the normal progression of challenges and access higher tiers directly. However, doing so would likely be dangerous without proper preparation.",
                            locationChanged: false
                        };
                    }
                    return { success: true, message: null };
                }
            }
        },
        
        maintenance_shaft: {
            name: "Maintenance Data Shaft",
            description: "A vertical shaft of pure data streams extends above and below you. Maintenance protocols flow past like schools of glowing fish. You're standing on what appears to be a service platform, with access points branching off in different directions. This is the backend of the System, never meant for human interaction.",
            exits: {
                south: {
                    destination: "system_backdoor",
                    description: "The pathway leads back to the system backdoor."
                },
                down: {
                    destination: "deepcode_nexus",
                    description: "A heavy data stream flows downward."
                }
            },
            items: ["system_manual"],
            commands: {
                use: (args, gameState, adventure) => {
                    if (args.join(' ').toLowerCase().includes('code') || args.join(' ').toLowerCase().includes('vector') || args.join(' ').toLowerCase().includes('access')) {
                        if (gameState.gameFlags.foundClearingClue && !gameState.gameFlags.usedBypassCode) {
                            gameState.gameFlags.usedBypassCode = true;
                            return {
                                success: true,
                                message: "You input the bypass code: \"Vector-7, Protocol D19.\" The system around you shimmers, and new pathways open up. A maintenance interface materializes: \"ADMINISTRATIVE BYPASS ENGAGED. TIER PROTOCOLS OVERRIDDEN. WARNING: RECOMMENDED POWER LEVELS WILL BE IGNORED.\"",
                                locationChanged: true
                            };
                        }
                    }
                    return { success: true, message: null };
                }
            }
        },
        
        deepcode_nexus: {
            name: "Deep Code Nexus",
            description: "You've reached a nexus point where multiple system layers converge. The space is vast and incomprehensible, with data structures that defy human understanding. In the center floats what appears to be a direct access terminal to The Dungeon - the System's advanced combat training area normally reserved for high-tier initiates.",
            exits: {
                up: {
                    destination: "maintenance_shaft",
                    description: "The data stream leads back up to the maintenance shaft."
                },
                down: {
                    destination: "dungeon_tier_fifty",
                    description: "The terminal provides direct access to Dungeon Tier 50."
                }
            },
            commands: {
                look: (args, gameState, adventure) => {
                    if (!gameState.gameFlags.nexusWarning && args.length === 0) {
                        gameState.gameFlags.nexusWarning = true;
                        return {
                            success: true,
                            message: "As you contemplate the terminal, a fragmented system message appears: \"WARNING: ACCESSING TIER 50 WITH CURRENT POWER LEVEL (3) EXCEEDS SAFETY PARAMETERS. SURVIVAL PROBABILITY: 2.7%. SYSTEM WILL NOT PREVENT ACCESS BUT CAUTIONS AGAINST PROCEEDING.\" Despite this, something in your implanted memories urges you forward, insisting this is the path you must take.",
                            locationChanged: false
                        };
                    }
                    return { success: true, message: null };
                },
                use: (args, gameState, adventure) => {
                    if (args.join(' ').toLowerCase().includes('terminal') || args.join(' ').toLowerCase().includes('access')) {
                        return {
                            success: true,
                            message: "You place your hand on the terminal. The system recognizes your override access but issues one final warning: \"INITIATE ALEX CHEN: PROCEEDING WILL LIKELY RESULT IN TERMINATION. LAST WARNING.\" You can feel the implanted memories practically screaming at you to continue despite the danger."
                        };
                    }
                    return { success: true, message: null };
                }
            }
        },
        
        dungeon_tier_fifty: {
            name: "The Dungeon - Tier 50",
            description: "You materialize in a massive arena that dwarfs anything you've seen before. The walls are scored with massive claw marks and energy burns. The floor is littered with what look like the remnants of failed initiates - broken equipment and occasionally what might be bones. Red warning lights pulse overhead, and the air itself feels heavy with danger.",
            exits: {
                up: {
                    destination: "deepcode_nexus",
                    description: "A shimmering portal leads back to the access nexus.",
                    blocked: true,
                    blockedMessage: "As you approach the exit, an energy barrier blocks your path. A system message appears: \"CHALLENGE INITIATED. COMPLETION OR TERMINATION REQUIRED TO EXIT.\"",
                    condition: (gameState) => gameState.gameFlags.defeatedGuardian
                },
                north: {
                    destination: "guardian_chamber",
                    description: "A massive doorway leads to what appears to be the main challenge chamber."
                }
            },
            commands: {
                look: (args, gameState, adventure) => {
                    if (!gameState.gameFlags.dungeonRealization && args.length === 0) {
                        gameState.gameFlags.dungeonRealization = true;
                        return {
                            success: true,
                            message: "As you take in your surroundings, the reality of your situation becomes clear. You've skipped approximately 50 tiers of preparation and challenges to arrive here. The creatures you'll face will be exponentially more powerful than the simple predators in the forest simulation. Yet, for some reason, your implanted memories fill you with a strange confidence and provide flashes of combat techniques you've never learned.",
                            locationChanged: false
                        };
                    }
                    return { success: true, message: null };
                }
            }
        },
        
        guardian_chamber: {
            name: "Guardian's Arena",
            description: "A circular battle arena stretches before you, easily a hundred meters across. Ancient-looking pillars surround the space, inscribed with the same symbols as the device. In the center stands a colossal figure - humanoid but clearly not human, composed of shifting energy and armor, at least three times your height. Its eyes lock onto you, recognizing your presence.",
            exits: {
                south: {
                    destination: "dungeon_tier_fifty",
                    description: "The entrance is back to the south."
                },
                north: {
                    destination: "inner_sanctum",
                    description: "A sealed door is visible beyond the guardian.",
                    blocked: true,
                    blockedMessage: "The guardian blocks your path. It must be defeated to proceed.",
                    condition: (gameState) => gameState.gameFlags.defeatedGuardian
                }
            },
            commands: {
                look: (args, gameState, adventure) => {
                    if (!gameState.gameFlags.guardianEncounter && args.length === 0) {
                        gameState.gameFlags.guardianEncounter = true;
                        return {
                            success: true,
                            message: "The guardian's voice booms in your mind: \"UNAUTHORIZED ACCESS DETECTED. TIER VERIFICATION FAILED. POWER LEVEL INSUFFICIENT. TERMINATION PROTOCOL INITIATED.\" It raises a massive energy weapon, preparing to obliterate you. System warnings flash across your vision, indicating this entity is rated for Tier 50 initiates with power levels of 30+.",
                            locationChanged: false
                        };
                    }
                    return { success: true, message: null };
                },
                attack: (args, gameState, adventure) => {
                    if (args.join(' ').toLowerCase().includes('guardian')) {
                        if (gameState.gameFlags.guardianEncounter && !gameState.gameFlags.defeatedGuardian) {
                            // Logic to handle different scenarios
                            if (gameState.inventory.includes('ancient_key') && gameState.gameFlags.completedForestChallenge) {
                                // Success path with both key and some training
                                gameState.gameFlags.defeatedGuardian = true;
                                gameState.gameFlags.currentPowerLevel = 15; // Major power boost
                                
                                return {
                                    success: true,
                                    message: "As the guardian attacks, something extraordinary happens. The ancient key in your possession glows with blinding light, and the implanted memories flood your consciousness. Suddenly, you KNOW how to fight - movements and powers far beyond your training. Your body moves with impossible speed and precision.\n\nThe guardian seems momentarily surprised as you evade its first attack and strike back with devastating energy bursts. The battle is intense, but you discover powers awakening within you that shouldn't be possible for a Tier 1 initiate.\n\nAfter an exhausting fight, you manage to disable the guardian, which collapses to one knee. \"ANOMALY DETECTED. OVERRIDE PATTERN ALPHA. ACCESS... GRANTED.\" The door beyond the guardian slides open, and you feel your power level has increased dramatically.",
                                    locationChanged: true
                                };
                            } else if (gameState.inventory.includes('ancient_key')) {
                                // Narrow escape with just the key
                                gameState.gameFlags.defeatedGuardian = true;
                                gameState.gameFlags.currentPowerLevel = 10; // Moderate power boost
                                
                                return {
                                    success: true,
                                    message: "The guardian attacks with overwhelming force. You should be dead in seconds, but the ancient key activates, surrounding you with a protective aura. The implanted memories provide you with combat techniques that your body struggles to execute properly without training, but they're enough to keep you alive.\n\nThe battle is desperate and you take serious damage, but eventually you manage to exploit a weakness in the guardian's defenses. It staggers back, systems failing, and acknowledges your victory: \"UNEXPECTED OUTCOME. ANCESTRAL PATTERN RECOGNIZED. PROCEED.\"\n\nThe door beyond opens, and though you're wounded, you've gained significant power from this encounter.",
                                    locationChanged: true
                                };
                            } else if (gameState.gameFlags.currentPowerLevel >= 3) {
                                // Very narrow escape with just training
                                gameState.gameFlags.defeatedGuardian = true;
                                gameState.gameFlags.barelyDefeatedGuardian = true;
                                gameState.gameFlags.currentPowerLevel = 8; // Some power boost
                                
                                return {
                                    success: true,
                                    message: "The guardian's attack nearly kills you instantly. Only your basic training and the strange implanted reflexes save you from immediate death. The battle is completely one-sided, with you desperately evading while looking for any weakness.\n\nMiraculously, you notice a fluctuation in the guardian's energy pattern that matches the system architecture you observed in the maintenance shaft. With nothing to lose, you direct all your energy at this point.\n\nThe guardian freezes, caught in a temporary system loop. It's not defeated, but stunned long enough for the door beyond to open automatically as part of a failsafe protocol. You rush through, knowing the guardian will recover soon. Your brush with death has somehow accelerated your development, increasing your power.",
                                    locationChanged: true
                                };
                            } else {
                                // Death path with no preparation
                                gameState.gameFlags.playerDied = true;
                                gameState.gameFlags.killedByGuardian = true;
                                
                                return {
                                    success: false,
                                    message: "You attempt to fight the guardian, but the difference in power is too vast. Its first energy attack overwhelms your defenses completely. As your consciousness fades, you hear the system announce: \"TERMINATION COMPLETE. UNAUTHORIZED ACCESS ATTEMPT LOGGED.\"\n\nGame Over",
                                    locationChanged: false
                                };
                            }
                        } else if (gameState.gameFlags.defeatedGuardian) {
                            return {
                                success: true,
                                message: "The guardian has already been neutralized. It remains in a dormant state, its systems recovering."
                            };
                        }
                    }
                    return { success: true, message: null };
                }
            }
        },
        
        inner_sanctum: {
            name: "Dungeon Inner Sanctum",
            description: "Beyond the guardian lies a sacred-looking chamber unlike the rest of the Dungeon. The technology here appears ancient rather than futuristic, with stone architecture melded with advanced energy systems. The walls are covered in detailed murals depicting a cosmic conflict between different alien civilizations.",
            exits: {
                south: {
                    destination: "guardian_chamber",
                    description: "The guardian's arena is back to the south."
                },
                down: {
                    destination: "hidden_passage",
                    description: "A concealed stairway descends further into the complex."
                }
            },
            items: ["ancient_tablet"],
            commands: {
                examine: (args, gameState, adventure) => {
                    if (args.join(' ').toLowerCase().includes('murals') || args.join(' ').toLowerCase().includes('walls')) {
                        return {
                            success: true,
                            message: "The murals tell a story: an ancient species discovered something terrible at the heart of the galaxy and created a vast system to combat it. They seeded planets with devices like the one humans unearthed, designing them to activate when civilizations reached the necessary technological level. The System appears to be some kind of training or preparation protocol for an eventual conflict. One section shows humanoid figures with extraordinary powers confronting cosmic horrors."
                        };
                    }
                    return { success: true, message: null };
                }
            }
        },
        
        hidden_passage: {
            name: "Ancient Hidden Passage",
            description: "A narrow passage carved from solid bedrock descends steeply. Unlike the rest of the System, this area has no technological elements - it feels older, as if it predates the System entirely. Your implanted memories resonate strongly here, giving you the unsettling feeling that you've walked this path before, in another life.",
            exits: {
                up: {
                    destination: "inner_sanctum",
                    description: "The passage leads back up to the inner sanctum."
                },
                down: {
                    destination: "crystal_cavern",
                    description: "The passage continues downward."
                }
            }
        },
        
        crystal_cavern: {
            name: "Bioluminescent Crystal Cavern",
            description: "The passage opens into a breathtaking natural cavern filled with towering crystals that emit a soft blue-green light. The air is charged with strange energy that makes your skin tingle. Water drips from the ceiling into small pools that seem to glow from within. This place feels untouched by the System's influence - something older and more primal.",
            exits: {
                up: {
                    destination: "hidden_passage",
                    description: "The passage leads back upward."
                },
                east: {
                    destination: "underground_river",
                    description: "A narrow gap between crystals leads to the sound of flowing water."
                }
            },
            items: ["glowing_crystal"],
            commands: {
                look: (args, gameState, adventure) => {
                    if (!gameState.gameFlags.crystalVision && args.length === 0) {
                        gameState.gameFlags.crystalVision = true;
                        return {
                            success: true,
                            message: "As you gaze at the largest crystal formation, you experience a vision: a different Earth, untouched by humans, where massive structures similar to the device stand in geometrically precise patterns around the planet. They pulse with energy that flows into the planet's core. The vision shifts to show figures similar to humans but distinctly alien, observing Earth from orbit. The vision fades, leaving you with more questions than answers.",
                            locationChanged: false
                        };
                    }
                    return { success: true, message: null };
                }
            }
        },
        
        underground_river: {
            name: "Underground Luminescent River",
            description: "A wide, slow-moving river of glowing blue water cuts through the cavern. The ceiling here rises hundreds of meters, dotted with hanging crystal formations that reflect the water's glow. Stone steps lead down to a small dock where an ancient-looking boat is moored. The far side of the river fades into darkness, but you can make out what might be a structure.",
            exits: {
                west: {
                    destination: "crystal_cavern",
                    description: "The gap leads back to the crystal cavern."
                },
                east: {
                    destination: "temple_approach",
                    description: "The boat would allow crossing to the far shore.",
                    blocked: true,
                    blockedMessage: "You need to use the boat to cross the river.",
                    condition: (gameState) => gameState.gameFlags.crossedRiver
                }
            },
            commands: {
                use: (args, gameState, adventure) => {
                    if (args.join(' ').toLowerCase().includes('boat')) {
                        if (!gameState.gameFlags.crossedRiver) {
                            gameState.gameFlags.crossedRiver = true;
                            return {
                                success: true,
                                message: "You board the ancient stone boat, which begins moving on its own once you're seated. As it glides across the luminescent water, you notice strange aquatic creatures swimming in the depths below - life forms that appear both technological and biological. The boat delivers you to a small landing on the far shore, near what appears to be temple steps.",
                                locationChanged: true
                            };
                        }
                    }
                    return { success: true, message: null };
                }
            }
        },
        
        temple_approach: {
            name: "Ancient Temple Approach",
            description: "Wide stone steps ascend from the river landing toward a temple-like structure carved into the cavern wall. The architecture is unlike anything human, with impossible angles and surfaces that seem to shift when viewed indirectly. Columns inscribed with the now-familiar alien script flank the approach, glowing faintly from within.",
            exits: {
                west: {
                    destination: "underground_river",
                    description: "The boat awaits at the river landing below."
                },
                up: {
                    destination: "temple_entrance",
                    description: "The steps lead up to the temple entrance."
                }
            },
            commands: {
                look: (args, gameState, adventure) => {
                    if (!gameState.gameFlags.approachRealization && args.length === 0) {
                        gameState.gameFlags.approachRealization = true;
                        return {
                            success: true,
                            message: "As you study the temple, your implanted memories provide context: this is not part of the System. This structure predates it by perhaps millions of years. It belongs to what the memories identify as 'Those Who Came Before' - a species so ancient they were considered mythological by the aliens who created the System. Something of immense importance lies within.",
                            locationChanged: false
                        };
                    }
                    return { success: true, message: null };
                }
            }
        },
        
        temple_entrance: {
            name: "Temple Entrance Hall",
            description: "The entrance hall of the temple stretches before you, its ceiling lost in darkness above. The walls are covered in intricate carvings depicting star systems and celestial events. The air is perfectly still and carries a faint metallic scent. Four massive statues of humanoid figures with six arms stand in silent judgment of all who enter.",
            exits: {
                down: {
                    destination: "temple_approach",
                    description: "The steps lead back down to the river landing."
                },
                north: {
                    destination: "central_chamber",
                    description: "A wide corridor leads to the central chamber."
                }
            },
            items: ["temple_key"],
            commands: {
                examine: (args, gameState, adventure) => {
                    if (args.join(' ').toLowerCase().includes('statues')) {
                        return {
                            success: true,
                            message: "The statues depict beings with vaguely humanoid forms but with six arms and elongated craniums. Their eyes are inlaid with crystals that seem to follow your movement. According to your implanted memories, these represent 'The Architects' - the ancient species that first discovered the fundamental code of reality and learned to manipulate it. They are believed to have ascended beyond physical form eons ago."
                        };
                    }
                    return { success: true, message: null };
                }
            }
        },
        
        central_chamber: {
            name: "Temple Central Chamber",
            description: "The heart of the temple is a vast circular chamber dominated by a spherical energy field in its center. Within the field floats what appears to be a fragment of technology similar to the device you encountered at the dig site, but clearly broken or incomplete. The chamber floor is inscribed with channeling patterns that direct energy toward the central sphere.",
            exits: {
                south: {
                    destination: "temple_entrance",
                    description: "The corridor leads back to the entrance hall."
                },
                east: {
                    destination: "meditation_chamber",
                    description: "A small door leads to an adjoining chamber."
                },
                west: {
                    destination: "archive_room",
                    description: "An archway leads to what appears to be some kind of archive."
                },
                down: {
                    destination: "artifact_chamber",
                    description: "A descending staircase leads to a lower level.",
                    blocked: true,
                    blockedMessage: "The stairway is blocked by an energy barrier. You need to find a way to deactivate it.",
                    condition: (gameState) => gameState.gameFlags.deactivatedBarrier
                }
            },
            commands: {
                use: (args, gameState, adventure) => {
                    if (args.join(' ').toLowerCase().includes('key') && args.join(' ').toLowerCase().includes('temple')) {
                        if (gameState.inventory.includes('temple_key') && !gameState.gameFlags.deactivatedBarrier) {
                            gameState.gameFlags.deactivatedBarrier = true;
                            return {
                                success: true,
                                message: "You insert the temple key into a nearly invisible slot in the floor pattern. The channeling lines flare with brilliant light, and the energy field surrounding the device fragment pulses. The barrier blocking the downward staircase dissolves, granting access to the lower level.",
                                locationChanged: true
                            };
                        }
                    }
                    return { success: true, message: null };
                }
            }
        },
        
        meditation_chamber: {
            name: "Ancient Meditation Chamber",
            description: "A small, perfectly circular room with a single stone seat in the center. The walls are bare except for a repeating pattern that your eyes have difficulty focusing on. The air feels different here - heavier, as if time itself moves more slowly. There's a profound sense of peace despite the alien nature of the space.",
            exits: {
                west: {
                    destination: "central_chamber",
                    description: "The door leads back to the central chamber."
                }
            },
            commands: {
                sit: (args, gameState, adventure) => {
                    if (!gameState.gameFlags.meditationVision) {
                        gameState.gameFlags.meditationVision = true;
                        gameState.gameFlags.currentPowerLevel = (gameState.gameFlags.currentPowerLevel || 3) + 5;
                        return {
                            success: true,
                            message: "You sit on the stone seat and immediately feel a connection forming with the temple itself. Your consciousness expands, temporarily accessing the vast knowledge stored in the structure. You witness the birth and death of stars, the rise and fall of countless civilizations, and the true nature of the System - a planetary defense mechanism against something vast and terrible that lurks between galaxies.\n\nWhen the vision ends, you feel fundamentally changed. Your power level has increased significantly, and you now understand how to channel energy in ways the System's training never revealed.",
                            locationChanged: false
                        };
                    } else {
                        return {
                            success: true,
                            message: "You sit on the stone seat again, but the connection is weaker now. You receive brief flashes of cosmic imagery but nothing as profound as your first experience."
                        };
                    }
                }
            }
        },
        
        archive_room: {
            name: "Knowledge Archive",
            description: "This rectangular chamber contains what must be an alien library. Instead of books, crystal pillars rise from floor to ceiling, each humming with stored information. At the room's center stands a pedestal with a hemispheric depression - an interface of some kind. The knowledge of an entire civilization might be stored here, if only you could access it.",
            exits: {
                east: {
                    destination: "central_chamber",
                    description: "The archway leads back to the central chamber."
                }
            },
            items: ["knowledge_crystal"],
            commands: {
                use: (args, gameState, adventure) => {
                    if (args.join(' ').toLowerCase().includes('pedestal') || args.join(' ').toLowerCase().includes('interface')) {
                        if (gameState.inventory.includes('knowledge_crystal')) {
                            if (!gameState.gameFlags.accessedArchive) {
                                gameState.gameFlags.accessedArchive = true;
                                gameState.gameFlags.currentPowerLevel = (gameState.gameFlags.currentPowerLevel || 3) + 3;
                                return {
                                    success: true,
                                    message: "You place the knowledge crystal on the interface pedestal. It lights up and locks into place. A stream of information floods directly into your mind - too much to consciously process, but your implanted memories help filter and integrate the knowledge.\n\nYou learn about the creators of the device and their conflict with entities they called 'The Void Dwellers' - beings that exist partially outside normal spacetime. The System was created as a way to identify and empower potential defenders against an expected invasion.\n\nThe knowledge permanently enhances your abilities and power level.",
                                    locationChanged: false
                                };
                            } else {
                                return {
                                    success: true,
                                    message: "The interface has gone dormant after your initial connection. The knowledge crystal appears to have been fully integrated with your implanted memories."
                                };
                            }
                        } else {
                            return {
                                success: true,
                                message: "The pedestal interface requires some kind of key or crystal to activate. Perhaps you can find one elsewhere in the temple."
                            };
                        }
                    }
                    return { success: true, message: null };
                }
            }
        },
        
        artifact_chamber: {
            name: "Sacred Artifact Chamber",
            description: "You've reached the innermost sanctum of the temple - a small, octagonal chamber with walls of pure crystal. In the center, hovering above a pedestal, is an artifact unlike anything you've seen before. It appears to be a metallic sphere covered in flowing, living circuitry, pulsing with an inner light that shifts through colors you can't even name. This is clearly not from the same civilization that created the System - it's older, far more advanced.",
            exits: {
                up: {
                    destination: "central_chamber",
                    description: "The staircase leads back up to the central chamber."
                }
            },
            commands: {
                examine: (args, gameState, adventure) => {
                    if (args.join(' ').toLowerCase().includes('artifact') || args.join(' ').toLowerCase().includes('sphere')) {
                        return {
                            success: true,
                            message: "The artifact is approximately the size of a basketball but seems to exist partially in dimensions beyond your perception. Your implanted memories provide a name for it: 'The Nexus Core' - supposedly a mythical object created by The Architects themselves. Legend says it contains the power to rewrite the fundamental laws of any system it interfaces with. Your memories are practically screaming at you to take it."
                        };
                    }
                    return { success: true, message: null };
                },
                touch: (args, gameState, adventure) => {
                    if (args.join(' ').toLowerCase().includes('artifact') || args.join(' ').toLowerCase().includes('sphere') || args.join(' ').toLowerCase().includes('nexus') || args.join(' ').toLowerCase().includes('core')) {
                        if (!gameState.gameFlags.touchedSecondArtifact) {
                            gameState.gameFlags.touchedSecondArtifact = true;
                            return {
                                success: true,
                                message: "You reach out and place your hand on the artifact. The moment contact is made, the world seems to stop. The artifact's surface flows like liquid, extending tendrils that wrap around your arm, then your body. You feel no pain, only a rush of power unlike anything you've experienced.\n\nMemories flood your mind - not implanted this time, but awakened. You remember a different life, a different form. You remember creating the System. You remember fleeing from something terrible. You remember hiding yourself in human form as a failsafe.\n\nAs your human consciousness is overwhelmed by this revelation, the last thing you hear is a voice that is somehow your own:\n\n\"CALIBRATION COMPLETE. ADMINISTRATOR INTERFACE INITIALIZED. WELCOME TO THE SYSTEM, ARCHITECT.\"",
                                locationChanged: false
                            };
                        }
                    }
                    return { success: true, message: null };
                }
            }
        }
    },
    
    // Items in the adventure
    items: {
        research_notes: {
            name: "Research Notes",
            description: "Your personal notes on the anomaly, including detailed scans and theories. Most notable is the unusual electromagnetic signature that defies known physics - it seems to flicker in and out of detectability, as if existing partially in another dimension.",
            takeable: true
        },
        
        tablet: {
            name: "Tablet Computer",
            description: "Your work tablet containing research data, communications, and personal files. The screen currently displays a message from Dr. Rivera: 'Alex - Meeting in the briefing room at 0900. Bring your latest scan analysis. This is the breakthrough we've been waiting for.'",
            takeable: true
        },
        
        family_photo: {
            name: "Family Photo",
            description: "A photo of you with your parents at your PhD graduation. They look proud. Your father died in a caving accident when you were a teenager, which initially sparked your interest in what lies beneath the Earth's surface. Your mother still calls every Sunday without fail.",
            takeable: true
        },
        
        mission_briefing: {
            name: "Mission Briefing Document",
            description: "A document outlining today's expedition to the anomaly. It includes safety protocols, team assignments, and initial theories. A note from the project director warns about maintaining secrecy: 'Remember, the Antarctic team is not to be informed of our findings until we've confirmed their nature.'",
            takeable: true
        },
        
        safety_suit: {
            name: "Deep Earth Safety Suit",
            description: "A specialized suit designed for extreme conditions found in deep earth exploration. It regulates body temperature, filters air, and provides basic protection against pressure, radiation, and hazardous materials. Standard protocol requires wearing this for any descent below 5 kilometers.",
            takeable: true
        },
        
        scanner_device: {
            name: "Multi-Spectrum Scanner",
            description: "A handheld device capable of analyzing materials across multiple spectrums, from radio waves to gamma radiation. It can identify most known elements and compounds, and flag anomalous readings for further study. Your customized version has enhanced sensitivity for detecting unusual energy patterns.",
            takeable: true
        },
        
        geological_sample: {
            name: "Unusual Geological Sample",
            description: "A fragment of rock from near the anomaly site. It appears to be normal basalt at first glance, but contains microscopic structures that seem artificial - perfectly geometric patterns that couldn't form naturally. Your scanner indicates trace elements not found on the periodic table.",
            takeable: true
        },
        
        energy_readings: {
            name: "Anomalous Energy Readings",
            description: "A data pad displaying real-time measurements from the anomaly. The energy signature doesn't match any known form of radiation or electromagnetic phenomenon. Most concerning is that the readings seem to change when observed, as if reacting to conscious attention.",
            takeable: true
        },
        
        the_device: {
            name: "The Device",
            description: "The alien artifact at the center of the chamber appears to be a complex geometric structure of unknown origin. Its surface is covered in intricate patterns that seem to shift when not directly observed. It emits no radiation your instruments can detect, yet clearly contains immense energy. There is no doubt this is not of human manufacture.",
            takeable: false,
            takeFailMessage: "The device is somehow anchored in place through means you cannot understand. It cannot be moved."
        },
        
        strange_symbols: {
            name: "Strange Symbols",
            description: "The walls of the chamber are covered in symbols unlike any human language or known mathematical notation. They seem to form a complex system of communication, possibly instructions or warnings related to the device.",
            takeable: false,
            takeFailMessage: "The symbols are carved into the walls of the chamber and cannot be removed."
        },
        
        research_equipment: {
            name: "Research Equipment",
            description: "Various scientific instruments set up around the chamber to monitor the device. They include spectrometers, radiation detectors, and custom-built sensors designed specifically for this expedition. Most are showing either no readings at all or values that make no scientific sense.",
            takeable: false,
            takeFailMessage: "The equipment is too bulky to carry and is wired into place."
        },
        
        // Post-activation items
        floating_crystal: {
            name: "Floating Crystal",
            description: "A small crystal that hovers a few inches above your palm when held. It glows with an inner light that pulses in time with your heartbeat. According to your implanted memories, this is a basic navigation tool for System users, helping to identify hidden pathways and interfaces.",
            takeable: true
        },
        
        holographic_terminal: {
            name: "Holographic Interface Terminal",
            description: "A floating holographic interface that responds to touch and thought. It displays system status information and user access controls. The language it displays shifts between alien script and English as if adapting to your comprehension.",
            takeable: false,
            takeFailMessage: "The terminal appears to be anchored to this location through some form of energy tether."
        },
        
        training_manual: {
            name: "System Training Protocol Guide",
            description: "A holographic manual that demonstrates basic System interaction techniques. It shows how to access and channel the energy that now suffuses reality, performing what would have once been considered impossible feats. The instructions feel strangely familiar, as if you've done this before.",
            takeable: true
        },
        
        training_weapon: {
            name: "Basic Energy Projector",
            description: "A simple weapon provided to initiates that helps focus and direct energy attacks. It's not an external power source but rather a channeling tool that helps untrained users direct their own newly awakened abilities without self-harm.",
            takeable: true
        },
        
        assessment_drone: {
            name: "Assessment Drone",
            description: "A hovering spherical drone that observes and evaluates initiate performance. It records combat metrics, energy manipulation efficiency, and adaptation rates. The drone appears to be partially organic, with components that look almost like a nervous system.",
            takeable: false,
            takeFailMessage: "The drone actively avoids your attempts to grab it, maintaining a perfect distance just out of reach."
        },
        
        challenge_directory: {
            name: "Challenge Directory",
            description: "A holographic directory listing available challenges sorted by difficulty, reward, and skill type. Each entry includes success rates and average completion times. Higher tier challenges are locked until lower tiers are completed or special access is granted.",
            takeable: false,
            takeFailMessage: "The directory is a projected interface anchored to this location."
        },
        
        ancient_key: {
            name: "Ancient Key",
            description: "An unusual object that doesn't match the System's aesthetic. It appears to be made of a metal similar to the device, with the same shifting patterns on its surface. It's not immediately obvious what it unlocks, but your implanted memories react strongly to its presence, suggesting it's of vital importance.",
            takeable: true
        },
        
        challenge_guide: {
            name: "Initiate's Challenge Guide",
            description: "A small holographic reference tool for System initiates. It contains tips for surviving challenges, basic combat techniques, and energy conservation methods. A section on emergency protocols is locked to your access level.",
            takeable: true
        },
        
        energy_pack: {
            name: "Energy Restoration Pack",
            description: "A small device that helps initiates recover energy faster after exertion. When activated, it glows with a gentle blue light and accelerates natural energy regeneration. Standard equipment for all challenge participants.",
            takeable: true,
            usable: true,
            useMessage: "You activate the energy pack, which dissolves into particles that your body absorbs. You feel refreshed and your energy reserves are replenished."
        },
        
        strange_fungi: {
            name: "Luminescent Fungi",
            description: "An unusual fungal growth that emits a soft blue glow. It doesn't match any species in your botanical knowledge, and seems to have properties not found in terrestrial life. Your scanner indicates it contains compounds that can enhance neural activity.",
            takeable: true,
            usable: true,
            useMessage: "You carefully extract some of the fungal essence and apply it as the implanted memories guide you. Your perception heightens temporarily, allowing you to see energy flows and system architecture more clearly. This could be useful for finding hidden pathways."
        },
        
        system_manual: {
            name: "System Maintenance Manual",
            description: "A fragmentary technical document that appears to be a maintenance guide for System administrators. Most of it is incomprehensible, but sections regarding access protocols and navigation are partially readable. It confirms that the entire System has an underlying architecture that can be accessed through maintenance backdoors.",
            takeable: true
        },
        
        ancient_tablet: {
            name: "Ancient Stone Tablet",
            description: "A tablet made of unknown stone with inscriptions that predate the System itself. The writing is similar to but distinct from the symbols on the device. Your implanted memories provide partial translation: it speaks of 'Those Who Came Before' and 'The Knowledge Keepers' - apparently two ancient species with some connection to Earth.",
            takeable: true
        },
        
        glowing_crystal: {
            name: "Bioluminescent Crystal Fragment",
            description: "A beautiful crystal fragment from the cavern that continues to glow even when removed from its source. It emits a calming energy that seems to stabilize the chaotic implanted memories in your mind, allowing clearer access to their information.",
            takeable: true,
            usable: true,
            useMessage: "You hold the crystal to your forehead as your implanted memories suggest. A moment of perfect clarity washes over you, and you understand a little more about your purpose here. The connection between the System, the ancient temple, and your own unusual role becomes slightly clearer."
        },
        
        temple_key: {
            name: "Temple Activation Key",
            description: "An ornate key that appears to be made from the same material as the temple itself. It's cool to the touch and seems to absorb light rather than reflect it. Geometric patterns on its surface occasionally rearrange themselves when not directly observed.",
            takeable: true
        },
        
        knowledge_crystal: {
            name: "Ancient Knowledge Crystal",
            description: "A perfect tetrahedral crystal that contains what appears to be stored information from an ancient civilization. It pulses with soft light and occasionally projects fragmentary images - star maps, strange beings, and technologies beyond human comprehension.",
            takeable: true
        }
    },
    
    // Achievements for the adventure
    achievements: [
        {
            id: 'first_contact',
            title: 'First Contact',
            description: 'Discover the alien device in the deep excavation',
            icon: 'fas fa-satellite',
            secret: false,
            trigger: (gameState) => gameState.gameFlags.examinedDevice
        },
        {
            id: 'reality_shift',
            title: 'System Integration',
            description: 'Experience the transformation of reality',
            icon: 'fas fa-random',
            secret: false,
            trigger: (gameState) => gameState.gameFlags.deviceActivated
        },
        {
            id: 'alien_memory',
            title: 'Echoes of Another Mind',
            description: 'Experience your first implanted memory',
            icon: 'fas fa-brain',
            secret: false,
            trigger: (gameState) => gameState.gameFlags.corridorVision
        },
        {
            id: 'system_initiate',
            title: 'System Initiate',
            description: 'Begin the System training protocol',
            icon: 'fas fa-user-graduate',
            secret: false,
            trigger: (gameState) => gameState.gameFlags.initializedSystem
        },
        {
            id: 'power_awakening',
            title: 'Power Awakening',
            description: 'Complete basic training and unlock your abilities',
            icon: 'fas fa-bolt',
            secret: false,
            trigger: (gameState) => gameState.gameFlags.completedBasicTraining
        },
        {
            id: 'first_challenge',
            title: 'Challenge Accepted',
            description: 'Complete your first System challenge',
            icon: 'fas fa-trophy',
            secret: false,
            trigger: (gameState) => gameState.gameFlags.completedForestChallenge
        },
        {
            id: 'secret_path',
            title: 'The Path Less Traveled',
            description: 'Discover the secret maintenance access',
            icon: 'fas fa-route',
            secret: false,
            trigger: (gameState) => gameState.gameFlags.usedBypassCode
        },
        {
            id: 'tier_skipper',
            title: 'Tier Skipper',
            description: 'Access Tier 50 without completing previous tiers',
            icon: 'fas fa-fast-forward',
            secret: false,
            trigger: (gameState) => gameState.currentLocation === 'dungeon_tier_fifty'
        },
        {
            id: 'guardian_slayer',
            title: 'Guardian Slayer',
            description: 'Defeat the Tier 50 Guardian despite being severely underpowered',
            icon: 'fas fa-dragon',
            secret: false,
            trigger: (gameState) => gameState.gameFlags.defeatedGuardian
        },
        {
            id: 'ancient_knowledge',
            title: 'Ancient Knowledge',
            description: 'Access the temple archive and expand your understanding',
            icon: 'fas fa-book',
            secret: false,
            trigger: (gameState) => gameState.gameFlags.accessedArchive
        },
        {
            id: 'meditation_master',
            title: 'Mind Expander',
            description: 'Experience cosmic awareness in the meditation chamber',
            icon: 'fas fa-om',
            secret: false,
            trigger: (gameState) => gameState.gameFlags.meditationVision
        },
        {
            id: 'architect_awakening',
            title: 'The Architect Awakens',
            description: 'Touch the ancient artifact and discover your true nature',
            icon: 'fas fa-dna',
            secret: false,
            trigger: (gameState) => gameState.gameFlags.touchedSecondArtifact
        },
        {
            id: 'secret_observer',
            title: 'The Observer',
            description: 'Notice the mysterious old man watching your progress',
            icon: 'fas fa-eye',
            secret: true,
            trigger: (gameState) => gameState.gameFlags.noticeOldMan
        },
        {
            id: 'barely_survived',
            title: 'By the Skin of Your Teeth',
            description: 'Defeat the guardian with minimal training and no special items',
            icon: 'fas fa-heartbeat',
            secret: true,
            trigger: (gameState) => gameState.gameFlags.barelyDefeatedGuardian
        },
        {
            id: 'cosmic_historian',
            title: 'Cosmic Historian',
            description: 'Learn the true history of Earth and the System',
            icon: 'fas fa-globe',
            secret: true,
            trigger: (gameState) => gameState.gameFlags.crystalVision && gameState.gameFlags.approachRealization
        }
    ],
    
    // Plot events for the journal
    plotEvents: [
        {
            id: 'discovery',
            description: 'First sight of the alien device',
            condition: (gameState) => gameState.gameFlags.examinedDevice,
            triggered: false,
            journalEntry: "I've never seen anything like it. The device in the chamber defies all scientific explanation - suspended in mid-air, made of unknown materials, with patterns that seem to shift when I'm not looking directly at them. Dr. Rivera's scans confirm what we already suspected: this is definitively not of human origin. The carbon dating makes no sense - readings of both thousands and millions of years simultaneously. What is this thing? And why was it buried so deep beneath the Earth?"
        },
        {
            id: 'activation',
            description: 'The device activates',
            condition: (gameState) => gameState.gameFlags.deviceActivated,
            triggered: false,
            journalEntry: "I touched it. I know I shouldn't have, but something compelled me - almost like it was calling to me specifically. There was a pulse of energy, and I lost consciousness. When I woke up in my lab, everything seemed normal at first, but now I realize everything has changed. Reality itself feels different, almost programmatic. And these memories in my head that aren't mine - flashes of alien knowledge and strange compulsions. I need to go back to the device, but something tells me the path there has changed as well. What have I done?"
        },
        {
            id: 'system_discovery',
            description: 'Discovering the nature of the System',
            condition: (gameState) => gameState.gameFlags.corridorVision,
            triggered: false,
            journalEntry: "I had a vision in the mysterious corridor - for a moment, I could see the world as it truly is now. Everything has been converted into what these implanted memories call 'the System.' Reality as we knew it has been integrated into some kind of vast program or framework. People don't seem to notice, but I can see the changes. The device we discovered was meant to do this - to activate when a civilization reached a certain technological threshold. But why? What purpose does this System serve? And why do I have memories that seem to understand it all?"
        },
        {
            id: 'training_begins',
            description: 'Beginning System training',
            condition: (gameState) => gameState.gameFlags.initializedSystem,
            triggered: false,
            journalEntry: "I've begun what the System calls 'training protocols.' It's teaching me to access and manipulate energies that shouldn't be possible for humans to control. I can generate shields, project energy bursts, enhance my physical capabilities - it's like something out of science fiction, yet it feels natural somehow. Other people are here too - they must have felt the same compulsion to seek out the device. We're all being prepared for something, but what? The strangest part is how familiar it all feels, as if I've done this before."
        },
        {
            id: 'secret_path',
            description: 'Discovering the maintenance access',
            condition: (gameState) => gameState.gameFlags.discoveredSecretPath,
            triggered: false,
            journalEntry: "I've found something the System doesn't want initiates to discover - a maintenance access that bypasses the normal training progression. These implanted memories are proving useful, revealing secrets about the System's architecture. The normal path would take me through fifty tiers of training, but I've found a way to skip ahead. It's dangerous, perhaps suicidally so, but something drives me forward. These aren't random alien memories in my head - they feel targeted, specific, as if someone wanted me to find this path."
        },
        {
            id: 'dungeon_arrival',
            description: 'Arriving at Tier 50',
            condition: (gameState) => gameState.currentLocation === 'dungeon_tier_fifty',
            triggered: false,
            journalEntry: "I've done it - bypassed the System's progression and arrived directly at Tier 50 of what initiates call 'The Dungeon.' I'm hopelessly underpowered for this level, where even the weakest opponents should be able to destroy me instantly. Yet these implanted memories continue to guide me, suggesting I have some special purpose or ability that makes this insane risk necessary. The remains of failed initiates litter the ground - a grim reminder of what awaits those who overreach their capabilities."
        },
        {
            id: 'guardian_fight',
            description: 'Confronting the guardian',
            condition: (gameState) => gameState.gameFlags.guardianEncounter,
            triggered: false,
            journalEntry: "I'm facing an entity called a Guardian - a construct designed to prevent unauthorized access to the deeper levels of the Dungeon. It's massive, powerful, and should be able to obliterate me with a thought. The System itself is warning me that my chances of survival are practically zero. Yet the implanted memories are practically screaming at me to proceed. There's something beyond this guardian that I'm meant to find, something crucial enough to risk everything for."
        },
        {
            id: 'temple_discovery',
            description: 'Discovering the ancient temple',
            condition: (gameState) => gameState.currentLocation === 'temple_approach',
            triggered: false,
            journalEntry: "Beyond the guardian lies something that doesn't seem to be part of the System at all - an ancient temple structure that predates it by perhaps millions of years. My implanted memories identify it as belonging to 'Those Who Came Before' - a species so ancient they were considered mythological by the aliens who created the System. The architecture is impossible, with angles and surfaces that shouldn't exist in three-dimensional space. Whatever lies within must be of immense importance."
        },
        {
            id: 'cosmic_revelation',
            description: 'Learning the cosmic truth',
            condition: (gameState) => gameState.gameFlags.accessedArchive,
            triggered: false,
            journalEntry: "The knowledge I've gained in the temple archive is overwhelming. The System wasn't created as a weapon or tool of conquest - it's a defense mechanism against entities called 'The Void Dwellers,' beings that exist partially outside normal spacetime. These entities have destroyed countless civilizations across the galaxy, and Earth was identified as a potential battleground in this cosmic conflict. The System converts reality into a framework that can identify and empower potential defenders. But my role seems to be different from the other initiates - special somehow."
        },
        {
            id: 'artifact_approach',
            description: 'Finding the second artifact',
            condition: (gameState) => gameState.currentLocation === 'artifact_chamber',
            triggered: false,
            journalEntry: "I've found it - the object my implanted memories were guiding me toward. The artifact chamber contains something called 'The Nexus Core,' a device supposedly created by The Architects themselves. It's older and far more advanced than the System technology. According to my memories, it contains the power to rewrite the fundamental laws of any system it interfaces with. Why was I guided here? What am I supposed to do with this power? The memories are fragmentary, but they contain an unmistakable sense of urgency - as if the fate of humanity depends on this moment."
        }
    ]
};

// Check if we're in a browser or Node.js environment
if (typeof window !== 'undefined') {
    // Browser environment
    window.alienArtifactAdventure = alienArtifactAdventure;
    
    // If using with ModernZork, also add to global namespace
    if (typeof adventureLoader !== 'undefined' && adventureLoader.registerAdventure) {
        console.log('Registering The Device: Awakening with adventure loader...');
        adventureLoader.registerAdventure(alienArtifactAdventure);
    }
} else if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = alienArtifactAdventure;
}

// End of The Device: Awakening - Part 1 of The System Chronicles