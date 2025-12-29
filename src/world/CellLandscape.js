import * as THREE from 'three';
import { Materials } from '../utils/materials.js';

export class CellLandscape {
    constructor() {
        this.group = new THREE.Group();
        this.cells = [];
        this.entryDistance = 3; // Distance to trigger cell entry
        this.createLandscape();
    }
    
    createLandscape() {
        // Create multiple cells positioned in 3D space
        const cellCount = 8;
        const spacing = 15;
        
        for (let i = 0; i < cellCount; i++) {
            const cell = this.createCell();
            
            // Position cells in a grid/pattern
            const row = Math.floor(i / 3);
            const col = i % 3;
            cell.position.set(
                (col - 1) * spacing + (Math.random() - 0.5) * 5,
                0,
                (row - 1) * spacing + (Math.random() - 0.5) * 5
            );
            
            // Store cell data for proximity checking
            this.cells.push({
                position: cell.position.clone(),
                mesh: cell
            });
            
            this.group.add(cell);
        }
    }
    
    createCell() {
        // Simple cell representation for landscape (just membrane)
        const cellRadius = 2;
        const geometry = new THREE.SphereGeometry(cellRadius, 16, 16);
        
        // Create a clone of the material so we can modify it independently
        const cellMaterial = Materials.cellMembrane.clone();
        cellMaterial.emissive = new THREE.Color(0x000000);
        cellMaterial.emissiveIntensity = 0;
        
        const cell = new THREE.Mesh(geometry, cellMaterial);
        
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
        cell.add(inner);
        
        // Add rotation animation
        cell.userData.rotationSpeed = 0.001 + Math.random() * 0.001;
        
        return cell;
    }
    
    checkProximity(cameraPosition) {
        // Check if camera is close enough to any cell to enter
        for (const cell of this.cells) {
            const distance = cameraPosition.distanceTo(cell.position);
            if (distance < this.entryDistance) {
                return cell;
            }
        }
        return null;
    }
    
    update() {
        // Animate cells
        this.group.children.forEach((cell) => {
            if (cell.userData.rotationSpeed) {
                cell.rotation.y += cell.userData.rotationSpeed;
            }
        });
    }
}

