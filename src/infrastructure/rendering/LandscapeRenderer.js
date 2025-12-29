import * as THREE from 'three';

/**
 * Renders landscape cells (simplified representation)
 */
export class LandscapeRenderer {
    constructor(materialManager) {
        this.materialManager = materialManager;
    }

    /**
     * Render a landscape cell (just membrane for landscape view)
     * @param {Cell} cell
     * @param {Object} position
     * @returns {THREE.Mesh}
     */
    renderLandscapeCell(cell, position) {
        const cellRadius = cell.getRadius();
        const geometry = new THREE.SphereGeometry(cellRadius, 16, 16);
        
        // Create a clone of the material so we can modify it independently
        const cellMaterial = this.materialManager.get('cellMembrane');
        cellMaterial.emissive = new THREE.Color(0x000000);
        cellMaterial.emissiveIntensity = 0;
        
        const cellMesh = new THREE.Mesh(geometry, cellMaterial);
        cellMesh.position.set(position.x, position.y, position.z);
        
        // Add subtle glow effect (inner sphere)
        const innerGeometry = new THREE.SphereGeometry(cellRadius * 0.95, 16, 16);
        const innerMaterial = new THREE.MeshStandardMaterial({
            color: 0xd7bde2,
            transparent: true,
            opacity: 0.3,
            emissive: 0xd7bde2,
            emissiveIntensity: 0.2
        });
        const inner = new THREE.Mesh(innerGeometry, innerMaterial);
        cellMesh.add(inner);
        
        // Add rotation animation
        cellMesh.userData.rotationSpeed = 0.001 + Math.random() * 0.001;
        cellMesh.userData.cell = cell;
        cellMesh.userData.cellId = cell.getId();
        
        return cellMesh;
    }

    /**
     * Update landscape cell animation
     * @param {THREE.Mesh} cellMesh
     */
    update(cellMesh) {
        if (cellMesh.userData.rotationSpeed) {
            cellMesh.rotation.y += cellMesh.userData.rotationSpeed;
        }
    }
}

