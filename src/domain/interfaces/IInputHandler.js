/**
 * Interface for input handlers
 * Abstracts input handling from domain logic
 */
export class IInputHandler {
    /**
     * Initialize the input handler
     */
    initialize() {
        throw new Error('initialize() must be implemented');
    }

    /**
     * Update the input handler
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime = 0) {
        throw new Error('update() must be implemented');
    }

    /**
     * Check if a key is currently pressed
     * @param {string} key - Key identifier
     * @returns {boolean}
     */
    isKeyPressed(key) {
        throw new Error('isKeyPressed() must be implemented');
    }

    /**
     * Get mouse position
     * @returns {Object} {x, y}
     */
    getMousePosition() {
        throw new Error('getMousePosition() must be implemented');
    }

    /**
     * Check if mouse button is pressed
     * @param {number} button - Button number (0=left, 1=middle, 2=right)
     * @returns {boolean}
     */
    isMouseButtonPressed(button) {
        throw new Error('isMouseButtonPressed() must be implemented');
    }

    /**
     * Register a callback for an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    on(event, callback) {
        throw new Error('on() must be implemented');
    }

    /**
     * Unregister a callback
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    off(event, callback) {
        throw new Error('off() must be implemented');
    }

    /**
     * Dispose of resources
     */
    dispose() {
        throw new Error('dispose() must be implemented');
    }
}

