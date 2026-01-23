/**
 * Base Entity class with component system
 * Implements Entity-Component-System pattern for flexibility
 */
export class Entity {
    constructor(id, type) {
        this.id = id;
        this.type = type;
        this.components = new Map();
        this.layers = [];
    }

    /**
     * Add a component to the entity
     * @param {Object} component - Component object
     */
    addComponent(component) {
        const type = component.constructor.name;
        this.components.set(type, component);
    }

    /**
     * Get a component by type
     * @param {string} type - Component type name
     * @returns {Object|undefined} Component or undefined
     */
    getComponent(type) {
        return this.components.get(type);
    }

    /**
     * Remove a component
     * @param {string} type - Component type name
     * @returns {boolean} True if component was removed
     */
    removeComponent(type) {
        return this.components.delete(type);
    }

    /**
     * Check if entity has a component
     * @param {string} type - Component type name
     * @returns {boolean} True if component exists
     */
    hasComponent(type) {
        return this.components.has(type);
    }

    /**
     * Add entity to a layer
     * @param {Layer} layer - Layer entity
     */
    addLayer(layer) {
        if (!this.layers.includes(layer)) {
            this.layers.push(layer);
            if (layer.addEntity) {
                layer.addEntity(this);
            }
        }
    }

    /**
     * Remove entity from a layer
     * @param {Layer} layer - Layer entity
     */
    removeLayer(layer) {
        const index = this.layers.indexOf(layer);
        if (index > -1) {
            this.layers.splice(index, 1);
            if (layer.removeEntity) {
                layer.removeEntity(this);
            }
        }
    }

    /**
     * Update the entity and all its components
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        // Update all components
        this.components.forEach(component => {
            if (component.update && typeof component.update === 'function') {
                component.update(deltaTime);
            }
        });
    }

    /**
     * Get entity ID
     * @returns {string} Entity ID
     */
    getId() {
        return this.id;
    }

    /**
     * Get entity type
     * @returns {string} Entity type
     */
    getType() {
        return this.type;
    }
}

