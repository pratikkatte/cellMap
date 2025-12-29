import * as THREE from 'three';
import { Materials } from '../utils/materials.js';
import { GeometryHelpers } from '../utils/geometry.js';

export class Mitochondria {
    constructor() {
        this.group = new THREE.Group();
        this.createMitochondria();
    }
    
    createMitochondria() {
        // Create multiple mitochondria
        const count = 4;
        
        for (let i = 0; i < count; i++) {
            const mitochondrion = this.createSingleMitochondrion();
            
            // Position them around the cell
            const angle = (i / count) * Math.PI * 2;
            const radius = 4 + Math.random() * 2;
            mitochondrion.position.set(
                Math.cos(angle) * radius,
                (Math.random() - 0.5) * 3,
                Math.sin(angle) * radius
            );
            
            mitochondrion.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            this.group.add(mitochondrion);
        }
    }
    
    createSingleMitochondrion() {
        const group = new THREE.Group();
        
        // Outer membrane (oval shape)
        const length = 1.5 + Math.random() * 0.5;
        const width = 0.8 + Math.random() * 0.3;
        const outerGeometry = new THREE.SphereGeometry(width, 16, 16);
        outerGeometry.scale(1, length / width, 1);
        const outerMembrane = new THREE.Mesh(outerGeometry, Materials.mitochondria);
        group.add(outerMembrane);
        
        // Inner membrane with cristae (folded)
        const innerWidth = width * 0.9;
        const innerLength = length * 0.95;
        const innerGeometry = new THREE.SphereGeometry(innerWidth, 16, 16);
        innerGeometry.scale(1, innerLength / innerWidth, 1);
        const innerMembrane = new THREE.Mesh(innerGeometry, Materials.mitochondria);
        group.add(innerMembrane);
        
        // Add cristae (folded inner membrane)
        const cristae = GeometryHelpers.createCristae(innerLength * 0.8, innerWidth * 0.6, 6);
        group.add(cristae);
        
        return group;
    }
    
    update() {
        // Gentle floating animation
        this.group.children.forEach((child, index) => {
            child.position.y += Math.sin(Date.now() * 0.001 + index) * 0.0002;
            child.rotation.y += 0.0001;
        });
    }
}

