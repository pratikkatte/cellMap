/**
 * Domain service for navigation logic
 * Handles navigation state and transitions
 */
export class NavigationService {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.currentCell = null;
        this.navigationHistory = [];
    }

    /**
     * Enter a cell
     * @param {Cell} cell - Cell to enter
     */
    enterCell(cell) {
        if (this.currentCell) {
            this.navigationHistory.push(this.currentCell);
        }
        this.currentCell = cell;
        this.eventBus.publish('cell:entered', { cell });
    }

    /**
     * Exit current cell
     */
    exitCell() {
        if (this.currentCell) {
            const exitedCell = this.currentCell;
            this.currentCell = null;
            this.eventBus.publish('cell:exited', { cell: exitedCell });
        }
    }

    /**
     * Get current cell
     * @returns {Cell|null} Current cell
     */
    getCurrentCell() {
        return this.currentCell;
    }

    /**
     * Check if inside a cell
     * @returns {boolean} True if inside a cell
     */
    isInsideCell() {
        return this.currentCell !== null;
    }

    /**
     * Go back in navigation history
     * @returns {Cell|null} Previous cell or null
     */
    goBack() {
        if (this.navigationHistory.length > 0) {
            const previousCell = this.navigationHistory.pop();
            this.currentCell = previousCell;
            this.eventBus.publish('cell:entered', { cell: previousCell });
            return previousCell;
        }
        return null;
    }

    /**
     * Clear navigation history
     */
    clearHistory() {
        this.navigationHistory = [];
    }
}

