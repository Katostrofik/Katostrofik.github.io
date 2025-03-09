// UI manager for ModernZork

const uiManager = (() => {
    // DOM references
    let gameOutput;
    let commandInput;
    
    // Animation settings
    let textAnimationSpeed = 20; // ms per character
    let animationEnabled = true;
    
    // Sound settings
    let soundEnabled = true;
    
    // Initialize the UI manager
    function initialize() {
        // Get DOM elements
        gameOutput = document.getElementById('game-output');
        commandInput = document.getElementById('command-input');
        
        // Load settings
        loadUISettings();
        
        return true;
    }
    
    // Load UI settings from local storage
    function loadUISettings() {
        const uiSettings = localStorage.getItem('modernzork_ui_settings');
        if (uiSettings) {
            try {
                const settings = JSON.parse(uiSettings);
                textAnimationSpeed = settings.textAnimationSpeed ?? 20;
                animationEnabled = settings.animationEnabled ?? true;
                soundEnabled = settings.soundEnabled ?? true;
            } catch (error) {
                console.error('Error loading UI settings:', error);
            }
        }
        
        // Save settings to localStorage so other modules can access them
        localStorage.setItem('modernzork_sound_enabled', soundEnabled);
    }
    
    // Save UI settings to local storage
    function saveUISettings() {
        const settings = {
            textAnimationSpeed,
            animationEnabled,
            soundEnabled
        };
        
        localStorage.setItem('modernzork_ui_settings', JSON.stringify(settings));
        localStorage.setItem('modernzork_sound_enabled', soundEnabled);
    }
    
    // Set animation speed
    function setAnimationSpeed(speed) {
        textAnimationSpeed = speed;
        saveUISettings();
    }
    
    // Toggle text animation
    function toggleAnimation(enabled) {
        animationEnabled = enabled;
        saveUISettings();
    }
    
    // Toggle sound
    function toggleSound(enabled) {
        soundEnabled = enabled;
        saveUISettings();
    }
    
    // Scroll to bottom of output
    function scrollToBottom() {
        if (gameOutput) {
            gameOutput.scrollTop = gameOutput.scrollHeight;
        }
    }
    
    // Print text with typing animation
    function animateText(text, className = 'text-normal', onComplete = null) {
        if (!gameOutput) return;
        
        const p = document.createElement('p');
        p.className = className;
        gameOutput.appendChild(p);
        
        // If animation is disabled, just print the text
        if (!animationEnabled || textAnimationSpeed <= 0) {
            p.innerHTML = text;
            scrollToBottom();
            if (onComplete) onComplete();
            return;
        }
        
        // Otherwise, animate the text
        let charIndex = 0;
        const animationInterval = setInterval(() => {
            if (charIndex < text.length) {
                p.innerHTML += text.charAt(charIndex);
                charIndex++;
                scrollToBottom();
            } else {
                clearInterval(animationInterval);
                if (onComplete) onComplete();
            }
        }, textAnimationSpeed);
    }
    
    // Print HTML without animation
    function printHTML(html, className = 'text-normal') {
        if (!gameOutput) return;
        
        const p = document.createElement('p');
        p.className = className;
        p.innerHTML = html;
        gameOutput.appendChild(p);
        
        // Scroll to bottom
        scrollToBottom();
    }
    
    // Print text with or without animation based on settings
    function printText(text, className = 'text-normal', onComplete = null) {
        if (animationEnabled && textAnimationSpeed > 0) {
            animateText(text, className, onComplete);
        } else {
            printHTML(text, className);
            if (onComplete) onComplete();
        }
    }
    
    // Clear the game output
    function clearOutput() {
        if (gameOutput) {
            gameOutput.innerHTML = '';
        }
    }
    
    // Disable user input
    function disableInput() {
        if (commandInput) {
            commandInput.disabled = true;
        }
    }
    
    // Enable user input
    function enableInput() {
        if (commandInput) {
            commandInput.disabled = false;
            commandInput.focus();
        }
    }
    
    // Play a sound effect
    function playSound(soundName) {
        if (!soundEnabled) return;
        
        const sounds = {
            move: 'sounds/move.mp3',
            take: 'sounds/take.mp3',
            drop: 'sounds/drop.mp3',
            error: 'sounds/error.mp3',
            success: 'sounds/success.mp3',
            achievement: 'sounds/achievement.mp3'
        };
        
        const soundPath = sounds[soundName];
        if (!soundPath) return;
        
        try {
            const audio = new Audio(soundPath);
            audio.volume = 0.5;
            audio.play().catch(error => {
                console.log(`Could not play sound ${soundName}:`, error);
            });
        } catch (error) {
            console.log(`Error playing sound ${soundName}:`, error);
        }
    }
    
    // Show a toast notification
    function showToast(message, type = 'info', duration = 3000) {
        // Create toast container if it doesn't exist
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Add to container
        toastContainer.appendChild(toast);
        
        // Remove after duration
        setTimeout(() => {
            toast.classList.add('toast-hide');
            setTimeout(() => {
                if (toastContainer.contains(toast)) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }, duration);
    }
    
    // Public API
    return {
        initialize,
        scrollToBottom,
        animateText,
        printHTML,
        printText,
        clearOutput,
        disableInput,
        enableInput,
        setAnimationSpeed,
        toggleAnimation,
        toggleSound,
        playSound,
        showToast
    };
})();