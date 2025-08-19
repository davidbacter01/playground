// Item class - Collectible items, equipment, and quest objects

class Item extends Entity {
    constructor(x, y, type, name, description = '') {
        super(x, y, 24, 24, ENTITY_TYPES.ITEM);
        
        this.itemType = type;
        this.name = name;
        this.description = description;
        this.isCollectible = true;
        this.isEquippable = false;
        this.isConsumable = false;
        this.isQuestItem = false;
        this.isMemoryFragment = false;
        
        // Item properties
        this.value = 0;
        this.rarity = 'common'; // common, uncommon, rare, epic, legendary
        this.stackable = false;
        this.stackSize = 1;
        this.maxStackSize = 1;
        
        // Equipment properties
        this.equipmentSlot = null; // weapon, armor, accessory
        this.stats = {}; // attack, defense, health, etc.
        
        // Consumable properties
        this.effects = []; // healing, buffs, etc.
        this.duration = 0; // effect duration in milliseconds
        
        // Visual properties
        this.glowColor = null;
        this.glowIntensity = 0;
        this.pulseEffect = false;
        this.pulseTimer = 0;
        
        // Set up item based on type
        this.setupItemType();
        
        // Create item sprite
        this.createSprite();
    }
    
    setupItemType() {
        switch (this.itemType) {
            case ITEM_TYPES.HEALING_HERB:
                this.name = "Healing Herb";
                this.description = "A medicinal herb that restores health when consumed.";
                this.isConsumable = true;
                this.value = 25;
                this.rarity = 'common';
                this.effects = [{ type: 'heal', value: 30 }];
                this.color = '#228B22';
                break;
                
            case ITEM_TYPES.KEY:
                this.name = "Ancient Key";
                this.description = "An old key that might unlock something important.";
                this.isQuestItem = true;
                this.value = 100;
                this.rarity = 'uncommon';
                this.color = '#FFD700';
                this.glowColor = '#FFD700';
                this.glowIntensity = 0.3;
                break;
                
            case ITEM_TYPES.MEMORY_FRAGMENT:
                this.name = "Memory Fragment";
                this.description = "A piece of lost memory that holds the key to lifting the curse.";
                this.isQuestItem = true;
                this.isMemoryFragment = true;
                this.value = 500;
                this.rarity = 'legendary';
                this.color = '#E91E63';
                this.glowColor = '#E91E63';
                this.glowIntensity = 0.5;
                this.pulseEffect = true;
                break;
                
            case ITEM_TYPES.SWORD:
                this.name = "Iron Sword";
                this.description = "A basic iron sword. Better than fighting with your fists.";
                this.isEquippable = true;
                this.equipmentSlot = 'weapon';
                this.value = 150;
                this.rarity = 'common';
                this.stats = { attack: 15 };
                this.color = '#C0C0C0';
                break;
                
            default:
                this.name = "Unknown Item";
                this.description = "An item of unknown origin.";
                this.color = '#808080';
        }
    }
    
    createSprite() {
        // Create animated sprite for the item
        let frames = [this.color];
        
        // Add glow effect if applicable
        if (this.glowColor) {
            frames.push(this.glowColor);
            frames.push(this.color);
        }
        
        // Add pulse effect if applicable
        if (this.pulseEffect) {
            frames = [this.color, this.glowColor, this.color, this.glowColor];
        }
        
        this.sprite = new AnimatedSprite(this.x, this.y, this.width, this.height, frames, 800);
        this.sprite.setAnchor(0.5, 0.5);
        
        // Store animation frames
        this.animations = {
            idle: frames
        };
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // Update pulse effect
        if (this.pulseEffect) {
            this.pulseTimer += deltaTime;
            if (this.pulseTimer > 1000) {
                this.pulseTimer = 0;
            }
        }
        
        // Update glow effect
        if (this.glowColor) {
            this.updateGlowEffect(deltaTime);
        }
        
        // Update sprite animation
        if (this.sprite && this.sprite.update) {
            this.sprite.update(deltaTime);
        }
    }
    
    updateGlowEffect(deltaTime) {
        // Simple glow effect
        if (this.glowIntensity > 0) {
            const glow = Math.sin(this.pulseTimer * 0.01) * this.glowIntensity;
            this.sprite.setAlpha(0.7 + glow);
        }
    }
    
    draw(ctx) {
        super.draw(ctx);
        
        // Draw item name above the item
        if (this.isHovered) {
            this.drawItemName(ctx);
        }
    }
    
    drawItemName(ctx) {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        const text = this.name;
        const textWidth = ctx.measureText(text).width;
        const x = this.x;
        const y = this.y - this.height / 2 - 10;
        
        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(x - textWidth / 2 - 5, y - 15, textWidth + 10, 20);
        
        // Draw text
        ctx.fillStyle = '#ffffff';
        ctx.fillText(text, x, y);
        
        ctx.restore();
    }
    
