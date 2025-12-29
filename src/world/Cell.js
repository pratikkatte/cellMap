import * as THREE from 'three';
import { Materials } from '../utils/materials.js';
import { Nucleus } from '../organelles/Nucleus.js';
import { EndoplasmicReticulum } from '../organelles/EndoplasmicReticulum.js';
import { GolgiApparatus } from '../organelles/GolgiApparatus.js';
import { Mitochondria } from '../organelles/Mitochondria.js';
import { Lysosome } from '../organelles/Lysosome.js';
import { Peroxisome } from '../organelles/Peroxisome.js';
import { Ribosome } from '../organelles/Ribosome.js';
import { Vacuole } from '../organelles/Vacuole.js';
import { Centrosome } from '../organelles/Centrosome.js';

export class Cell {
    constructor() {
        this.group = new THREE.Group();
        this.organelles = [];
        this.createCell();
    }
    
    createCell() {
        // Cell membrane (plasma membrane) - large translucent sphere
        const cellRadius = 8;
        const membraneGeometry = new THREE.SphereGeometry(cellRadius, 32, 32);
        const membrane = new THREE.Mesh(membraneGeometry, Materials.cellMembrane);
        this.group.add(membrane);
        
        // Create all organelles
        const nucleus = new Nucleus();
        nucleus.group.position.set(0, 0, 0);
        this.group.add(nucleus.group);
        this.organelles.push(nucleus);
        
        const er = new EndoplasmicReticulum();
        er.group.position.set(0, 1, 0);
        this.group.add(er.group);
        this.organelles.push(er);
        
        const golgi = new GolgiApparatus();
        golgi.group.position.set(3, -1, 2);
        this.group.add(golgi.group);
        this.organelles.push(golgi);
        
        const mitochondria = new Mitochondria();
        this.group.add(mitochondria.group);
        this.organelles.push(mitochondria);
        
        const lysosomes = new Lysosome();
        this.group.add(lysosomes.group);
        this.organelles.push(lysosomes);
        
        const peroxisomes = new Peroxisome();
        this.group.add(peroxisomes.group);
        this.organelles.push(peroxisomes);
        
        const ribosomes = new Ribosome();
        this.group.add(ribosomes.group);
        this.organelles.push(ribosomes);
        
        const vacuole = new Vacuole();
        this.group.add(vacuole.group);
        this.organelles.push(vacuole);
        
        const centrosome = new Centrosome();
        this.group.add(centrosome.group);
        this.organelles.push(centrosome);
    }
    
    update() {
        // Update all organelles
        this.organelles.forEach(organelle => {
            if (organelle.update) {
                organelle.update();
            }
        });
    }
}

