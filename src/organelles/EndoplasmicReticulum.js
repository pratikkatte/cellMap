import * as THREE from 'three';
import { Materials } from '../utils/materials.js';

export class EndoplasmicReticulum {
    constructor() {
        this.group = new THREE.Group();
        this.createRER();
        this.createSER();
    }
    
    createRER() {
        // Rough ER - network of interconnected tubes with ribosomes
        const rerGroup = new THREE.Group();
        
        // Create a network of tubes
        const tubeRadius = 0.3;
        const networkPoints = [
            new THREE.Vector3(-2, 1, 0),
            new THREE.Vector3(-1, 2, 1),
            new THREE.Vector3(0, 1.5, 2),
            new THREE.Vector3(1, 2, 1),
            new THREE.Vector3(2, 1, 0),
            new THREE.Vector3(1, 0, -1),
            new THREE.Vector3(0, 0.5, -2),
            new THREE.Vector3(-1, 0, -1)
        ];
        
        // Create tubes connecting the points
        for (let i = 0; i < networkPoints.length; i++) {
            const nextIndex = (i + 1) % networkPoints.length;
            const points = [networkPoints[i], networkPoints[nextIndex]];
            const curve = new THREE.CatmullRomCurve3(points);
            const geometry = new THREE.TubeGeometry(curve, 20, tubeRadius, 8, false);
            const mesh = new THREE.Mesh(geometry, Materials.er);
            rerGroup.add(mesh);
        }
        
        // Add ribosomes (small spheres) on the RER
        const ribosomeGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const ribosomeCount = 30;
        
        for (let i = 0; i < ribosomeCount; i++) {
            const ribosome = new THREE.Mesh(ribosomeGeometry, Materials.ribosome);
            
            // Position along the tubes
            const tubeIndex = Math.floor(Math.random() * networkPoints.length);
            const nextIndex = (tubeIndex + 1) % networkPoints.length;
            const t = Math.random();
            
            const position = new THREE.Vector3().lerpVectors(
                networkPoints[tubeIndex],
                networkPoints[nextIndex],
                t
            );
            
            ribosome.position.copy(position);
            
            // Offset slightly outward from tube
            const direction = new THREE.Vector3().subVectors(
                networkPoints[nextIndex],
                networkPoints[tubeIndex]
            ).normalize();
            const offset = new THREE.Vector3().crossVectors(direction, new THREE.Vector3(0, 1, 0));
            ribosome.position.add(offset.multiplyScalar(tubeRadius + 0.2));
            
            rerGroup.add(ribosome);
        }
        
        this.group.add(rerGroup);
    }
    
    createSER() {
        // Smooth ER - similar network but without ribosomes
        const serGroup = new THREE.Group();
        
        const tubeRadius = 0.25;
        const networkPoints = [
            new THREE.Vector3(2, -1, 1),
            new THREE.Vector3(3, 0, 2),
            new THREE.Vector3(4, -1, 1),
            new THREE.Vector3(3, -2, 0),
            new THREE.Vector3(2, -1, -1),
            new THREE.Vector3(1, 0, 0)
        ];
        
        for (let i = 0; i < networkPoints.length; i++) {
            const nextIndex = (i + 1) % networkPoints.length;
            const points = [networkPoints[i], networkPoints[nextIndex]];
            const curve = new THREE.CatmullRomCurve3(points);
            const geometry = new THREE.TubeGeometry(curve, 20, tubeRadius, 8, false);
            const mesh = new THREE.Mesh(geometry, Materials.er);
            serGroup.add(mesh);
        }
        
        this.group.add(serGroup);
    }
    
    update() {
        // Subtle floating animation
        this.group.children.forEach((child, index) => {
            child.position.y += Math.sin(Date.now() * 0.001 + index) * 0.0001;
        });
    }
}

