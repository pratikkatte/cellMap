/**
 * Base class for all organelles
 * Implements the Organelle interface and provides common functionality
 */
export class Organelle {
    constructor(id, type, position, config = {}) {
        this.id = id;
        this.type = type;
        this.position = position;
        this.config = config;
        this.isActive = true;
        this.animationState = {};
    }

    /**
     * Get the unique identifier of this organelle
     */
    getId() {
        return this.id;
    }

    /**
     * Get the type of this organelle
     */
    getType() {
        return this.type;
    }

    /**
     * Get the position of this organelle
     */
    getPosition() {
        return this.position;
    }

    /**
     * Set the position of this organelle
     */
    setPosition(position) {
        this.position = position;
    }

    /**
     * Check if the organelle is active
     */
    getIsActive() {
        return this.isActive;
    }

    /**
     * Set the active state
     */
    setActive(active) {
        this.isActive = active;
    }

    /**
     * Update the organelle's state (for animations, etc.)
     * Override in subclasses
     */
    update(deltaTime = 0) {
        // Default implementation - override in subclasses
    }

    /**
     * Get configuration
     */
    getConfig() {
        return this.config;
    }

    /**
     * Set configuration
     */
    setConfig(config) {
        this.config = { ...this.config, ...config };
    }
}

