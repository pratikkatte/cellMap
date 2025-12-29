/**
 * Command to create a new cell
 */
export class CreateCellCommand {
    constructor(cellFactory, cellId, config = {}) {
        this.cellFactory = cellFactory;
        this.cellId = cellId;
        this.config = config;
    }

    execute() {
        return this.cellFactory.createDefaultCell(this.cellId, this.config);
    }
}

