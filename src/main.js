import { CellWorldController } from './presentation/controllers/CellWorldController.js';
import { OrganellePlugin } from './plugins/organelles/OrganellePlugin.js';
import { PluginManager } from './plugins/PluginManager.js';

/**
 * Application entry point
 * Initializes the Cell World application with the new architecture
 */
class CellWorldApplication {
    constructor() {
        this.controller = null;
        this.pluginManager = new PluginManager();
    }

    async initialize() {
        // Get canvas element
        const canvas = document.getElementById('canvas');
        if (!canvas) {
            throw new Error('Canvas element not found');
        }

        // Create main controller
        this.controller = new CellWorldController(canvas);

        // Initialize controller (this sets up all infrastructure)
        await this.controller.initialize();

        // Register and install plugins
        this.pluginManager.register('organelles', OrganellePlugin);
        
        // Install plugins with context
        this.pluginManager.install('organelles', {
            organelleRegistry: this.controller.organelleRegistry,
            materialManager: this.controller.materialManager
        });

        // Start the application
        this.controller.start();
    }
}

// Initialize and start the application
const app = new CellWorldApplication();
app.initialize().catch(error => {
    console.error('Failed to initialize application:', error);
});
