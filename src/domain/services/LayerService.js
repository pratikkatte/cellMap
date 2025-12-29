import { Layer } from '../entities/Layer.js';

/**
 * Domain service for layer management
 * Handles layer registration, activation, and deactivation
 */
export class LayerService {
    constructor(eventBus) {
        this.layers = new Map();
        this.eventBus = eventBus;
    }

    /**
     * Register a layer
     * @param {Layer} layer - Layer entity
     */
    registerLayer(layer) {
        if (!(layer instanceof Layer)) {
            throw new Error('Layer must be an instance of Layer class');
        }
        this.layers.set(layer.id, layer);
        this.eventBus.publish('layer:registered', { layer });
    }

    /**
     * Activate a layer
     * @param {string} layerId - Layer ID
     */
    activateLayer(layerId) {
        const layer = this.layers.get(layerId);
        if (!layer) {
            throw new Error(`Layer ${layerId} not found`);
        }
        layer.activate();
        this.eventBus.publish('layer:activated', { layerId, layer });
    }

    /**
     * Deactivate a layer
     * @param {string} layerId - Layer ID
     */
    deactivateLayer(layerId) {
        const layer = this.layers.get(layerId);
        if (!layer) {
            throw new Error(`Layer ${layerId} not found`);
        }
        layer.deactivate();
        this.eventBus.publish('layer:deactivated', { layerId, layer });
    }

    /**
     * Get a layer by ID
     * @param {string} layerId - Layer ID
     * @returns {Layer|undefined} Layer entity
     */
    getLayer(layerId) {
        return this.layers.get(layerId);
    }

    /**
     * Get all active layers
     * @returns {Array<Layer>} Array of active layers
     */
    getActiveLayers() {
        return Array.from(this.layers.values()).filter(layer => layer.active);
    }

    /**
     * Get all layers
     * @returns {Array<Layer>} Array of all layers
     */
    getAllLayers() {
        return Array.from(this.layers.values());
    }

    /**
     * Check if a layer exists
     * @param {string} layerId - Layer ID
     * @returns {boolean} True if layer exists
     */
    hasLayer(layerId) {
        return this.layers.has(layerId);
    }
}

