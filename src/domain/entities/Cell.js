import { Organelle } from './Organelle.js';

/**
 * Cell aggregate root
 * Manages all organelles and cell-level properties
 */
export class Cell {
    constructor(id, radius = 8) {
        this.id = id;
        this.radius = radius;
        this.organelles = new Map();
        this.membrane = null;
        this.cytoplasm = null;
    }

    /**
     * Add an organelle to the cell
     */
    addOrganelle(organelle) {
        if (!(organelle instanceof Organelle)) {
            throw new Error('Organelle must be an instance of Organelle class');
        }
        this.organelles.set(organelle.getId(), organelle);
    }

    /**
     * Remove an organelle from the cell
     */
    removeOrganelle(organelleId) {
        return this.organelles.delete(organelleId);
    }

    /**
     * Get an organelle by ID
     */
    getOrganelle(organelleId) {
        return this.organelles.get(organelleId);
    }

    /**
     * Get all organelles
     */
    getAllOrganelles() {
        return Array.from(this.organelles.values());
    }

    /**
     * Get organelles by type
     */
    getOrganellesByType(type) {
        return this.getAllOrganelles().filter(org => org.getType() === type);
    }

    /**
     * Update all organelles
     */
    update(deltaTime = 0) {
        this.organelles.forEach(organelle => {
            if (organelle.getIsActive()) {
                organelle.update(deltaTime);
            }
        });
    }

    /**
     * Get cell ID
     */
    getId() {
        return this.id;
    }

    /**
     * Get cell radius
     */
    getRadius() {
        return this.radius;
    }

    /**
     * Set cell radius
     */
    setRadius(radius) {
        this.radius = radius;
    }

    /**
     * Set membrane properties
     */
    setMembrane(membrane) {
        this.membrane = membrane;
    }

    /**
     * Set cytoplasm properties
     */
    setCytoplasm(cytoplasm) {
        this.cytoplasm = cytoplasm;
    }
}

