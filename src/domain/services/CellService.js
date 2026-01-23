/**
 * Domain service for cell business logic
 * Handles cell operations and publishes domain events
 */
export class CellService {
    constructor(cellRepository, eventBus) {
        this.repository = cellRepository;
        this.eventBus = eventBus;
    }

    /**
     * Create a new cell
     * @param {Object} config - Cell configuration
     * @returns {Cell} Created cell
     */
    createCell(config) {
        const cell = this.repository.create(config);
        this.eventBus.publish('cell:created', { cell });
        return cell;
    }

    /**
     * Get a cell by ID
     * @param {string} id - Cell ID
     * @returns {Cell} Cell entity
     */
    getCell(id) {
        return this.repository.findById(id);
    }

    /**
     * Update a cell
     * @param {Cell} cell - Cell entity
     */
    updateCell(cell) {
        this.repository.save(cell);
        this.eventBus.publish('cell:updated', { cell });
    }

    /**
     * Add an organelle to a cell
     * @param {string} cellId - Cell ID
     * @param {Organelle} organelle - Organelle entity
     */
    addOrganelle(cellId, organelle) {
        const cell = this.repository.findById(cellId);
        if (!cell) {
            throw new Error(`Cell ${cellId} not found`);
        }
        cell.addOrganelle(organelle);
        this.repository.save(cell);
        this.eventBus.publish('organelle:added', { cellId, organelle });
    }

    /**
     * Remove an organelle from a cell
     * @param {string} cellId - Cell ID
     * @param {string} organelleId - Organelle ID
     */
    removeOrganelle(cellId, organelleId) {
        const cell = this.repository.findById(cellId);
        if (!cell) {
            throw new Error(`Cell ${cellId} not found`);
        }
        const removed = cell.removeOrganelle(organelleId);
        if (removed) {
            this.repository.save(cell);
            this.eventBus.publish('organelle:removed', { cellId, organelleId });
        }
        return removed;
    }

    /**
     * Get all cells
     * @returns {Array<Cell>} Array of cells
     */
    getAllCells() {
        return this.repository.findAll();
    }
}

