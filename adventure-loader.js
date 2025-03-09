// Handles discovery, validation, and loading of adventure "cartridges"

const adventureLoader = (() => {
    // Registry of available adventures - ensure they're arrays
    let availableAdventures = {
        official: [],    // Official adventures
        community: []    // Community adventures
    };
    
    // Required metadata fields for a valid adventure
    const requiredMetadata = ['id', 'author', 'version', 'initialLocation', 'introText'];
    
    // Field aliases (for backward compatibility)
    const fieldAliases = {
        'name': 'title',
        'title': 'name'
    };
    
    // Initialize the adventure loader
    async function initialize() {
        try {
            console.log("Initializing adventure loader");
            
            // Clear available adventures
            availableAdventures = {
                official: [],
                community: []
            };
            
            // Always register built-in adventures first to ensure we have something
            registerBuiltInAdventures();
            
            // Then try file system if available
            try {
                // First, try to scan for adventures in the file system if available
                await discoverFileSystemAdventures();
            } catch (fsError) {
                console.warn("Error with file system discovery:", fsError);
                // Continue even if this fails
            }
            
            try {
                // Then, try to load any custom adventures if API is available
                if (typeof window.api !== 'undefined' && window.api.loadCustomAdventures) {
                    const customAdventures = await window.api.loadCustomAdventures();
                    customAdventures.forEach(adventure => {
                        registerAdventure(adventure, 'community');
                    });
                }
            } catch (apiError) {
                console.warn("Error loading custom adventures:", apiError);
                // Continue even if this fails
            }
            
            try {
                // Load saved community adventures from localStorage
                loadSavedCommunityAdventures();
            } catch (localStorageError) {
                console.warn("Error loading from localStorage:", localStorageError);
                // Continue even if this fails
            }
            
            // Scan for adventures in the HTML
            try {
                scanHtmlForAdventureScripts();
            } catch (htmlError) {
                console.warn("Error scanning HTML:", htmlError);
                // Continue even if this fails
            }
            
            // Update the adventure selection in the UI
            try {
                updateAdventureSelectionUI();
            } catch (uiError) {
                console.warn("Error updating UI:", uiError);
                // Continue even if this fails
            }
            
            // Debugging: log all adventures found
            console.log("Available official adventures:", availableAdventures.official);
            console.log("Available community adventures:", availableAdventures.community);
            
            return true;
        } catch (error) {
            console.error('Error initializing adventure loader:', error);
            
            // Fallback to ensure we have at least the built-in adventures
            registerBuiltInAdventures();
            updateAdventureSelectionUI();
            
            return false;
        }
    }
    
    // Discover adventures from the file system
    async function discoverFileSystemAdventures() {
        try {
            // Check if we have file system access
            if (typeof window.fs !== 'undefined' && window.fs.listFiles) {
                console.log("Attempting to discover adventures in file system");
                
                // Discover official adventures
                await discoverAdventuresInDirectory('/adventures/Official', 'official');
                
                // Discover community adventures
                await discoverAdventuresInDirectory('/adventures/Community', 'community');
                
                return true;
            } else {
                console.log("File system access not available, using built-in adventures");
                return false;
            }
        } catch (error) {
            console.error("Error discovering adventures:", error);
            return false;
        }
    }
    
    // Discover adventures in a specific directory
    async function discoverAdventuresInDirectory(directory, category) {
        try {
            console.log(`Scanning directory: ${directory}`);
            
            // List files in the directory
            const files = await window.fs.listFiles(directory);
            console.log(`Found ${files.length} files in ${directory}`);
            
            // Process each file
            for (const file of files) {
                if (file.endsWith('.js')) {
                    try {
                        // Read the file content
                        const content = await window.fs.readFile(`${directory}/${file}`, { encoding: 'utf8' });
                        
                        // Extract adventure metadata
                        const adventure = extractAdventureMetadata(content);
                        
                        if (adventure) {
                            // Add source information
                            adventure.source = category;
                            adventure.filePath = `${directory}/${file}`;
                            
                            // Register the adventure
                            registerAdventure(adventure, category);
                            console.log(`Registered adventure from file: ${file}`);
                        }
                    } catch (fileError) {
                        console.warn(`Error processing adventure file ${file}:`, fileError);
                    }
                }
            }
        } catch (error) {
            console.warn(`Error listing files in ${directory}:`, error);
        }
    }
    
    // Extract adventure metadata from file content
    function extractAdventureMetadata(content) {
        try {
            // Look for standard adventure object declaration
            // This is a simple extraction method for metadata only
            const metadataMatch = content.match(/const\s+(\w+)\s*=\s*{([^}]*)/);
            
            if (metadataMatch) {
                const metadataBlock = metadataMatch[2];
                
                // Extract key metadata fields
                const id = extractField(metadataBlock, 'id');
                const title = extractField(metadataBlock, 'title') || extractField(metadataBlock, 'name');
                const author = extractField(metadataBlock, 'author');
                const version = extractField(metadataBlock, 'version');
                const description = extractField(metadataBlock, 'description');
                
                // Check if we have the minimum required metadata
                if (id && title && author) {
                    return {
                        id,
                        title,
                        author,
                        version: version || '1.0',
                        description: description || `An adventure by ${author}`
                    };
                }
            }
            
            return null;
        } catch (error) {
            console.warn("Error extracting adventure metadata:", error);
            return null;
        }
    }
    
    // Helper function to extract a field value from text
    function extractField(text, fieldName) {
        const regex = new RegExp(`${fieldName}\\s*:\\s*['"]([^'"]*)['"`, 'i');
        const match = text.match(regex);
        return match ? match[1] : null;
    }
    
    // Scan HTML for adventure script references
    function scanHtmlForAdventureScripts() {
        console.log("Scanning HTML for adventure scripts");
        
        try {
            // Get all script tags
            const scripts = document.getElementsByTagName('script');
            const adventureScriptPaths = [];
            
            // Look for adventure script paths
            for (let i = 0; i < scripts.length; i++) {
                const src = scripts[i].src;
                if (src) {
                    // Check if it looks like an adventure script
                    if (src.includes('adventure') && src.endsWith('.js')) {
                        const filename = src.substring(src.lastIndexOf('/') + 1);
                        console.log("Found potential adventure script:", filename);
                        adventureScriptPaths.push(filename);
                    }
                }
            }
            
            // Also check for known adventure variables in global scope
            const knownAdventureObjects = [
                'demoAdventure',
                'spaceAdventure',
                'hauntedMansion', 
                'alienArtifactAdventure',
                'hauntedAdventure'
            ];
            
            for (const objName of knownAdventureObjects) {
                if (typeof window[objName] !== 'undefined') {
                    const adventure = window[objName];
                    if (adventure && adventure.id) {
                        console.log("Found adventure in global scope:", adventure.id);
                        adventure.source = 'official';
                        registerAdventure(adventure, 'official');
                    }
                }
            }
            
            return adventureScriptPaths;
        } catch (error) {
            console.error("Error scanning HTML for adventure scripts:", error);
            return [];
        }
    }
    
    // Load saved community adventures from localStorage
    function loadSavedCommunityAdventures() {
        try {
            const savedAdventures = localStorage.getItem('modernzork_saved_adventures');
            if (savedAdventures) {
                const adventures = JSON.parse(savedAdventures);
                adventures.forEach(adventure => {
                    if (validateAdventure(adventure)) {
                        adventure.source = 'community';
                        registerAdventure(adventure, 'community');
                    }
                });
            }
        } catch (error) {
            console.warn("Error loading saved community adventures:", error);
        }
    }
    
    // Register built-in adventures
    function registerBuiltInAdventures() {
        console.log("Registering built-in adventures");
        
        // Scan HTML for adventure scripts
        scanHtmlForAdventureScripts();
        
        // Look for any objects in window that look like adventures
        for (const key in window) {
            try {
                if (key.toLowerCase().includes('adventure')) {
                    const obj = window[key];
                    // Check if it looks like an adventure object
                    if (obj && typeof obj === 'object' && obj.id && obj.title) {
                        // Check if we haven't already registered it
                        if (!findAdventure(obj.id)) {
                            console.log(`Found adventure object in global scope: ${obj.id}`);
                            obj.source = 'official';
                            registerAdventure(obj, 'official');
                        }
                    }
                }
            } catch (e) {
                // Skip any objects that cause errors when accessing
            }
        }
        
        // Explicitly check for common adventure objects
        if (typeof demoAdventure !== 'undefined') {
            demoAdventure.source = 'official';
            registerAdventure(demoAdventure, 'official');
        }
        
        if (typeof spaceAdventure !== 'undefined') {
            spaceAdventure.source = 'official';
            registerAdventure(spaceAdventure, 'official');
        }
        
        if (typeof hauntedMansion !== 'undefined') {
            hauntedMansion.source = 'official';
            registerAdventure(hauntedMansion, 'official');
        }
        
        if (typeof alienArtifactAdventure !== 'undefined') {
            alienArtifactAdventure.source = 'official';
            registerAdventure(alienArtifactAdventure, 'official');
        }
        
        if (typeof hauntedAdventure !== 'undefined') {
            hauntedAdventure.source = 'official';
            registerAdventure(hauntedAdventure, 'official');
        }
    }
    
    // Register a new adventure
    function registerAdventure(adventure, category = 'official') {
        try {
            // Validate adventure has required metadata
            if (!validateAdventure(adventure)) {
                console.error(`Adventure validation failed: ${adventure.id || 'Unknown ID'}`);
                return false;
            }
            
            // Make sure title is set
            adventure.title = adventure.title || adventure.name || adventure.id;
            
            // Set category if not specified
            category = category || adventure.source || 'official';
            adventure.source = category;
            
            // Ensure the adventure list for this category exists
            if (!availableAdventures[category]) {
                availableAdventures[category] = [];
            }
            
            // Get the appropriate adventure list
            const adventureList = availableAdventures[category];
            
            // Check if adventure with this ID already exists
            const existingIndex = adventureList.findIndex(a => a.id === adventure.id);
            if (existingIndex >= 0) {
                // Replace existing adventure
                adventureList[existingIndex] = adventure;
            } else {
                // Add new adventure
                adventureList.push(adventure);
            }
            
            console.log(`Registered adventure: ${adventure.id} in category: ${category}`);
            return true;
        } catch (error) {
            console.error(`Error registering adventure: ${error}`);
            return false;
        }
    }
    
    // Validate adventure has required metadata and structure
    function validateAdventure(adventure) {
        try {
            // Basic object check
            if (!adventure || typeof adventure !== 'object') {
                console.error('Invalid adventure object');
                return false;
            }
            
            // Check for ID at minimum
            if (!adventure.id) {
                console.error('Adventure missing ID');
                return false;
            }
            
            // For metadata-only validation, just check id, title/name, and author
            if (adventure.id && (adventure.title || adventure.name) && adventure.author) {
                return true;
            }
            
            // For full adventure validation, check more details
            // Check required fields
            for (const field of requiredMetadata) {
                // Check if the field exists directly
                if (adventure[field]) {
                    continue;
                }
                
                // Check if there's an alias for this field
                const alias = fieldAliases[field];
                if (alias && adventure[alias]) {
                    // Copy the value from the alias field to the expected field
                    adventure[field] = adventure[alias];
                    continue;
                }
                
                // For metadata-only validation, we only need id, author, version
                if (field !== 'initialLocation' && field !== 'introText') {
                    continue;
                }
                
                // If neither field nor alias exists, report error
                console.error(`Adventure missing required field: ${field}`);
                return false;
            }
            
            // For metadata-only validation, we're done
            if (!adventure.locations) {
                return true;
            }
            
            // Validate essential structures (locations, items)
            if (!adventure.locations || Object.keys(adventure.locations).length === 0) {
                console.error('Adventure has no locations');
                return false;
            }
            
            // Validate initial location exists
            if (!adventure.locations[adventure.initialLocation]) {
                console.error(`Initial location "${adventure.initialLocation}" does not exist`);
                return false;
            }
            
            return true;
        } catch (error) {
            console.error(`Error validating adventure: ${error}`);
            return false;
        }
    }
    
    // Update the adventure selection UI
    function updateAdventureSelectionUI() {
        try {
            const adventureSelect = document.getElementById('adventure-select');
            if (!adventureSelect) {
                console.log("Adventure select element not found");
                return;
            }
            
            // Clear existing options
            adventureSelect.innerHTML = '';
            
            // Create and add option groups
            const officialGroup = document.createElement('optgroup');
            officialGroup.label = "Official Adventures";
            
            const communityGroup = document.createElement('optgroup');
            communityGroup.label = "Community Adventures";
            
            // Add options for each available official adventure
            if (Array.isArray(availableAdventures.official)) {
                availableAdventures.official.forEach(adventure => {
                    const option = document.createElement('option');
                    option.value = adventure.id;
                    option.textContent = adventure.title || adventure.name || adventure.id;
                    officialGroup.appendChild(option);
                });
            }
            
            // Add options for each available community adventure
            if (Array.isArray(availableAdventures.community)) {
                availableAdventures.community.forEach(adventure => {
                    const option = document.createElement('option');
                    option.value = adventure.id;
                    option.textContent = adventure.title || adventure.name || adventure.id;
                    communityGroup.appendChild(option);
                });
            }
            
            // Add option groups if they have options
            if (officialGroup.children.length > 0) {
                adventureSelect.appendChild(officialGroup);
            }
            
            if (communityGroup.children.length > 0) {
                adventureSelect.appendChild(communityGroup);
            }
            
            // If no adventures, add a default option
            if (adventureSelect.children.length === 0) {
                const option = document.createElement('option');
                option.value = "";
                option.textContent = "No adventures available";
                adventureSelect.appendChild(option);
            }
            
            console.log("Adventure selection UI updated");
        } catch (error) {
            console.error("Error updating adventure selection UI:", error);
        }
    }
    
    // Load an adventure by ID
    function loadAdventure(adventureId) {
        try {
            // Find the adventure in the registry
            let adventure = findAdventure(adventureId);
            
            if (!adventure) {
                console.error(`Adventure not found: ${adventureId}`);
                return null;
            }
            
            // If adventure is a metadata-only object, try to load the full adventure
            if (!adventure.locations && adventure.filePath) {
                try {
                    // Load from file if available
                    return loadAdventureFromFile(adventure.filePath);
                } catch (error) {
                    console.error(`Error loading adventure from file: ${error}`);
                    return null;
                }
            }
            
            return adventure;
        } catch (error) {
            console.error(`Error loading adventure: ${error}`);
            return null;
        }
    }
    
    // Find an adventure by ID
    function findAdventure(adventureId) {
        try {
            // Search official adventures
            let adventure = null;
            
            // Make sure arrays exist
            const officialAdventures = Array.isArray(availableAdventures.official) 
                ? availableAdventures.official : [];
            
            const communityAdventures = Array.isArray(availableAdventures.community)
                ? availableAdventures.community : [];
            
            // Search in official adventures
            adventure = officialAdventures.find(a => a.id === adventureId);
            
            // If not found, search in community adventures
            if (!adventure) {
                adventure = communityAdventures.find(a => a.id === adventureId);
            }
            
            return adventure;
        } catch (error) {
            console.error(`Error finding adventure: ${error}`);
            return null;
        }
    }
    
    // Load adventure from file
    async function loadAdventureFromFile(filePath) {
        try {
            // If we have file system access, load the adventure
            if (typeof window.fs !== 'undefined' && window.fs.readFile) {
                const content = await window.fs.readFile(filePath, { encoding: 'utf8' });
                
                // Extract adventure object
                const adventureMatch = content.match(/const\s+(\w+)\s*=\s*{/);
                if (adventureMatch) {
                    const adventureName = adventureMatch[1];
                    
                    // Create a new script element to execute the code
                    const script = document.createElement('script');
                    script.textContent = content;
                    document.head.appendChild(script);
                    
                    // Get the adventure object from the global scope
                    const adventure = window[adventureName];
                    
                    // Clean up
                    document.head.removeChild(script);
                    
                    if (adventure) {
                        return adventure;
                    }
                }
            }
            
            throw new Error("Could not load adventure from file");
        } catch (error) {
            console.error(`Error loading adventure from file ${filePath}:`, error);
            return null;
        }
    }
    
    // Import an adventure from a JSON string
    function importAdventure(jsonData) {
        try {
            const adventure = JSON.parse(jsonData);
            if (registerAdventure(adventure, 'community')) {
                // Save to localStorage
                saveAdventureToLocalStorage(adventure);
                
                // Update UI
                updateAdventureSelectionUI();
                
                return adventure.id;
            }
            return null;
        } catch (error) {
            console.error('Error importing adventure:', error);
            return null;
        }
    }
    
    // Save an adventure to localStorage
    function saveAdventureToLocalStorage(adventure) {
        try {
            // Get existing saved adventures
            const savedAdventuresStr = localStorage.getItem('modernzork_saved_adventures');
            let savedAdventures = [];
            
            if (savedAdventuresStr) {
                savedAdventures = JSON.parse(savedAdventuresStr);
            }
            
            // Check if adventure already exists
            const existingIndex = savedAdventures.findIndex(a => a.id === adventure.id);
            
            if (existingIndex >= 0) {
                // Replace existing adventure
                savedAdventures[existingIndex] = adventure;
            } else {
                // Add new adventure
                savedAdventures.push(adventure);
            }
            
            // Save back to localStorage
            localStorage.setItem('modernzork_saved_adventures', JSON.stringify(savedAdventures));
            
            return true;
        } catch (error) {
            console.error('Error saving adventure to localStorage:', error);
            return false;
        }
    }
    
    // Get all available adventures
    function getAvailableAdventures() {
        try {
            // Combine official and community adventures
            const officialAdventures = Array.isArray(availableAdventures.official) 
                ? availableAdventures.official : [];
            
            const communityAdventures = Array.isArray(availableAdventures.community)
                ? availableAdventures.community : [];
            
            return [
                ...officialAdventures.map(adventure => ({
                    id: adventure.id,
                    title: adventure.title || adventure.name || adventure.id,
                    author: adventure.author || 'Unknown',
                    version: adventure.version || '1.0',
                    description: adventure.description || 'No description available',
                    source: adventure.source || 'official'
                })),
                ...communityAdventures.map(adventure => ({
                    id: adventure.id,
                    title: adventure.title || adventure.name || adventure.id,
                    author: adventure.author || 'Unknown',
                    version: adventure.version || '1.0',
                    description: adventure.description || 'No description available',
                    source: adventure.source || 'community'
                }))
            ];
        } catch (error) {
            console.error("Error getting available adventures:", error);
            return [];
        }
    }
    
    // Get official adventures
    function getOfficialAdventures() {
        try {
            const officialAdventures = Array.isArray(availableAdventures.official) 
                ? availableAdventures.official : [];
                
            return officialAdventures.map(adventure => ({
                id: adventure.id,
                title: adventure.title || adventure.name || adventure.id,
                author: adventure.author || 'Unknown',
                version: adventure.version || '1.0',
                description: adventure.description || 'No description available'
            }));
        } catch (error) {
            console.error("Error getting official adventures:", error);
            return [];
        }
    }
    
    // Get community adventures
    function getCommunityAdventures() {
        try {
            const communityAdventures = Array.isArray(availableAdventures.community)
                ? availableAdventures.community : [];
                
            return communityAdventures.map(adventure => ({
                id: adventure.id,
                title: adventure.title || adventure.name || adventure.id,
                author: adventure.author || 'Unknown',
                version: adventure.version || '1.0',
                description: adventure.description || 'No description available'
            }));
        } catch (error) {
            console.error("Error getting community adventures:", error);
            return [];
        }
    }
    
    // Check if an adventure exists
    function hasAdventure(adventureId) {
        return findAdventure(adventureId) !== undefined;
    }
    
    // Setup adventure directories
    async function setupAdventureDirectories() {
        // Initialize with robust error handling
        try {
            // Register built-in adventures
            registerBuiltInAdventures();
            
            // Try to discover adventures but continue if it fails
            try {
                await discoverFileSystemAdventures();
            } catch (error) {
                console.warn("Error discovering adventures:", error);
            }
            
            return true;
        } catch (error) {
            console.error("Error setting up adventure directories:", error);
            return false;
        }
    }
    
    // Public API
    return {
        initialize,
        registerAdventure,
        loadAdventure,
        importAdventure,
        getAvailableAdventures,
        getOfficialAdventures,
        getCommunityAdventures,
        hasAdventure,
        setupAdventureDirectories
    };
})();