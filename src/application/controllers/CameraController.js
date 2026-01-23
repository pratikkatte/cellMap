/**
 * Application-level camera controller
 * Coordinates camera management across different modes
 */
export class CameraController {
    constructor(cameraControllers, eventBus) {
        this.cameraControllers = cameraControllers; // Map of mode -> camera controller
        this.currentController = null;
        this.eventBus = eventBus;
    }

    /**
     * Switch camera controller for a mode
     * @param {string} mode - Mode name
     */
    switchMode(mode) {
        const controller = this.cameraControllers[mode];
        if (!controller) {
            console.warn(`No camera controller found for mode: ${mode}`);
            return;
        }

        // Disable current controller
        if (this.currentController && this.currentController.setEnabled) {
            this.currentController.setEnabled(false);
        }

        // Enable new controller
        this.currentController = controller;
        if (this.currentController.setEnabled) {
            this.currentController.setEnabled(true);
        }

        this.eventBus?.publish('camera:mode:changed', { mode, controller });
    }

    /**
     * Get current camera controller
     * @returns {Object|null} Current camera controller
     */
    getCurrentController() {
        return this.currentController;
    }

    /**
     * Register a camera controller for a mode
     * @param {string} mode - Mode name
     * @param {Object} controller - Camera controller
     */
    registerController(mode, controller) {
        this.cameraControllers[mode] = controller;
    }

    /**
     * Update current camera controller
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        if (this.currentController && this.currentController.update) {
            this.currentController.update(deltaTime);
        }
    }
}

