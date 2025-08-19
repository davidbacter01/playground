// Sprite system for handling pixel art graphics and animations

class Sprite {
    constructor(x, y, width, height, color = '#ffffff') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.visible = true;
        this.alpha = 1.0;
        this.rotation = 0;
        this.scaleX = 1.0;
        this.scaleY = 1.0;
        this.anchorX = 0.5;
        this.anchorY = 0.5;
    }
    
    // Draw the sprite to the canvas
    draw(ctx) {
        if (!this.visible) return;
        
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scaleX, this.scaleY);
        
        // Draw based on anchor point
        const drawX = -this.width * this.anchorX;
        const drawY = -this.height * this.anchorY;
        
        ctx.fillStyle = this.color;
        ctx.fillRect(drawX, drawY, this.width, this.height);
        
        ctx.restore();
    }
    
    // Check if this sprite collides with another sprite
    collidesWith(other) {
        return Utils.rectCollision(
            { x: this.x - this.width * this.anchorX, y: this.y - this.height * this.anchorY, width: this.width, height: this.height },
            { x: other.x - other.width * other.anchorX, y: other.y - other.height * other.anchorY, width: other.width, height: other.height }
        );
    }
    
    // Get the bounding box of this sprite
    getBounds() {
        return {
            x: this.x - this.width * this.anchorX,
            y: this.y - this.height * this.anchorY,
            width: this.width,
            height: this.height
        };
    }
    
    // Set the anchor point (0,0 = top-left, 0.5,0.5 = center)
    setAnchor(x, y) {
        this.anchorX = x;
        this.anchorY = y;
    }
    
    // Set the sprite's position
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    
    // Move the sprite by the given amount
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
    
    // Set the sprite's size
    setSize(width, height) {
        this.width = width;
        this.height = height;
    }
    
    // Set the sprite's color
    setColor(color) {
        this.color = color;
    }
    
    // Set the sprite's visibility
    setVisible(visible) {
        this.visible = visible;
    }
    
    // Set the sprite's alpha (transparency)
    setAlpha(alpha) {
        this.alpha = Utils.clamp(alpha, 0, 1);
    }
    
    // Set the sprite's rotation (in radians)
    setRotation(rotation) {
        this.rotation = rotation;
    }
    
    // Set the sprite's scale
    setScale(scaleX, scaleY = scaleX) {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
    }
}

// Animated sprite that cycles through multiple frames
class AnimatedSprite extends Sprite {
    constructor(x, y, width, height, frames, frameTime = 100) {
        super(x, y, width, height);
        this.frames = frames; // Array of colors or frame data
        this.frameTime = frameTime; // Time per frame in milliseconds
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.playing = true;
        this.loop = true;
        this.onComplete = null;
    }
    
    // Update the animation
    update(deltaTime) {
        if (!this.playing) return;
        
        this.frameTimer += deltaTime;
        if (this.frameTimer >= this.frameTime) {
            this.frameTimer = 0;
            this.nextFrame();
        }
    }
    
    // Move to the next frame
    nextFrame() {
        this.currentFrame++;
        if (this.currentFrame >= this.frames.length) {
            if (this.loop) {
                this.currentFrame = 0;
            } else {
                this.currentFrame = this.frames.length - 1;
                this.playing = false;
                if (this.onComplete) this.onComplete();
            }
        }
        
        // Update the sprite's appearance based on the current frame
        this.updateFrame();
    }
    
    // Update the sprite's appearance for the current frame
    updateFrame() {
        const frame = this.frames[this.currentFrame];
        if (typeof frame === 'string') {
            this.color = frame;
        } else if (frame.color) {
            this.color = frame.color;
        }
        // Could add more frame properties here (size, rotation, etc.)
    }
    
    // Play the animation
    play() {
        this.playing = true;
    }
    
    // Pause the animation
    pause() {
        this.playing = false;
    }
    
    // Stop the animation and reset to first frame
    stop() {
        this.playing = false;
        this.currentFrame = 0;
        this.frameTimer = 0;
    }
    
    // Set the animation speed
    setFrameTime(frameTime) {
        this.frameTime = frameTime;
    }
    
    // Set whether the animation loops
    setLoop(loop) {
        this.loop = loop;
    }
    
    // Set a callback for when the animation completes
    setOnComplete(callback) {
        this.onComplete = callback;
    }
    
    // Go to a specific frame
    gotoFrame(frameIndex) {
        this.currentFrame = Utils.clamp(frameIndex, 0, this.frames.length - 1);
        this.updateFrame();
    }
    
    // Check if the animation is on the last frame
    isOnLastFrame() {
        return this.currentFrame === this.frames.length - 1;
    }
    
    // Check if the animation is finished (for non-looping animations)
    isFinished() {
        return !this.loop && this.currentFrame === this.frames.length - 1;
    }
}

// Sprite sheet for more complex graphics
class SpriteSheet {
    constructor(image, tileWidth, tileHeight) {
        this.image = image;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.tilesX = Math.floor(image.width / tileWidth);
        this.tilesY = Math.floor(image.height / tileHeight);
    }
    
    // Draw a specific tile from the sprite sheet
    drawTile(ctx, tileX, tileY, destX, destY, destWidth, destHeight) {
        const sourceX = tileX * this.tileWidth;
        const sourceY = tileY * this.tileHeight;
        
        ctx.drawImage(
            this.image,
            sourceX, sourceY, this.tileWidth, this.tileHeight,
            destX, destY, destWidth, destHeight
        );
    }
    
    // Get the number of tiles in the sheet
    getTileCount() {
        return this.tilesX * this.tilesY;
    }
    
    // Check if a tile index is valid
    isValidTile(tileX, tileY) {
        return tileX >= 0 && tileX < this.tilesX && tileY >= 0 && tileY < this.tilesY;
    }
}

// Particle system for visual effects
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.emitters = [];
    }
    
    // Add a particle emitter
    addEmitter(emitter) {
        this.emitters.push(emitter);
    }
    
    // Update all particles and emitters
    update(deltaTime) {
        // Update emitters
        this.emitters.forEach(emitter => {
            emitter.update(deltaTime);
            if (emitter.active) {
                const newParticles = emitter.emit();
                this.particles.push(...newParticles);
            }
        });
        
        // Update particles
        this.particles = this.particles.filter(particle => {
            particle.update(deltaTime);
            return particle.life > 0;
        });
    }
    
    // Draw all particles
    draw(ctx) {
        this.particles.forEach(particle => {
            particle.draw(ctx);
        });
    }
    
    // Clear all particles
    clear() {
        this.particles = [];
        this.emitters = [];
    }
    
    // Get the number of active particles
    getParticleCount() {
        return this.particles.length;
    }
}
