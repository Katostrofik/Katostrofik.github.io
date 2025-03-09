// Adventure Directory Structure Management

// Function to create the adventure directory structure
async function createAdventureDirectoryStructure() {
    try {
        // Check if we have file system access
        if (typeof window.fs === 'undefined' || !window.fs.mkdir) {
            console.log("File system access not available - using built-in adventures");
            return false;
        }
        
        // Create adventures directory if it doesn't exist
        await createDirectoryIfNotExists('/adventures');
        
        // Create Official directory
        await createDirectoryIfNotExists('/adventures/Official');
        
        // Create Community directory
        await createDirectoryIfNotExists('/adventures/Community');
        
        // Move existing adventure files to the appropriate directories
        await moveAdventureFiles();
        
        console.log("Adventure directory structure created successfully");
        return true;
    } catch (error) {
        console.error("Error creating adventure directory structure:", error);
        return false;
    }
}

// Helper function to create a directory if it doesn't exist
async function createDirectoryIfNotExists(path) {
    try {
        // Check if directory exists
        try {
            await window.fs.stat(path);
            console.log(`Directory ${path} already exists`);
        } catch (error) {
            // Directory doesn't exist, create it
            await window.fs.mkdir(path);
            console.log(`Created directory: ${path}`);
        }
        return true;
    } catch (error) {
        console.error(`Error creating directory ${path}:`, error);
        return false;
    }
}

// Move adventure files to the appropriate directories
async function moveAdventureFiles() {
    try {
        // Move demo adventure
        await moveAdventureFile('demo-adventure.js', '/adventures/Official/');
        
        // Move space adventure
        await moveAdventureFile('space-adventure.js', '/adventures/Official/');
        
        // Move haunted mansion if it exists
        await moveAdventureFile('haunted-adventure.js', '/adventures/Official/');
        
        // Move alien artifact adventure if it exists
        await moveAdventureFile('alien-artifact-adventure.js', '/adventures/Official/');
        
        return true;
    } catch (error) {
        console.error("Error moving adventure files:", error);
        return false;
    }
}

// Helper function to move an adventure file
async function moveAdventureFile(filename, targetDir) {
    try {
        // Read the source file
        const content = await window.fs.readFile(filename, { encoding: 'utf8' });
        
        // Write to the target location
        await window.fs.writeFile(`${targetDir}${filename}`, content);
        
        console.log(`Moved ${filename} to ${targetDir}`);
        return true;
    } catch (error) {
        // Simply log as a warning, not an error since some files might not exist
        console.log(`Note: Could not move file ${filename} - it may not exist or is already moved`);
        return false;
    }
}

// Setup function to be called from script.js
async function setupAdventureDirectories() {
    // Try to create directory structure but continue regardless of result
    await createAdventureDirectoryStructure();
    
    // Initialize the adventure loader which will scan directories if available
    // or use built-in adventures if not
    if (typeof adventureLoader !== 'undefined' && adventureLoader.initialize) {
        await adventureLoader.initialize();
    }
}