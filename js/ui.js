// UI system for managing game interface elements

class UIManager {
    constructor() {
        this.elements = {};
        this.dialogueBox = null;
        this.healthBar = null;
        this.inventory = null;
        this.questLog = null;
        this.gameOverScreen = null;
        this.victoryScreen = null;
        
        this.isDialogueActive = false;
        this.currentDialogue = null;
        this.dialogueChoices = [];
        
        this.isInventoryOpen = false;
        this.isQuestLogOpen = false;
        
        this.initialize();
    }
    
    initialize() {
        this.setupElements();
        this.bindEvents();
        this.hideAllScreens();
    }
    
    setupElements() {
        // Get DOM elements
        this.dialogueBox = document.getElementById('dialogueBox');
        this.healthBar = document.getElementById('healthBar');
        this.healthFill = document.getElementById('healthFill');
        this.healthText = document.getElementById('healthText');
        this.inventory = document.getElementById('inventory');
        this.inventoryItems = document.getElementById('inventoryItems');
        this.questLog = document.getElementById('questLog');
        this.questItems = document.getElementById('questItems');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.victoryScreen = document.getElementById('victoryScreen');
        this.dialogueText = document.getElementById('dialogueText');
        this.dialogueChoices = document.getElementById('dialogueChoices');
        this.dialogueNext = document.getElementById('dialogueNext');
        this.restartButton = document.getElementById('restartButton');
        this.newGameButton = document.getElementById('newGameButton');
        
        // Store references
        this.elements = {
            dialogueBox: this.dialogueBox,
            healthBar: this.healthBar,
            healthFill: this.healthFill,
            healthText: this.healthText,
            inventory: this.inventory,
            inventoryItems: this.inventoryItems,
            questLog: this.questLog,
            questItems: this.questItems,
            gameOverScreen: this.gameOverScreen,
            victoryScreen: this.victoryScreen,
            dialogueText: this.dialogueText,
            dialogueChoices: this.dialogueChoices,
            dialogueNext: this.dialogueNext,
            restartButton: this.restartButton,
            newGameButton: this.newGameButton
        };
    }
    
