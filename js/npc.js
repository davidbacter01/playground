// NPC class - Non-player characters that provide dialogue and quests

class NPC extends Entity {
    constructor(x, y, name, type = 'villager') {
        super(x, y, 32, 32, ENTITY_TYPES.NPC);
        
        this.name = name;
        this.npcType = type;
        this.dialogue = [];
        this.currentDialogueIndex = 0;
        this.isInDialogue = false;
        this.interactionRange = 50;
        this.quests = [];
        this.completedQuests = [];
        
        // Dialogue state
        this.dialogueTree = {};
        this.currentDialogueNode = 'start';
        this.dialogueChoices = [];
        
        // NPC behavior
        this.behavior = 'idle'; // idle, patrol, follow
        this.patrolPoints = [];
        this.currentPatrolIndex = 0;
        this.patrolSpeed = 1;
        this.idleTime = 0;
        this.maxIdleTime = 3000;
        
        // Create NPC sprite
        this.createSprite();
        
        // Set up default dialogue and quests
        this.setupDefaultContent();
    }
    
    createSprite() {
        // Create animated sprite for the NPC
        const idleFrames = [COLORS.NPC, '#1976D2', COLORS.NPC, '#1976D2'];
        
        this.sprite = new AnimatedSprite(this.x, this.y, this.width, this.height, idleFrames, 400);
        this.sprite.setAnchor(0.5, 0.5);
        
        // Store animation frames
        this.animations = {
            idle: idleFrames
        };
    }
    
    setupDefaultContent() {
        // Set up default dialogue based on NPC type
        switch (this.npcType) {
            case 'elder':
                this.dialogue = [
                    "Welcome, young adventurer. I am the village elder.",
                    "The island has been cursed for generations. Only by collecting the memory fragments can you lift it.",
                    "Start your journey in the forest to the north. There you will find the first fragment."
                ];
                this.addQuest({
                    id: 'find_memory_fragments',
                    title: 'Memory Fragments',
                    description: 'Find all 5 memory fragments scattered across the island',
                    type: 'main',
                    reward: 'Access to Temple of Shadows'
                });
                break;
                
            case 'merchant':
                this.dialogue = [
                    "Welcome to my shop, traveler!",
                    "I have healing herbs and useful items for your journey.",
                    "Come back anytime you need supplies."
                ];
                break;
                
            case 'guard':
                this.dialogue = [
                    "Halt! Who goes there?",
                    "Ah, you're the new adventurer. The village is safe, but be careful in the wilds.",
                    "I've heard reports of shadow creatures in the forest."
                ];
                break;
                
            case 'wanderer':
                this.dialogue = [
                    "Greetings, fellow traveler.",
                    "I've been exploring these lands for years. The ancient ruins hold many secrets.",
                    "Be careful of the guardians that protect them."
                ];
                this.addQuest({
                    id: 'explore_ruins',
                    title: 'Ancient Secrets',
                    description: 'Explore the ancient ruins and find the hidden memory fragment',
                    type: 'side',
                    reward: 'Experience and items'
                });
                break;
                
            default:
                this.dialogue = [
                    "Hello there!",
                    "How are you doing today?",
                    "Safe travels on your journey!"
                ];
        }
        
        // Set up dialogue tree
        this.setupDialogueTree();
    }
    
    setupDialogueTree() {
        this.dialogueTree = {
            'start': {
                text: this.dialogue[0],
                choices: ['Continue', 'Ask about quests', 'Goodbye'],
                next: ['continue', 'quests', 'end']
            },
            'continue': {
                text: this.dialogue[1] || "That's all I have to say for now.",
                choices: ['Ask about quests', 'Goodbye'],
                next: ['quests', 'end']
            },
            'quests': {
                text: this.getQuestDialogue(),
                choices: ['Accept quest', 'Continue', 'Goodbye'],
                next: ['accept_quest', 'continue', 'end']
            },
            'accept_quest': {
                text: "Excellent! I'll mark that quest in your log.",
                choices: ['Continue', 'Goodbye'],
                next: ['continue', 'end']
            },
            'end': {
                text: "Farewell, adventurer. May your journey be safe.",
                choices: ['Goodbye'],
                next: ['close']
            }
        };
    }
    
    getQuestDialogue() {
        if (this.quests.length === 0) {
            return "I don't have any quests for you at the moment.";
        }
        
        const availableQuests = this.quests.filter(q => !this.completedQuests.includes(q.id));
        if (availableQuests.length === 0) {
            return "You've completed all my quests. Thank you for your help!";
        }
        
        const quest = availableQuests[0];
        return `I have a quest for you: ${quest.title}. ${quest.description}`;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // Update behavior
        this.updateBehavior(deltaTime);
        
        // Update sprite animation
        if (this.sprite && this.sprite.update) {
            this.sprite.update(deltaTime);
        }
    }
    