    collect(player) {
        if (!this.isCollectible) return false;
        
        // Add to player inventory
        if (player.addToInventory(this)) {
            // Apply immediate effects if consumable
            if (this.isConsumable) {
                this.use(player);
            }
            
            // Special handling for memory fragments
            if (this.isMemoryFragment && player.addMemoryFragment) {
                player.addMemoryFragment();
            }
            
            // Destroy the item from the world
            this.destroy();
            
            console.log(`Collected: ${this.name}`);
            return true;
        }
        
        return false;
    }
    
    use(target) {
        if (!this.isConsumable) return false;
        
        // Apply effects
        this.effects.forEach(effect => {
            this.applyEffect(target, effect);
        });
        
        // Remove from inventory if consumed
        if (target.removeFromInventory) {
            // Find and remove this item from inventory
            const inventory = target.inventory;
            const itemIndex = inventory.findIndex(item => item === this);
            if (itemIndex !== -1) {
                target.removeFromInventory(itemIndex);
            }
        }
        
        console.log(`Used: ${this.name}`);
        return true;
    }
    
    applyEffect(target, effect) {
        switch (effect.type) {
            case 'heal':
                if (target.heal) {
                    target.heal(effect.value);
                }
                break;
                
            case 'buff':
                if (target.addBuff) {
                    target.addBuff(effect.buffType, effect.value, this.duration);
                }
                break;
                
            case 'experience':
                if (target.addExperience) {
                    target.addExperience(effect.value);
                }
                break;
                
            default:
                console.log(`Unknown effect type: ${effect.type}`);
        }
    }
    
    equip(target) {
        if (!this.isEquippable) return false;
        
        // Unequip current item in the same slot
        if (target.equippedWeapon && this.equipmentSlot === 'weapon') {
            target.unequipWeapon();
        } else if (target.equippedArmor && this.equipmentSlot === 'armor') {
            target.unequipArmor();
        }
        
        // Equip the new item
        switch (this.equipmentSlot) {
            case 'weapon':
                target.equippedWeapon = this;
                break;
            case 'armor':
                target.equippedArmor = this;
                break;
        }
        
        // Apply stats
        this.applyStats(target, true);
        
        console.log(`Equipped: ${this.name}`);
        return true;
    }
    
    unequip(target) {
        if (!this.isEquippable) return false;
        
        // Remove stats
        this.applyStats(target, false);
        
        // Unequip the item
        switch (this.equipmentSlot) {
            case 'weapon':
                target.equippedWeapon = null;
                break;
            case 'armor':
                target.equippedArmor = null;
                break;
        }
        
        console.log(`Unequipped: ${this.name}`);
        return true;
    }
    
    applyStats(target, isEquipping) {
        const multiplier = isEquipping ? 1 : -1;
        
        Object.keys(this.stats).forEach(stat => {
            if (target[stat] !== undefined) {
                target[stat] += this.stats[stat] * multiplier;
            }
        });
    }
    
    // Get item information for display
    getInfo() {
        return {
            name: this.name,
            description: this.description,
            type: this.itemType,
            rarity: this.rarity,
            value: this.value,
            isEquippable: this.isEquippable,
            isConsumable: this.isConsumable,
            isQuestItem: this.isQuestItem,
            equipmentSlot: this.equipmentSlot,
            stats: this.stats,
            effects: this.effects
        };
    }
    
    // Get item rarity color
    getRarityColor() {
        switch (this.rarity) {
            case 'common': return '#ffffff';
            case 'uncommon': return '#1eff00';
            case 'rare': return '#0070dd';
            case 'epic': return '#a335ee';
            case 'legendary': return '#ff8000';
            default: return '#ffffff';
        }
    }
    
    // Check if item can be used by target
    canUse(target) {
        if (!this.isConsumable) return false;
        
        // Check if target needs healing
        if (this.effects.some(e => e.type === 'heal')) {
            return target.health < target.maxHealth;
        }
        
        return true;
    }
    
    // Check if item can be equipped by target
    canEquip(target) {
        if (!this.isEquippable) return false;
        
        // Check level requirements
        if (this.levelRequirement && target.level < this.levelRequirement) {
            return false;
        }
        
        return true;
    }
    
    // Clone the item
    clone() {
        const clonedItem = new Item(this.x, this.y, this.itemType, this.name, this.description);
        clonedItem.value = this.value;
        clonedItem.rarity = this.rarity;
        clonedItem.stats = { ...this.stats };
        clonedItem.effects = [...this.effects];
        clonedItem.equipmentSlot = this.equipmentSlot;
        clonedItem.isEquippable = this.isEquippable;
        clonedItem.isConsumable = this.isConsumable;
        clonedItem.isQuestItem = this.isQuestItem;
        clonedItem.isMemoryFragment = this.isMemoryFragment;
        
        return clonedItem;
    }
    
    // Set hover state
    setHovered(hovered) {
        this.isHovered = hovered;
    }
}
