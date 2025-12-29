import * as THREE from 'three';
import { Materials } from '../utils/materials.js';

export class Peroxisome {
    constructor() {
        this.group = new THREE.Group();
        this.createPeroxisomes();
    }
    
    createPeroxisomes() {
        const count = 5;
        const baseRadius = 0.25;
        
        for (let i = 0; i < count; i++) {
            const radius = baseRadius + Math.random() * 0.15;
            const geometry = new THREE.SphereGeometry(radius, 12, 12);
            const peroxisome = new THREE.Mesh(geometry, Materials.peroxisome);
            
            // Position around cell
            const angle = (i / count) * Math.PI * 2;
            const distance = 3.5 + Math.random() * 2;
            peroxisome.position.set(
                Math.cos(angle) * distance,
                (Math.random() - 0.5) * 4,
                Math.sin(angle) * distance
            );
            
            this.group.add(peroxisome);
        }
    }
    
    update() {
        // Subtle floating
        this.group.children.forEach((child, index) => {
            child.position.y += Math.sin(Date.now() * 0.001 + index) * 0.0001;
        });
    }
}

