// Utility functions for the game

class Utils {
    // Calculate distance between two points
    static distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // Check if two rectangles are colliding
    static rectCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    // Check if a point is within a rectangle
    static pointInRect(point, rect) {
        return point.x >= rect.x && 
               point.x <= rect.x + rect.width &&
               point.y >= rect.y && 
               point.y <= rect.y + rect.height;
    }
    
    // Clamp a value between min and max
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    
    // Linear interpolation
    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    // Convert world coordinates to tile coordinates
    static worldToTile(worldX, worldY) {
        return {
            x: Math.floor(worldX / GAME_CONFIG.TILE_SIZE),
            y: Math.floor(worldY / GAME_CONFIG.TILE_SIZE)
        };
    }
    
    // Convert tile coordinates to world coordinates
    static tileToWorld(tileX, tileY) {
        return {
            x: tileX * GAME_CONFIG.TILE_SIZE,
            y: tileY * GAME_CONFIG.TILE_SIZE
        };
    }
    
    // Check if coordinates are within map bounds
    static isInBounds(x, y, mapWidth, mapHeight) {
        return x >= 0 && x < mapWidth && y >= 0 && y < mapHeight;
    }
    
    // Generate a random integer between min and max (inclusive)
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Generate a random float between min and max
    static randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    // Check if a random chance occurs (0.0 to 1.0)
    static randomChance(chance) {
        return Math.random() < chance;
    }
    
    // Deep clone an object
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => Utils.deepClone(item));
        if (typeof obj === 'object') {
            const cloned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = Utils.deepClone(obj[key]);
                }
            }
            return cloned;
        }
    }
    
    // Save data to localStorage
    static saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            return false;
        }
    }
    
    // Load data from localStorage
    static loadFromStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            return defaultValue;
        }
    }
    
    // Format time in MM:SS format
    static formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Create a simple particle effect
    static createParticle(x, y, color, velocity, life) {
        return {
            x: x,
            y: y,
            vx: velocity.x,
            vy: velocity.y,
            color: color,
            life: life,
            maxLife: life,
            update: function() {
                this.x += this.vx;
                this.y += this.vy;
                this.life--;
                return this.life > 0;
            },
            draw: function(ctx) {
                const alpha = this.life / this.maxLife;
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, 2, 2);
                ctx.restore();
            }
        };
    }
    
    // Simple text wrapping for dialogue
    static wrapText(text, maxWidth, ctx) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }
}
