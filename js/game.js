// Main game class that manages the game loop and all game systems

class Game {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isRunning = false;
        this.lastTime = 0;
        this.deltaTime = 0;
        
        // Game systems
        this.inputManager = null;
        this.uiManager = null;
        this.player = null;
        this.currentMap = null;
        this.maps = {};
        
        // Game state
        this.gameState = 'playing'; // playing, paused, gameOver, victory
        this.currentMapId = MAP_IDS.VILLAGE;
        this.camera = { x: 0, y: 0, width: 800, height: 600 };
        
        // Game settings
        this.debugMode = false;
        this.showFPS = true;
        this.fpsCounter = 0;
        this.fpsTimer = 0;
        
        // Initialize the game
        this.initialize();
    }
    
    initialize() {
        // Set up canvas
        this.setupCanvas();
        
        // Initialize game systems
        this.inputManager = new InputManager();
        this.uiManager = new UIManager();
        
        // Create player
        this.createPlayer();
        
        // Create maps
        this.createMaps();
        
        // Set initial map
        this.changeMap(this.currentMapId);
        
        // Bind events
        this.bindEvents();
        
        // Start game loop
        this.start();
    }
    
    setupCanvas() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            console.error('Canvas element not found!');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false; // Pixel art style
        
        // Set canvas size
        this.canvas.width = GAME_CONFIG.CANVAS_WIDTH;
        this.canvas.height = GAME_CONFIG.CANVAS_HEIGHT;
        
        // Set camera size
        this.camera.width = this.canvas.width;
        this.camera.height = this.canvas.height;
    }
    
    createPlayer() {
        // Create player at origin, will be positioned by map spawn system
        this.player = new Player(0, 0);
    }
    
    createMaps() {
        // Create all maps
        this.maps[MAP_IDS.VILLAGE] = new Map(MAP_IDS.VILLAGE, 30, 20);
        this.maps[MAP_IDS.FOREST] = new Map(MAP_IDS.FOREST, 40, 30);
        this.maps[MAP_IDS.RUINS] = new Map(MAP_IDS.RUINS, 35, 25);
        this.maps[MAP_IDS.CAVES] = new Map(MAP_IDS.CAVES, 30, 25);
        this.maps[MAP_IDS.TEMPLE] = new Map(MAP_IDS.TEMPLE, 50, 40);
        
        // Add player to all maps
        Object.values(this.maps).forEach(map => {
            map.addEntity(this.player);
        });
    }
    
    changeMap(mapId) {
        if (!this.maps[mapId]) {
            console.error(`Map ${mapId} not found!`);
            return;
        }
        
        this.currentMapId = mapId;
        this.currentMap = this.maps[mapId];
        
        // Get spawn point for player
        const spawnPoint = this.currentMap.getSpawnPoint('player');
        this.player.setPosition(spawnPoint.x, spawnPoint.y);
        
        // Update camera to follow player
        this.updateCamera();
        
        console.log(`Changed to map: ${this.currentMap.name}`);
    }
    
    bindEvents() {
        // Game restart event
        document.addEventListener('gameRestart', () => {
            this.restartGame();
        });
        
        // New game event
        document.addEventListener('newGame', () => {
            this.newGame();
        });
        
        // Window resize event
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    start() {
        this.isRunning = true;
        this.gameLoop();
    }
    
    stop() {
        this.isRunning = false;
    }
    
    gameLoop(currentTime = 0) {
        if (!this.isRunning) return;
        
        // Calculate delta time
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Cap delta time to prevent large jumps
        if (this.deltaTime > 100) {
            this.deltaTime = 100;
        }
        
        // Update FPS counter
        this.updateFPS();
        
        // Update game state
        if (this.gameState === 'playing') {
            this.update();
        }
        
        // Render game
        this.render();
        
        // Continue game loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update() {
        // Update input
        this.inputManager.update();
        
        // Handle player input
        if (this.player) {
            this.player.handleInput(this.inputManager);
        }
        
        // Update current map
        if (this.currentMap) {
            this.currentMap.update(this.deltaTime);
        }
        
        // Update player
        if (this.player) {
            this.player.update(this.deltaTime);
        }
        
        // Update camera
        this.updateCamera();
        
        // Check for map transitions
        this.checkMapTransitions();
        
        // Check for game state changes
        this.checkGameState();
        
        // Update UI
        if (this.player) {
            this.uiManager.updateUI(this.player);
        }
        
        // Check for interactions
        this.checkInteractions();
    }
    
    updateCamera() {
        if (!this.player) return;
        
        // Center camera on player
        this.camera.x = this.player.x - this.camera.width / 2;
        this.camera.y = this.player.y - this.camera.height / 2;
        
        // Clamp camera to map bounds
        if (this.currentMap) {
            const mapWidth = this.currentMap.width * this.currentMap.tileSize;
            const mapHeight = this.currentMap.height * this.currentMap.tileSize;
            
            this.camera.x = Math.max(0, Math.min(this.camera.x, mapWidth - this.camera.width));
            this.camera.y = Math.max(0, Math.min(this.camera.y, mapHeight - this.camera.height));
        }
    }
    
    checkMapTransitions() {
        if (!this.player || !this.currentMap) return;
        
        const exit = this.currentMap.getExitAt(this.player.x, this.player.y);
        if (exit) {
            this.changeMap(exit.targetMap);
            
            // Set player position at new map entrance
            const newMap = this.maps[exit.targetMap];
            if (newMap) {
                const spawnPoint = newMap.getSpawnPoint('player');
                this.player.setPosition(spawnPoint.x, spawnPoint.y);
            }
        }
    }
    
    checkGameState() {
        if (!this.player) return;
        
        // Check if player died
        if (this.player.health <= 0 && this.gameState === 'playing') {
            this.gameOver();
        }
        
        // Check if player won (collected all memory fragments)
        if (this.player.memoryFragments >= this.player.maxMemoryFragments && this.gameState === 'playing') {
            this.victory();
        }
    }
    
    checkInteractions() {
        if (!this.player || !this.currentMap) return;
        
        // Check for NPC interactions
        this.currentMap.npcs.forEach(npc => {
            if (npc.canInteractWith(this.player) && this.inputManager.isInteractPressed()) {
                const dialogue = npc.startDialogue(this.player);
                if (dialogue) {
                    this.uiManager.showDialogue(dialogue);
                }
            }
        });
        
        // Check for item collection
        this.currentMap.items.forEach(item => {
            if (item.collidesWith(this.player)) {
                item.collect(this.player);
            }
        });
        
        // Check for enemy attacks
        this.currentMap.enemies.forEach(enemy => {
            if (enemy.collidesWith(this.player) && enemy.isAggressive()) {
                // Enemy attacks player
                if (enemy.isAttacking && enemy.attackCooldown <= 0) {
                    this.player.takeDamage(enemy.attackDamage);
                }
            }
        });
        
        // Check for player attacks
        if (this.player.isAttacking) {
            this.currentMap.enemies.forEach(enemy => {
                if (enemy.isVulnerable()) {
                    const attackRange = this.player.attackRange;
                    const distance = this.player.getDistanceTo(enemy);
                    
                    if (distance <= attackRange) {
                        enemy.takeDamage(this.player.attackDamage);
                        this.player.addExperience(enemy.maxHealth);
                    }
                }
            });
        }
    }
    
    render() {
        if (!this.ctx) return;
        
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Save context for camera transform
        this.ctx.save();
        
        // Apply camera transform
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // Render current map
        if (this.currentMap) {
            this.currentMap.draw(this.ctx, this.camera);
        }
        
        // Render player
        if (this.player) {
            this.player.draw(this.ctx);
        }
        
        // Restore context
        this.ctx.restore();
        
        // Render UI elements (not affected by camera)
        this.renderUI();
        
        // Render debug info
        if (this.debugMode) {
            this.renderDebugInfo();
        }
        
        // Render FPS
        if (this.showFPS) {
            this.renderFPS();
        }
    }
    
    renderUI() {
        // UI is handled by the UIManager and CSS
        // This method can be used for additional UI rendering if needed
    }
    
    renderDebugInfo() {
        if (!this.ctx) return;
        
        this.ctx.save();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'left';
        
        let y = 20;
        const lineHeight = 15;
        
        // Player info
        if (this.player) {
            this.ctx.fillText(`Player: (${Math.round(this.player.x)}, ${Math.round(this.player.y)})`, 10, y);
            y += lineHeight;
            this.ctx.fillText(`Health: ${this.player.health}/${this.player.maxHealth}`, 10, y);
            y += lineHeight;
            this.ctx.fillText(`Level: ${this.player.level}`, 10, y);
            y += lineHeight;
            this.ctx.fillText(`Memory Fragments: ${this.player.memoryFragments}/${this.player.maxMemoryFragments}`, 10, y);
            y += lineHeight;
        }
        
        // Map info
        if (this.currentMap) {
            this.ctx.fillText(`Map: ${this.currentMap.name}`, 10, y);
            y += lineHeight;
            this.ctx.fillText(`Entities: ${this.currentMap.entities.length}`, 10, y);
            y += lineHeight;
            this.ctx.fillText(`Enemies: ${this.currentMap.enemies.length}`, 10, y);
            y += lineHeight;
        }
        
        // Camera info
        this.ctx.fillText(`Camera: (${Math.round(this.camera.x)}, ${Math.round(this.camera.y)})`, 10, y);
        y += lineHeight;
        
        // Controls
        y += lineHeight;
        this.ctx.fillText('Controls: WASD/Arrows to move, Space to attack, E to interact, I for inventory, Q for quests', 10, y);
        
        this.ctx.restore();
    }
    
    renderFPS() {
        if (!this.ctx) return;
        
        this.ctx.save();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`FPS: ${this.fpsCounter}`, this.canvas.width - 10, 20);
        this.ctx.restore();
    }
    
    updateFPS() {
        this.fpsTimer += this.deltaTime;
        if (this.fpsTimer >= 1000) {
            this.fpsCounter = Math.round(1000 / this.deltaTime);
            this.fpsTimer = 0;
        }
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        this.uiManager.showGameOver();
        console.log('Game Over!');
    }
    
    victory() {
        this.gameState = 'victory';
        this.uiManager.showVictory();
        console.log('Victory! You have lifted the curse!');
    }
    
    restartGame() {
        // Reset player
        if (this.player) {
            this.player.reset();
        }
        
        // Reset maps
        this.createMaps();
        
        // Return to village
        this.changeMap(MAP_IDS.VILLAGE);
        
        // Reset game state
        this.gameState = 'playing';
        
        // Hide UI screens
        this.uiManager.hideAllScreens();
        
        console.log('Game restarted');
    }
    
    newGame() {
        // This is the same as restart for now
        this.restartGame();
    }
    
    pause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
        }
    }
    
    resume() {
        if (this.gameState === 'paused') {
            this.gameState = 'playing';
        }
    }
    
    toggleDebug() {
        this.debugMode = !this.debugMode;
        console.log(`Debug mode: ${this.debugMode ? 'ON' : 'OFF'}`);
    }
    
    toggleFPS() {
        this.showFPS = !this.showFPS;
        console.log(`FPS display: ${this.showFPS ? 'ON' : 'OFF'}`);
    }
    
    handleResize() {
        // Handle window resize if needed
        console.log('Window resized');
    }
    
    saveGame() {
        if (this.player) {
            this.player.saveData();
            console.log('Game saved');
        }
    }
    
    loadGame() {
        if (this.player) {
            const loaded = this.player.loadData();
            if (loaded) {
                console.log('Game loaded');
                // Update UI
                this.uiManager.updateUI(this.player);
            }
        }
    }
    
    // Debug methods
    spawnEnemy(type = ENEMY_TYPES.SHADOW_CREATURE) {
        if (!this.currentMap || !this.player) return;
        
        const enemy = new Enemy(this.player.x + 100, this.player.y + 100, type);
        enemy.setTarget(this.player);
        this.currentMap.addEntity(enemy);
        
        console.log(`Spawned ${type} at (${enemy.x}, ${enemy.y})`);
    }
    
    spawnItem(type = ITEM_TYPES.HEALING_HERB) {
        if (!this.currentMap || !this.player) return;
        
        const item = new Item(this.player.x + 50, this.player.y + 50, type);
        this.currentMap.addEntity(item);
        
        console.log(`Spawned ${type} at (${item.x}, ${item.y})`);
    }
    
    teleportPlayer(x, y) {
        if (!this.player) return;
        
        this.player.setPosition(x, y);
        this.updateCamera();
        
        console.log(`Player teleported to (${x}, ${y})`);
    }
    
    // Get game statistics
    getGameStats() {
        if (!this.player) return {};
        
        return {
            playerLevel: this.player.level,
            playerHealth: this.player.health,
            playerMaxHealth: this.player.maxHealth,
            memoryFragments: this.player.memoryFragments,
            maxMemoryFragments: this.player.maxMemoryFragments,
            currentMap: this.currentMapId,
            gameState: this.gameState,
            entities: this.currentMap ? this.currentMap.entities.length : 0,
            enemies: this.currentMap ? this.currentMap.enemies.length : 0
        };
    }
}
