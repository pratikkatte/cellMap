import { LandscapeMode } from './LandscapeMode.js';
import { WalkthroughMode } from './WalkthroughMode.js';
import { OverviewMode } from './OverviewMode.js';

/**
 * Manages navigation modes and transitions
 */
export class ModeManager {
    constructor(cameraController, inputHandler) {
        this.modes = new Map();
        this.currentMode = null;
        
        // Create default modes
        this.modes.set('landscape', new LandscapeMode(cameraController, inputHandler));
        this.modes.set('walkthrough', new WalkthroughMode(cameraController, inputHandler));
        this.modes.set('overview', new OverviewMode(cameraController, inputHandler));
    }

    /**
     * Register a custom mode
     * @param {string} name
     * @param {NavigationMode} mode
     */
    registerMode(name, mode) {
        this.modes.set(name, mode);
    }

    /**
     * Switch to a mode
     * @param {string} modeName
     */
    switchTo(modeName) {
        if (!this.modes.has(modeName)) {
            throw new Error(`Mode ${modeName} not found`);
        }

        // Exit current mode
        if (this.currentMode) {
            this.currentMode.exit();
        }

        // Enter new mode
        this.currentMode = this.modes.get(modeName);
        this.currentMode.enter();

        return this.currentMode;
    }

    /**
     * Get current mode
     * @returns {NavigationMode|null}
     */
    getCurrentMode() {
        return this.currentMode;
    }

    /**
     * Get current mode name
     * @returns {string|null}
     */
    getCurrentModeName() {
        return this.currentMode ? this.currentMode.getName() : null;
    }

    /**
     * Update current mode
     * @param {number} deltaTime
     */
    update(deltaTime) {
        if (this.currentMode) {
            this.currentMode.update(deltaTime);
        }
    }
}

