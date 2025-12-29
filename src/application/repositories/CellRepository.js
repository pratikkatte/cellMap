/**
 * Repository for managing cells
 */
export class CellRepository {
    constructor() {
        this.cells = new Map();
    }

    /**
     * Save a cell
     * @param {Cell} cell
     */
    save(cell) {
        this.cells.set(cell.getId(), cell);
    }

    /**
     * Get a cell by ID
     * @param {string} id
     * @returns {Cell|null}
     */
    getById(id) {
        return this.cells.get(id) || null;
    }

    /**
     * Get all cells
     * @returns {Cell[]}
     */
    getAll() {
        return Array.from(this.cells.values());
    }

    /**
     * Remove a cell
     * @param {string} id
     * @returns {boolean}
     */
    remove(id) {
        return this.cells.delete(id);
    }

    /**
     * Clear all cells
     */
    clear() {
        this.cells.clear();
    }

    /**
     * Check if a cell exists
     * @param {string} id
     * @returns {boolean}
     */
    exists(id) {
        return this.cells.has(id);
    }
}

