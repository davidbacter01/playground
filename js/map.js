// Map system for tile-based world generation and management

class Map {
    constructor(id, width, height) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.tileSize = GAME_CONFIG.TILE_SIZE;
        
        // Tile data
        this.tiles = [];
        this.collisionMap = [];
        
        // Entities on the map
        this.entities = [];
        this.player = null;
        this.enemies = [];
        this.npcs = [];
        this.items = [];
        
        // Map properties
        this.name = '';
        this.description = '';
        this.backgroundMusic = null;
        this.ambientSounds = [];
        this.lighting = 'day'; // day, night, cave, temple
        
        // Map connections
        this.exits = [];
        this.spawnPoints = [];
        
        // Initialize the map
        this.initialize();
    }
    
    initialize() {
        // Initialize tile arrays
        this.tiles = new Array(this.height);
        this.collisionMap = new Array(this.height);
        
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = new Array(this.width);
            this.collisionMap[y] = new Array(this.width);
            
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x] = TILE_TYPES.GRASS;
                this.collisionMap[y][x] = false;
            }
        }
        
        // Set up map based on ID
        this.setupMap();
    }
    
    setupMap() {
        switch (this.id) {
            case MAP_IDS.VILLAGE:
                this.setupVillage();
                break;
            case MAP_IDS.FOREST:
                this.setupForest();
                break;
            case MAP_IDS.RUINS:
                this.setupRuins();
                break;
            case MAP_IDS.CAVES:
                this.setupCaves();
                break;
            case MAP_IDS.TEMPLE:
                this.setupTemple();
                break;
            default:
                this.setupDefaultMap();
        }
    }
    
    setupVillage() {
        this.name = "Village of Hope";
        this.description = "A small village where survivors of the curse gather.";
        this.lighting = 'day';
        
        // Create village layout
        this.createVillageLayout();
        
        // Add NPCs
        this.addVillageNPCs();
        
        // Add items
        this.addVillageItems();
        
        // Set spawn points
        this.spawnPoints = [
            { x: this.width / 2, y: this.height / 2, type: 'player' },
            { x: 5, y: 5, type: 'enemy' },
            { x: this.width - 5, y: this.height - 5, type: 'item' }
        ];
        
        // Set exits
        this.exits = [
            { x: this.width / 2, y: 0, targetMap: MAP_IDS.FOREST, targetX: this.width / 2, targetY: this.height - 2 }
        ];
    }
    
    setupForest() {
        this.name = "Shadow Forest";
        this.description = "A dark forest where shadow creatures lurk.";
        this.lighting = 'night';
        
        // Create forest layout
        this.createForestLayout();
        
        // Add enemies
        this.addForestEnemies();
        
        // Add memory fragment
        this.addMemoryFragment();
        
        // Set spawn points
        this.spawnPoints = [
            { x: this.width / 2, y: this.height - 2, type: 'player' }
        ];
        
        // Set exits
        this.exits = [
            { x: this.width / 2, y: this.height - 1, targetMap: MAP_IDS.VILLAGE, targetX: this.width / 2, targetY: 1 },
            { x: this.width - 1, y: this.height / 2, targetMap: MAP_IDS.RUINS, targetX: 1, targetY: this.height / 2 }
        ];
    }
    
    setupRuins() {
        this.name = "Ancient Ruins";
        this.description = "Crumbling ruins that hold ancient secrets.";
        this.lighting = 'cave';
        
        // Create ruins layout
        this.createRuinsLayout();
        
        // Add guardians
        this.addRuinsGuardians();
        
        // Add memory fragment
        this.addMemoryFragment();
        
        // Set spawn points
        this.spawnPoints = [
            { x: 1, y: this.height / 2, type: 'player' }
        ];
        
        // Set exits
        this.exits = [
            { x: 0, y: this.height / 2, targetMap: MAP_IDS.FOREST, targetX: this.width - 2, targetY: this.height / 2 }
        ];
    }
    
    setupCaves() {
        this.name = "Cliffside Caves";
        this.description = "Dark caves carved into the cliff face.";
        this.lighting = 'cave';
        
        // Create cave layout
        this.createCaveLayout();
        
        // Add cave enemies
        this.addCaveEnemies();
        
        // Add memory fragment
        this.addMemoryFragment();
        
        // Set spawn points
        this.spawnPoints = [
            { x: this.width / 2, y: this.height - 2, type: 'player' }
        ];
        
        // Set exits
        this.exits = [
            { x: this.width / 2, y: this.height - 1, targetMap: MAP_IDS.FOREST, targetX: this.width / 2, targetY: 1 }
        ];
    }
    
    setupTemple() {
        this.name = "Temple of Shadows";
        this.description = "The final dungeon where the Shadow Beast awaits.";
        this.lighting = 'temple';
        
        // Create temple layout
        this.createTempleLayout();
        
        // Add final boss
        this.addShadowBeast();
        
        // Add memory fragments
        this.addMemoryFragment();
        this.addMemoryFragment();
        
        // Set spawn points
        this.spawnPoints = [
            { x: 1, y: this.height / 2, type: 'player' }
        ];
        
        // Set exits
        this.exits = [
            { x: 0, y: this.height / 2, targetMap: MAP_IDS.VILLAGE, targetX: this.width / 2, targetY: this.height / 2 }
        ];
    }
    
    createVillageLayout() {
        // Create a simple village with buildings and paths
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1) {
                    // Border walls
                    this.tiles[y][x] = TILE_TYPES.WALL;
                    this.collisionMap[y][x] = true;
                } else if ((x === 5 || x === 14) && (y >= 5 && y <= 14)) {
                    // Building walls (reduced size to avoid spawn point)
                    this.tiles[y][x] = TILE_TYPES.STONE;
                    this.collisionMap[y][x] = true;
                } else if ((y === 5 || y === 14) && (x >= 5 && x <= 14)) {
                    // Building walls (reduced size to avoid spawn point)
                    this.tiles[y][x] = TILE_TYPES.STONE;
                    this.collisionMap[y][x] = true;
                } else if (x === this.width / 2 && (y >= 0 && y < this.height)) {
                    // Main path
                    this.tiles[y][x] = TILE_TYPES.STONE;
                    this.collisionMap[y][x] = false;
                } else if (y === this.height / 2 && (x >= 0 && x < this.width)) {
                    // Cross path
                    this.tiles[y][x] = TILE_TYPES.STONE;
                    this.collisionMap[y][x] = false;
                }
            }
        }
        
        // Ensure spawn area is clear
        this.createClearing(this.width / 2, this.height / 2, 4, 4);
    }
    
    createForestLayout() {
        // Create a forest with trees and clearings
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1) {
                    // Border trees
                    this.tiles[y][x] = TILE_TYPES.TREE;
                    this.collisionMap[y][x] = true;
                } else if (Utils.randomChance(0.3)) {
                    // Random trees
                    this.tiles[y][x] = TILE_TYPES.TREE;
                    this.collisionMap[y][x] = true;
                } else if (Utils.randomChance(0.1)) {
                    // Water patches
                    this.tiles[y][x] = TILE_TYPES.WATER;
                    this.collisionMap[y][x] = true;
                }
            }
        }
        
        // Create clearings for gameplay
        this.createClearing(5, 5, 8, 8);
        this.createClearing(this.width - 13, this.height - 13, 8, 8);
    }
    
    createRuinsLayout() {
        // Create ruins with walls and debris
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1) {
                    // Border walls
                    this.tiles[y][x] = TILE_TYPES.WALL;
                    this.collisionMap[y][x] = true;
                } else if (Utils.randomChance(0.4)) {
                    // Ruined walls
                    this.tiles[y][x] = TILE_TYPES.STONE;
                    this.collisionMap[y][x] = true;
                } else if (Utils.randomChance(0.2)) {
                    // Debris
                    this.tiles[y][x] = TILE_TYPES.STONE;
                    this.collisionMap[y][x] = false;
                }
            }
        }
        
        // Create central chamber
        this.createClearing(this.width / 2 - 4, this.height / 2 - 4, 8, 8);
    }
    
    createCaveLayout() {
        // Create cave with stalagmites and water
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1) {
                    // Cave walls
                    this.tiles[y][x] = TILE_TYPES.WALL;
                    this.collisionMap[y][x] = true;
                } else if (Utils.randomChance(0.25)) {
                    // Stalagmites
                    this.tiles[y][x] = TILE_TYPES.STONE;
                    this.collisionMap[y][x] = true;
                } else if (Utils.randomChance(0.15)) {
                    // Water pools
                    this.tiles[y][x] = TILE_TYPES.WATER;
                    this.collisionMap[y][x] = true;
                }
            }
        }
    }
    
    createTempleLayout() {
        // Create temple with grand halls and chambers
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1) {
                    // Temple walls
                    this.tiles[y][x] = TILE_TYPES.WALL;
                    this.collisionMap[y][x] = true;
                } else if (x === this.width / 2 || y === this.height / 2) {
                    // Main corridors
                    this.tiles[y][x] = TILE_TYPES.STONE;
                    this.collisionMap[y][x] = false;
                } else if (Utils.randomChance(0.3)) {
                    // Decorative pillars
                    this.tiles[y][x] = TILE_TYPES.STONE;
                    this.collisionMap[y][x] = true;
                }
            }
        }
        
        // Create boss chamber
        this.createClearing(this.width / 2 - 6, this.height / 2 - 6, 12, 12);
    }
    
    createClearing(centerX, centerY, width, height) {
        // Ensure integer coordinates for the clearing bounds
        const startX = Math.floor(centerX - width / 2);
        const startY = Math.floor(centerY - height / 2);
        const endX = Math.floor(centerX + width / 2);
        const endY = Math.floor(centerY + height / 2);

        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                if (Utils.isInBounds(x, y, this.width, this.height)) {
                    this.tiles[y][x] = TILE_TYPES.GRASS;
                    this.collisionMap[y][x] = false;
                }
            }
        }
    }
    
    addVillageNPCs() {
        // Add village elder
        const elder = new NPC(10, 10, "Elder Thorne", "elder");
        this.addEntity(elder);
        this.npcs.push(elder);
        
        // Add merchant
        const merchant = new NPC(20, 10, "Merchant Gwen", "merchant");
        this.addEntity(merchant);
        this.npcs.push(merchant);
        
        // Add guard
        const guard = new NPC(15, 20, "Guard Marcus", "guard");
        this.addEntity(guard);
        this.npcs.push(guard);
        
        // Add wanderer
        const wanderer = new NPC(25, 15, "Wanderer Eli", "wanderer");
        this.addEntity(wanderer);
        this.npcs.push(wanderer);
    }
    
    addVillageItems() {
        // Add healing herbs
        for (let i = 0; i < 3; i++) {
            const herb = new Item(
                Utils.randomInt(5, this.width - 5),
                Utils.randomInt(5, this.height - 5),
                ITEM_TYPES.HEALING_HERB
            );
            this.addEntity(herb);
            this.items.push(herb);
        }
    }
    
    addForestEnemies() {
        // Add shadow creatures
        for (let i = 0; i < 5; i++) {
            const enemy = new Enemy(
                Utils.randomInt(5, this.width - 5),
                Utils.randomInt(5, this.height - 5),
                ENEMY_TYPES.SHADOW_CREATURE
            );
            enemy.setTarget(this.player);
            this.addEntity(enemy);
            this.enemies.push(enemy);
        }
    }
    
    addRuinsGuardians() {
        // Add ancient guardians
        for (let i = 0; i < 3; i++) {
            const guardian = new Enemy(
                Utils.randomInt(5, this.width - 5),
                Utils.randomInt(5, this.height - 5),
                ENEMY_TYPES.ANCIENT_GUARDIAN
            );
            guardian.setTarget(this.player);
            this.addEntity(guardian);
            this.enemies.push(guardian);
        }
    }
    
    addCaveEnemies() {
        // Add forest spirits
        for (let i = 0; i < 4; i++) {
            const spirit = new Enemy(
                Utils.randomInt(5, this.width - 5),
                Utils.randomInt(5, this.height - 5),
                ENEMY_TYPES.FOREST_SPIRIT
            );
            spirit.setTarget(this.player);
            this.addEntity(spirit);
            this.enemies.push(spirit);
        }
    }
    
    addShadowBeast() {
        // Add the final boss (placeholder for now)
        const boss = new Enemy(
            this.width / 2,
            this.height / 2,
            'shadow_beast'
        );
        boss.setTarget(this.player);
        this.addEntity(boss);
        this.enemies.push(boss);
    }
    
    addMemoryFragment() {
        // Add a memory fragment to the map
        let x, y;
        do {
            x = Utils.randomInt(5, this.width - 5);
            y = Utils.randomInt(5, this.height - 5);
        } while (this.collisionMap[y][x]);
        
        const fragment = new Item(x * this.tileSize, y * this.tileSize, ITEM_TYPES.MEMORY_FRAGMENT);
        this.addEntity(fragment);
        this.items.push(fragment);
    }
    
    addEntity(entity) {
        this.entities.push(entity);
        
        // Categorize entity
        if (entity.type === ENTITY_TYPES.PLAYER) {
            this.player = entity;
        } else if (entity.type === ENTITY_TYPES.ENEMY) {
            this.enemies.push(entity);
        } else if (entity.type === ENTITY_TYPES.NPC) {
            this.npcs.push(entity);
        } else if (entity.type === ENTITY_TYPES.ITEM) {
            this.items.push(entity);
        }
    }
    
    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
        }
        
        // Remove from category arrays
        if (entity.type === ENTITY_TYPES.ENEMY) {
            const enemyIndex = this.enemies.indexOf(entity);
            if (enemyIndex > -1) this.enemies.splice(enemyIndex, 1);
        } else if (entity.type === ENTITY_TYPES.NPC) {
            const npcIndex = this.npcs.indexOf(entity);
            if (npcIndex > -1) this.npcs.splice(npcIndex, 1);
        } else if (entity.type === ENTITY_TYPES.ITEM) {
            const itemIndex = this.items.indexOf(entity);
            if (itemIndex > -1) this.items.splice(itemIndex, 1);
        }
    }
    
    update(deltaTime) {
        // Update all entities
        this.entities.forEach(entity => {
            if (entity.update) {
                entity.update(deltaTime);
            }
        });
        
        // Remove destroyed entities
        this.entities = this.entities.filter(entity => !entity.isDestroyed());
        this.enemies = this.enemies.filter(enemy => !enemy.isDestroyed());
        this.npcs = this.npcs.filter(npc => !npc.isDestroyed());
        this.items = this.items.filter(item => !item.isDestroyed());
        
        // Update enemies to target player
        if (this.player) {
            this.enemies.forEach(enemy => {
                if (enemy.setTarget) {
                    enemy.setTarget(this.player);
                }
            });
        }
    }
    
    draw(ctx, camera) {
        // Draw tiles
        this.drawTiles(ctx, camera);
        
        // Draw entities
        this.entities.forEach(entity => {
            if (entity.draw) {
                entity.draw(ctx);
            }
        });
    }
    
    drawTiles(ctx, camera) {
        const startX = Math.max(0, Math.floor(camera.x / this.tileSize));
        const startY = Math.max(0, Math.floor(camera.y / this.tileSize));
        const endX = Math.min(this.width, Math.ceil((camera.x + camera.width) / this.tileSize));
        const endY = Math.min(this.height, Math.ceil((camera.y + camera.height) / this.tileSize));
        
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const tileType = this.tiles[y][x];
                const worldX = x * this.tileSize;
                const worldY = y * this.tileSize;
                
                this.drawTile(ctx, tileType, worldX, worldY);
            }
        }
    }
    
    drawTile(ctx, tileType, x, y) {
        let color = '#ffffff';
        
        switch (tileType) {
            case TILE_TYPES.GRASS: color = '#228B22'; break;
            case TILE_TYPES.WATER: color = '#4169E1'; break;
            case TILE_TYPES.STONE: color = '#808080'; break;
            case TILE_TYPES.SAND: color = '#F4A460'; break;
            case TILE_TYPES.TREE: color = '#006400'; break;
            case TILE_TYPES.WALL: color = '#696969'; break;
            case TILE_TYPES.DOOR: color = '#8B4513'; break;
            case TILE_TYPES.BRIDGE: color = '#8B4513'; break;
        }
        
        ctx.fillStyle = color;
        ctx.fillRect(x, y, this.tileSize, this.tileSize);
        
        // Add some texture
        if (tileType === TILE_TYPES.GRASS) {
            ctx.fillStyle = '#32CD32';
            for (let i = 0; i < 3; i++) {
                const dotX = x + Utils.randomInt(2, this.tileSize - 2);
                const dotY = y + Utils.randomInt(2, this.tileSize - 2);
                ctx.fillRect(dotX, dotY, 1, 1);
            }
        }
    }
    
    isCollision(x, y) {
        const tileX = Math.floor(x / this.tileSize);
        const tileY = Math.floor(y / this.tileSize);
        
        if (!Utils.isInBounds(tileX, tileY, this.width, this.height)) {
            return true;
        }
        
        return this.collisionMap[tileY][tileX];
    }
    
    getTileAt(x, y) {
        const tileX = Math.floor(x / this.tileSize);
        const tileY = Math.floor(y / this.tileSize);
        
        if (!Utils.isInBounds(tileX, tileY, this.width, this.height)) {
            return null;
        }
        
        return {
            type: this.tiles[tileY][tileX],
            collision: this.collisionMap[tileY][tileX],
            x: tileX,
            y: tileY
        };
    }
    
    setTile(x, y, tileType, hasCollision = false) {
        if (!Utils.isInBounds(x, y, this.width, this.height)) return;
        
        this.tiles[y][x] = tileType;
        this.collisionMap[y][x] = hasCollision;
    }
    
    getEntitiesAt(x, y, radius = 0) {
        return this.entities.filter(entity => {
            const distance = Utils.distance(x, y, entity.x, entity.y);
            return distance <= radius;
        });
    }
    
    getEntitiesInRect(x, y, width, height) {
        return this.entities.filter(entity => {
            return Utils.rectCollision(
                { x: entity.x - entity.width / 2, y: entity.y - entity.height / 2, width: entity.width, height: entity.height },
                { x, y, width, height }
            );
        });
    }
    
    getExitAt(x, y) {
        return this.exits.find(exit => {
            const exitX = exit.x * this.tileSize;
            const exitY = exit.y * this.tileSize;
            const distance = Utils.distance(x, y, exitX, exitY);
            return distance <= this.tileSize;
        });
    }
    
    getSpawnPoint(type) {
        const spawnPoint = this.spawnPoints.find(sp => sp.type === type);
        if (spawnPoint) {
            return {
                x: spawnPoint.x * this.tileSize,
                y: spawnPoint.y * this.tileSize
            };
        }
        return { x: this.width / 2 * this.tileSize, y: this.height / 2 * this.tileSize };
    }
}
