import * as THREE from 'three';
import { Materials } from '../utils/materials.js';

export class Nucleus {
    constructor() {
        this.group = new THREE.Group();
        this.createNucleus();
    }
    
    createNucleus() {
        const radius = 3;
        
        // Outer membrane
        const outerGeometry = new THREE.SphereGeometry(radius, 32, 32);
        const outerMembrane = new THREE.Mesh(outerGeometry, Materials.nucleus);
        this.group.add(outerMembrane);
        
        // Inner membrane (slightly smaller)
        const innerRadius = radius * 0.95;
        const innerGeometry = new THREE.SphereGeometry(innerRadius, 32, 32);
        const innerMembrane = new THREE.Mesh(innerGeometry, Materials.nucleus);
        this.group.add(innerMembrane);
        
        // Nucleolus (dense region)
        const nucleolusRadius = radius * 0.4;
        const nucleolusGeometry = new THREE.SphereGeometry(nucleolusRadius, 16, 16);
        const nucleolus = new THREE.Mesh(nucleolusGeometry, Materials.nucleolus);
        nucleolus.position.set(radius * 0.3, radius * 0.2, 0);
        this.group.add(nucleolus);
        
        // Chromatin (particle system)
        const chromatinCount = 50;
        const chromatinGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        
        for (let i = 0; i < chromatinCount; i++) {
            const chromatin = new THREE.Mesh(chromatinGeometry, Materials.chromatin);
            
            // Random position inside nucleus
            const angle1 = Math.random() * Math.PI * 2;
            const angle2 = Math.random() * Math.PI;
            const r = radius * (0.3 + Math.random() * 0.6);
            
            chromatin.position.set(
                r * Math.sin(angle2) * Math.cos(angle1),
                r * Math.sin(angle2) * Math.sin(angle1),
                r * Math.cos(angle2)
            );
            
            this.group.add(chromatin);
        }
        
        // Add subtle rotation animation
        this.rotationSpeed = 0.0005;
    }
    
    update() {
        this.group.rotation.y += this.rotationSpeed;
    }
}

