// Community Hub for ModernZork
// Allows players to browse, download, rate, and share adventures

const communityHub = (() => {
    // API endpoints (replace with actual APIs when available)
    const API = {
        // Base URL for API
        BASE_URL: 'https://api.modernzork.com/v1',
        
        // Community endpoints (simulated for now)
        GET_OFFICIAL: '/adventures/official',
        GET_COMMUNITY: '/adventures/community',
        GET_TRENDING: '/adventures/trending',
        GET_ADVENTURE: '/adventures/',
        RATE_ADVENTURE: '/adventures/rate',
        UPLOAD_ADVENTURE: '/adventures/upload',
        SEARCH_ADVENTURES: '/adventures/search'
    };
    
    // Adventure categories
    const CATEGORY = {
        OFFICIAL: 'official',
        COMMUNITY: 'community'
    };
    
    // Sort options
    const SORT = {
        NEWEST: 'newest',
        HIGHEST_RATED: 'highest_rated',
        MOST_PLAYED: 'most_played',
        TRENDING: 'trending'
    };
    
    // Current view state
    let viewState = {
        category: CATEGORY.OFFICIAL,
        sort: SORT.NEWEST,
        page: 1,
        searchQuery: '',
        selectedAdventure: null
    };
    
    // User preferences
    let userPreferences = {
        showNSFWContent: false
    };
    
    // Initialize the community hub
    function initialize() {
        // Set up the community UI
        setupCommunityUI();
        
        // Add community button to header if it doesn't exist
        if (!document.getElementById('community-btn')) {
            const gameControls = document.querySelector('.game-controls');
            if (gameControls) {
                const communityBtn = document.createElement('button');
                communityBtn.id = 'community-btn';
                communityBtn.className = 'control-btn';
                communityBtn.title = 'Community Hub';
                communityBtn.innerHTML = '<i class="fas fa-globe"></i>';
                communityBtn.addEventListener('click', () => openCommunityModal());
                
                // Insert at appropriate position
                const saveBtn = document.getElementById('save-btn');
                if (saveBtn) {
                    gameControls.insertBefore(communityBtn, saveBtn);
                } else {
                    const settingsBtn = document.getElementById('settings-btn');
                    if (settingsBtn) {
                        gameControls.insertBefore(communityBtn, settingsBtn);
                    } else {
                        gameControls.appendChild(communityBtn);
                    }
                }
            }
        }
    }
    
    // Set up the community UI
    function setupCommunityUI() {
        // Create community modal if it doesn't exist
        if (!document.getElementById('community-modal')) {
            const modal = document.createElement('div');
            modal.id = 'community-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content community-modal-content">
                    <div class="modal-header">
                        <h2>Adventure Library</h2>
                        <span class="close-modal">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="community-tabs">
                            <button class="tab-btn active" data-tab="browse-tab">Browse</button>
                            <button class="tab-btn" data-tab="your-adventures-tab">Your Adventures</button>
                            <button class="tab-btn" data-tab="upload-tab">Share Your Creation</button>
                        </div>
                        
                        <div id="browse-tab" class="tab-content active">
                            <div class="browse-controls">
                                <div class="category-selector">
                                    <button class="category-btn active" data-category="official">Official</button>
                                    <button class="category-btn" data-category="community">Community</button>
                                </div>
                                
                                <div class="search-container">
                                    <input type="text" id="adventure-search" placeholder="Search adventures...">
                                    <button id="search-btn"><i class="fas fa-search"></i></button>
                                </div>
                                
                                <div class="sort-selector">
                                    <label for="sort-select">Sort by:</label>
                                    <select id="sort-select">
                                        <option value="newest">Newest</option>
                                        <option value="highest_rated">Highest Rated</option>
                                        <option value="most_played">Most Played</option>
                                        <option value="trending">Trending</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="adventures-grid" id="adventures-grid">
                                <!-- Adventures will be loaded here -->
                                <div class="loading-spinner">
                                    <i class="fas fa-spinner fa-spin"></i>
                                    <p>Loading adventures...</p>
                                </div>
                            </div>
                            
                            <div class="pagination" id="pagination">
                                <!-- Pagination controls will be added here -->
                            </div>
                        </div>
                        
                        <div id="your-adventures-tab" class="tab-content">
                            <div class="your-adventures-container" id="your-adventures-container">
                                <h3>Your Downloaded Adventures</h3>
                                <div class="your-adventures-list" id="your-adventures-list">
                                    <!-- Downloaded adventures will be listed here -->
                                </div>
                                
                                <h3>Your Created Adventures</h3>
                                <div class="your-created-list" id="your-created-list">
                                    <!-- Created adventures will be listed here -->
                                </div>
                            </div>
                        </div>
                        
                        <div id="upload-tab" class="tab-content">
                            <div class="upload-container">
                                <h3>Share Your Adventure</h3>
                                <p>Create an adventure using our Adventure Creator or upload a JSON file directly.</p>
                                
                                <div class="upload-options">
                                    <button id="create-adventure-btn" class="btn">Adventure Creator</button>
                                    <div class="file-upload">
                                        <input type="file" id="adventure-file" accept=".json">
                                        <label for="adventure-file" class="btn">Upload JSON</label>
                                    </div>
                                </div>
                                
                                <div class="upload-form" id="upload-form" style="display:none;">
                                    <div class="form-group">
                                        <label for="upload-title">Title:</label>
                                        <input type="text" id="upload-title" placeholder="Adventure title">
                                    </div>
                                    <div class="form-group">
                                        <label for="upload-description">Description:</label>
                                        <textarea id="upload-description" placeholder="Describe your adventure"></textarea>
                                    </div>
                                    <div class="form-group">
                                        <label for="upload-tags">Tags (comma separated):</label>
                                        <input type="text" id="upload-tags" placeholder="fantasy, mystery, horror">
                                    </div>
                                    <div class="form-group checkbox-group">
                                        <label>
                                            <input type="checkbox" id="upload-nsfw">
                                            Contains mature content
                                        </label>
                                    </div>
                                    <div class="form-buttons">
                                        <button id="upload-submit-btn" class="btn">Upload</button>
                                        <button id="upload-cancel-btn" class="btn">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add event listeners
            setupCommunityEventListeners(modal);
        }
    }
    
    // Set up event listeners for community UI
    function setupCommunityEventListeners(modal) {
        // Close button
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // Tabs
        const tabs = modal.querySelectorAll('.community-tabs .tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                console.log("Tab clicked:", e.target.getAttribute('data-tab'));
                
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                const tabContents = modal.querySelectorAll('.tab-content');
                tabContents.forEach(tc => tc.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                e.target.classList.add('active');
                const tabId = e.target.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
                
                // Load content based on tab
                if (tabId === 'browse-tab') {
                    console.log("Loading browse tab content");
                    loadAdventures();
                } else if (tabId === 'your-adventures-tab') {
                    console.log("Loading your adventures tab content");
                    loadYourAdventures();
                }
            });
        });
        
        // Category buttons
        const categoryBtns = modal.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all category buttons
                categoryBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                e.target.classList.add('active');
                
                // Update view state
                viewState.category = e.target.getAttribute('data-category');
                viewState.page = 1;
                
                // Load adventures with new category
                loadAdventures();
            });
        });
        
        // Sort select
        const sortSelect = modal.querySelector('#sort-select');
        sortSelect.addEventListener('change', () => {
            viewState.sort = sortSelect.value;
            viewState.page = 1;
            loadAdventures();
        });
        
        // Search
        const searchInput = modal.querySelector('#adventure-search');
        const searchBtn = modal.querySelector('#search-btn');
        
        searchBtn.addEventListener('click', () => {
            viewState.searchQuery = searchInput.value.trim();
            viewState.page = 1;
            loadAdventures();
        });
        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                viewState.searchQuery = searchInput.value.trim();
                viewState.page = 1;
                loadAdventures();
            }
        });
        
        // Upload
        const createAdventureBtn = modal.querySelector('#create-adventure-btn');
        createAdventureBtn.addEventListener('click', () => {
            // Redirect to Adventure Creator (if implemented)
            alert('Adventure Creator coming soon!');
        });
        
        const adventureFileInput = modal.querySelector('#adventure-file');
        adventureFileInput.addEventListener('change', handleAdventureFileUpload);
        
        const uploadSubmitBtn = modal.querySelector('#upload-submit-btn');
        uploadSubmitBtn.addEventListener('click', submitAdventureUpload);
        
        const uploadCancelBtn = modal.querySelector('#upload-cancel-btn');
        uploadCancelBtn.addEventListener('click', () => {
            document.getElementById('upload-form').style.display = 'none';
        });
    }
    
    // Open the community modal
    function openCommunityModal() {
        const modal = document.getElementById('community-modal');
        if (modal) {
            // Show modal
            modal.style.display = 'block';
            
            // Load adventures
            loadAdventures();
        }
    }
    
    // Load adventures based on current view state
    async function loadAdventures() {
        const grid = document.getElementById('adventures-grid');
        if (!grid) return;
        
        // Show loading
        grid.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading adventures...</p>
            </div>
        `;
        
        try {
            // In a real implementation, this would make an API call
            // For now, we'll simulate with mock data
            const adventures = await getMockAdventures();
            
            // Apply filters and sorting
            let filteredAdventures = filterAdventures(adventures);
            
            // Paginate
            const paginatedResults = paginateAdventures(filteredAdventures, viewState.page);
            
            // Display adventures
            displayAdventures(paginatedResults.adventures);
            
            // Update pagination
            updatePagination(paginatedResults.totalPages);
            
        } catch (error) {
            grid.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Error loading adventures. Please try again later.</p>
                </div>
            `;
            console.error('Error loading adventures:', error);
        }
    }
    
    // Filter adventures based on view state
    function filterAdventures(adventures) {
        // Filter by category
        let filtered = adventures.filter(adv => adv.category === viewState.category);
        
        // Filter by search query
        if (viewState.searchQuery) {
            const query = viewState.searchQuery.toLowerCase();
            filtered = filtered.filter(adv => 
                adv.title.toLowerCase().includes(query) || 
                adv.description.toLowerCase().includes(query) ||
                adv.author.toLowerCase().includes(query) ||
                (adv.tags && adv.tags.some(tag => tag.toLowerCase().includes(query)))
            );
        }
        
        // Filter out NSFW content if not enabled
        if (!userPreferences.showNSFWContent) {
            filtered = filtered.filter(adv => !adv.nsfw);
        }
        
        // Sort
        switch (viewState.sort) {
            case SORT.NEWEST:
                filtered.sort((a, b) => b.created - a.created);
                break;
            case SORT.HIGHEST_RATED:
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case SORT.MOST_PLAYED:
                filtered.sort((a, b) => b.plays - a.plays);
                break;
            case SORT.TRENDING:
                filtered.sort((a, b) => b.trending - a.trending);
                break;
        }
        
        return filtered;
    }
    
    // Paginate adventures
    function paginateAdventures(adventures, page) {
        const perPage = 12;
        const totalPages = Math.ceil(adventures.length / perPage);
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        
        return {
            adventures: adventures.slice(startIndex, endIndex),
            totalPages: totalPages
        };
    }
    
    // Display adventures in the grid
    function displayAdventures(adventures) {
        const grid = document.getElementById('adventures-grid');
        if (!grid) return;
        
        if (adventures.length === 0) {
            grid.innerHTML = `
                <div class="no-adventures">
                    <i class="fas fa-search"></i>
                    <p>No adventures found. Try different search criteria.</p>
                </div>
            `;
            return;
        }
        
        // Clear grid
        grid.innerHTML = '';
        
        // Add each adventure
        adventures.forEach(adventure => {
            const adventureCard = document.createElement('div');
            adventureCard.className = 'adventure-card';
            adventureCard.innerHTML = `
                <div class="adventure-card-header">
                    <h3 class="adventure-title">${adventure.title}</h3>
                    ${adventure.nsfw ? '<span class="nsfw-tag">NSFW</span>' : ''}
                </div>
                <div class="adventure-card-body">
                    <p class="adventure-author">By ${adventure.author}</p>
                    <p class="adventure-description">${truncateText(adventure.description, 100)}</p>
                </div>
                <div class="adventure-card-footer">
                    <div class="adventure-stats">
                        <span class="adventure-rating">
                            <i class="fas fa-star"></i> ${adventure.rating.toFixed(1)}
                        </span>
                        <span class="adventure-plays">
                            <i class="fas fa-play"></i> ${formatNumber(adventure.plays)}
                        </span>
                    </div>
                    <button class="adventure-download-btn" data-id="${adventure.id}">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            `;
            
            // Add tags if they exist
            if (adventure.tags && adventure.tags.length > 0) {
                const tagsContainer = document.createElement('div');
                tagsContainer.className = 'adventure-tags';
                
                adventure.tags.forEach(tag => {
                    const tagSpan = document.createElement('span');
                    tagSpan.className = 'adventure-tag';
                    tagSpan.textContent = tag;
                    tagsContainer.appendChild(tagSpan);
                });
                
                adventureCard.querySelector('.adventure-card-body').appendChild(tagsContainer);
            }
            
            // Add event listener for view details
            adventureCard.addEventListener('click', (e) => {
                // Don't trigger if download button was clicked
                if (e.target.closest('.adventure-download-btn')) return;
                
                viewAdventureDetails(adventure.id);
            });
            
            // Add event listener for download button
            const downloadBtn = adventureCard.querySelector('.adventure-download-btn');
            downloadBtn.addEventListener('click', () => {
                downloadAdventure(adventure.id);
            });
            
            grid.appendChild(adventureCard);
        });
    }
    
    // Update pagination controls
    function updatePagination(totalPages) {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;
        
        // Clear container
        paginationContainer.innerHTML = '';
        
        if (totalPages <= 1) return;
        
        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.disabled = viewState.page === 1;
        prevBtn.addEventListener('click', () => {
            if (viewState.page > 1) {
                viewState.page--;
                loadAdventures();
            }
        });
        paginationContainer.appendChild(prevBtn);
        
        // Page numbers
        const maxVisiblePages = 5;
        const startPage = Math.max(1, viewState.page - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-btn ${i === viewState.page ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                viewState.page = i;
                loadAdventures();
            });
            paginationContainer.appendChild(pageBtn);
        }
        
        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.disabled = viewState.page === totalPages;
        nextBtn.addEventListener('click', () => {
            if (viewState.page < totalPages) {
                viewState.page++;
                loadAdventures();
            }
        });
        paginationContainer.appendChild(nextBtn);
    }
    
    // Load your adventures (downloaded and created)
    function loadYourAdventures() {
        console.log("Loading your adventures");
        
        try {
            // Create section containers if they don't exist
            ensureAdventureSectionsExist();
            
            // Load each section
            loadOfficialAdventures();
            loadDownloadedAdventures();
            
            // Only call loadCreatedAdventures if it exists
            if (typeof loadCreatedAdventures === 'function') {
                loadCreatedAdventures();
            } else {
                console.log("loadCreatedAdventures function not defined, skipping");
            }
        } catch (error) {
            console.error("Error loading your adventures:", error);
            
            // Display error message in the tab
            const container = document.getElementById('your-adventures-container');
            if (container) {
                container.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Error loading adventures. Please try again later.</p>
                    </div>
                `;
            }
        }
    }

    // Helper function to ensure all section containers exist
    function ensureAdventureSectionsExist() {
        const yourAdventuresContainer = document.getElementById('your-adventures-container');
        if (!yourAdventuresContainer) return;
        
        // Clear container for fresh start
        yourAdventuresContainer.innerHTML = '';
        
        // Add official adventures section
        const officialHeader = document.createElement('h3');
        officialHeader.textContent = 'Available Official Adventures';
        yourAdventuresContainer.appendChild(officialHeader);
        
        const officialContainer = document.createElement('div');
        officialContainer.id = 'official-adventures-list';
        officialContainer.className = 'your-adventures-list';
        yourAdventuresContainer.appendChild(officialContainer);
        
        // Add downloaded adventures section
        const downloadedHeader = document.createElement('h3');
        downloadedHeader.textContent = 'Downloaded Community Adventures';
        yourAdventuresContainer.appendChild(downloadedHeader);
        
        const downloadedContainer = document.createElement('div');
        downloadedContainer.id = 'your-adventures-list';
        downloadedContainer.className = 'your-adventures-list';
        yourAdventuresContainer.appendChild(downloadedContainer);
        
        // Add created adventures section
        const createdHeader = document.createElement('h3');
        createdHeader.textContent = 'Your Created Adventures';
        yourAdventuresContainer.appendChild(createdHeader);
        
        const createdContainer = document.createElement('div');
        createdContainer.id = 'your-created-list';
        createdContainer.className = 'your-adventures-list';
        yourAdventuresContainer.appendChild(createdContainer);
    }
    
    // Load official adventures
    function loadOfficialAdventures() {
        // Create the official adventures section if it doesn't exist
        let officialContainer = document.getElementById('official-adventures-list');
        
        if (!officialContainer) {
            // Find the parent container
            const yourAdventuresContainer = document.getElementById('your-adventures-container');
            if (!yourAdventuresContainer) return;
            
            // Add the official adventures header
            const officialHeader = document.createElement('h3');
            officialHeader.textContent = 'Available Official Adventures';
            yourAdventuresContainer.insertBefore(officialHeader, yourAdventuresContainer.firstChild);
            
            // Create official adventures container
            officialContainer = document.createElement('div');
            officialContainer.id = 'official-adventures-list';
            officialContainer.className = 'your-adventures-list';
            yourAdventuresContainer.insertBefore(officialContainer, yourAdventuresContainer.children[1]);
        }
        
        // Get official adventures - use a more compatible approach
        // that works regardless of whether getOfficialAdventures exists
        const allAdventures = adventureLoader.getAvailableAdventures();
        const officialAdventures = allAdventures.filter(adv => adv.source === 'official');
        
        if (officialAdventures.length === 0) {
            officialContainer.innerHTML = '<p class="no-adventures">No official adventures found.</p>';
            return;
        }
        
        // Clear container
        officialContainer.innerHTML = '';
        
        // Add each adventure
        officialAdventures.forEach(adventure => {
            const adventureItem = document.createElement('div');
            adventureItem.className = 'adventure-list-item';
            adventureItem.innerHTML = `
                <div class="adventure-info">
                    <h4>${adventure.title}</h4>
                    <p>By ${adventure.author}</p>
                    <p>${adventure.description || 'No description available.'}</p>
                </div>
                <div class="adventure-actions">
                    <button class="play-btn" data-id="${adventure.id}">Play</button>
                </div>
            `;
            
            // Add event listeners
            const playBtn = adventureItem.querySelector('.play-btn');
            playBtn.addEventListener('click', () => {
                playAdventure(adventure.id);
            });
            
            officialContainer.appendChild(adventureItem);
        });
    }

    // Load downloaded adventures (update this existing function)
    function loadDownloadedAdventures() {
        // Find the "Your Downloaded Adventures" header and change its text
        const downloadedHeader = document.querySelector('#your-adventures-container h3:nth-of-type(2)');
        if (downloadedHeader) {
            downloadedHeader.textContent = 'Downloaded Community Adventures';
        }
        
        const container = document.getElementById('your-adventures-list');
        if (!container) return;
        
        // Get all adventures
        const adventures = adventureLoader.getAvailableAdventures();
        
        // Filter to just community adventures
        const downloadedAdventures = adventures.filter(adv => adv.source === 'community');
        
        if (downloadedAdventures.length === 0) {
            container.innerHTML = '<p class="no-adventures">You have not downloaded any community adventures yet.</p>';
            return;
        }
        
        // Clear container
        container.innerHTML = '';
        
        // Add each adventure
        downloadedAdventures.forEach(adventure => {
            const adventureItem = document.createElement('div');
            adventureItem.className = 'adventure-list-item';
            adventureItem.innerHTML = `
                <div class="adventure-info">
                    <h4>${adventure.title}</h4>
                    <p>By ${adventure.author}</p>
                    <p>${adventure.description}</p>
                </div>
                <div class="adventure-actions">
                    <button class="play-btn" data-id="${adventure.id}">Play</button>
                    <button class="delete-btn" data-id="${adventure.id}">Delete</button>
                </div>
            `;
            
            // Add event listeners
            const playBtn = adventureItem.querySelector('.play-btn');
            playBtn.addEventListener('click', () => {
                playAdventure(adventure.id);
            });
            
            const deleteBtn = adventureItem.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                if (confirm(`Are you sure you want to delete "${adventure.title}"?`)) {
                    deleteAdventure(adventure.id);
                    loadDownloadedAdventures(); // Refresh list
                }
            });
            
            container.appendChild(adventureItem);
        });
    }

    // Load created adventures
    function loadCreatedAdventures() {
        const container = document.getElementById('your-created-list');
        if (!container) return;
        
        // Get created adventures from local storage
        const createdAdventures = getCreatedAdventures();
        
        if (createdAdventures.length === 0) {
            container.innerHTML = '<p class="no-adventures">You have not created any adventures yet.</p>';
            return;
        }
        
        // Clear container
        container.innerHTML = '';
        
        // Add each adventure
        createdAdventures.forEach(adventure => {
            const adventureItem = document.createElement('div');
            adventureItem.className = 'adventure-list-item';
            adventureItem.innerHTML = `
                <div class="adventure-info">
                    <h4>${adventure.title}</h4>
                    <p>Created: ${new Date(adventure.created || Date.now()).toLocaleDateString()}</p>
                </div>
                <div class="adventure-actions">
                    <button class="play-btn" data-id="${adventure.id}">Play</button>
                    <button class="edit-btn" data-id="${adventure.id}">Edit</button>
                    <button class="share-btn" data-id="${adventure.id}">Share</button>
                    <button class="delete-btn" data-id="${adventure.id}">Delete</button>
                </div>
            `;
            
            // Add event listeners
            const playBtn = adventureItem.querySelector('.play-btn');
            playBtn.addEventListener('click', () => {
                playAdventure(adventure.id);
            });
            
            const editBtn = adventureItem.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => {
                editAdventure(adventure.id);
            });
            
            const shareBtn = adventureItem.querySelector('.share-btn');
            shareBtn.addEventListener('click', () => {
                shareAdventure(adventure.id);
            });
            
            const deleteBtn = adventureItem.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                if (confirm(`Are you sure you want to delete "${adventure.title}"?`)) {
                    deleteCreatedAdventure(adventure.id);
                    loadCreatedAdventures(); // Refresh list
                }
            });
            
            container.appendChild(adventureItem);
        });
    }

    // Helper function to get created adventures from localStorage
    function getCreatedAdventures() {
        const createdAdventuresStr = localStorage.getItem('modernzork_created_adventures');
        if (!createdAdventuresStr) return [];
        
        try {
            return JSON.parse(createdAdventuresStr);
        } catch (error) {
            console.error('Error parsing created adventures:', error);
            return [];
        }
    }
    
    // View adventure details
    function viewAdventureDetails(adventureId) {
        // In a real implementation, this would fetch adventure details from API
        // For now, just use mock data
        getMockAdventureDetails(adventureId).then(adventure => {
            if (!adventure) {
                alert('Adventure not found.');
                return;
            }
            
            // Create modal for adventure details
            const detailsModal = document.createElement('div');
            detailsModal.className = 'modal adventure-details-modal';
            detailsModal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${adventure.title}</h2>
                        <span class="close-modal">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="adventure-details">
                            <div class="adventure-meta">
                                <p class="adventure-author">By ${adventure.author}</p>
                                <p class="adventure-created">Created: ${new Date(adventure.created).toLocaleDateString()}</p>
                                <div class="adventure-stats">
                                    <span class="adventure-rating">
                                        <i class="fas fa-star"></i> ${adventure.rating.toFixed(1)}
                                        (${adventure.ratingCount} ratings)
                                    </span>
                                    <span class="adventure-plays">
                                        <i class="fas fa-play"></i> ${formatNumber(adventure.plays)} plays
                                    </span>
                                </div>
                                ${adventure.nsfw ? '<span class="nsfw-tag large">NSFW</span>' : ''}
                            </div>
                            
                            <div class="adventure-description-full">
                                <h3>Description</h3>
                                <p>${adventure.description}</p>
                            </div>
                            
                            <div class="adventure-tags-container">
                                <h3>Tags</h3>
                                <div class="adventure-tags">
                                    ${adventure.tags.map(tag => `<span class="adventure-tag">${tag}</span>`).join('')}
                                </div>
                            </div>
                            
                            <div class="adventure-stats-details">
                                <h3>Details</h3>
                                <p><strong>Locations:</strong> ${adventure.stats.locations}</p>
                                <p><strong>Items:</strong> ${adventure.stats.items}</p>
                                <p><strong>Approximate Playtime:</strong> ${adventure.stats.playtime}</p>
                                <p><strong>Difficulty:</strong> ${adventure.stats.difficulty}</p>
                            </div>
                            
                            <div class="user-rating">
                                <h3>Rate this Adventure</h3>
                                <div class="star-rating">
                                    <i class="far fa-star" data-rating="1"></i>
                                    <i class="far fa-star" data-rating="2"></i>
                                    <i class="far fa-star" data-rating="3"></i>
                                    <i class="far fa-star" data-rating="4"></i>
                                    <i class="far fa-star" data-rating="5"></i>
                                </div>
                            </div>
                            
                            <div class="adventure-actions">
                                <button class="btn download-btn">Download</button>
                                <button class="btn report-btn">Report</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Add event listeners
            const closeBtn = detailsModal.querySelector('.close-modal');
            closeBtn.addEventListener('click', () => {
                document.body.removeChild(detailsModal);
            });
            
            // Star rating
            const stars = detailsModal.querySelectorAll('.star-rating i');
            stars.forEach(star => {
                star.addEventListener('mouseover', () => {
                    const rating = parseInt(star.getAttribute('data-rating'));
                    highlightStars(stars, rating);
                });
                
                star.addEventListener('mouseout', () => {
                    resetStars(stars);
                });
                
                star.addEventListener('click', () => {
                    const rating = parseInt(star.getAttribute('data-rating'));
                    rateAdventure(adventureId, rating);
                });
            });
            
            // Download button
            const downloadBtn = detailsModal.querySelector('.download-btn');
            downloadBtn.addEventListener('click', () => {
                downloadAdventure(adventureId);
                document.body.removeChild(detailsModal);
            });
            
            // Report button
            const reportBtn = detailsModal.querySelector('.report-btn');
            reportBtn.addEventListener('click', () => {
                reportAdventure(adventureId);
            });
            
            // Add modal to body
            document.body.appendChild(detailsModal);
        }).catch(error => {
            console.error('Error loading adventure details:', error);
            alert('Error loading adventure details. Please try again later.');
        });
    }
    
    // Highlight stars up to a specific rating
    function highlightStars(stars, rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove('far');
                star.classList.add('fas');
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
            }
        });
    }
    
    // Reset stars to default state
    function resetStars(stars) {
        stars.forEach(star => {
            star.classList.remove('fas');
            star.classList.add('far');
        });
    }
    
    // Rate an adventure
    function rateAdventure(adventureId, rating) {
        // In a real implementation, this would send rating to API
        // For now, just log and show a message
        console.log(`Rating adventure ${adventureId} with ${rating} stars`);
        alert(`Thanks for rating! You gave ${rating} stars.`);
    }
    
    // Download an adventure
    function downloadAdventure(adventureId) {
        // In a real implementation, this would fetch adventure data from API
        // For now, just simulate with mock data
        getMockAdventureDetails(adventureId).then(adventure => {
            if (!adventure) {
                alert('Adventure not found or could not be downloaded.');
                return;
            }
            
            // Import adventure into local storage
            const result = adventureLoader.importAdventure(JSON.stringify(adventure.data));
            
            if (result) {
                alert(`"${adventure.title}" has been downloaded and is now available to play!`);
            } else {
                alert('Failed to import adventure. It may be invalid or corrupted.');
            }
        }).catch(error => {
            console.error('Error downloading adventure:', error);
            alert('Error downloading adventure. Please try again later.');
        });
    }
    
    // Play an adventure
    function playAdventure(adventureId) {
        // Close community modal
        document.getElementById('community-modal').style.display = 'none';
        
        // Start the adventure
        if (typeof gamePreferences !== 'undefined') {
            gamePreferences.currentAdventure = adventureId;
            saveSettings();
            startAdventure(adventureId);
        } else {
            alert('Error starting adventure. The game engine could not be accessed.');
        }
    }
    
    // Edit an adventure
    function editAdventure(adventureId) {
        // In a real implementation, this would open the adventure creator
        alert('Adventure Creator coming soon!');
    }
    
    // Share an adventure
    function shareAdventure(adventureId) {
        // Get adventure data
        const createdAdventures = getCreatedAdventures();
        const adventure = createdAdventures.find(adv => adv.id === adventureId);
        
        if (!adventure) {
            alert('Adventure not found.');
            return;
        }
        
        // In a real implementation, this would upload to the community server
        // For now, just provide export functionality
        
        // Create a JSON blob
        const blob = new Blob([JSON.stringify(adventure)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const a = document.createElement('a');
        a.href = url;
        a.download = `${adventure.id}.json`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('Adventure exported. You can share this file with others or upload it to the community hub when available.');
    }
    
    // Report an adventure
    function reportAdventure(adventureId) {
        // In a real implementation, this would open a report form
        const reason = prompt('Please provide a reason for reporting this adventure:');
        
        if (reason) {
            alert('Thank you for your report. Our moderators will review this adventure.');
        }
    }
    
    // Delete a downloaded adventure
    function deleteAdventure(adventureId) {
        // In a real implementation, this would call a method in adventureLoader
        alert('Adventure deleted.');
    }
    
    // Delete a created adventure
    function deleteCreatedAdventure(adventureId) {
        // Get created adventures
        const createdAdventures = getCreatedAdventures();
        const updatedAdventures = createdAdventures.filter(adv => adv.id !== adventureId);
        
        // Save updated list
        localStorage.setItem('modernzork_created_adventures', JSON.stringify(updatedAdventures));
    }
    
    // Handle adventure file upload
    function handleAdventureFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Check file type
        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            alert('Please upload a JSON file.');
            e.target.value = ''; // Clear input
            return;
        }
        
        // Read file
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const adventure = JSON.parse(event.target.result);
                
                // Show upload form with pre-filled data
                showUploadForm(adventure);
            } catch (error) {
                console.error('Error parsing adventure file:', error);
                alert('Invalid JSON file. Please check the file and try again.');
            }
        };
        
        reader.readAsText(file);
    }
    
    // Show upload form with pre-filled data
    function showUploadForm(adventure) {
        const form = document.getElementById('upload-form');
        if (!form) return;
        
        // Pre-fill form fields
        const titleInput = document.getElementById('upload-title');
        const descriptionInput = document.getElementById('upload-description');
        const tagsInput = document.getElementById('upload-tags');
        const nsfwCheckbox = document.getElementById('upload-nsfw');
        
        if (titleInput) titleInput.value = adventure.title || '';
        if (descriptionInput) descriptionInput.value = adventure.description || '';
        if (tagsInput) tagsInput.value = adventure.tags ? adventure.tags.join(', ') : '';
        if (nsfwCheckbox) nsfwCheckbox.checked = adventure.nsfw || false;
        
        // Store adventure data for later
        form.dataset.adventure = JSON.stringify(adventure);
        
        // Show form
        form.style.display = 'block';
    }
    
    // Submit adventure upload
    function submitAdventureUpload() {
        const form = document.getElementById('upload-form');
        if (!form) return;
        
        // Get form data
        const title = document.getElementById('upload-title').value.trim();
        const description = document.getElementById('upload-description').value.trim();
        const tagsInput = document.getElementById('upload-tags').value.trim();
        const nsfw = document.getElementById('upload-nsfw').checked;
        
        // Validate
        if (!title) {
            alert('Please enter a title for your adventure.');
            return;
        }
        
        if (!description) {
            alert('Please enter a description for your adventure.');
            return;
        }
        
        // Parse tags
        const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
        
        // Get adventure data
        let adventure;
        try {
            adventure = JSON.parse(form.dataset.adventure || '{}');
        } catch (error) {
            console.error('Error parsing adventure data:', error);
            alert('Invalid adventure data. Please try again.');
            return;
        }
        
        // Update adventure with form data
        adventure.title = title;
        adventure.description = description;
        adventure.tags = tags;
        adventure.nsfw = nsfw;
        adventure.created = Date.now();
        adventure.author = 'You'; // In a real implementation, this would be the user's name
        
        // In a real implementation, this would upload to the community server
        // For now, just save locally
        saveCreatedAdventure(adventure);
        
        // Hide form
        form.style.display = 'none';
        
        // Clear file input
        document.getElementById('adventure-file').value = '';
        
        // Show success message
        alert('Adventure saved successfully!');
        
        // Switch to Your Adventures tab
        const tabBtn = document.querySelector('.tab-btn[data-tab="your-adventures-tab"]');
        if (tabBtn) tabBtn.click();
    }
    
    // Save a created adventure
    function saveCreatedAdventure(adventure) {
        // Generate ID if not present
        if (!adventure.id) {
            adventure.id = 'custom_' + Date.now();
        }
        
        // Get created adventures
        const createdAdventures = getCreatedAdventures();
        
        // Check if adventure with this ID already exists
        const existingIndex = createdAdventures.findIndex(adv => adv.id === adventure.id);
        
        if (existingIndex >= 0) {
            // Update existing adventure
            createdAdventures[existingIndex] = adventure;
        } else {
            // Add new adventure
            createdAdventures.push(adventure);
        }
        
        // Save updated list
        localStorage.setItem('modernzork_created_adventures', JSON.stringify(createdAdventures));
        
        // Register with adventure loader
        adventureLoader.registerAdventure(adventure);
    }
    
    // Get created adventures from local storage
    function getCreatedAdventures() {
        const createdAdventuresStr = localStorage.getItem('modernzork_created_adventures');
        if (!createdAdventuresStr) return [];
        
        try {
            return JSON.parse(createdAdventuresStr);
        } catch (error) {
            console.error('Error parsing created adventures:', error);
            return [];
        }
    }
    
    // Helper function to truncate text
    function truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
    
    // Helper function to format numbers (e.g. 1.2k)
    function formatNumber(num) {
        if (num < 1000) return num.toString();
        if (num < 1000000) return (num / 1000).toFixed(1) + 'k';
        return (num / 1000000).toFixed(1) + 'm';
    }
    
    // Get mock adventures for testing
    async function getMockAdventures() {
        // This would be replaced with actual API call
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate mock data
        const mockAdventures = [];
        
        // Official adventures
        mockAdventures.push({
            id: 'demo-adventure',
            title: 'The Forgotten Cave',
            author: 'ModernZork Team',
            description: 'Explore a mysterious cave system in search of ancient treasures. But beware, the cave holds many secrets and dangers!',
            category: CATEGORY.OFFICIAL,
            created: Date.now() - 1000000000,
            rating: 4.7,
            ratingCount: 125,
            plays: 1542,
            trending: 85,
            tags: ['fantasy', 'exploration', 'treasure'],
            nsfw: false
        });
        
        mockAdventures.push({
            id: 'space-adventure',
            title: 'Space Odyssey',
            author: 'ModernZork Team',
            description: 'Awaken from cryosleep aboard the colony ship Hyperion to discover something has gone terribly wrong. Survive and uncover the mystery!',
            category: CATEGORY.OFFICIAL,
            created: Date.now() - 800000000,
            rating: 4.5,
            ratingCount: 98,
            plays: 1247,
            trending: 90,
            tags: ['sci-fi', 'space', 'mystery'],
            nsfw: false
        });
        
        mockAdventures.push({
            id: 'haunted-mansion',
            title: 'Haunted Mansion',
            author: 'ModernZork Team',
            description: 'Investigate the legends surrounding the notorious Blackwood mansion. Will you discover the truth or become another victim of its curse?',
            category: CATEGORY.OFFICIAL,
            created: Date.now() - 600000000,
            rating: 4.8,
            ratingCount: 112,
            plays: 1389,
            trending: 95,
            tags: ['horror', 'mystery', 'paranormal'],
            nsfw: false
        });
        
        // Community adventures
        for (let i = 1; i <= 20; i++) {
            const id = `community-${i}`;
            const title = `Community Adventure ${i}`;
            const created = Date.now() - Math.random() * 10000000000;
            const rating = 2 + Math.random() * 3; // 2-5 stars
            const plays = Math.floor(Math.random() * 1000);
            const trending = Math.floor(Math.random() * 100);
            
            mockAdventures.push({
                id,
                title,
                author: `User${Math.floor(Math.random() * 1000)}`,
                description: `This is a community-created adventure. It features various challenges, puzzles, and an engaging storyline.`,
                category: CATEGORY.COMMUNITY,
                created,
                rating,
                ratingCount: Math.floor(Math.random() * 100),
                plays,
                trending,
                tags: ['community', Math.random() > 0.5 ? 'fantasy' : 'sci-fi', Math.random() > 0.7 ? 'puzzle' : 'action'],
                nsfw: Math.random() > 0.9 // 10% chance of being marked NSFW
            });
        }
        
        return mockAdventures;
    }
    
    // Get mock adventure details for testing
    async function getMockAdventureDetails(adventureId) {
        // Get all mock adventures
        const adventures = await getMockAdventures();
        
        // Find the one with matching ID
        const adventure = adventures.find(adv => adv.id === adventureId);
        
        if (!adventure) return null;
        
        // Add additional details
        return {
            ...adventure,
            stats: {
                locations: Math.floor(Math.random() * 15) + 5,
                items: Math.floor(Math.random() * 20) + 10,
                playtime: `${Math.floor(Math.random() * 30) + 10} minutes`,
                difficulty: ['Easy', 'Moderate', 'Hard'][Math.floor(Math.random() * 3)]
            },
            data: {
                id: adventure.id,
                title: adventure.title,
                author: adventure.author,
                version: '1.0',
                initialLocation: 'start',
                introText: `Welcome to ${adventure.title}! This is a demonstration adventure.`,
                locations: {
                    start: {
                        name: 'Starting Location',
                        description: 'This is where your adventure begins.',
                        exits: {
                            north: {
                                destination: 'room2',
                                description: 'A path leads north.'
                            }
                        }
                    },
                    room2: {
                        name: 'Second Room',
                        description: 'You have reached the second room.',
                        exits: {
                            south: {
                                destination: 'start',
                                description: 'The path leads back south.'
                            }
                        }
                    }
                },
                items: {
                    key: {
                        name: 'key',
                        description: 'A simple key.',
                        takeable: true
                    }
                }
            }
        };
    }
    
    // Public API
    return {
        initialize,
        openCommunityModal
    };
})();