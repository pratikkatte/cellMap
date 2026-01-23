import { Engine } from './core/Engine.js';
import { ThreeRenderer } from './infrastructure/rendering/ThreeRenderer.js';
import { ModeManager } from './application/modes/ModeManager.js';
import { FirstPersonCameraController } from './infrastructure/rendering/FirstPersonCameraController.js';
import { OrbitalCameraController } from './infrastructure/rendering/OrbitalCameraController.js';
import { InputHandler } from './infrastructure/input/InputHandler.js';
import { Position } from './domain/valueObjects/Position.js';
import { OrganellePlugin } from './plugins/organelles/OrganellePlugin.js';
import { PluginManager } from './plugins/PluginManager.js';
import { CellWorldController } from './presentation/controllers/CellWorldController.js';
import appConfig from './config/app.config.js';

/**
 * Application entry point using Engine architecture
 * Implements the architecture from architecture_old.md
 */
class CellWorldApplication {
    constructor() {
        this.engine = new Engine(appConfig);
        this.renderer = null;
        this.controller = null;
    }

    async initialize() {
        const canvas = document.getElementById('canvas');
        if (!canvas) {
            throw new Error('Canvas element not found');
        }

        // Initialize engine
        await this.engine.initialize();

        // Set up plugin manager
        const pluginManager = new PluginManager();
        await pluginManager.initialize(this.engine);
        this.engine.setPluginManager(pluginManager);

        // Set up renderer
        this.renderer = new ThreeRenderer(canvas);
        this.renderer.initialize();
        
        // Connect renderer to engine's scene manager
        // The renderer will use the scene from SceneManager
        const defaultScene = this.engine.getSceneManager().getCurrentScene();
        if (defaultScene) {
            this.renderer.setScene(defaultScene);
        }
        
        this.engine.setRenderer(this.renderer);

        // Set up input handler
        const inputHandler = new InputHandler();
        inputHandler.initialize();

        // Set up camera controllers
        const camera = this.renderer.getCamera();
        const firstPersonCameraController = new FirstPersonCameraController(camera);
        const orbitalCameraController = new OrbitalCameraController(
            camera,
            new Position(0, 0, 0)
        );

        // Set up mode manager
        const modeManager = new ModeManager(orbitalCameraController, inputHandler);
        this.engine.setModeManager(modeManager);

        // Create controller for application logic
        // This bridges the Engine architecture with existing controller logic
        this.controller = new CellWorldController(canvas, appConfig);
        await this.controller.initialize();
        
        // Connect controller to engine systems
        this.controller.engine = this.engine;
        this.controller.eventBus = this.engine.getEventBus();
        this.controller.sceneManager = this.engine.getSceneManager();

        // Register and install plugins
        pluginManager.register('organelles', OrganellePlugin);
        await pluginManager.install('organelles', {
            engine: this.engine,
            organelleRegistry: this.controller.organelleRegistry,
            materialManager: this.controller.materialManager
        });

        // Set up event listeners
        this.setupEventListeners();

        // Start engine (this will start the main loop)
        this.engine.start();
        
        // Also start controller for compatibility
        this.controller.start();
    }

    setupEventListeners() {
        const eventBus = this.engine.getEventBus();
        
        eventBus.subscribe('cell:entered', (data) => {
            console.log('Cell entered:', data);
        });

        eventBus.subscribe('cell:exited', (data) => {
            console.log('Cell exited:', data);
        });

        eventBus.subscribe('mode:changed', (data) => {
            console.log('Mode changed:', data);
        });

        eventBus.subscribe('organelle:selected', (data) => {
            console.log('Organelle selected:', data);
        });

        eventBus.subscribe('layer:activated', (data) => {
            console.log('Layer activated:', data);
        });

        eventBus.subscribe('zoom:changed', (data) => {
            console.log('Zoom changed:', data);
        });
    }
}

// Initialize and start the application
const app = new CellWorldApplication();
app.initialize().catch(error => {
    console.error('Failed to initialize application:', error);
});
