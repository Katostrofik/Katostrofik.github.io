// Haunted Mansion - A horror adventure for ModernZork

const hauntedMansion = {
    // Adventure Metadata
    id: 'haunted-mansion',
    title: 'Haunted Mansion',
    author: 'ModernZork',
    version: '1.0',
    
    // Initial location when starting the adventure
    initialLocation: 'mansion_gates',
    
    // Introduction text displayed when the adventure starts
    introText: `
    HAUNTED MANSION
    ===============
    A Tale of Terror in Text
    
    The old Blackwood mansion has stood empty for decades, its dark windows like unseeing eyes staring out at the surrounding forest. Local legends speak of strange noises, ghostly apparitions, and people who enter never returning.
    
    As a paranormal investigator, you've heard all the stories before. But there's something different about this place - something that drew you here on this moonless night. The last text message from your partner, who entered the mansion two days ago, simply read: "I've found something. The legends are true. Don't come after me."
    
    Of course, that's exactly why you're here now, standing before the rusted gates of Blackwood mansion, your flashlight casting weak shadows across the overgrown path beyond.
    
    (Type 'help' for a list of commands)
    `,
    
    // Victory conditions
    victoryCondition: (gameState) => {
        return gameState.inventory.includes('ancient_tome') && 
               gameState.inventory.includes('mystic_amulet') && 
               gameState.currentLocation === 'mansion_gates';
    },
    
    victoryText: `
    As you step back through the mansion gates, clutching both the ancient tome and the mystic amulet, you feel the oppressive atmosphere lift. The ghostly wails that had followed you through the house fade into silence.
    
    Looking back at the mansion, you see lights flickering in the windows - not the eerie glow of supernatural manifestations, but warm, human lights. Shadows move past the windows, like people walking freely.
    
    In your hands, the tome and amulet grow warm. You understand now - the spirits weren't trying to harm you; they were asking for help. With these artifacts removed, the binding spell that trapped them has been broken.
    
    Your partner might be among them, finally at peace. Your investigation is complete, and the Blackwood mansion will trouble the living no more.
    
    Congratulations! You have completed "Haunted Mansion"!
    `,
    
    // Game over condition
    gameOverCondition: (gameState) => {
        return gameState.gameFlags.soulCaptured || gameState.gameFlags.fallen;
    },
    
    gameOverText: (gameState) => {
        if (gameState.gameFlags.soulCaptured) {
            return "The ghostly figures surround you, their cold hands passing through your body as they drain your life essence. You feel yourself growing lighter, more insubstantial, as your soul is torn from your body. You are now among the trapped spirits of Blackwood mansion, another victim of its ancient curse...";
        } else if (gameState.gameFlags.fallen) {
            return "The rotted floorboards give way beneath you, sending you plummeting into darkness. The last thing you feel is the sickening impact as you hit the stone floor of the forgotten cellar below. Another victim claimed by the Blackwood mansion, another ghost to haunt its halls...";
        } else {
            return "Game Over!";
        }
    },
    
    // Locations in the adventure
    locations: {
        // Mansion Entrance
        mansion_gates: {
            name: "Mansion Gates",
            description: "Tall wrought-iron gates stand before you, partially open as if inviting you in. Beyond them, a weed-choked path leads to the looming silhouette of Blackwood mansion. The night air feels unnaturally still, and no sounds come from the surrounding forest.",
            exits: {
                north: {
                    destination: "overgrown_garden",
                    description: "The path leads through the gates to the garden."
                }
            },
            items: ["flashlight"],
            commands: {
                leave: (noun, gameState) => {
                    return {
                        success: true,
                        message: "Something compels you to stay. Your partner is still missing, and the answers lie within the mansion."
                    };
                }
            }
        },
        
        // Garden
        overgrown_garden: {
            name: "Overgrown Garden",
            description: "What once must have been a magnificent garden is now wild and untamed. Marble statues peek out from tangles of vines, their faces worn by time and weather. A stone path winds through the chaos toward the mansion's front door. You could swear some of the statues have changed position when you weren't looking directly at them.",
            exits: {
                south: {
                    destination: "mansion_gates",
                    description: "The gates are back to the south."
                },
                north: {
                    destination: "entrance_hall",
                    description: "The mansion's front door lies ahead."
                }
            },
            items: ["stone_key"]
        },
        
        // Entrance Hall
        entrance_hall: {
            name: "Entrance Hall",
            description: "The grand entrance hall is dominated by a sweeping staircase that leads to the upper floor. Dust covers everything, and cobwebs hang from the crystal chandelier overhead. The floorboards creak under your weight, and you feel a distinct drop in temperature. A large mirror hanging on the wall shows a reflection that seems delayed by a fraction of a second.",
            exits: {
                south: {
                    destination: "overgrown_garden",
                    description: "The front door leads back to the garden."
                },
                east: {
                    destination: "dining_room",
                    description: "An open doorway leads to what appears to be a dining room."
                },
                west: {
                    destination: "library",
                    description: "Heavy double doors lead to the mansion's library."
                },
                up: {
                    destination: "upper_hallway",
                    description: "The staircase leads to the upper floor."
                }
            },
            items: ["dusty_photograph"]
        },
        
        // Library
        library: {
            name: "Library",
            description: "Walls of bookshelves line this massive room, filled with ancient tomes and manuscripts. A thick layer of dust covers everything, yet there are clear signs that someone has been here recently - footprints in the dust, and several books left open on the central reading table. A chilly draft seems to originate from nowhere, occasionally ruffling the pages of the open books.",
            exits: {
                east: {
                    destination: "entrance_hall",
                    description: "The double doors lead back to the entrance hall."
                },
                north: {
                    destination: "secret_study",
                    description: "A concealed door in the bookshelf is slightly ajar.",
                    hidden: true,
                    condition: (gameState) => gameState.gameFlags.secretDoorFound
                }
            },
            items: ["ancient_tome", "research_journal"],
            commands: {
                search: (noun, gameState) => {
                    if (noun === "bookshelves" || noun === "bookshelf" || noun === "shelves" || noun === "books" || noun === "") {
                        gameState.gameFlags.secretDoorFound = true;
                        return {
                            success: true,
                            locationChanged: true,
                            message: "As you carefully search the bookshelves, your hand brushes against a leather-bound volume that seems different from the others. When you pull it, you hear a click, and a section of the bookshelf swings inward, revealing a hidden study!"
                        };
                    } else {
                        return {
                            success: false,
                            message: "You find nothing unusual."
                        };
                    }
                }
            }
        },
        
        // Secret Study
        secret_study: {
            name: "Secret Study",
            description: "This hidden room appears to have been someone's private workspace. Occult symbols are drawn on the floor in what looks disturbingly like dried blood. Notes and diagrams are pinned to the walls, detailing something called 'The Binding' and 'The Veil Between Worlds.' A small desk holds various arcane implements.",
            exits: {
                south: {
                    destination: "library",
                    description: "The hidden door leads back to the library."
                }
            },
            items: ["ritual_dagger", "mysterious_note"]
        },
        
        // Dining Room
        dining_room: {
            name: "Dining Room",
            description: "A long table dominates this room, set for a feast that never happened. Fine china, tarnished silver, and crystal glasses are arranged with eerie precision. A thick layer of dust covers everything except, strangely, a single place setting at the head of the table that appears to have been recently used. A large fireplace stands cold and dark against the far wall.",
            exits: {
                west: {
                    destination: "entrance_hall",
                    description: "The doorway leads back to the entrance hall."
                },
                north: {
                    destination: "kitchen",
                    description: "A swinging door leads to what must be the kitchen."
                }
            },
            items: ["silver_candelabra"]
        },
        
        // Kitchen
        kitchen: {
            name: "Kitchen",
            description: "The mansion's kitchen is surprisingly modern compared to the rest of the house, though still decades out of date. Cast iron pots and pans hang from hooks, and an ancient refrigerator stands against one wall. A strong smell of rot permeates the air. The temperature here is unnaturally cold, and your breath forms visible clouds.",
            exits: {
                south: {
                    destination: "dining_room",
                    description: "The swinging door leads back to the dining room."
                },
                down: {
                    destination: "cellar",
                    description: "A wooden trap door in the floor likely leads to a cellar.",
                    blocked: true,
                    blockedMessage: "The trap door is locked. You need a key."
                }
            },
            items: ["rusted_key"]
        },
        
        // Cellar
        cellar: {
            name: "Cellar",
            description: "The mansion's cellar is a damp, stone-walled chamber filled with wine racks and storage crates. Most of the bottles are broken, and a dark liquid that might not be wine stains the floor. Strange markings are carved into the support columns, and you can hear the faint sound of whispering that seems to follow you around the room.",
            exits: {
                up: {
                    destination: "kitchen",
                    description: "The ladder leads back up to the kitchen."
                }
            },
            items: ["wine_bottle", "old_chains"]
        },
        
        // Upper Hallway
        upper_hallway: {
            name: "Upper Hallway",
            description: "The upper floor hallway stretches in both directions, with numerous doors leading to bedrooms and other chambers. Faded portraits line the walls, their eyes seeming to follow you as you move. The floorboards here are dangerously rotted in places, and you need to watch your step carefully.",
            exits: {
                down: {
                    destination: "entrance_hall",
                    description: "The staircase leads back down to the entrance hall."
                },
                east: {
                    destination: "master_bedroom",
                    description: "A large, ornate door likely leads to the master bedroom."
                },
                west: {
                    destination: "nursery",
                    description: "A door with peeling paint might be a child's room or nursery."
                },
                north: {
                    destination: "upstairs_bathroom",
                    description: "A smaller door probably leads to a bathroom."
                }
            },
            commands: {
                move: (noun, gameState) => {
                    // If the player has visited the hallway multiple times, there's a chance of falling
                    if (gameState.gameFlags.hallwayVisitCount) {
                        gameState.gameFlags.hallwayVisitCount++;
                        
                        if (gameState.gameFlags.hallwayVisitCount > 3 && Math.random() < 0.2) {
                            gameState.gameFlags.fallen = true;
                            return {
                                success: false,
                                message: "As you move down the hallway, the rotted floorboards suddenly give way beneath your feet!"
                            };
                        }
                    } else {
                        gameState.gameFlags.hallwayVisitCount = 1;
                    }
                    
                    return {
                        success: true,
                        message: "You carefully make your way across the creaking floor."
                    };
                }
            }
        },
        
        // Master Bedroom
        master_bedroom: {
            name: "Master Bedroom",
            description: "The master bedroom contains a massive four-poster bed with tattered curtains. A vanity table stands near the window, its mirror cracked but still reflective. Despite the overall decay, the bed sheets appear freshly made, and there's an indentation on the pillow as if someone has recently lain there. The air is heavy with the scent of an old-fashioned perfume.",
            exits: {
                west: {
                    destination: "upper_hallway",
                    description: "The door leads back to the upper hallway."
                },
                north: {
                    destination: "balcony",
                    description: "Glass doors lead to a balcony."
                }
            },
            items: ["antique_brush", "jewelry_box"]
        },
        
        // Balcony
        balcony: {
            name: "Balcony",
            description: "The stone balcony overlooks the overgrown garden below. From this vantage point, you notice that the garden's layout forms an intricate symbol that can only be seen from above. The night air is bitingly cold, and you can see your breath forming clouds. The stone railing is crumbling in places, making it dangerous to lean against.",
            exits: {
                south: {
                    destination: "master_bedroom",
                    description: "The glass doors lead back to the master bedroom."
                }
            },
            items: ["telescope"]
        },
        
        // Nursery
        nursery: {
            name: "Nursery",
            description: "This room was clearly once a child's nursery. Faded alphabet blocks lie scattered across the floor, and a wooden rocking horse stands in one corner, gently rocking by itself. A music box on a shelf occasionally plays a few notes of a haunting lullaby. The walls are painted with scenes from fairy tales that have become disturbing with age and decay.",
            exits: {
                east: {
                    destination: "upper_hallway",
                    description: "The door leads back to the upper hallway."
                }
            },
            items: ["teddy_bear", "music_box"]
        },
        
        // Upstairs Bathroom
        upstairs_bathroom: {
            name: "Upstairs Bathroom",
            description: "The mansion's bathroom contains an old claw-foot tub, a pedestal sink with tarnished fixtures, and a toilet. The mirror above the sink is clouded with age. There's a dark ring around the inside of the bathtub, and the sink occasionally drips a liquid that's too thick and dark to be water. A ghostly sobbing can be heard faintly but seems to stop whenever you try to locate the source.",
            exits: {
                south: {
                    destination: "upper_hallway",
                    description: "The door leads back to the upper hallway."
                }
            },
            items: ["hand_mirror", "bloodied_towel"]
        }
    },
    
    // Items in the adventure
    items: {
        // Mansion Gates Items
        flashlight: {
            id: "flashlight",
            name: "Flashlight",
            aliases: ["light", "torch"],
            description: "A heavy-duty flashlight with batteries that seem to be running low. The beam flickers occasionally.",
            takeable: true,
            points: 5
        },
        
        // Garden Items
        stone_key: {
            id: "stone_key",
            name: "Stone Key",
            aliases: ["key"],
            description: "An ornate key carved from a single piece of dark stone. It's surprisingly warm to the touch.",
            takeable: true
        },
        
        // Entrance Hall Items
        dusty_photograph: {
            id: "dusty_photograph",
            name: "Dusty Photograph",
            aliases: ["photo", "photograph", "picture"],
            description: "A black-and-white photograph showing a family standing in front of the mansion. The faces are blurred, as if they were moving when the picture was taken. The date on the back reads 'June 17, 1931.'",
            takeable: true
        },
        
        // Library Items
        ancient_tome: {
            id: "ancient_tome",
            name: "Ancient Tome",
            aliases: ["tome", "book"],
            description: "A leather-bound book written in a language you don't recognize. The pages seem to shift and change when you're not looking directly at them. It radiates an unnatural coldness.",
            takeable: true,
            points: 15
        },
        
        research_journal: {
            id: "research_journal",
            name: "Research Journal",
            aliases: ["journal", "notes", "diary"],
            description: "A modern notebook filled with your partner's handwriting. The notes detail their investigation of the mansion and references to 'the binding ritual' and 'trapped souls.' The final entry reads: 'I know how to free them now. I need the tome and the amulet. If you're reading this, finish what I started.'",
            takeable: true
        },
        
        // Secret Study Items
        ritual_dagger: {
            id: "ritual_dagger",
            name: "Ritual Dagger",
            aliases: ["dagger", "knife"],
            description: "An ornate silver dagger with strange symbols etched along the blade. The edge is still sharp, and dark stains suggest it has been used for more than ceremonial purposes.",
            takeable: true
        },
        
        mysterious_note: {
            id: "mysterious_note",
            name: "Mysterious Note",
            aliases: ["note", "paper"],
            description: "A torn piece of paper with hastily scribbled words: 'The binding holds them here. Find the amulet. Free the souls. Before midnight.'",
            takeable: true
        },
        
        // Dining Room Items
        silver_candelabra: {
            id: "silver_candelabra",
            name: "Silver Candelabra",
            aliases: ["candelabra", "candlestick"],
            description: "A tarnished silver candelabra with five arms. The candles are half-burned but show no signs of having been lit recently.",
            takeable: true
        },
        
        // Kitchen Items
        rusted_key: {
            id: "rusted_key",
            name: "Rusted Key",
            aliases: ["key", "iron key"],
            description: "A heavy iron key covered in rust. It likely opens the cellar trap door.",
            takeable: true
        },
        
        // Cellar Items
        wine_bottle: {
            id: "wine_bottle",
            name: "Wine Bottle",
            aliases: ["bottle", "wine"],
            description: "A dusty bottle of wine with a faded label. When you move it, you can hear something solid sliding around inside that's definitely not liquid.",
            takeable: true,
            usable: true,
            useMessage: "You break the bottle against the wall, revealing a small key hidden inside. It looks like it might fit a jewelry box."
        },
        
        old_chains: {
            id: "old_chains",
            name: "Old Chains",
            aliases: ["chains", "shackles"],
            description: "Heavy iron chains bolted to the cellar wall. There are dark stains around where they're anchored, and the manacles are sized for human wrists.",
            takeable: false,
            takeFailMessage: "The chains are firmly bolted to the wall and cannot be removed."
        },
        
        // Master Bedroom Items
        antique_brush: {
            id: "antique_brush",
            name: "Antique Brush",
            aliases: ["brush", "hairbrush"],
            description: "A silver-backed hairbrush with long dark hairs still caught in the bristles. When you pick it up, you briefly see a woman's reflection in the vanity mirror, though you're alone in the room.",
            takeable: true
        },
        
        jewelry_box: {
            id: "jewelry_box",
            name: "Jewelry Box",
            aliases: ["box"],
            description: "An ornate wooden jewelry box with a small keyhole. It's locked, but something valuable might be inside.",
            takeable: true,
            locked: true,
            openable: true,
            isOpen: false,
            contains: ["mystic_amulet"],
            openMessage: "You use the small key from the wine bottle to unlock the jewelry box, revealing a strange amulet inside."
        },
        
        mystic_amulet: {
            id: "mystic_amulet",
            name: "Mystic Amulet",
            aliases: ["amulet", "necklace", "pendant"],
            description: "A heavy gold amulet on a thick chain. It's inscribed with the same symbols you've seen throughout the mansion. The central stone pulses with an inner light, and it feels warm to the touch.",
            takeable: true,
            hidden: true,
            points: 15
        },
        
        // Balcony Items
        telescope: {
            id: "telescope",
            name: "Telescope",
            aliases: ["scope"],
            description: "An antique brass telescope mounted on a tripod. It's pointed at the night sky, focused on a particular arrangement of stars.",
            takeable: false,
            takeFailMessage: "The telescope is bolted to the balcony floor and cannot be removed.",
            usable: true,
            useMessage: "Looking through the telescope, you see that it's focused on a specific constellation. The arrangement of stars perfectly matches the symbol formed by the garden below and the occult markings you've seen throughout the mansion."
        },
        
        // Nursery Items
        teddy_bear: {
            id: "teddy_bear",
            name: "Teddy Bear",
            aliases: ["bear", "toy", "teddy"],
            description: "A well-worn teddy bear with one button eye missing. When you pick it up, you hear a child's laughter echo briefly through the room.",
            takeable: true,
            usable: true,
            useMessage: "As you hold the teddy bear, the temperature in the room drops dramatically, and you see the faint outline of a small child hugging the bear in your hands before fading away."
        },
        
        music_box: {
            id: "music_box",
            name: "Music Box",
            aliases: ["box"],
            description: "A delicate porcelain music box depicting dancing children. It occasionally plays a few notes on its own.",
            takeable: true,
            usable: true,
            useMessage: "You wind the music box, and it plays a haunting lullaby. As the music plays, you see faint spectral shapes of children dancing around the room before fading away as the music stops."
        },
        
        // Bathroom Items
        hand_mirror: {
            id: "hand_mirror",
            name: "Hand Mirror",
            aliases: ["mirror"],
            description: "A silver-backed hand mirror with an ornate handle. The reflective surface is tarnished but still functional.",
            takeable: true,
            usable: true,
            useMessage: "When you look into the mirror, for a brief moment you see not your own face but that of a woman with hollow eyes and a rictus grin. The image vanishes as quickly as it appeared, leaving you wondering if it was just your imagination."
        },
        
        bloodied_towel: {
            id: "bloodied_towel",
            name: "Bloodied Towel",
            aliases: ["towel", "cloth"],
            description: "A once-white towel now stained with dark, rust-colored splotches that look disturbingly like blood. It's stiff and dry, suggesting the stains are old.",
            takeable: true
        }
    }
};

// If running in a Node.js environment (for testing)
if (typeof module !== 'undefined') {
    module.exports = hauntedMansion;
}