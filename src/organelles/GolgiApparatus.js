import * as THREE from 'three';
import { Materials } from '../utils/materials.js';

export class GolgiApparatus {
    constructor() {
        this.group = new THREE.Group();
        this.createGolgi();
    }
    
    createGolgi() {
        // Stack of flattened, curved sacs (cisternae)
        const stackCount = 5;
        const baseRadius = 1.5;
        const stackSpacing = 0.3;
        
        for (let i = 0; i < stackCount; i++) {
            // Create curved cisterna
            const shape = new THREE.Shape();
            const radius = baseRadius * (1 - i * 0.1); // Slightly smaller as we go up
            
            // Create curved shape
            shape.moveTo(-radius, 0);
            shape.quadraticCurveTo(0, -radius * 0.5, radius, 0);
            shape.quadraticCurveTo(0, radius * 0.5, -radius, 0);
            
            const extrudeSettings = {
                depth: 0.2,
                bevelEnabled: true,
                bevelThickness: 0.05,
                bevelSize: 0.05,
                bevelSegments: 3
            };
            
            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            const mesh = new THREE.Mesh(geometry, Materials.golgi);
            
            // Position in stack
            mesh.position.y = i * stackSpacing;
            mesh.rotation.x = Math.PI / 2;
            mesh.rotation.z = Math.PI / 4;
            
            this.group.add(mesh);
        }
        
        // Add vesicles budding off
        const vesicleGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const vesicleCount = 8;
        
        for (let i = 0; i < vesicleCount; i++) {
            const vesicle = new THREE.Mesh(vesicleGeometry, Materials.golgi);
            const angle = (i / vesicleCount) * Math.PI * 2;
            vesicle.position.set(
                Math.cos(angle) * (baseRadius + 0.5),
                Math.random() * stackCount * stackSpacing,
                Math.sin(angle) * (baseRadius + 0.5)
            );
            this.group.add(vesicle);
        }
        
        this.rotationSpeed = 0.0003;
    }
    
    update() {
        this.group.rotation.y += this.rotationSpeed;
    }
}

