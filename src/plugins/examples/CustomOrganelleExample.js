/**
 * Example plugin showing how to add a custom organelle
 * 
 * This demonstrates:
 * 1. Creating a custom organelle factory
 * 2. Registering it with the organelle registry
 * 3. Using the plugin system
 */

import { BaseOrganelleFactory } from '../../domain/entities/organelles/BaseOrganelleFactory.js';
import { Organelle } from '../../domain/entities/Organelle.js';
import * as THREE from 'three';

/**
 * Example: Custom Organelle Factory
 * This creates organelles using the new architecture
 */
class CustomOrganelleFactory extends BaseOrganelleFactory {
    constructor(materialManager) {
        super('customOrganelle', materialManager);
    }

    createGeometry(config) {
        const radius = config.radius || 1;
        return new THREE.SphereGeometry(radius, 16, 16);
    }

    createMaterial(config) {
        return this.materialManager.createCustom({
            color: config.color || '#00ff00',
            transparent: config.transparent || true,
            opacity: config.opacity || 0.8
        });
    }

    create(id, config = {}) {
        const organelle = super.create(id, config);
        
        // Add custom behavior
        organelle.customProperty = config.customProperty || 'default';
        
        return organelle;
    }
}

/**
 * Example Plugin
 * Shows how to create and register a plugin
 */
export const CustomOrganelleExamplePlugin = {
    install(context) {
        const { organelleRegistry, materialManager } = context;

        // Register the custom organelle factory
        const factory = new CustomOrganelleFactory(materialManager);
        organelleRegistry.register(factory);

        console.log('Custom organelle plugin installed!');
    }
};

/**
 * Usage in main.js:
 * 
 * import { CustomOrganelleExamplePlugin } from './plugins/examples/CustomOrganelleExample.js';
 * 
 * pluginManager.register('customOrganelle', CustomOrganelleExamplePlugin);
 * pluginManager.install('customOrganelle', {
 *     organelleRegistry: controller.organelleRegistry,
 *     materialManager: controller.materialManager
 * });
 * 
 * Then you can create cells with custom organelles:
 * 
 * const cell = cellFactory.createFromConfig('myCell', {
 *     organelles: [
 *         {
 *             type: 'customOrganelle',
 *             position: { x: 0, y: 0, z: 0 },
 *             config: {
 *                 radius: 1.5,
 *                 color: '#ff00ff',
 *                 customProperty: 'myValue'
 *             }
 *         }
 *     ]
 * });
 */

