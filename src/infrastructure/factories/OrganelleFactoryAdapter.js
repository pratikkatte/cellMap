import { BaseOrganelleFactory } from '../../domain/entities/organelles/BaseOrganelleFactory.js';
import { Organelle } from '../../domain/entities/Organelle.js';
import { Position } from '../../domain/valueObjects/Position.js';
import * as THREE from 'three';

/**
 * Adapter factory that wraps legacy organelle classes
 * This allows gradual migration to the new architecture
 */
export class OrganelleFactoryAdapter extends BaseOrganelleFactory {
    constructor(type, LegacyOrganelleClass, materialManager) {
        super(type, materialManager);
        this.LegacyOrganelleClass = LegacyOrganelleClass;
    }

    create(id, config = {}) {
        const position = Position.from(config.position || { x: 0, y: 0, z: 0 });
        
        // Create legacy organelle instance
        const legacyOrganelle = new this.LegacyOrganelleClass();
        
        // Create domain organelle wrapper
        const organelle = new Organelle(id, this.type, position, config);
        
        // Store legacy organelle reference for rendering
        organelle.legacyInstance = legacyOrganelle;
        organelle.group = legacyOrganelle.group;
        
        // Position the group
        if (organelle.group) {
            organelle.group.position.set(position.x, position.y, position.z);
        }
        
        // Override update to call legacy update
        const originalUpdate = organelle.update.bind(organelle);
        organelle.update = (deltaTime) => {
            if (legacyOrganelle.update) {
                legacyOrganelle.update();
            }
            originalUpdate(deltaTime);
        };
        
        return organelle;
    }

    createGeometry(config) {
        // Not used in adapter pattern
        return null;
    }

    createMaterial(config) {
        // Not used in adapter pattern
        return null;
    }
}

