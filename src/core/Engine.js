import { SceneManager } from './SceneManager.js';
import { EventBus } from './EventBus.js';
import { ResourceManager } from './ResourceManager.js';

/**
 * Main application orchestrator
 * Coordinates all core systems and manages the main loop
 */
export class Engine {
    constructor(config = {}) {
        this.config = config;
        this.sceneManager = new SceneManager();
        this.resourceManager = new ResourceManager();
        this.eventBus = new EventBus();
        this.pluginManager = null; // Will be injected
        this.modeManager = null; // Will be injected
        this.renderer = null; // Will be injected from infrastructure
        this.isRunning = false;
        this.lastTime = 0;
    }

    /**
     * Initialize the engine
     */
    async initialize() {
        // Create default scene
        this.sceneManager.createScene('default');
        this.sceneManager.switchScene('default');
        
        // Publish initialization event
        this.eventBus.publish('engine:initialized', { engine: this });
    }

    /**
     * Start the engine main loop
     */
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.loop();
        this.eventBus.publish('engine:started', { engine: this });
    }

    /**
     * Stop the engine
     */
    stop() {
        this.isRunning = false;
        this.eventBus.publish('engine:stopped', { engine: this });
    }

    /**
     * Main game loop
     */
    loop() {
        if (!this.isRunning) return;

        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame(() => this.loop());
    }

    /**
     * Update all systems
     * @param {number} deltaTime - Time since last frame in seconds
     */
    update(deltaTime) {
        // Update mode manager
        if (this.modeManager && this.modeManager.update) {
            this.modeManager.update(deltaTime);
        }
        
        // Update plugins
        if (this.pluginManager && this.pluginManager.update) {
            this.pluginManager.update(deltaTime);
        }
        
        // Publish update event
        this.eventBus.publish('engine:update', { deltaTime, engine: this });
    }

    /**
     * Render the current scene
     */
    render() {
        if (this.renderer && this.sceneManager.getCurrentScene()) {
            const scene = this.sceneManager.getCurrentScene();
            const camera = this.renderer.getCamera ? this.renderer.getCamera() : null;
            
            if (this.renderer.render) {
                this.renderer.render(scene, camera);
            }
        }
    }

    /**
     * Dispose of all resources
     */
    dispose() {
        this.stop();
        
        // Dispose scenes
        const sceneNames = Array.from(this.sceneManager.scenes.keys());
        sceneNames.forEach(name => {
            this.sceneManager.removeScene(name);
        });
        
        // Clear resources
        this.resourceManager.clearCache();
        
        // Clear events
        this.eventBus.clear();
        
        // Publish disposed event
        this.eventBus.publish('engine:disposed', { engine: this });
    }

    // Getters
    getSceneManager() {
        return this.sceneManager;
    }

    getResourceManager() {
        return this.resourceManager;
    }

    getEventBus() {
        return this.eventBus;
    }

    getPluginManager() {
        return this.pluginManager;
    }

    getModeManager() {
        return this.modeManager;
    }

    getRenderer() {
        return this.renderer;
    }

    getConfig() {
        return this.config;
    }

    // Setters
    setRenderer(renderer) {
        this.renderer = renderer;
    }

    setModeManager(modeManager) {
        this.modeManager = modeManager;
    }

    setPluginManager(pluginManager) {
        this.pluginManager = pluginManager;
    }
}

