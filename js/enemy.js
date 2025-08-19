// Enemy class - AI-controlled enemies that the player can fight

class Enemy extends Entity {
    constructor(x, y, type) {
        super(x, y, 32, 32, ENTITY_TYPES.ENEMY);
        
        this.enemyType = type;
        this.setupEnemyType();
        
        // AI state
        this.aiState = 'idle'; // idle, patrol, chase, attack, retreat
        this.aiTimer = 0;
        this.stateTimer = 0;
        this.target = null;
        this.lastSeenPlayer = 0;
        this.patrolPoints = [];
        this.currentPatrolIndex = 0;
        
        // Combat
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.attackRange = 30;
        this.attackDamage = 15;
        this.attackDuration = 400;
        this.attackTimer = 0;
        this.retreatHealth = 0.3; // Retreat when health drops below 30%
        
        // Movement
        this.patrolSpeed = this.moveSpeed * 0.5;
        this.chaseSpeed = this.moveSpeed * 1.2;
        this.retreatSpeed = this.moveSpeed * 1.5;
        
        // Vision and detection
        this.detectionRange = 120;
        this.attackRange = 40;
        this.forgetTime = 3000; // Time to forget about player if not seen
        
        // Create enemy sprite
        this.createSprite();
        
        // Set collision properties
        this.setMaxSpeed(this.moveSpeed);
        this.setFriction(0.8);
    }
    
    setupEnemyType() {
        switch (this.enemyType) {
            case ENEMY_TYPES.SHADOW_CREATURE:
                this.maxHealth = 40;
                this.health = this.maxHealth;
                this.moveSpeed = GAME_CONFIG.ENEMY_SPEED;
                this.attackDamage = 15;
                this.detectionRange = 100;
                this.attackRange = 35;
                this.color = '#8B0000';
                break;
                
            case ENEMY_TYPES.FOREST_SPIRIT:
                this.maxHealth = 60;
                this.health = this.maxHealth;
                this.moveSpeed = GAME_CONFIG.ENEMY_SPEED * 1.2;
                this.attackDamage = 20;
                this.detectionRange = 140;
                this.attackRange = 45;
                this.color = '#228B22';
                break;
                
            case ENEMY_TYPES.ANCIENT_GUARDIAN:
                this.maxHealth = 100;
                this.health = this.maxHealth;
                this.moveSpeed = GAME_CONFIG.ENEMY_SPEED * 0.8;
                this.attackDamage = 30;
                this.detectionRange = 160;
                this.attackRange = 50;
                this.color = '#696969';
                break;
                
            default:
                this.maxHealth = 50;
                this.health = this.maxHealth;
                this.moveSpeed = GAME_CONFIG.ENEMY_SPEED;
                this.attackDamage = 20;
                this.detectionRange = 120;
                this.attackRange = 40;
                this.color = COLORS.ENEMY;
        }
    }
    
    createSprite() {
        // Create animated sprite for the enemy
        const idleFrames = [this.color, '#8B0000', this.color, '#8B0000'];
        const walkFrames = [this.color, '#8B0000', this.color, '#8B0000'];
        const attackFrames = [this.color, '#ff0000', this.color];
        
        this.sprite = new AnimatedSprite(this.x, this.y, this.width, this.height, idleFrames, 300);
        this.sprite.setAnchor(0.5, 0.5);
        
        // Store animation frames for different states
        this.animations = {
            idle: idleFrames,
            walk: walkFrames,
            attack: attackFrames
        };
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // Update AI
        this.updateAI(deltaTime);
        
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
        
        // Update sprite animation
        if (this.sprite && this.sprite.update) {
            this.sprite.update(deltaTime);
        }
    }
    
    updateAI(deltaTime) {
        this.aiTimer += deltaTime;
        this.stateTimer += deltaTime;
        
        // Check if player is visible
        if (this.target && this.canSeePlayer()) {
            this.lastSeenPlayer = this.aiTimer;
            this.aiState = 'chase';
        } else if (this.aiTimer - this.lastSeenPlayer > this.forgetTime) {
            this.target = null;
            this.aiState = 'patrol';
        }
        
        // Update based on current AI state
        switch (this.aiState) {
            case 'idle':
                this.updateIdle(deltaTime);
                break;
            case 'patrol':
                this.updatePatrol(deltaTime);
                break;
            case 'chase':
                this.updateChase(deltaTime);
                break;
            case 'attack':
                this.updateAttack(deltaTime);
                break;
            case 'retreat':
                this.updateRetreat(deltaTime);
                break;
        }
        
        // Check if should retreat
        if (this.health < this.maxHealth * this.retreatHealth && this.aiState !== 'retreat') {
            this.aiState = 'retreat';
            this.stateTimer = 0;
        }
    }
    
    updateIdle(deltaTime) {
        // Stay still for a random amount of time
        if (this.stateTimer > Utils.randomInt(1000, 3000)) {
            this.aiState = 'patrol';
            this.stateTimer = 0;
        }
        
        this.setVelocity(0, 0);
    }
    
