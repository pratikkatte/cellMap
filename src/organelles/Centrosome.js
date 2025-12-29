import * as THREE from 'three';
import { Materials } from '../utils/materials.js';

export class Centrosome {
    constructor() {
        this.group = new THREE.Group();
        this.createCentrosome();
    }
    
    createCentrosome() {
        // Two perpendicular centrioles (cylinders)
        const centrioleLength = 0.8;
        const centrioleRadius = 0.15;
        const geometry = new THREE.CylinderGeometry(centrioleRadius, centrioleRadius, centrioleLength, 8);
        
        // First centriole
        const centriole1 = new THREE.Mesh(geometry, Materials.centrosome);
        centriole1.rotation.z = Math.PI / 2;
        this.group.add(centriole1);
        
        // Second centriole (perpendicular)
        const centriole2 = new THREE.Mesh(geometry, Materials.centrosome);
        centriole2.rotation.x = Math.PI / 2;
        centriole2.position.y = 0.1;
        this.group.add(centriole2);
        
        // Microtubules radiating outward
        const microtubuleCount = 12;
        const microtubuleLength = 2;
        const microtubuleGeometry = new THREE.CylinderGeometry(0.05, 0.05, microtubuleLength, 6);
        
        for (let i = 0; i < microtubuleCount; i++) {
            const angle = (i / microtubuleCount) * Math.PI * 2;
            const microtubule = new THREE.Mesh(microtubuleGeometry, Materials.microtubule);
            
            // Position and rotate to radiate outward
            microtubule.position.set(
                Math.cos(angle) * microtubuleLength / 2,
                Math.sin(angle * 2) * 0.3,
                Math.sin(angle) * microtubuleLength / 2
            );
            
            microtubule.rotation.set(
                Math.PI / 2 - Math.sin(angle * 2) * 0.2,
                angle,
                0
            );
            
            this.group.add(microtubule);
        }
        
        // Position centrosome
        this.group.position.set(-3, -2, -1);
    }
    
    update() {
        // Slow rotation
        this.group.rotation.y += 0.0003;
    }
}

