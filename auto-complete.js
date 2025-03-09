// Autocomplete handler for ModernZork

const autoCompleteHandler = (() => {
    // Standard command words for autocomplete
    const standardCommands = [
        'go', 'look', 'examine', 'take', 'get', 'drop', 'inventory',
        'use', 'open', 'close', 'help', 'score', 'quit',
        'north', 'south', 'east', 'west', 'up', 'down',
        'n', 's', 'e', 'w', 'u', 'd'
    ];
    
    // Get autocomplete suggestions for a partial command
    function getSuggestions(partial, gameState, adventure) {
        if (!partial) return [];
        
        const partialLower = partial.toLowerCase();
        const words = partialLower.split(/\s+/);
        const lastWord = words[words.length - 1];
        
        // If we're suggesting the command itself (first word)
        if (words.length === 1) {
            return standardCommands
                .filter(cmd => cmd.startsWith(partialLower))
                .slice(0, 5);  // Limit to 5 suggestions
        }
        
        // If we already have a command, suggest appropriate objects
        const command = words[0];
        const partialObject = lastWord;
        
        // For movement commands, suggest directions
        if (['go', 'move', 'walk'].includes(command)) {
            const directions = ['north', 'south', 'east', 'west', 'up', 'down'];
            return directions
                .filter(dir => dir.startsWith(partialObject))
                .map(dir => `${words.slice(0, -1).join(' ')} ${dir}`);
        }
        
        // For object interaction commands, suggest visible objects
        const location = adventure.locations[gameState.currentLocation];
        let objectSuggestions = [];
        
        // Get visible items in current location
        if (location.items) {
            const visibleItems = location.items
                .filter(itemId => {
                    const item = adventure.items[itemId];
                    return item && !item.hidden;
                })
                .map(itemId => adventure.items[itemId].name.toLowerCase());
            objectSuggestions = objectSuggestions.concat(visibleItems);
        }
        
        // For drop and use commands, add inventory items
        if (['drop', 'use'].includes(command)) {
            const inventoryItems = gameState.inventory
                .map(itemId => adventure.items[itemId].name.toLowerCase());
            objectSuggestions = objectSuggestions.concat(inventoryItems);
        }
        
        // Filter and format suggestions
        return objectSuggestions
            .filter(obj => obj.startsWith(partialObject))
            .map(obj => `${words.slice(0, -1).join(' ')} ${obj}`)
            .slice(0, 5);  // Limit to 5 suggestions
    }
    
    // Public API
    return {
        getSuggestions
    };
})();