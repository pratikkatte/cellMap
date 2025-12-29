import * as THREE from 'three';
import { Materials } from '../utils/materials.js';
import { GeometryHelpers } from '../utils/geometry.js';

export class Vacuole {
    constructor() {
        this.group = new THREE.Group();
        this.createVacuole();
    }
    
    createVacuole() {
        // Create irregular shaped vacuole
        const radius = 1.2;
        const geometry = GeometryHelpers.createIrregularShape(radius, 12);
        const vacuole = new THREE.Mesh(geometry, Materials.vacuole);
        
        // Position in cell
        vacuole.position.set(-2, 0, -2);
        vacuole.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        this.group.add(vacuole);
    }
    
    update() {
        // Gentle rotation
        this.group.rotation.y += 0.0002;
    }
}

