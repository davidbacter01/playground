// Main entry point for the game

let game = null;

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Starting Echoes of the Forgotten Isle...');
    
    // Create and start the game
    game = new Game();
    
    // Add debug controls to the console
    setupDebugControls();
    
    // Add some helpful information
    console.log('Game started successfully!');
    console.log('Controls:');
    console.log('- WASD or Arrow Keys: Move');
    console.log('- Space: Attack');
    console.log('- E: Interact with NPCs');
    console.log('- I: Open/Close Inventory');
    console.log('- Q: Open/Close Quest Log');
    console.log('- Escape: Close menus');
    console.log('');
    console.log('Debug commands available in console:');
    console.log('- game.toggleDebug() - Show/hide debug info');
    console.log('- game.toggleFPS() - Show/hide FPS counter');
    console.log('- game.spawnEnemy() - Spawn an enemy');
    console.log('- game.spawnItem() - Spawn an item');
    console.log('- game.teleportPlayer(x, y) - Move player');
    console.log('- game.saveGame() - Save progress');
    console.log('- game.loadGame() - Load progress');
});

// Set up debug controls accessible from the console
function setupDebugControls() {
    // Make game globally accessible for debugging and collision detection
    window.game = game;
    window.currentGame = game;
    
    // Add debug mode toggle
    window.toggleDebug = () => {
        if (game) {
            game.toggleDebug();
        }
    };
    
    // Add FPS toggle
    window.toggleFPS = () => {
        if (game) {
            game.toggleFPS();
        }
    };
    
    // Add enemy spawning
    window.spawnEnemy = (type) => {
        if (game) {
            game.spawnEnemy(type);
        }
    };
    
    // Add item spawning
    window.spawnItem = (type) => {
        if (game) {
            game.spawnItem(type);
        }
    };
    
    // Add player teleportation
    window.teleportPlayer = (x, y) => {
        if (game) {
            game.teleportPlayer(x, y);
        }
    };
    
    // Add save/load functions
    window.saveGame = () => {
        if (game) {
            game.saveGame();
        }
    };
    
    window.loadGame = () => {
        if (game) {
            game.loadGame();
        }
    };
    
    // Add game stats
    window.getGameStats = () => {
        if (game) {
            return game.getGameStats();
        }
        return {};
    };
    
    // Add map changing
    window.changeMap = (mapId) => {
        if (game) {
            game.changeMap(mapId);
        }
    };
    
    // Add player info
    window.getPlayerInfo = () => {
        if (game && game.player) {
            return {
                position: { x: game.player.x, y: game.player.y },
                health: game.player.health,
                maxHealth: game.player.maxHealth,
                level: game.player.level,
                experience: game.player.experience,
                memoryFragments: game.player.memoryFragments,
                inventory: game.player.inventory.length,
                quests: game.player.questLog.length
            };
        }
        return null;
    };
    
    // Add cheat functions
    window.giveHealth = (amount) => {
        if (game && game.player) {
            game.player.heal(amount);
            console.log(`Player healed by ${amount}`);
        }
    };
    
    window.giveExperience = (amount) => {
        if (game && game.player) {
            game.player.addExperience(amount);
            console.log(`Player gained ${amount} experience`);
        }
    };
    
    window.giveMemoryFragment = () => {
        if (game && game.player) {
            game.player.addMemoryFragment();
            console.log('Memory fragment added!');
        }
    };
    
    window.killAllEnemies = () => {
        if (game && game.currentMap) {
            const enemies = [...game.currentMap.enemies];
            enemies.forEach(enemy => {
                enemy.takeDamage(enemy.maxHealth);
            });
            console.log(`Killed ${enemies.length} enemies`);
        }
    };
    
    // Add map info
    window.getMapInfo = () => {
        if (game && game.currentMap) {
            return {
                name: game.currentMap.name,
                description: game.currentMap.description,
                id: game.currentMap.id,
                size: { width: game.currentMap.width, height: game.currentMap.height },
                entities: game.currentMap.entities.length,
                enemies: game.currentMap.enemies.length,
                npcs: game.currentMap.npcs.length,
                items: game.currentMap.items.length
            };
        }
        return null;
    };
    
    // Add available maps list
    window.getAvailableMaps = () => {
        if (game && game.maps) {
            return Object.keys(game.maps).map(id => ({
                id: id,
                name: game.maps[id].name,
                description: game.maps[id].description
            }));
        }
        return [];
    };
    
    // Add help function
    window.gameHelp = () => {
        console.log('=== Echoes of the Forgotten Isle - Debug Help ===');
        console.log('');
        console.log('Game Controls:');
        console.log('- WASD/Arrows: Move player');
        console.log('- Space: Attack');
        console.log('- E: Interact with NPCs');
        console.log('- I: Inventory');
        console.log('- Q: Quest log');
        console.log('- Escape: Close menus');
        console.log('');
        console.log('Debug Commands:');
        console.log('- toggleDebug() - Show/hide debug info');
        console.log('- toggleFPS() - Show/hide FPS counter');
        console.log('- spawnEnemy(type) - Spawn enemy (shadow_creature, forest_spirit, ancient_guardian)');
        console.log('- spawnItem(type) - Spawn item (healing_herb, key, memory_fragment, sword)');
        console.log('- teleportPlayer(x, y) - Move player to coordinates');
        console.log('- saveGame() - Save progress');
        console.log('- loadGame() - Load progress');
        console.log('- getGameStats() - Get game statistics');
        console.log('- getPlayerInfo() - Get player information');
        console.log('- getMapInfo() - Get current map information');
        console.log('- getAvailableMaps() - List all available maps');
        console.log('- changeMap(mapId) - Change to different map');
        console.log('');
        console.log('Cheat Commands:');
        console.log('- giveHealth(amount) - Restore player health');
        console.log('- giveExperience(amount) - Give player experience');
        console.log('- giveMemoryFragment() - Add memory fragment');
        console.log('- killAllEnemies() - Kill all enemies on current map');
        console.log('');
        console.log('Map IDs:');
        console.log('- village, forest, ruins, caves, temple');
        console.log('');
        console.log('Enemy Types:');
        console.log('- shadow_creature, forest_spirit, ancient_guardian');
        console.log('');
        console.log('Item Types:');
        console.log('- healing_herb, key, memory_fragment, sword');
    };
    
    // Log available debug commands
    console.log('Debug commands available:');
    console.log('- gameHelp() - Show all available commands');
    console.log('- toggleDebug() - Toggle debug mode');
    console.log('- toggleFPS() - Toggle FPS display');
    console.log('- spawnEnemy(type) - Spawn enemy');
    console.log('- spawnItem(type) - Spawn item');
    console.log('- teleportPlayer(x, y) - Move player');
    console.log('- saveGame() / loadGame() - Save/load progress');
    console.log('- getGameStats() - Get game statistics');
    console.log('- getPlayerInfo() - Get player info');
    console.log('- getMapInfo() - Get map info');
    console.log('- getAvailableMaps() - List maps');
    console.log('- changeMap(id) - Change map');
    console.log('- giveHealth(amount) - Restore health');
    console.log('- giveExperience(amount) - Give XP');
    console.log('- giveMemoryFragment() - Add fragment');
    console.log('- killAllEnemies() - Kill all enemies');
}

// Handle window errors gracefully
window.addEventListener('error', (event) => {
    console.error('Game error:', event.error);
    
    if (game) {
        // Try to show error in UI
        game.uiManager.showNotification('Game error occurred. Check console for details.', 'error', 5000);
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    if (game) {
        game.uiManager.showNotification('Game error occurred. Check console for details.', 'error', 5000);
    }
});

// Add some CSS animations for the notification system
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification {
        animation: slideIn 0.3s ease-out;
    }
`;
document.head.appendChild(style);

// Export game instance for external access
window.EchoesGame = {
    game: null,
    getInstance: () => game,
    restart: () => {
        if (game) {
            game.restartGame();
        }
    },
    pause: () => {
        if (game) {
            game.pause();
        }
    },
    resume: () => {
        if (game) {
            game.resume();
        }
    },
    save: () => {
        if (game) {
            game.saveGame();
        }
    },
    load: () => {
        if (game) {
            game.loadGame();
        }
    }
};

// Initialize the game instance reference
Object.defineProperty(window.EchoesGame, 'game', {
    get: () => game,
    set: (value) => { game = value; }
});

console.log('EchoesGame API available at window.EchoesGame');
console.log('Use EchoesGame.getInstance() to access the game instance');