    bindEvents() {
        // Dialogue events
        if (this.dialogueNext) {
            this.dialogueNext.addEventListener('click', () => {
                this.nextDialogue();
            });
        }
        
        // Game over events
        if (this.restartButton) {
            this.restartButton.addEventListener('click', () => {
                this.restartGame();
            });
        }
        
        // Victory events
        if (this.newGameButton) {
            this.newGameButton.addEventListener('click', () => {
                this.newGame();
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
    }
    
    handleKeyPress(e) {
        switch (e.code) {
            case 'KeyI':
                this.toggleInventory();
                break;
            case 'KeyQ':
                this.toggleQuestLog();
                break;
            case 'Escape':
                this.closeAllMenus();
                break;
            case 'Enter':
            case 'Space':
                if (this.isDialogueActive) {
                    this.nextDialogue();
                }
                break;
        }
    }
    
    updateHealthBar(health, maxHealth) {
        if (!this.healthFill || !this.healthText) return;
        
        const percentage = health / maxHealth;
        this.healthFill.style.width = `${percentage * 100}%`;
        this.healthText.textContent = `${health}/${maxHealth}`;
        
        // Change color based on health
        if (percentage > 0.6) {
            this.healthFill.style.background = 'linear-gradient(90deg, #ff0000, #ff6666)';
        } else if (percentage > 0.3) {
            this.healthFill.style.background = 'linear-gradient(90deg, #ffaa00, #ffcc66)';
        } else {
            this.healthFill.style.background = 'linear-gradient(90deg, #ff0000, #ff3333)';
        }
    }
    
    updateInventory(player) {
        if (!this.inventoryItems || !player) return;
        
        this.inventoryItems.innerHTML = '';
        
        if (player.inventory.length === 0) {
            this.inventoryItems.innerHTML = '<div class="inventory-item">Empty</div>';
            return;
        }
        
        player.inventory.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'inventory-item';
            itemElement.innerHTML = `
                <span style="color: ${item.getRarityColor ? item.getRarityColor() : '#ffffff'}">${item.name}</span>
                <span style="float: right; color: #888;">${item.stackSize || 1}</span>
            `;
            
            // Add click event for item interaction
            itemElement.addEventListener('click', () => {
                this.handleItemClick(item, index, player);
            });
            
            this.inventoryItems.appendChild(itemElement);
        });
    }
    
    updateQuestLog(player) {
        if (!this.questItems || !player) return;
        
        this.questItems.innerHTML = '';
        
        if (player.questLog.length === 0) {
            this.questItems.innerHTML = '<div class="quest-item">No active quests</div>';
            return;
        }
        
        player.questLog.forEach(quest => {
            const questElement = document.createElement('div');
            questElement.className = 'quest-item';
            questElement.innerHTML = `
                <strong>${quest.title}</strong><br>
                <span style="color: #ccc;">${quest.description}</span><br>
                <span style="color: #888;">Reward: ${quest.reward}</span>
            `;
            
            this.questItems.appendChild(questElement);
        });
    }
    
    handleItemClick(item, index, player) {
        if (item.isConsumable && item.canUse(player)) {
            if (confirm(`Use ${item.name}?`)) {
                item.use(player);
                this.updateInventory(player);
                this.updateHealthBar(player.health, player.maxHealth);
            }
        } else if (item.isEquippable && item.canEquip(player)) {
            if (confirm(`Equip ${item.name}?`)) {
                item.equip(player);
                this.updateInventory(player);
            }
        } else {
            alert(`${item.name}: ${item.description}`);
        }
    }
    
    showDialogue(dialogue) {
        if (!this.dialogueBox || !dialogue) return;
        
        this.isDialogueActive = true;
        this.currentDialogue = dialogue;
        
        // Set dialogue text
        if (this.dialogueText) {
            this.dialogueText.textContent = dialogue.text;
        }
        
        // Set dialogue choices
        if (this.dialogueChoices) {
            this.dialogueChoices.innerHTML = '';
            
            if (dialogue.choices && dialogue.choices.length > 0) {
                dialogue.choices.forEach((choice, index) => {
                    const choiceElement = document.createElement('button');
                    choiceElement.className = 'dialogue-choice';
                    choiceElement.textContent = choice;
                    choiceElement.addEventListener('click', () => {
                        this.makeDialogueChoice(index);
                    });
                    this.dialogueChoices.appendChild(choiceElement);
                });
            }
        }
        
        // Show dialogue box
        this.dialogueBox.classList.remove('hidden');
        this.dialogueBox.classList.add('fade-in');
    }
    
    hideDialogue() {
        if (!this.dialogueBox) return;
        
        this.isDialogueActive = false;
        this.currentDialogue = null;
        this.dialogueBox.classList.add('hidden');
        this.dialogueBox.classList.remove('fade-in');
    }
    
    nextDialogue() {
        if (!this.currentDialogue) return;
        
        // If there are choices, this should be handled by choice selection
        if (this.currentDialogue.choices && this.currentDialogue.choices.length > 0) {
            return;
        }
        
        // For simple dialogue, just hide it
        this.hideDialogue();
    }
    
    makeDialogueChoice(choiceIndex) {
        if (!this.currentDialogue || !this.currentDialogue.choices) return;
        
        const choice = this.currentDialogue.choices[choiceIndex];
        console.log(`Player chose: ${choice}`);
        
        // Hide dialogue after choice
        this.hideDialogue();
    }
    
    toggleInventory() {
        if (!this.inventory) return;
        
        this.isInventoryOpen = !this.isInventoryOpen;
        
        if (this.isInventoryOpen) {
            this.inventory.style.display = 'block';
            this.inventory.classList.add('fade-in');
        } else {
            this.inventory.style.display = 'none';
            this.inventory.classList.remove('fade-in');
        }
    }
    
    toggleQuestLog() {
        if (!this.questLog) return;
        
        this.isQuestLogOpen = !this.isQuestLogOpen;
        
        if (this.isQuestLogOpen) {
            this.questLog.style.display = 'block';
            this.questLog.classList.add('fade-in');
        } else {
            this.questLog.style.display = 'none';
            this.questLog.classList.remove('fade-in');
        }
    }
    
    closeAllMenus() {
        this.isInventoryOpen = false;
        this.isQuestLogOpen = false;
        this.hideDialogue();
        
        if (this.inventory) {
            this.inventory.style.display = 'none';
        }
        if (this.questLog) {
            this.questLog.style.display = 'none';
        }
    }
    
    showGameOver() {
        if (!this.gameOverScreen) return;
        
        this.gameOverScreen.classList.remove('hidden');
        this.gameOverScreen.classList.add('fade-in');
    }
    
    showVictory() {
        if (!this.victoryScreen) return;
        
        this.victoryScreen.classList.remove('hidden');
        this.victoryScreen.classList.add('fade-in');
    }
    
    hideAllScreens() {
        if (this.gameOverScreen) this.gameOverScreen.classList.add('hidden');
        if (this.victoryScreen) this.victoryScreen.classList.add('hidden');
        if (this.dialogueBox) this.dialogueBox.classList.add('hidden');
    }
    
    restartGame() {
        // This will be handled by the main game class
        console.log('Restart game requested');
        this.hideAllScreens();
        
        // Dispatch custom event
        const event = new CustomEvent('gameRestart');
        document.dispatchEvent(event);
    }
    
    newGame() {
        // This will be handled by the main game class
        console.log('New game requested');
        this.hideAllScreens();
        
        // Dispatch custom event
        const event = new CustomEvent('newGame');
        document.dispatchEvent(event);
    }
    
    showNotification(message, type = 'info', duration = 3000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, duration);
    }
    
    showTooltip(element, text) {
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 12px;
            pointer-events: none;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.2s;
        `;
        
        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 + 'px';
        tooltip.style.top = rect.top - 30 + 'px';
        
        // Add to document
        document.body.appendChild(tooltip);
        
        // Show tooltip
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 100);
        
        // Remove tooltip on mouse leave
        element.addEventListener('mouseleave', () => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        });
        
        return tooltip;
    }
    
    updateUI(player) {
        if (!player) return;
        
        // Update health bar
        this.updateHealthBar(player.health, player.maxHealth);
        
        // Update inventory
        this.updateInventory(player);
        
        // Update quest log
        this.updateQuestLog(player);
    }
    
    // Animation methods
    fadeIn(element, duration = 300) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-in`;
        
        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);
    }
    
    fadeOut(element, duration = 300) {
        if (!element) return;
        
        element.style.transition = `opacity ${duration}ms ease-out`;
        element.style.opacity = '0';
        
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, duration);
    }
    
    // Utility methods
    isElementVisible(element) {
        if (!element) return false;
        return !element.classList.contains('hidden') && element.style.display !== 'none';
    }
    
    getElementPosition(element) {
        if (!element) return { x: 0, y: 0 };
        
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }
    
    // Debug methods
    showDebugInfo() {
        console.log('UI Debug Info:');
        console.log('Dialogue Active:', this.isDialogueActive);
        console.log('Inventory Open:', this.isInventoryOpen);
        console.log('Quest Log Open:', this.isQuestLogOpen);
        console.log('Current Dialogue:', this.currentDialogue);
    }
}
