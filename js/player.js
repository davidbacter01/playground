// Player class - the main character controlled by the user

class Player extends Entity {
    constructor(x, y) {
        super(x, y, 32, 32, ENTITY_TYPES.PLAYER);
        
        // Player stats
        this.maxHealth = GAME_CONFIG.PLAYER_MAX_HEALTH;
        this.health = this.maxHealth;
        this.level = 1;
        this.experience = 0;
        this.experienceToNext = 100;
        
        // Player state
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.attackRange = GAME_CONFIG.ATTACK_RANGE;
        this.attackDamage = GAME_CONFIG.ATTACK_DAMAGE;
        this.attackDuration = 300; // milliseconds
        this.attackTimer = 0;
        this.facingDirection = { x: 0, y: 1 }; // Default facing down
        
        // Movement
        this.moveSpeed = GAME_CONFIG.PLAYER_SPEED;
        this.isMoving = false;
        this.lastMoveTime = 0;
        
        // Inventory and quests
        this.inventory = [];
        this.maxInventorySize = 20;
        this.questLog = [];
        this.memoryFragments = 0;
        this.maxMemoryFragments = 5;
        
        // Equipment
        this.equippedWeapon = null;
        this.equippedArmor = null;
        
        // Animation
        this.animationState = 'idle';
        this.animationTimer = 0;
        this.walkFrame = 0;
        this.walkFrameTime = 150;
        
        // Create player sprite
        this.createSprite();
        
        // Set collision properties
        this.setMaxSpeed(this.moveSpeed);
        this.setFriction(0.9);
    }
    
    createSprite() {
        // Create animated sprite for the player
        const idleFrames = [COLORS.PLAYER, '#45a049', '#4CAF50', '#45a049'];
        const walkFrames = [COLORS.PLAYER, '#45a049', '#4CAF50', '#45a049'];
        
        this.sprite = new AnimatedSprite(this.x, this.y, this.width, this.height, idleFrames, 200);
        this.sprite.setAnchor(0.5, 0.5);
        
        // Store animation frames for different states
        this.animations = {
            idle: idleFrames,
            walk: walkFrames,
            attack: [COLORS.PLAYER, '#ff0000', COLORS.PLAYER]
        };
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // Update attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }
        
        // Update attack timer
        if (this.isAttacking) {
            this.attackTimer += deltaTime;
            if (this.attackTimer >= this.attackDuration) {
                this.isAttacking = false;
                this.attackTimer = 0;
            }
        }
        
        // Update animation
        this.updateAnimation(deltaTime);
        
        // Update sprite animation
        if (this.sprite && this.sprite.update) {
            this.sprite.update(deltaTime);
        }
    }
    
    updateAnimation(deltaTime) {
        this.animationTimer += deltaTime;
        
        if (this.isAttacking) {
            this.animationState = 'attack';
            this.sprite.frames = this.animations.attack;
            this.sprite.frameTime = 100;
        } else if (this.isMoving) {
            this.animationState = 'walk';
            this.sprite.frames = this.animations.walk;
            this.sprite.frameTime = this.walkFrameTime;
        } else {
            this.animationState = 'idle';
            this.sprite.frames = this.animations.idle;
            this.sprite.frameTime = 200;
        }
    }
    
    handleInput(inputManager) {
        // Get movement input
        const movement = inputManager.getMovementVector();
        
        if (movement.x !== 0 || movement.y !== 0) {
            this.isMoving = true;
            this.facingDirection = { x: movement.x, y: movement.y };
            
            // Calculate movement
            const moveX = movement.x * this.moveSpeed;
            const moveY = movement.y * this.moveSpeed;
            
            // Check collision before moving - try full movement first
            if (this.canMoveTo(this.x + moveX, this.y + moveY)) {
                this.setVelocity(moveX, moveY);
            } else {
                // Try moving on individual axes
                let finalMoveX = 0;
                let finalMoveY = 0;
                
                // Check X movement
                if (this.canMoveTo(this.x + moveX, this.y)) {
                    finalMoveX = moveX;
                }
                
                // Check Y movement
                if (this.canMoveTo(this.x, this.y + moveY)) {
                    finalMoveY = moveY;
                }
                
                this.setVelocity(finalMoveX, finalMoveY);
            }
            
            this.lastMoveTime = Date.now();
        } else {
            this.isMoving = false;
            this.setVelocity(0, 0);
        }
        
        // Handle attack input
        if (inputManager.isAttackPressed() && !this.isAttacking && this.attackCooldown <= 0) {
            this.attack();
        }
        
        // Handle interaction input
        if (inputManager.isInteractPressed()) {
            this.interact();
        }
        
        // Handle inventory input
        if (inputManager.isInventoryPressed()) {
            this.toggleInventory();
        }
    }
    
    attack() {
        if (this.isAttacking || this.attackCooldown > 0) return;
        
        this.isAttacking = true;
        this.attackTimer = 0;
        this.attackCooldown = 500; // 500ms cooldown
        
        // Create attack hitbox
        const attackX = this.x + this.facingDirection.x * this.attackRange;
        const attackY = this.y + this.facingDirection.y * this.attackRange;
        
        // Check for enemies in attack range
        this.checkAttackHit(attackX, attackY);
        
        // Play attack animation
        this.sprite.gotoFrame(0);
        this.sprite.play();
    }
    
    checkAttackHit(attackX, attackY) {
        // This will be implemented when we have the game world
        // For now, it's a placeholder
        console.log(`Player attacks at ${attackX}, ${attackY}`);
    }
    
