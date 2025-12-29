import { Cell } from './Cell.js';

/**
 * Landscape aggregate root
 * Manages the world outside cells
 */
export class Landscape {
    constructor(id) {
        this.id = id;
        this.cells = new Map();
        this.environment = {
            ground: null,
            atmosphere: null,
            lighting: []
        };
    }

    /**
     * Add a cell to the landscape
     */
    addCell(cell) {
        if (!(cell instanceof Cell)) {
            throw new Error('Cell must be an instance of Cell class');
        }
        this.cells.set(cell.getId(), cell);
    }

    /**
     * Remove a cell from the landscape
     */
    removeCell(cellId) {
        return this.cells.delete(cellId);
    }

    /**
     * Get a cell by ID
     */
    getCell(cellId) {
        return this.cells.get(cellId);
    }

    /**
     * Get all cells
     */
    getAllCells() {
        return Array.from(this.cells.values());
    }

    /**
     * Find cells near a position
     */
    findCellsNearPosition(position, radius) {
        return this.getAllCells().filter(cell => {
            // Assuming cells have position - we'll need to track this
            const cellPosition = cell.position || { x: 0, y: 0, z: 0 };
            const distance = Math.sqrt(
                Math.pow(cellPosition.x - position.x, 2) +
                Math.pow(cellPosition.y - position.y, 2) +
                Math.pow(cellPosition.z - position.z, 2)
            );
            return distance <= radius;
        });
    }

    /**
     * Update landscape
     */
    update(deltaTime = 0) {
        this.cells.forEach(cell => {
            cell.update(deltaTime);
        });
    }

    /**
     * Set environment properties
     */
    setEnvironment(environment) {
        this.environment = { ...this.environment, ...environment };
    }
}

