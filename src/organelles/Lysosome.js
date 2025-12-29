import * as THREE from 'three';
import { Materials } from '../utils/materials.js';

export class Lysosome {
    constructor() {
        this.group = new THREE.Group();
        this.createLysosomes();
    }
    
    createLysosomes() {
        const count = 6;
        const baseRadius = 0.3;
        
        for (let i = 0; i < count; i++) {
            const radius = baseRadius + Math.random() * 0.2;
            const geometry = new THREE.SphereGeometry(radius, 12, 12);
            
            // Create granular texture effect with smaller spheres
            const lysosome = new THREE.Group();
            const mainSphere = new THREE.Mesh(geometry, Materials.lysosome);
            lysosome.add(mainSphere);
            
            // Add granular particles inside
            const particleCount = 8;
            const particleGeometry = new THREE.SphereGeometry(radius * 0.2, 6, 6);
            const particleMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.6
            });
            
            for (let j = 0; j < particleCount; j++) {
                const particle = new THREE.Mesh(particleGeometry, particleMaterial);
                const angle1 = Math.random() * Math.PI * 2;
                const angle2 = Math.random() * Math.PI;
                const r = radius * (0.2 + Math.random() * 0.5);
                
                particle.position.set(
                    r * Math.sin(angle2) * Math.cos(angle1),
                    r * Math.sin(angle2) * Math.sin(angle1),
                    r * Math.cos(angle2)
                );
                
                lysosome.add(particle);
            }
            
            // Position around cell
            const angle = (i / count) * Math.PI * 2;
            const distance = 3 + Math.random() * 2;
            lysosome.position.set(
                Math.cos(angle) * distance,
                (Math.random() - 0.5) * 4,
                Math.sin(angle) * distance
            );
            
            this.group.add(lysosome);
        }
    }
    
    update() {
        // Slow rotation
        this.group.children.forEach((child) => {
            child.rotation.x += 0.0005;
            child.rotation.y += 0.0003;
        });
    }
}