    interact() {
        // Check for nearby interactable objects
        // This will be implemented when we have the game world
        console.log('Player attempts to interact');
    }
    
    toggleInventory() {
        // This will be implemented in the UI system
        console.log('Toggle inventory');
    }
    
    canMoveTo(x, y) {
        // Check if the new position would cause collision
        if (window.currentGame && window.currentGame.currentMap) {
            const map = window.currentGame.currentMap;
            
            // Use a smaller collision box than the full player size to prevent getting stuck
            const collisionPadding = 8; // Smaller than half the player size (16)
            
            // Check just the center area of the player, not the full bounds
            const checkPoints = [
                { x: x, y: y },                                    // Center
                { x: x - collisionPadding, y: y },                 // Left
                { x: x + collisionPadding, y: y },                 // Right
                { x: x, y: y - collisionPadding },                 // Top
                { x: x, y: y + collisionPadding }                  // Bottom
            ];
            
            // If the center or main directional points collide, block movement
            for (const point of checkPoints) {
                if (map.isCollision(point.x, point.y)) {
                    if (window.DEBUG_MODE) {
                        console.log(`Collision detected at point: (${point.x}, ${point.y})`);
                    }
                    return false;
                }
            }
            
            return true;
        }
        return true; // Allow movement if no map context
    }
    
    takeDamage(damage) {
        this.health = Math.max(0, this.health - damage);
        
        // Visual feedback
        if (this.sprite) {
            this.sprite.setColor('#ff0000');
            setTimeout(() => {
                if (this.sprite) {
                    this.sprite.setColor(this.animations.idle[0]);
                }
            }, 200);
        }
        
        // Check if player died
        if (this.health <= 0) {
            this.die();
        }
        
        return this.health;
    }
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
        return this.health;
    }
    
    die() {
        this.active = false;
        this.visible = false;
        console.log('Player died');
        // This will trigger game over in the main game loop
    }
    
    addExperience(amount) {
        this.experience += amount;
        
        // Check for level up
        while (this.experience >= this.experienceToNext) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.level++;
        this.experience -= this.experienceToNext;
        this.experienceToNext = Math.floor(this.experienceToNext * 1.5);
        
        // Increase stats
        this.maxHealth += 20;
        this.health = this.maxHealth;
        this.attackDamage += 5;
        
        console.log(`Player leveled up to level ${this.level}!`);
    }
    
    addToInventory(item) {
        if (this.inventory.length >= this.maxInventorySize) {
            return false; // Inventory full
        }
        
        this.inventory.push(item);
        console.log(`Added ${item.name} to inventory`);
        return true;
    }
    
    removeFromInventory(itemIndex) {
        if (itemIndex >= 0 && itemIndex < this.inventory.length) {
            const item = this.inventory.splice(itemIndex, 1)[0];
            console.log(`Removed ${item.name} from inventory`);
            return item;
        }
        return null;
    }
    
    addQuest(quest) {
        this.questLog.push(quest);
        console.log(`Added quest: ${quest.title}`);
    }
    
    completeQuest(questId) {
        const questIndex = this.questLog.findIndex(q => q.id === questId);
        if (questIndex !== -1) {
            const quest = this.questLog.splice(questIndex, 1)[0];
            console.log(`Completed quest: ${quest.title}`);
            return quest;
        }
        return null;
    }
    
    addMemoryFragment() {
        if (this.memoryFragments < this.maxMemoryFragments) {
            this.memoryFragments++;
            console.log(`Found memory fragment! (${this.memoryFragments}/${this.maxMemoryFragments})`);
            
            // Check if all fragments are collected
            if (this.memoryFragments >= this.maxMemoryFragments) {
                console.log('All memory fragments collected! You can now enter the Temple of Shadows.');
            }
            
            return true;
        }
        return false;
    }
    
    getHealthPercentage() {
        return this.health / this.maxHealth;
    }
    
    getExperiencePercentage() {
        return this.experience / this.experienceToNext;
    }
    
    // Save player data
    saveData() {
        const saveData = {
            position: { x: this.x, y: this.y },
            health: this.health,
            maxHealth: this.maxHealth,
            level: this.level,
            experience: this.experience,
            experienceToNext: this.experienceToNext,
            inventory: this.inventory,
            questLog: this.questLog,
            memoryFragments: this.memoryFragments,
            equippedWeapon: this.equippedWeapon,
            equippedArmor: this.equippedArmor
        };
        
        return Utils.saveToStorage('playerData', saveData);
    }
    
    // Load player data
    loadData() {
        const saveData = Utils.loadFromStorage('playerData');
        if (saveData) {
            this.setPosition(saveData.position.x, saveData.position.y);
            this.health = saveData.health;
            this.maxHealth = saveData.maxHealth;
            this.level = saveData.level;
            this.experience = saveData.experience;
            this.experienceToNext = saveData.experienceToNext;
            this.inventory = saveData.inventory || [];
            this.questLog = saveData.questLog || [];
            this.memoryFragments = saveData.memoryFragments || 0;
            this.equippedWeapon = saveData.equippedWeapon;
            this.equippedArmor = saveData.equippedArmor;
            
            console.log('Player data loaded');
            return true;
        }
        return false;
    }
    
    // Reset player to starting state
    reset() {
        this.health = this.maxHealth;
        this.level = 1;
        this.experience = 0;
        this.experienceToNext = 100;
        this.inventory = [];
        this.questLog = [];
        this.memoryFragments = 0;
        this.equippedWeapon = null;
        this.equippedArmor = null;
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.attackTimer = 0;
        
        console.log('Player reset to starting state');
    }
}
