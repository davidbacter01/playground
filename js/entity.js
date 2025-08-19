// Base entity class for all game objects

class Entity {
    constructor(x, y, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.visible = true;
        this.active = true;
        this.sprite = null;
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };
        this.maxSpeed = 0;
        this.friction = 0.8;
        this.gravity = 0;
        this.onGround = false;
        this.collisionBox = { x: 0, y: 0, width: width, height: height };
        this.tags = [];
        this.data = {};
    }
    
    // Update the entity
    update(deltaTime) {
        if (!this.active) return;
        
        // Apply acceleration
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;
        
        // Apply gravity
        if (this.gravity !== 0) {
            this.velocity.y += this.gravity * deltaTime;
        }
        
        // Apply friction
        if (this.friction !== 0) {
            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;
        }
        
        // Limit speed
        if (this.maxSpeed > 0) {
            const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
            if (speed > this.maxSpeed) {
                const scale = this.maxSpeed / speed;
                this.velocity.x *= scale;
                this.velocity.y *= scale;
            }
        }
        
        // Update position
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;
        
        // Update collision box
        this.updateCollisionBox();
        
        // Update sprite if it exists
        if (this.sprite) {
            this.sprite.setPosition(this.x, this.y);
            if (this.sprite.update) {
                this.sprite.update(deltaTime);
            }
        }
    }
    
    // Draw the entity
    draw(ctx) {
        if (!this.visible || !this.active) return;
        
        if (this.sprite) {
            this.sprite.draw(ctx);
        } else {
            // Fallback drawing if no sprite
            ctx.fillStyle = this.getDefaultColor();
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
        
        // Debug: draw collision box
        if (window.DEBUG_MODE) {
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 1;
            ctx.strokeRect(
                this.collisionBox.x, 
                this.collisionBox.y, 
                this.collisionBox.width, 
                this.collisionBox.height
            );
        }
    }
    
    // Get the default color for this entity type
    getDefaultColor() {
        switch (this.type) {
            case ENTITY_TYPES.PLAYER: return COLORS.PLAYER;
            case ENTITY_TYPES.ENEMY: return COLORS.ENEMY;
            case ENTITY_TYPES.NPC: return COLORS.NPC;
            case ENTITY_TYPES.ITEM: return COLORS.ITEM;
            case ENTITY_TYPES.MEMORY_FRAGMENT: return COLORS.MEMORY_FRAGMENT;
            default: return '#ffffff';
        }
    }
    
    // Update the collision box position
    updateCollisionBox() {
        this.collisionBox.x = this.x - this.width / 2;
        this.collisionBox.y = this.y - this.height / 2;
        this.collisionBox.width = this.width;
        this.collisionBox.height = this.height;
    }
    
    // Check collision with another entity
    collidesWith(other) {
        if (!other || !other.collisionBox) return false;
        return Utils.rectCollision(this.collisionBox, other.collisionBox);
    }
    
    // Check collision with a rectangle
    collidesWithRect(rect) {
        return Utils.rectCollision(this.collisionBox, rect);
    }
    
    // Check if a point is within this entity
    containsPoint(x, y) {
        return Utils.pointInRect({ x, y }, this.collisionBox);
    }
    
    // Set the entity's position
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.updateCollisionBox();
        if (this.sprite) {
            this.sprite.setPosition(x, y);
        }
    }
    
    // Move the entity by the given amount
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.updateCollisionBox();
        if (this.sprite) {
            this.sprite.move(dx, dy);
        }
    }
    
    // Set the entity's velocity
    setVelocity(x, y) {
        this.velocity.x = x;
        this.velocity.y = y;
    }
    
    // Add velocity to the entity
    addVelocity(dx, dy) {
        this.velocity.x += dx;
        this.velocity.y += dy;
    }
    
    // Set the entity's acceleration
    setAcceleration(x, y) {
        this.acceleration.x = x;
        this.acceleration.y = y;
    }
    
    // Set the entity's maximum speed
    setMaxSpeed(speed) {
        this.maxSpeed = speed;
    }
    
    // Set the entity's friction
    setFriction(friction) {
        this.friction = Utils.clamp(friction, 0, 1);
    }
    
    // Set the entity's gravity
    setGravity(gravity) {
        this.gravity = gravity;
    }
    
    // Set the entity's size
    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.updateCollisionBox();
        if (this.sprite) {
            this.sprite.setSize(width, height);
        }
    }
    
    // Set the entity's collision box offset
    setCollisionOffset(x, y, width, height) {
        this.collisionBox.x = this.x + x;
        this.collisionBox.y = this.y + y;
        this.collisionBox.width = width;
        this.collisionBox.height = height;
    }
    
    // Set the entity's sprite
    setSprite(sprite) {
        this.sprite = sprite;
        if (sprite) {
            sprite.setPosition(this.x, this.y);
            sprite.setSize(this.width, this.height);
        }
    }
    
    // Set the entity's visibility
    setVisible(visible) {
        this.visible = visible;
        if (this.sprite) {
            this.sprite.setVisible(visible);
        }
    }
    
    // Set the entity's active state
    setActive(active) {
        this.active = active;
    }
    
    // Add a tag to the entity
    addTag(tag) {
        if (!this.tags.includes(tag)) {
            this.tags.push(tag);
        }
    }
    
    // Remove a tag from the entity
    removeTag(tag) {
        const index = this.tags.indexOf(tag);
        if (index > -1) {
            this.tags.splice(index, 1);
        }
    }
    
    // Check if the entity has a specific tag
    hasTag(tag) {
        return this.tags.includes(tag);
    }
    
    // Set custom data for the entity
    setData(key, value) {
        this.data[key] = value;
    }
    
    // Get custom data from the entity
    getData(key, defaultValue = null) {
        return this.data[key] !== undefined ? this.data[key] : defaultValue;
    }
    
    // Get the distance to another entity
    getDistanceTo(other) {
        return Utils.distance(this.x, this.y, other.x, other.y);
    }
    
    // Get the direction to another entity
    getDirectionTo(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance === 0) return { x: 0, y: 0 };
        
        return {
            x: dx / distance,
            y: dy / distance
        };
    }
    
    // Check if the entity is within a certain distance of another entity
    isWithinDistance(other, distance) {
        return this.getDistanceTo(other) <= distance;
    }
    
    // Get the entity's center position
    getCenter() {
        return {
            x: this.x,
            y: this.y
        };
    }
    
    // Get the entity's bounds
    getBounds() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }
    
    // Destroy the entity
    destroy() {
        this.active = false;
        this.visible = false;
        if (this.sprite) {
            this.sprite.setVisible(false);
        }
    }
    
    // Check if the entity is destroyed
    isDestroyed() {
        return !this.active && !this.visible;
    }
}