    updateBehavior(deltaTime) {
        switch (this.behavior) {
            case 'idle':
                this.updateIdle(deltaTime);
                break;
            case 'patrol':
                this.updatePatrol(deltaTime);
                break;
            case 'follow':
                this.updateFollow(deltaTime);
                break;
        }
    }
    
    updateIdle(deltaTime) {
        this.idleTime += deltaTime;
        
        if (this.idleTime > this.maxIdleTime) {
            if (this.patrolPoints.length > 0) {
                this.behavior = 'patrol';
            } else {
                this.idleTime = 0;
            }
        }
        
        this.setVelocity(0, 0);
    }
    
    updatePatrol(deltaTime) {
        if (this.patrolPoints.length === 0) {
            this.behavior = 'idle';
            return;
        }
        
        const targetPoint = this.patrolPoints[this.currentPatrolIndex];
        const distance = Utils.distance(this.x, this.y, targetPoint.x, targetPoint.y);
        
        if (distance < 10) {
            // Reached patrol point, move to next
            this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
            this.behavior = 'idle';
            this.idleTime = 0;
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
    
    updateFollow(deltaTime) {
        // Follow behavior (could be used for escort quests)
        this.setVelocity(0, 0);
    }
    
    canInteractWith(player) {
        if (!player) return false;
        
        const distance = this.getDistanceTo(player);
        return distance <= this.interactionRange;
    }
    
    startDialogue(player) {
        if (!this.canInteractWith(player)) return false;
        
        this.isInDialogue = true;
        this.currentDialogueNode = 'start';
        this.currentDialogueIndex = 0;
        
        return this.getCurrentDialogue();
    }
    
    getCurrentDialogue() {
        const node = this.dialogueTree[this.currentDialogueNode];
        if (!node) return null;
        
        return {
            text: node.text,
            choices: node.choices,
            npcName: this.name
        };
    }
    
    makeDialogueChoice(choiceIndex) {
        const node = this.dialogueTree[this.currentDialogueNode];
        if (!node || choiceIndex >= node.next.length) return null;
        
        const nextNode = node.next[choiceIndex];
        
        if (nextNode === 'close') {
            this.endDialogue();
            return null;
        }
        
        if (nextNode === 'accept_quest') {
            this.acceptQuest();
        }
        
        this.currentDialogueNode = nextNode;
        return this.getCurrentDialogue();
    }
    
    acceptQuest() {
        const availableQuests = this.quests.filter(q => !this.completedQuests.includes(q.id));
        if (availableQuests.length > 0) {
            const quest = availableQuests[0];
            // This will be handled by the game system
            console.log(`Quest accepted: ${quest.title}`);
        }
    }
    
    endDialogue() {
        this.isInDialogue = false;
        this.currentDialogueNode = 'start';
    }
    
    addQuest(quest) {
        if (!this.quests.find(q => q.id === quest.id)) {
            this.quests.push(quest);
        }
    }
    
    completeQuest(questId) {
        if (!this.completedQuests.includes(questId)) {
            this.completedQuests.push(questId);
            console.log(`Quest completed: ${questId}`);
        }
    }
    
    hasQuest(questId) {
        return this.quests.some(q => q.id === questId);
    }
    
    isQuestCompleted(questId) {
        return this.completedQuests.includes(questId);
    }
    
    setPatrolPoints(points) {
        this.patrolPoints = points;
        this.currentPatrolIndex = 0;
    }
    
    setBehavior(behavior) {
        this.behavior = behavior;
        this.idleTime = 0;
    }
    
    // Get NPC information for display
    getInfo() {
        return {
            name: this.name,
            type: this.npcType,
            hasQuests: this.quests.length > 0,
            questsAvailable: this.quests.filter(q => !this.completedQuests.includes(q.id)).length,
            behavior: this.behavior
        };
    }
    
    // Check if NPC has anything important to say
    hasImportantDialogue() {
        const availableQuests = this.quests.filter(q => !this.completedQuests.includes(q.id));
        return availableQuests.length > 0;
    }
    
    // Get a random greeting
    getRandomGreeting() {
        const greetings = [
            "Hello there!",
            "Greetings, traveler!",
            "Welcome!",
            "Good to see you!",
            "How are you doing?"
        ];
        
        return greetings[Utils.randomInt(0, greetings.length - 1)];
    }
    
    // Get a random farewell
    getRandomFarewell() {
        const farewells = [
            "Safe travels!",
            "Farewell!",
            "Come back soon!",
            "Good luck on your journey!",
            "Take care!"
        ];
        
        return farewells[Utils.randomInt(0, farewells.length - 1)];
    }
}
