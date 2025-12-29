/**
 * Layer abstraction for different detail levels
 * Manages entities at different levels of detail (molecular, organelle, cellular, etc.)
 */
export class Layer {
    constructor(id, name, config = {}) {
        this.id = id;
        this.name = name;
        this.config = config;
        this.active = false;
        this.entities = [];
        this.visualizer = null;
    }

    /**
     * Activate the layer
     */
    activate() {
        if (this.active) return;
        
        this.active = true;
        this.entities.forEach(entity => {
            if (entity.setActive) {
                entity.setActive(true);
            }
        });
    }

    /**
     * Deactivate the layer
     */
    deactivate() {
        if (!this.active) return;
        
        this.active = false;
        this.entities.forEach(entity => {
            if (entity.setActive) {
                entity.setActive(false);
            }
        });
    }

    /**
     * Add an entity to the layer
     * @param {Entity} entity - Entity to add
     */
    addEntity(entity) {
        if (!this.entities.includes(entity)) {
            this.entities.push(entity);
            if (entity.addLayer) {
                entity.addLayer(this);
            }
        }
    }

    /**
     * Remove an entity from the layer
     * @param {Entity} entity - Entity to remove
     */
    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
            if (entity.removeLayer) {
                entity.removeLayer(this);
            }
        }
    }

    /**
     * Update all entities in the layer
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        if (!this.active) return;
        
        this.entities.forEach(entity => {
            if (entity.update) {
                entity.update(deltaTime);
            }
        });
    }

    /**
     * Get layer ID
     * @returns {string} Layer ID
     */
    getId() {
        return this.id;
    }

    /**
     * Get layer name
     * @returns {string} Layer name
     */
    getName() {
        return this.name;
    }

    /**
     * Get all entities in the layer
     * @returns {Array<Entity>} Array of entities
     */
    getEntities() {
        return this.entities;
    }

    /**
     * Set the visualizer for this layer
     * @param {Object} visualizer - Visualizer object
     */
    setVisualizer(visualizer) {
        this.visualizer = visualizer;
    }

    /**
     * Get the visualizer
     * @returns {Object|null} Visualizer or null
     */
    getVisualizer() {
        return this.visualizer;
    }

    /**
     * Check if layer is active
     * @returns {boolean} True if active
     */
    isActive() {
        return this.active;
    }
}