    updatePatrol(deltaTime) {
        // Move between patrol points or wander randomly
        if (this.patrolPoints.length > 0) {
            this.patrolToPoints();
        } else {
            this.wanderRandomly(deltaTime);
        }
        
        // Change direction occasionally
        if (this.stateTimer > Utils.randomInt(2000, 5000)) {
            this.aiState = 'idle';
            this.stateTimer = 0;
        }
    }
    
    updateChase(deltaTime) {
        if (!this.target) return;
        
        const distance = this.getDistanceTo(this.target);
        
        if (distance <= this.attackRange) {
            // Close enough to attack
            this.aiState = 'attack';
            this.stateTimer = 0;
            this.setVelocity(0, 0);
        } else if (distance <= this.detectionRange) {
            // Chase the player
            const direction = this.getDirectionTo(this.target);
            const moveX = direction.x * this.chaseSpeed;
            const moveY = direction.y * this.chaseSpeed;
            this.setVelocity(moveX, moveY);
        } else {
            // Lost sight of player
            this.aiState = 'patrol';
            this.stateTimer = 0;
        }
    }
    
    updateAttack(deltaTime) {
        if (!this.target) {
            this.aiState = 'chase';
            return;
        }
        
        const distance = this.getDistanceTo(this.target);
        
        if (distance > this.attackRange) {
            // Player moved away, chase again
            this.aiState = 'chase';
            return;
        }
        
        // Attack if cooldown is ready
        if (this.attackCooldown <= 0) {
            this.performAttack();
        }
    }
    
    updateRetreat(deltaTime) {
        if (!this.target) {
            this.aiState = 'patrol';
            return;
        }
        
        // Move away from player
        const direction = this.getDirectionTo(this.target);
        const moveX = -direction.x * this.retreatSpeed;
        const moveY = -direction.y * this.retreatSpeed;
        this.setVelocity(moveX, moveY);
        
        // Stop retreating after some time
        if (this.stateTimer > 2000) {
            this.aiState = 'patrol';
            this.stateTimer = 0;
        }
    }
    
    patrolToPoints() {
        if (this.patrolPoints.length === 0) return;
        
        const targetPoint = this.patrolPoints[this.currentPatrolIndex];
        const distance = Utils.distance(this.x, this.y, targetPoint.x, targetPoint.y);
        
        if (distance < 10) {
            // Reached patrol point, move to next
            this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
        } else {
            // Move towards current patrol point
            const direction = {
                x: (targetPoint.x - this.x) / distance,
                y: (targetPoint.y - this.y) / distance
            };
            
            const moveX = direction.x * this.patrolSpeed;
            const moveY = direction.y * this.patrolSpeed;
            this.setVelocity(moveX, moveY);
        }
    }
    
    wanderRandomly(deltaTime) {
        // Change direction occasionally
        if (this.stateTimer > Utils.randomInt(1000, 3000)) {
            const angle = Utils.randomFloat(0, Math.PI * 2);
            const speed = this.patrolSpeed;
            
            this.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );
            
            this.stateTimer = 0;
        }
    }
    
    canSeePlayer() {
        if (!this.target) return false;
        
        const distance = this.getDistanceTo(this.target);
        return distance <= this.detectionRange;
    }
    
    setTarget(target) {
        this.target = target;
    }
    
    setPatrolPoints(points) {
        this.patrolPoints = points;
        this.currentPatrolIndex = 0;
    }
    
    performAttack() {
        if (this.isAttacking || this.attackCooldown > 0) return;
        
        this.isAttacking = true;
        this.attackTimer = 0;
        this.attackCooldown = 1000; // 1 second cooldown
        
        // Attack animation
        this.sprite.frames = this.animations.attack;
        this.sprite.frameTime = 150;
        this.sprite.gotoFrame(0);
        this.sprite.play();
        
        // Check if attack hits player
        if (this.target && this.getDistanceTo(this.target) <= this.attackRange) {
            if (this.target.takeDamage) {
                this.target.takeDamage(this.attackDamage);
            }
        }
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
        
        // Check if enemy died
        if (this.health <= 0) {
            this.die();
        }
        
        return this.health;
    }
    
    die() {
        // Drop experience and items
        if (this.target && this.target.addExperience) {
            this.target.addExperience(this.maxHealth * 2);
        }
        
        // Destroy the enemy
        this.destroy();
        
        console.log(`${this.enemyType} defeated!`);
    }
    
    // Get the enemy's health percentage
    getHealthPercentage() {
        return this.health / this.maxHealth;
    }
    
    // Check if the enemy is aggressive (will attack player)
    isAggressive() {
        return this.aiState === 'chase' || this.aiState === 'attack';
    }
    
    // Check if the enemy is vulnerable (can be attacked)
    isVulnerable() {
        return !this.isAttacking && this.health > 0;
    }
    
    // Get the enemy's current behavior description
    getBehaviorDescription() {
        switch (this.aiState) {
            case 'idle': return 'standing still';
            case 'patrol': return 'patrolling';
            case 'chase': return 'chasing player';
            case 'attack': return 'attacking';
            case 'retreat': return 'retreating';
            default: return 'unknown';
        }
    }
}
