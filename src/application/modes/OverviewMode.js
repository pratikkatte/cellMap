import { NavigationMode } from './NavigationMode.js';

/**
 * Overview navigation mode (orbital camera around cell)
 */
export class OverviewMode extends NavigationMode {
    constructor(cameraController, inputHandler) {
        super('overview');
        this.cameraController = cameraController;
        this.inputHandler = inputHandler;
    }

    enter() {
        super.enter();
        // Setup for overview mode
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

