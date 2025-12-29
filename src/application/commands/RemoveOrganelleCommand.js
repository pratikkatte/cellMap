/**
 * Command to remove an organelle from a cell
 */
export class RemoveOrganelleCommand {
    constructor(cell, organelleId) {
        this.cell = cell;
        this.organelleId = organelleId;
    }

    execute() {
        return this.cell.removeOrganelle(this.organelleId);
    }
}

