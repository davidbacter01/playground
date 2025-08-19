# Echoes of the Forgotten Isle

A top-down pixel art RPG adventure game built with HTML5 Canvas and vanilla JavaScript.

## 🎮 Game Overview

**Echoes of the Forgotten Isle** is an atmospheric RPG where you play as a young adventurer shipwrecked on a cursed island where time flows differently. Shadow creatures roam freely, and to escape, you must explore, fight enemies, interact with NPCs, and recover 5 memory fragments hidden across the island.

### 🎯 Final Goal
Defeat the Shadow Beast in the Temple of Shadows to lift the curse and escape the island.

## ✨ Features

### 🎮 Core Gameplay
- **Top-down perspective** with SNES-style pixel art
- **Real-time combat** with melee attacks and enemy AI
- **Exploration** across multiple interconnected maps
- **Character progression** with experience, levels, and stats
- **Inventory system** for items and equipment

### 🗺️ World & Maps
- **Village Hub** - Safe zone with NPCs and quests
- **Shadow Forest** - Basic enemies and first memory fragment
- **Ancient Ruins** - Puzzle elements and second fragment
- **Cliffside Caves** - Stronger enemies and third fragment
- **Temple of Shadows** - Final dungeon with 4th + 5th fragments + boss

### 🎭 Characters & NPCs
- **Village Elder** - Main quest giver
- **Merchant** - Sells healing items and supplies
- **Guard** - Provides information about the island
- **Wanderer** - Side quests and lore

### 🛡️ Combat & Enemies
- **Shadow Creatures** - Basic forest enemies
- **Forest Spirits** - Faster, more aggressive enemies
- **Ancient Guardians** - Strong ruins protectors
- **Shadow Beast** - Final boss encounter

### 🎒 Items & Equipment
- **Healing Herbs** - Restore health
- **Ancient Keys** - Unlock special areas
- **Memory Fragments** - Main quest items
- **Weapons & Armor** - Improve combat stats

## 🎮 Controls

### Movement
- **WASD** or **Arrow Keys** - Move character
- **Space** - Attack
- **E** or **Enter** - Interact with NPCs/objects

### Interface
- **I** - Open/Close Inventory
- **Q** - Open/Close Quest Log
- **Escape** - Close menus/Pause

## 🚀 Getting Started

### Prerequisites
- Modern web browser with HTML5 Canvas support
- No additional software required

### Installation
1. Download or clone the repository
2. Open `index.html` in your web browser
3. The game will start automatically

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🏗️ Project Structure

```
playground/
├── index.html              # Main HTML file
├── styles.css              # Game styling and UI
├── js/
│   ├── constants.js        # Game constants and configuration
│   ├── utils.js            # Utility functions
│   ├── input.js            # Input handling system
│   ├── sprite.js           # Sprite and animation system
│   ├── entity.js           # Base entity class
│   ├── player.js           # Player character class
│   ├── enemy.js            # Enemy AI and behavior
│   ├── npc.js              # NPC dialogue and quests
│   ├── item.js             # Items and equipment
│   ├── map.js              # Map generation and management
│   ├── ui.js               # User interface system
│   ├── game.js             # Main game loop and logic
│   └── main.js             # Entry point and initialization
└── README.md               # This file
```

## 🔧 Technical Details

### Architecture
- **Modular design** with separate classes for each game system
- **Entity-Component-System** inspired architecture
- **Event-driven** communication between systems
- **State management** for game progression

### Rendering
- **HTML5 Canvas** for pixel-perfect rendering
- **Camera system** that follows the player
- **Tile-based** map rendering with collision detection
- **Sprite animations** for characters and effects

### Performance
- **60 FPS** target with delta-time based updates
- **Efficient collision detection** using bounding boxes
- **Viewport culling** for large maps
- **Memory management** for entities and sprites

## 🎨 Art & Style

### Visual Design
- **Pixel art aesthetic** with 16x16 and 32x32 sprites
- **Atmospheric lighting** that changes between areas
- **Smooth animations** for movement and combat
- **Color-coded** entities and items

### Audio (Future Enhancement)
- Placeholder sound effects for:
  - Sword swings
  - Item pickup
  - Text dialogue
  - Enemy death
  - Player hurt

## 🧪 Debug & Development

### Debug Commands
The game includes comprehensive debug tools accessible from the browser console:

```javascript
// Basic debug
game.toggleDebug()           // Show/hide debug info
game.toggleFPS()            // Show/hide FPS counter

// Entity spawning
game.spawnEnemy('shadow_creature')
game.spawnItem('healing_herb')

// Player manipulation
game.teleportPlayer(100, 100)
game.saveGame()
game.loadGame()

// Game information
game.getGameStats()
game.getPlayerInfo()
game.getMapInfo()

// Cheat commands
giveHealth(50)
giveExperience(100)
giveMemoryFragment()
killAllEnemies()

// Map navigation
changeMap('forest')
getAvailableMaps()

// Help
gameHelp()                  // Show all available commands
```

### Development Features
- **Console logging** for debugging
- **Error handling** with graceful fallbacks
- **Performance monitoring** with FPS counter
- **State inspection** tools
- **Hot reloading** compatible

## 🎯 Game Progression

### Starting Area (Village)
- Meet NPCs and learn about the curse
- Accept main quest to find memory fragments
- Collect basic supplies and healing items

### Forest Exploration
- Fight shadow creatures
- Find first memory fragment
- Learn basic combat mechanics

### Ancient Ruins
- Solve environmental puzzles
- Defeat ancient guardians
- Collect second memory fragment

### Cave System
- Navigate dark, dangerous caves
- Battle forest spirits
- Obtain third memory fragment

### Temple of Shadows
- Final dungeon challenge
- Collect remaining memory fragments
- Face the Shadow Beast boss
- Lift the curse and win the game

## 🔮 Future Enhancements

### Planned Features
- **More detailed pixel art** sprites and animations
- **Sound effects and background music**
- **Additional enemy types** and boss encounters
- **More complex quest system** with branching paths
- **Equipment upgrades** and crafting
- **Save/load system** with multiple slots
- **Mobile touch controls** support

### Technical Improvements
- **WebGL rendering** for better performance
- **Procedural map generation** for replayability
- **Multiplayer support** for cooperative play
- **Modding system** for custom content
- **Achievement system** and statistics

## 🤝 Contributing

This is a prototype/demo project, but contributions are welcome! Areas that could use improvement:

- **Art assets** - Better pixel art sprites and animations
- **Sound design** - Audio effects and music
- **Game balance** - Combat difficulty and progression
- **Additional content** - More maps, enemies, and items
- **Performance optimization** - Better rendering and physics
- **Accessibility** - Colorblind support, keyboard remapping

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by classic SNES RPGs like Zelda and Final Fantasy
- Built with modern web technologies for accessibility
- Designed as a learning project for game development concepts

## 🎮 Play the Game

Ready to start your adventure? Open `index.html` in your browser and begin exploring the Forgotten Isle!

**Good luck, adventurer. The shadows await...**

---

*"In the echoes of forgotten memories lies the key to freedom..."*
