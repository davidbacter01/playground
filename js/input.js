// Input handling system for the game

class InputManager {
    constructor() {
        this.keys = {};
        this.mouse = {
            x: 0,
            y: 0,
            left: false,
            right: false
        };
        this.bindEvents();
    }
    
    bindEvents() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            // Prevent default behavior for game keys
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Mouse events
        document.addEventListener('mousemove', (e) => {
            const rect = e.target.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        document.addEventListener('mousedown', (e) => {
            if (e.button === 0) this.mouse.left = true;
            if (e.button === 2) this.mouse.right = true;
        });
        
        document.addEventListener('mouseup', (e) => {
            if (e.button === 0) this.mouse.left = false;
            if (e.button === 2) this.mouse.right = false;
        });
        
        // Prevent context menu
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Handle window focus/blur
        window.addEventListener('blur', () => {
            this.resetKeys();
        });
    }
    
    // Check if a key is currently pressed
    isKeyPressed(keyCode) {
        return this.keys[keyCode] || false;
    }
    
    // Check if a key was just pressed (for single-tap actions)
    isKeyJustPressed(keyCode) {
        return this.keys[keyCode] || false;
    }
    
    // Get movement input as a normalized vector
    getMovementVector() {
        let x = 0;
        let y = 0;
        
        // WASD keys
        if (this.isKeyPressed('KeyW') || this.isKeyPressed('ArrowUp')) y -= 1;
        if (this.isKeyPressed('KeyS') || this.isKeyPressed('ArrowDown')) y += 1;
        if (this.isKeyPressed('KeyA') || this.isKeyPressed('ArrowLeft')) x -= 1;
        if (this.isKeyPressed('KeyD') || this.isKeyPressed('ArrowRight')) x += 1;
        
        // Normalize diagonal movement
        if (x !== 0 && y !== 0) {
            x *= 0.707; // 1/√2
            y *= 0.707;
        }
        
        return { x, y };
    }
    
    // Check if attack key is pressed
    isAttackPressed() {
        return this.isKeyPressed('Space');
    }
    
    // Check if inventory key is pressed
    isInventoryPressed() {
        return this.isKeyJustPressed('KeyI');
    }
    
    // Check if map key is pressed
    isMapPressed() {
        return this.isKeyJustPressed('KeyM');
    }
    
    // Check if pause key is pressed
    isPausePressed() {
        return this.isKeyJustPressed('Escape');
    }
    
    // Check if interact key is pressed
    isInteractPressed() {
        return this.isKeyJustPressed('KeyE') || this.isKeyJustPressed('Enter');
    }
    
    // Reset all keys (useful when game loses focus)
    resetKeys() {
        this.keys = {};
        this.mouse.left = false;
        this.mouse.right = false;
    }
    
    // Get mouse position relative to canvas
    getMousePosition(canvas) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: this.mouse.x,
            y: this.mouse.y
        };
    }
    
    // Check if mouse is over a specific area
    isMouseOver(x, y, width, height) {
        return this.mouse.x >= x && 
               this.mouse.x <= x + width && 
               this.mouse.y >= y && 
               this.mouse.y <= y + height;
    }
    
    // Check if left mouse button is pressed
    isMouseLeftPressed() {
        return this.mouse.left;
    }
    
    // Check if right mouse button is pressed
    isMouseRightPressed() {
        return this.mouse.right;
    }
    
    // Get touch input for mobile devices
    getTouchInput() {
        // Placeholder for mobile touch support
        return {
            x: 0,
            y: 0,
            active: false
        };
    }
    
    // Update input state (called each frame)
    update() {
        // Reset single-tap keys here if needed
        // This could be used for keys that should only trigger once per press
    }
}
