/**
 * Interface for camera controllers
 * Abstracts camera control from domain logic
 */
export class ICameraController {
    /**
     * Update the camera controller
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime = 0) {
        throw new Error('update() must be implemented');
    }

    /**
     * Get the current camera position
     * @returns {Object} Position object
     */
    getPosition() {
        throw new Error('getPosition() must be implemented');
    }

    /**
     * Set the camera position
     * @param {Object} position - Position object
     */
    setPosition(position) {
        throw new Error('setPosition() must be implemented');
    }

    /**
     * Reset the camera to default position
     */
    reset() {
        throw new Error('reset() must be implemented');
    }

    /**
     * Enable or disable the controller
     * @param {boolean} enabled
     */
    setEnabled(enabled) {
        throw new Error('setEnabled() must be implemented');
    }

    /**
     * Dispose of resources
     */
    dispose() {
        throw new Error('dispose() must be implemented');
    }
}

