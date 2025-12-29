import { Organelle } from '../entities/Organelle.js';

/**
 * Interface for organelle factories
 * Implementations create specific organelle types
 */
export class IOrganelleFactory {
    /**
     * Create an organelle instance
     * @param {string} id - Unique identifier
     * @param {Object} config - Configuration object
     * @returns {Organelle}
     */
    create(id, config = {}) {
        throw new Error('create() must be implemented');
    }

    /**
     * Get the organelle type this factory creates
     * @returns {string}
     */
    getType() {
        throw new Error('getType() must be implemented');
    }

    /**
     * Check if this factory can create the given type
     * @param {string} type
     * @returns {boolean}
     */
    canCreate(type) {
        return this.getType() === type;
    }
}

