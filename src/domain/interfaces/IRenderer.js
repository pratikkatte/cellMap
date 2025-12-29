/**
 * Interface for rendering implementations
 * Abstracts rendering from domain logic
 */
export class IRenderer {
    /**
     * Initialize the renderer
     */
    initialize() {
        throw new Error('initialize() must be implemented');
    }

    /**
     * Render a frame
     */
    render() {
        throw new Error('render() must be implemented');
    }

    /**
     * Add an object to the scene
     * @param {Object} object - Object to add
     */
    addToScene(object) {
        throw new Error('addToScene() must be implemented');
    }

    /**
     * Remove an object from the scene
     * @param {Object} object - Object to remove
     */
    removeFromScene(object) {
        throw new Error('removeFromScene() must be implemented');
    }

    /**
     * Clear the scene
     */
    clearScene() {
        throw new Error('clearScene() must be implemented');
    }

    /**
     * Resize the renderer
     * @param {number} width
     * @param {number} height
     */
    resize(width, height) {
        throw new Error('resize() must be implemented');
    }

    /**
     * Dispose of resources
     */
    dispose() {
        throw new Error('dispose() must be implemented');
    }
}

