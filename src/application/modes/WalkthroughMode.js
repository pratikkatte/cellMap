import { NavigationMode } from './NavigationMode.js';

/**
 * Walkthrough navigation mode (first-person inside cell)
 */
export class WalkthroughMode extends NavigationMode {
    constructor(cameraController, inputHandler) {
        super('walkthrough');
        this.cameraController = cameraController;
        this.inputHandler = inputHandler;
    }

    enter() {
        super.enter();
        // Setup for walkthrough mode
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

