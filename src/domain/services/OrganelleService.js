/**
 * Domain service for organelle operations
 */
export class OrganelleService {
    constructor(organelleRegistry, eventBus) {
        this.registry = organelleRegistry;
        this.eventBus = eventBus;
    }

    /**
     * Create an organelle
     * @param {string} type - Organelle type
     * @param {Object} config - Organelle configuration
     * @returns {Organelle} Created organelle
     */
    createOrganelle(type, config = {}) {
        const factory = this.registry.get(type);
        if (!factory) {
            throw new Error(`Organelle type ${type} not found in registry`);
        }
        
        const organelle = factory.create(config);
        this.eventBus.publish('organelle:created', { organelle, type });
        return organelle;
    }

    /**
     * Get available organelle types
     * @returns {Array<string>} Array of organelle type names
     */
    getAvailableTypes() {
        return this.registry.getTypes();
    }

    /**
     * Check if an organelle type exists
     * @param {string} type - Organelle type
     * @returns {boolean} True if type exists
     */
    hasType(type) {
        return this.registry.has(type);
    }
}

