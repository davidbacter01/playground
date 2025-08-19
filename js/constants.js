// Game Constants
const GAME_CONFIG = {
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    TILE_SIZE: 32,
    PLAYER_SPEED: 0.12,
    ENEMY_SPEED: 0.08,
    ATTACK_RANGE: 40,
    ATTACK_DAMAGE: 25,
    PLAYER_MAX_HEALTH: 100,
    ENEMY_MAX_HEALTH: 50
};

// Tile Types
const TILE_TYPES = {
    GRASS: 0,
    WATER: 1,
    STONE: 2,
    SAND: 3,
    TREE: 4,
    WALL: 5,
    DOOR: 6,
    BRIDGE: 7
};

// Entity Types
const ENTITY_TYPES = {
    PLAYER: 'player',
    ENEMY: 'enemy',
    NPC: 'npc',
    ITEM: 'item',
    MEMORY_FRAGMENT: 'memory_fragment'
};

// Enemy Types
const ENEMY_TYPES = {
    SHADOW_CREATURE: 'shadow_creature',
    FOREST_SPIRIT: 'forest_spirit',
    ANCIENT_GUARDIAN: 'ancient_guardian'
};

// Item Types
const ITEM_TYPES = {
    HEALING_HERB: 'healing_herb',
    KEY: 'key',
    MEMORY_FRAGMENT: 'memory_fragment',
    SWORD: 'sword'
};

// Map IDs
const MAP_IDS = {
    VILLAGE: 'village',
    FOREST: 'forest',
    RUINS: 'ruins',
    CAVES: 'caves',
    TEMPLE: 'temple'
};

// Colors for rendering
const COLORS = {
    PLAYER: '#4CAF50',
    ENEMY: '#f44336',
    NPC: '#2196F3',
    ITEM: '#FF9800',
    MEMORY_FRAGMENT: '#E91E63',
    HEALTH_BAR: '#ff0000',
    HEALTH_BAR_BG: '#333333',
    UI_BORDER: '#666666',
    UI_BG: '#000000',
    TEXT: '#ffffff',
    TEXT_SHADOW: '#000000'
};

// Animation frames
const ANIMATION_FRAMES = {
    PLAYER_IDLE: 4,
    PLAYER_WALK: 4,
    PLAYER_ATTACK: 3,
    ENEMY_IDLE: 4,
    ENEMY_WALK: 4
};

// Sound effects (placeholder)
const SOUND_EFFECTS = {
    SWORD_SWING: 'sword_swing',
    ITEM_PICKUP: 'item_pickup',
    TEXT_BLIP: 'text_blip',
    ENEMY_DEATH: 'enemy_death',
    PLAYER_HURT: 'player_hurt'
};
