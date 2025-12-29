/**
 * Base class for navigation modes
 */
export class NavigationMode {
    constructor(name) {
        this.name = name;
        this.isActive = false;
    }

    /**
     * Enter this mode
     */
    enter() {
        this.isActive = true;
    }

    /**
     * Exit this mode
     */
    exit() {
        this.isActive = false;
    }

    /**
     * Update the mode
     * @param {number} deltaTime
     */
    update(deltaTime) {
        // Override in subclasses
    }

    /**
     * Get mode name
     */
    getName() {
        return this.name;
    }

    /**
     * Check if mode is active
     */
    isActive() {
        return this.isActive;
    }
}

