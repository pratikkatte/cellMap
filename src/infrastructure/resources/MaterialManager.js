import * as THREE from 'three';
import { Color } from '../../domain/valueObjects/Color.js';

/**
 * Manages Three.js materials
 */
export class MaterialManager {
    constructor() {
        this.materials = new Map();
        this.initializeDefaultMaterials();
    }

    initializeDefaultMaterials() {
        // Nucleus materials
        this.register('nucleus', new THREE.MeshStandardMaterial({
            color: 0x9b59b6,
            transparent: true,
            opacity: 0.7,
            roughness: 0.5,
            metalness: 0.1
        }));

        this.register('nucleolus', new THREE.MeshStandardMaterial({
            color: 0x7d3c98,
            roughness: 0.3
        }));

        this.register('chromatin', new THREE.MeshStandardMaterial({
            color: 0xb794d4,
            transparent: true,
            opacity: 0.6
        }));

        // ER and Golgi
        this.register('er', new THREE.MeshStandardMaterial({
            color: 0x8e44ad,
            transparent: true,
            opacity: 0.8,
            roughness: 0.4
        }));

        this.register('golgi', new THREE.MeshStandardMaterial({
            color: 0xa569bd,
            transparent: true,
            opacity: 0.8,
            roughness: 0.4
        }));

        // Mitochondria, Lysosomes, Peroxisomes
        this.register('mitochondria', new THREE.MeshStandardMaterial({
            color: 0xe74c3c,
            transparent: true,
            opacity: 0.9,
            roughness: 0.5
        }));

        this.register('lysosome', new THREE.MeshStandardMaterial({
            color: 0xec7063,
            transparent: true,
            opacity: 0.9,
            roughness: 0.6
        }));

        this.register('peroxisome', new THREE.MeshStandardMaterial({
            color: 0xc0392b,
            roughness: 0.5
        }));

        // Centrosome and Microtubules
        this.register('centrosome', new THREE.MeshStandardMaterial({
            color: 0x3498db,
            roughness: 0.3
        }));

        this.register('microtubule', new THREE.MeshStandardMaterial({
            color: 0x5dade2,
            transparent: true,
            opacity: 0.7
        }));

        // Other
        this.register('ribosome', new THREE.MeshStandardMaterial({
            color: 0xc0392b,
            roughness: 0.4
        }));

        this.register('vacuole', new THREE.MeshStandardMaterial({
            color: 0x85c1e9,
            transparent: true,
            opacity: 0.6,
            roughness: 0.5
        }));

        this.register('cellMembrane', new THREE.MeshStandardMaterial({
            color: 0xd7bde2,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide,
            roughness: 0.8
        }));

        this.register('cytoplasm', new THREE.MeshStandardMaterial({
            color: 0xe8d5e8,
            transparent: true,
            opacity: 0.1
        }));
    }

    /**
     * Register a material
     * @param {string} name
     * @param {THREE.Material} material
     */
    register(name, material) {
        this.materials.set(name, material);
    }

    /**
     * Get a material by name
     * @param {string} name
     * @returns {THREE.Material}
     */
    get(name) {
        const material = this.materials.get(name);
        if (!material) {
            throw new Error(`Material ${name} not found`);
        }
        return material.clone();
    }

    /**
     * Create a custom material
     * @param {Object} config
     * @returns {THREE.Material}
     */
    createCustom(config) {
        const color = Color.from(config.color || '#ffffff');
        return new THREE.MeshStandardMaterial({
            color: color.toThreeColor().getHex(),
            transparent: config.transparent || false,
            opacity: config.opacity || 1,
            roughness: config.roughness || 0.5,
            metalness: config.metalness || 0.1
        });
    }
}

