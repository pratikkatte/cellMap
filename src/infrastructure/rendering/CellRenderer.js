import * as THREE from 'three';
import { OrganelleRenderer } from './OrganelleRenderer.js';

/**
 * Renders cells to Three.js objects
 */
export class CellRenderer {
    constructor(materialManager) {
        this.materialManager = materialManager;
        this.organelleRenderer = new OrganelleRenderer(materialManager);
    }

    /**
     * Render a cell entity to a Three.js group
     * @param {Cell} cell
     * @returns {THREE.Group}
     */
    render(cell) {
        const group = new THREE.Group();
        
        // Render cell membrane
        const cellRadius = cell.getRadius();
        const membraneGeometry = new THREE.SphereGeometry(cellRadius, 32, 32);
        const membraneMaterial = this.materialManager.get('cellMembrane');
        const membrane = new THREE.Mesh(membraneGeometry, membraneMaterial);
        group.add(membrane);
        
        // Render all organelles
        cell.getAllOrganelles().forEach(organelle => {
            // If organelle has legacy instance (from adapter), use its group directly
            if (organelle.legacyInstance && organelle.group) {
                // Clone the group to avoid issues with multiple cells
                const organelleGroup = organelle.group.clone();
                const position = organelle.getPosition();
                organelleGroup.position.set(position.x, position.y, position.z);
                organelleGroup.userData.organelle = organelle;
                organelleGroup.userData.organelleId = organelle.getId();
                group.add(organelleGroup);
            } else {
                // Use renderer for new-style organelles
                const organelleGroup = this.organelleRenderer.render(organelle);
                group.add(organelleGroup);
            }
        });
        
        // Store reference to cell
        group.userData.cell = cell;
        group.userData.cellId = cell.getId();
        
        return group;
    }

    /**
     * Update cell visual representation
     * @param {THREE.Group} group
     * @param {Cell} cell
     */
    update(group, cell) {
        // Update organelles
        cell.getAllOrganelles().forEach(organelle => {
            const organelleGroup = group.children.find(
                child => child.userData.organelleId === organelle.getId()
            );
            if (organelleGroup) {
                this.organelleRenderer.update(organelleGroup, organelle);
            }
        });
    }
}

