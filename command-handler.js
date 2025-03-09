// Command handler for ModernZork

const commandHandler = (() => {
    // Standard commands
    const standardCommands = {
        // Movement commands
        'go': handleGoCommand,
        'move': handleGoCommand,
        'walk': handleGoCommand,
        'north': (args, state, adventure) => handleGoCommand(['north'], state, adventure),
        'south': (args, state, adventure) => handleGoCommand(['south'], state, adventure),
        'east': (args, state, adventure) => handleGoCommand(['east'], state, adventure),
        'west': (args, state, adventure) => handleGoCommand(['west'], state, adventure),
        'up': (args, state, adventure) => handleGoCommand(['up'], state, adventure),
        'down': (args, state, adventure) => handleGoCommand(['down'], state, adventure),
        'n': (args, state, adventure) => handleGoCommand(['north'], state, adventure),
        's': (args, state, adventure) => handleGoCommand(['south'], state, adventure),
        'e': (args, state, adventure) => handleGoCommand(['east'], state, adventure),
        'w': (args, state, adventure) => handleGoCommand(['west'], state, adventure),
        'u': (args, state, adventure) => handleGoCommand(['up'], state, adventure),
        'd': (args, state, adventure) => handleGoCommand(['down'], state, adventure),
        
        // Interaction commands
        'look': handleLookCommand,
        'examine': handleExamineCommand,
        'take': handleTakeCommand,
        'get': handleTakeCommand,
        'drop': handleDropCommand,
        'inventory': handleInventoryCommand,
        'i': handleInventoryCommand,
        'use': handleUseCommand,
        'open': handleOpenCommand,
        'close': handleCloseCommand,
        
        // Meta commands
        'help': handleHelpCommand,
        'score': handleScoreCommand,
        'quit': handleQuitCommand
    };
    
    // Handle a command
    function handleCommand(commandText, gameState, adventure) {
        // Parse the command
        const { command, args } = parseCommand(commandText);
        
        // Check for custom command handler in the current adventure
        const location = adventure.locations[gameState.currentLocation];
        if (location.commands && command in location.commands) {
            return location.commands[command](args, gameState, adventure);
        }
        
        // Check for special item commands
        const matchingItem = findMatchingItem(args.join(' '), gameState, adventure);
        if (matchingItem && matchingItem.commands && command in matchingItem.commands) {
            return matchingItem.commands[command](args, gameState, adventure);
        }
        
        // Check for standard commands
        if (command in standardCommands) {
            return standardCommands[command](args, gameState, adventure);
        }
        
        // Unknown command
        return {
            success: false,
            message: `I don't understand '${commandText}'.`
        };
    }
    
    // Parse a command into command and arguments
    function parseCommand(commandText) {
        const normalized = commandText.toLowerCase().trim();
        const words = normalized.split(/\s+/);
        const command = words[0];
        const args = words.slice(1);
        
        return { command, args };
    }
    
    // Find an item by name (in inventory or current location)
    function findMatchingItem(itemName, gameState, adventure) {
        const normalizedName = itemName.toLowerCase();
        
        // Check inventory
        for (const itemId of gameState.inventory) {
            const item = adventure.items[itemId];
            if (item && item.name.toLowerCase() === normalizedName) {
                return item;
            }
        }
        
        // Check current location
        const location = adventure.locations[gameState.currentLocation];
        if (location.items) {
            for (const itemId of location.items) {
                const item = adventure.items[itemId];
                if (item && item.name.toLowerCase() === normalizedName && !item.hidden) {
                    return item;
                }
            }
        }
        
        return null;
    }
    
    // Movement command handler
    function handleGoCommand(args, gameState, adventure) {
        if (args.length === 0) {
            return {
                success: false,
                message: 'Go where?'
            };
        }
        
        const direction = args[0].toLowerCase();
        const location = adventure.locations[gameState.currentLocation];
        
        if (!location.exits || !location.exits[direction]) {
            return {
                success: false,
                message: `You can't go ${direction} from here.`
            };
        }
        
        const exit = location.exits[direction];
        
        // Check if exit is blocked
        if (exit.blocked) {
            return {
                success: false,
                message: exit.blockedMessage || `You can't go ${direction} from here.`
            };
        }
        
        // Check for condition
        if (exit.condition && !evaluateCondition(exit.condition, gameState)) {
            return {
                success: false,
                message: exit.failMessage || `You can't go ${direction} from here.`
            };
        }
        
        // Move to the new location
        gameState.currentLocation = exit.destination;
        
        return {
            success: true,
            locationChanged: true,
            message: null
        };
    }
    
    // Look command handler
    function handleLookCommand(args, gameState, adventure) {
        // If no arguments, just describe the current location again
        if (args.length === 0) {
            return {
                success: true,
                locationChanged: true,
                message: null
            };
        }
        
        // Look at a specific item/direction
        const target = args.join(' ').toLowerCase();
        
        // Check if looking at a direction
        const directions = ['north', 'south', 'east', 'west', 'up', 'down', 'n', 's', 'e', 'w', 'u', 'd'];
        const direction = directions.includes(target) ? 
            (target.length === 1 ? 
                { 'n': 'north', 's': 'south', 'e': 'east', 'w': 'west', 'u': 'up', 'd': 'down' }[target] : 
                target) : 
            null;
        
        if (direction) {
            const location = adventure.locations[gameState.currentLocation];
            if (location.exits && location.exits[direction]) {
                return {
                    success: true,
                    message: location.exits[direction].description || `You see nothing special ${direction}.`
                };
            } else {
                return {
                    success: false,
                    message: `You see nothing special ${direction}.`
                };
            }
        }
        
        // Otherwise, look at an item (same as examine)
        return handleExamineCommand(args, gameState, adventure);
    }
    
    // Examine command handler
    function handleExamineCommand(args, gameState, adventure) {
        if (args.length === 0) {
            return {
                success: false,
                message: 'Examine what?'
            };
        }
        
        const itemName = args.join(' ');
        const item = findMatchingItem(itemName, gameState, adventure);
        
        if (!item) {
            return {
                success: false,
                message: `You don't see any ${itemName} here.`
            };
        }
        
        return {
            success: true,
            message: item.description
        };
    }
    
    // Take command handler
    function handleTakeCommand(args, gameState, adventure) {
        if (args.length === 0) {
            return {
                success: false,
                message: 'Take what?'
            };
        }
        
        const itemName = args.join(' ');
        const location = adventure.locations[gameState.currentLocation];
        
        // Find the item in the current location
        const itemId = location.items ? 
            location.items.find(id => 
                adventure.items[id] && 
                adventure.items[id].name.toLowerCase() === itemName.toLowerCase() && 
                !adventure.items[id].hidden
            ) : 
            null;
        
        if (!itemId) {
            return {
                success: false,
                message: `You don't see any ${itemName} here.`
            };
        }
        
        const item = adventure.items[itemId];
        
        // Check if item can be taken
        if (!item.takeable) {
            return {
                success: false,
                message: item.takeFailMessage || `You can't take the ${item.name}.`
            };
        }
        
        // Remove item from location
        location.items = location.items.filter(id => id !== itemId);
        
        // Add to inventory
        gameState.inventory.push(itemId);
        
        // Add to score if item has points
        if (item.points) {
            gameState.score += item.points;
        }
        
        return {
            success: true,
            inventoryChanged: true,
            message: item.takeSuccessMessage || `You take the ${item.name}.`
        };
    }
    
    // Drop command handler
    function handleDropCommand(args, gameState, adventure) {
        if (args.length === 0) {
            return {
                success: false,
                message: 'Drop what?'
            };
        }
        
        const itemName = args.join(' ');
        
        // Find the item in inventory
        const itemId = gameState.inventory.find(id => 
            adventure.items[id] && 
            adventure.items[id].name.toLowerCase() === itemName.toLowerCase()
        );
        
        if (!itemId) {
            return {
                success: false,
                message: `You don't have a ${itemName}.`
            };
        }
        
        const item = adventure.items[itemId];
        
        // Remove from inventory
        gameState.inventory = gameState.inventory.filter(id => id !== itemId);
        
        // Add to current location
        const location = adventure.locations[gameState.currentLocation];
        if (!location.items) {
            location.items = [];
        }
        location.items.push(itemId);
        
        return {
            success: true,
            inventoryChanged: true,
            message: `You drop the ${item.name}.`
        };
    }
    
    // Inventory command handler
    function handleInventoryCommand(args, gameState, adventure) {
        if (gameState.inventory.length === 0) {
            return {
                success: true,
                message: 'You are not carrying anything.'
            };
        }
        
        const itemNames = gameState.inventory
            .map(id => adventure.items[id].name)
            .join(', ');
        
        return {
            success: true,
            message: `You are carrying: ${itemNames}`
        };
    }
    
    // Use command handler
    function handleUseCommand(args, gameState, adventure) {
        if (args.length === 0) {
            return {
                success: false,
                message: 'Use what?'
            };
        }
        
        const itemName = args[0];
        const item = findMatchingItem(itemName, gameState, adventure);
        
        if (!item) {
            return {
                success: false,
                message: `You don't have a ${itemName}.`
            };
        }
        
        if (!item.usable) {
            return {
                success: false,
                message: `You can't use the ${item.name} that way.`
            };
        }
        
        // If the item has a use function, call it
        if (typeof item.use === 'function') {
            return item.use(args.slice(1), gameState, adventure);
        }
        
        // Default use behavior
        return {
            success: true,
            message: item.useMessage || `You use the ${item.name}.`
        };
    }
    
    // Open command handler
    function handleOpenCommand(args, gameState, adventure) {
        if (args.length === 0) {
            return {
                success: false,
                message: 'Open what?'
            };
        }
        
        const itemName = args.join(' ');
        const item = findMatchingItem(itemName, gameState, adventure);
        
        if (!item) {
            return {
                success: false,
                message: `You don't see any ${itemName} here.`
            };
        }
        
        if (!item.openable) {
            return {
                success: false,
                message: `You can't open the ${item.name}.`
            };
        }
        
        if (item.isOpen) {
            return {
                success: false,
                message: `The ${item.name} is already open.`
            };
        }
        
        // If the item is locked
        if (item.locked) {
            if (item.keyId && gameState.inventory.includes(item.keyId)) {
                const key = adventure.items[item.keyId];
                item.locked = false;
                return {
                    success: true,
                    message: `You unlock the ${item.name} with the ${key.name}.`
                };
            } else {
                return {
                    success: false,
                    message: item.lockedMessage || `The ${item.name} is locked.`
                };
            }
        }
        
        // Open the item
        item.isOpen = true;
        
        // Reveal any hidden items
        if (item.contains && item.contains.length > 0) {
            const location = adventure.locations[gameState.currentLocation];
            if (!location.items) {
                location.items = [];
            }
            
            item.contains.forEach(id => {
                if (!location.items.includes(id)) {
                    location.items.push(id);
                    // Remove from the container
                    adventure.items[id].hidden = false;
                }
            });
            
            // Clear the container
            item.contains = [];
        }
        
        return {
            success: true,
            locationChanged: item.contains && item.contains.length > 0,
            message: item.openMessage || `You open the ${item.name}.`
        };
    }
    
    // Close command handler
    function handleCloseCommand(args, gameState, adventure) {
        if (args.length === 0) {
            return {
                success: false,
                message: 'Close what?'
            };
        }
        
        const itemName = args.join(' ');
        const item = findMatchingItem(itemName, gameState, adventure);
        
        if (!item) {
            return {
                success: false,
                message: `You don't see any ${itemName} here.`
            };
        }
        
        if (!item.openable) {
            return {
                success: false,
                message: `You can't close the ${item.name}.`
            };
        }
        
        if (!item.isOpen) {
            return {
                success: false,
                message: `The ${item.name} is already closed.`
            };
        }
        
        // Close the item
        item.isOpen = false;
        
        return {
            success: true,
            message: item.closeMessage || `You close the ${item.name}.`
        };
    }
    
    // Help command handler
    function handleHelpCommand(args, gameState, adventure) {
        const helpText = `
            <strong>Available Commands:</strong><br>
            <br>
            <strong>Movement:</strong> GO [direction], or just type a direction (NORTH, SOUTH, EAST, WEST, UP, DOWN)<br>
            <strong>Look around:</strong> LOOK<br>
            <strong>Examine something:</strong> EXAMINE [object] or LOOK AT [object]<br>
            <strong>Get an item:</strong> TAKE [item] or GET [item]<br>
            <strong>Drop an item:</strong> DROP [item]<br>
            <strong>Use an item:</strong> USE [item]<br>
            <strong>Check inventory:</strong> INVENTORY or I<br>
            <strong>Open something:</strong> OPEN [object]<br>
            <strong>Close something:</strong> CLOSE [object]<br>
            <strong>Check score:</strong> SCORE<br>
            <strong>Quit game:</strong> QUIT<br>
            <br>
            Tip: You can use the TAB key to autocomplete commands.
        `;
        
        return {
            success: true,
            message: helpText
        };
    }
    
    // Score command handler
    function handleScoreCommand(args, gameState, adventure) {
        return {
            success: true,
            message: `Your score is ${gameState.score} in ${gameState.moveCount} moves.`
        };
    }
    
    // Quit command handler
    function handleQuitCommand(args, gameState, adventure) {
        const confirmQuit = confirm('Are you sure you want to quit? Your progress will be lost.');
        
        if (confirmQuit) {
            // Reload the page to restart
            location.reload();
            return { success: true };
        }
        
        return {
            success: false,
            message: 'Game continues.'
        };
    }
    
    // Public API
    return {
        handleCommand,
        standardCommands
    };
})();