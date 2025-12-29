import * as THREE from 'three';
import { Position } from '../../domain/valueObjects/Position.js';

/**
 * Renders organelles to Three.js objects
 */
export class OrganelleRenderer {
    constructor(materialManager) {
        this.materialManager = materialManager;
    }

    /**
     * Render an organelle entity to a Three.js group
     * @param {Organelle} organelle
     * @returns {THREE.Group}
     */
    render(organelle) {
        const group = new THREE.Group();
        const position = organelle.getPosition();
        group.position.set(position.x, position.y, position.z);
        
        // Store reference to organelle
        group.userData.organelle = organelle;
        group.userData.organelleId = organelle.getId();
        
        return group;
    }

    /**
     * Update organelle visual representation
     * @param {THREE.Group} group
     * @param {Organelle} organelle
     */
    update(group, organelle) {
        const position = organelle.getPosition();
        group.position.set(position.x, position.y, position.z);
    }
}

