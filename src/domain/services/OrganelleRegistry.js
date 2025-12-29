import { IOrganelleFactory } from '../interfaces/IOrganelleFactory.js';

/**
 * Registry for organelle factories
 * Allows dynamic registration and creation of organelles
 */
export class OrganelleRegistry {
    constructor() {
        this.factories = new Map();
    }

    /**
     * Register an organelle factory
     * @param {IOrganelleFactory} factory
     */
    register(factory) {
        if (!(factory instanceof IOrganelleFactory)) {
            throw new Error('Factory must implement IOrganelleFactory');
        }
        this.factories.set(factory.getType(), factory);
    }

    /**
     * Unregister an organelle factory
     * @param {string} type
     */
    unregister(type) {
        return this.factories.delete(type);
    }

    /**
     * Create an organelle of the specified type
     * @param {string} type - Organelle type
     * @param {string} id - Unique identifier
     * @param {Object} config - Configuration
     * @returns {Organelle}
     */
    create(type, id, config = {}) {
        const factory = this.factories.get(type);
        if (!factory) {
            throw new Error(`No factory registered for organelle type: ${type}`);
        }
        return factory.create(id, config);
    }

    /**
     * Check if a type is registered
     * @param {string} type
     * @returns {boolean}
     */
    hasType(type) {
        return this.factories.has(type);
    }

    /**
     * Get all registered types
     * @returns {string[]}
     */
    getRegisteredTypes() {
        return Array.from(this.factories.keys());
    }

    /**
     * Clear all registrations
     */
    clear() {
        this.factories.clear();
    }
}

