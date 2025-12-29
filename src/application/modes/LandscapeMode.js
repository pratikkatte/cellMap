import { NavigationMode } from './NavigationMode.js';

/**
 * Landscape navigation mode
 */
export class LandscapeMode extends NavigationMode {
    constructor(cameraController, inputHandler) {
        super('landscape');
        this.cameraController = cameraController;
        this.inputHandler = inputHandler;
    }

    enter() {
        super.enter();
        // Setup for landscape mode
        this.cameraController.setEnabled(true);
    }

    exit() {
        super.exit();
    }

    update(deltaTime) {
        if (!this.isActive) return;
        this.cameraController.update(deltaTime);
    }
}

