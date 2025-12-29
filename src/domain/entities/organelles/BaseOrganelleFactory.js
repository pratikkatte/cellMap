import { IOrganelleFactory } from '../../interfaces/IOrganelleFactory.js';
import { Organelle } from '../../entities/Organelle.js';
import { Position } from '../../valueObjects/Position.js';

/**
 * Base factory for organelles
 * Subclasses should implement createGeometry and createMaterial methods
 */
export class BaseOrganelleFactory extends IOrganelleFactory {
    constructor(type, materialManager) {
        super();
        this.type = type;
        this.materialManager = materialManager;
    }

    getType() {
        return this.type;
    }

    /**
     * Create an organelle instance
     * @param {string} id
     * @param {Object} config
     * @returns {Organelle}
     */
    create(id, config = {}) {
        const position = Position.from(config.position || { x: 0, y: 0, z: 0 });
        const organelle = new Organelle(id, this.type, position, config);
        
        // Store rendering data
        organelle.renderData = {
            geometry: this.createGeometry(config),
            material: this.createMaterial(config),
            meshes: []
        };
        
        return organelle;
    }

    /**
     * Create geometry for the organelle
     * Override in subclasses
     * @param {Object} config
     * @returns {THREE.BufferGeometry}
     */
    createGeometry(config) {
        throw new Error('createGeometry() must be implemented');
    }

    /**
     * Create material for the organelle
     * Override in subclasses
     * @param {Object} config
     * @returns {THREE.Material}
     */
    createMaterial(config) {
        throw new Error('createMaterial() must be implemented');
    }
}

