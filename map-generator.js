// Enhanced map generator with debugging
const mapGenerator = (() => {
    // Constants
    const NODE_RADIUS = 15;
    const GRID_SIZE = 80;
    const LABEL_OFFSET = 20;
    
    // Map data - use global mapData if available
    const getMapData = () => {
        if (typeof mapData !== 'undefined') {
            return mapData;
        } else {
            console.error("mapData not found in global scope");
            return { nodes: {}, visited: [], currentLocation: null };
        }
    };
    
    // Debug log function
    function debug(message, data) {
        console.log(`[MapGenerator] ${message}`, data);
    }
    
    // Initialize the map
    function initialize(adventure, gameState) {
        debug("Initializing map", { adventure, gameState });
        
        const mapData = getMapData();
        
        // Reset nodes
        mapData.nodes = {};
        
        // Mark current location as visited if not already
        if (gameState.currentLocation && !mapData.visited.includes(gameState.currentLocation)) {
            mapData.visited.push(gameState.currentLocation);
        }
        
        // Set current location
        mapData.currentLocation = gameState.currentLocation;
        
        // Create map SVG
        const svg = document.getElementById('game-map');
        if (!svg) {
            console.error("Game map SVG element not found");
            return;
        }
        
        // Clear existing map content
        const locationsGroup = document.getElementById('map-locations');
        const pathsGroup = document.getElementById('map-paths');
        const labelsGroup = document.getElementById('map-labels');
        
        if (!locationsGroup || !pathsGroup || !labelsGroup) {
            console.error("Map SVG groups not found", { locationsGroup, pathsGroup, labelsGroup });
            return;
        }
        
        locationsGroup.innerHTML = '';
        pathsGroup.innerHTML = '';
        labelsGroup.innerHTML = '';
        
        // Auto-generate layout for visible locations
        generateMapLayout(adventure);
        
        // Draw the map
        drawMap();
        
        debug("Map initialized with data", { mapData: getMapData() });
    }
    
    // Update the map with the current game state
    function updateMap(adventure, gameState) {
        debug("Updating map", { adventure, gameState });
        
        const mapData = getMapData();
        
        // Update current location
        mapData.currentLocation = gameState.currentLocation;
        
        // Add current location to visited list if not already there
        if (!mapData.visited.includes(gameState.currentLocation)) {
            mapData.visited.push(gameState.currentLocation);
        }
        
        // Make sure current location has a node in the map
        if (!mapData.nodes[gameState.currentLocation]) {
            // Create node for current location
            mapData.nodes[gameState.currentLocation] = {
                id: gameState.currentLocation,
                name: adventure.locations[gameState.currentLocation].name,
                x: 250, // Center of SVG
                y: 250, // Center of SVG
                connections: []
            };
        }
        
        // Add newly visible locations and connections
        updateVisibleLocations(adventure, gameState);
        
        // Redraw the map
        drawMap();
        
        debug("Map updated with data", { mapData: getMapData() });
    }
    
    // Update visible locations based on current game state
    function updateVisibleLocations(adventure, gameState) {
        const mapData = getMapData();
        const currentLocation = adventure.locations[gameState.currentLocation];
        
        if (currentLocation && currentLocation.exits) {
            Object.entries(currentLocation.exits).forEach(([direction, exit]) => {
                // If exit is not hidden, add to known locations
                const isHidden = exit.hidden && !(exit.condition && typeof exit.condition === 'function' && exit.condition(gameState));
                if (!isHidden) {
                    const destinationId = exit.destination;
                    
                    if (adventure.locations[destinationId]) {
                        // If we don't already have this node, add it
                        if (!mapData.nodes[destinationId]) {
                            // Calculate position based on current location and direction
                            const position = calculatePositionFromDirection(
                                mapData.nodes[gameState.currentLocation], 
                                direction
                            );
                            
                            mapData.nodes[destinationId] = {
                                id: destinationId,
                                name: adventure.locations[destinationId].name,
                                x: position.x,
                                y: position.y,
                                connections: []
                            };
                        }
                        
                        // Add connection if not already there
                        const fromNode = mapData.nodes[gameState.currentLocation];
                        const connectionExists = fromNode.connections.some(conn => 
                            conn.to === destinationId && conn.direction === direction
                        );
                        
                        if (!connectionExists) {
                            fromNode.connections.push({
                                to: destinationId,
                                direction: direction
                            });
                            debug("Added connection", { from: gameState.currentLocation, to: destinationId, direction });
                        }
                    }
                }
            });
        }
    }
    
    // Generate initial map layout
    function generateMapLayout(adventure) {
        debug("Generating map layout", { adventure });
        
        const mapData = getMapData();
        
        // Start with the initial location
        const startLocation = adventure.initialLocation;
        if (!startLocation || !adventure.locations[startLocation]) {
            console.error("Invalid initial location", { startLocation });
            return;
        }
        
        // Create the first node in the center
        mapData.nodes[startLocation] = {
            id: startLocation,
            name: adventure.locations[startLocation].name,
            x: 250, // Center of SVG
            y: 250, // Center of SVG
            connections: []
        };
        
        // First, create nodes for all visited locations
        // This helps prevent the "node missing" error when adding connections
        mapData.visited.forEach(locationId => {
            debug("Processing visited location for map", { locationId });
            
            // Skip if we already created this node
            if (locationId !== startLocation && !mapData.nodes[locationId] && adventure.locations[locationId]) {
                mapData.nodes[locationId] = {
                    id: locationId,
                    name: adventure.locations[locationId].name,
                    x: 250, // Temporary position, will adjust later
                    y: 250, // Temporary position, will adjust later
                    connections: []
                };
            }
        });
        
        // Then, set positions and add connections for visited locations
        mapData.visited.forEach(locationId => {
            const location = adventure.locations[locationId];
            if (!location || !location.exits) {
                console.warn("Invalid location or has no exits", { locationId, location });
                return;
            }
            
            // Add connections to map
            Object.entries(location.exits).forEach(([direction, exit]) => {
                const destinationId = exit.destination;
                
                // If destination is valid
                if (adventure.locations[destinationId]) {
                    // Create node for destination if it doesn't exist
                    if (!mapData.nodes[destinationId]) {
                        // Calculate position based on direction
                        const position = calculatePositionFromDirection(
                            mapData.nodes[locationId], 
                            direction
                        );
                        
                        // Create node for destination
                        mapData.nodes[destinationId] = {
                            id: destinationId,
                            name: adventure.locations[destinationId].name,
                            x: position.x,
                            y: position.y,
                            connections: []
                        };
                        
                        debug("Added new node to map", { destinationId, position });
                    } 
                    // If node exists but doesn't have a good position, update its position
                    else if (mapData.nodes[destinationId].x === 250 && mapData.nodes[destinationId].y === 250) {
                        const position = calculatePositionFromDirection(
                            mapData.nodes[locationId], 
                            direction
                        );
                        
                        mapData.nodes[destinationId].x = position.x;
                        mapData.nodes[destinationId].y = position.y;
                        
                        debug("Updated node position", { destinationId, position });
                    }
                    
                    // Add connection from source to destination
                    addConnection(locationId, destinationId, direction);
                }
            });
        });
        
        debug("Map layout generated", { nodes: Object.keys(mapData.nodes).length });
    }
    
    // Calculate position based on direction from a node
    function calculatePositionFromDirection(node, direction) {
        if (!node) return { x: 250, y: 250 }; // Default to center if no reference
        
        // Direction vectors
        const vectors = {
            north: { x: 0, y: -1 },
            south: { x: 0, y: 1 },
            east: { x: 1, y: 0 },
            west: { x: -1, y: 0 },
            northeast: { x: 0.7, y: -0.7 },
            northwest: { x: -0.7, y: -0.7 },
            southeast: { x: 0.7, y: 0.7 },
            southwest: { x: -0.7, y: 0.7 },
            up: { x: 0, y: -1 },
            down: { x: 0, y: 1 },
            // Shortcuts
            n: { x: 0, y: -1 },
            s: { x: 0, y: 1 },
            e: { x: 1, y: 0 },
            w: { x: -1, y: 0 },
            ne: { x: 0.7, y: -0.7 },
            nw: { x: -0.7, y: -0.7 },
            se: { x: 0.7, y: 0.7 },
            sw: { x: -0.7, y: 0.7 },
            u: { x: 0, y: -1 },
            d: { x: 0, y: 1 }
        };
        
        // Get vector for direction
        const vector = vectors[direction.toLowerCase()] || { x: 0, y: 0 };
        
        // Calculate new position
        return {
            x: node.x + (vector.x * GRID_SIZE),
            y: node.y + (vector.y * GRID_SIZE)
        };
    }
    
    // Add a connection between two nodes
    function addConnection(fromId, toId, direction) {
        const mapData = getMapData();
        
        // Make sure both nodes exist
        if (!mapData.nodes[fromId] || !mapData.nodes[toId]) {
            console.warn("Cannot add connection - node missing", { fromId, toId });
            return;
        }
        
        // Check if connection already exists
        const fromNode = mapData.nodes[fromId];
        const connectionExists = fromNode.connections.some(conn => 
            conn.to === toId && conn.direction === direction
        );
        
        if (!connectionExists) {
            fromNode.connections.push({
                to: toId,
                direction: direction
            });
            debug("Added connection", { from: fromId, to: toId, direction });
        }
    }
    
    // Draw the map
    function drawMap() {
        const mapData = getMapData();
        
        debug("Drawing map", { 
            nodeCount: Object.keys(mapData.nodes).length,
            visitedCount: mapData.visited.length
        });
        
        const svg = document.getElementById('game-map');
        const locationsGroup = document.getElementById('map-locations');
        const pathsGroup = document.getElementById('map-paths');
        const labelsGroup = document.getElementById('map-labels');
        
        if (!svg || !locationsGroup || !pathsGroup || !labelsGroup) {
            console.error("Map SVG elements not found", { svg, locationsGroup, pathsGroup, labelsGroup });
            return;
        }
        
        // Clear previous content
        locationsGroup.innerHTML = '';
        pathsGroup.innerHTML = '';
        labelsGroup.innerHTML = '';
        
        // Handle empty map case
        if (Object.keys(mapData.nodes).length === 0) {
            debug("No nodes to draw");
            // Add a message to the map
            const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            textElement.setAttribute('x', 250);
            textElement.setAttribute('y', 250);
            textElement.setAttribute('text-anchor', 'middle');
            textElement.setAttribute('fill', '#aaa');
            textElement.textContent = "Map will be revealed as you explore";
            labelsGroup.appendChild(textElement);
            return;
        }
        
        // Set viewBox to encompass all nodes with padding
        const nodePositions = Object.values(mapData.nodes).map(node => ({ x: node.x, y: node.y }));
        const minX = Math.min(...nodePositions.map(pos => pos.x)) - 50;
        const minY = Math.min(...nodePositions.map(pos => pos.y)) - 50;
        const maxX = Math.max(...nodePositions.map(pos => pos.x)) + 50;
        const maxY = Math.max(...nodePositions.map(pos => pos.y)) + 50;
        
        const width = maxX - minX;
        const height = maxY - minY;
        
        svg.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`);
        
        // Draw connections first (so they're behind nodes)
        drawConnections(pathsGroup);
        
        // Draw nodes
        drawNodes(locationsGroup);
        
        // Draw labels
        drawLabels(labelsGroup);
        
        debug("Map drawing complete");
    }
    
    // Draw connections between nodes
    function drawConnections(container) {
        const mapData = getMapData();
        debug("Drawing connections");
        
        // Draw a line for each connection
        Object.values(mapData.nodes).forEach(node => {
            if (!node.connections) return;
            
            node.connections.forEach(connection => {
                const targetNode = mapData.nodes[connection.to];
                if (!targetNode) return;
                
                // Create path element
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', `M ${node.x} ${node.y} L ${targetNode.x} ${targetNode.y}`);
                path.setAttribute('stroke', '#666');
                path.setAttribute('stroke-width', '2');
                
                // If both nodes are visited, make the path more visible
                if (mapData.visited.includes(node.id) && mapData.visited.includes(targetNode.id)) {
                    path.setAttribute('stroke', '#aaa');
                    path.setAttribute('stroke-width', '3');
                }
                
                container.appendChild(path);
            });
        });
    }
    
    // Draw nodes (locations)
    function drawNodes(container) {
        const mapData = getMapData();
        debug("Drawing nodes");
        
        // Draw a circle for each node
        Object.values(mapData.nodes).forEach(node => {
            // Create circle element
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', node.x);
            circle.setAttribute('cy', node.y);
            circle.setAttribute('r', NODE_RADIUS);
            
            // Determine fill color based on node status
            if (node.id === mapData.currentLocation) {
                // Current location
                circle.setAttribute('fill', '#33ff33');
                circle.setAttribute('stroke', '#fff');
                circle.setAttribute('stroke-width', '2');
            } else if (mapData.visited.includes(node.id)) {
                // Visited location
                circle.setAttribute('fill', '#336633');
                circle.setAttribute('stroke', '#aaa');
                circle.setAttribute('stroke-width', '1');
            } else {
                // Known but unvisited location
                circle.setAttribute('fill', '#222');
                circle.setAttribute('stroke', '#666');
                circle.setAttribute('stroke-width', '1');
            }
            
            container.appendChild(circle);
        });
    }
    
    // Draw labels for nodes
    function drawLabels(container) {
        const mapData = getMapData();
        debug("Drawing labels");
        
        // Draw text labels for each node
        Object.values(mapData.nodes).forEach(node => {
            // Only show labels for current and visited locations
            if (node.id === mapData.currentLocation || mapData.visited.includes(node.id)) {
                // Create text element
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', node.x);
                text.setAttribute('y', node.y + LABEL_OFFSET);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('fill', node.id === mapData.currentLocation ? '#fff' : '#aaa');
                text.setAttribute('font-size', '12');
                text.textContent = node.name;
                
                container.appendChild(text);
            }
        });
    }
    
    // Public API
    return {
        initialize,
        updateMap
    };
})();