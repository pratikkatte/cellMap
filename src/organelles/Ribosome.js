import * as THREE from 'three';
import { Materials } from '../utils/materials.js';

export class Ribosome {
    constructor() {
        this.group = new THREE.Group();
        this.createFreeRibosomes();
    }
    
    createFreeRibosomes() {
        // Free-floating ribosomes in cytoplasm
        const count = 40;
        const radius = 0.1;
        const geometry = new THREE.SphereGeometry(radius, 6, 6);
        
        for (let i = 0; i < count; i++) {
            const ribosome = new THREE.Mesh(geometry, Materials.ribosome);
            
            // Random position in cell (avoiding center where nucleus is)
            const angle1 = Math.random() * Math.PI * 2;
            const angle2 = Math.random() * Math.PI;
            const r = 2 + Math.random() * 4; // Outside nucleus area
            
            ribosome.position.set(
                r * Math.sin(angle2) * Math.cos(angle1),
                r * Math.sin(angle2) * Math.sin(angle1),
                r * Math.cos(angle2)
            );
            
            this.group.add(ribosome);
        }
    }
    
    update() {
        // Very slow drift
        this.group.children.forEach((child) => {
            child.rotation.x += 0.001;
            child.rotation.y += 0.001;
        });
    }
}

