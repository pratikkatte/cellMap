/**
 * Command to add an organelle to a cell
 */
export class AddOrganelleCommand {
    constructor(cell, organelleRegistry, organelleType, organelleId, config = {}) {
        this.cell = cell;
        this.organelleRegistry = organelleRegistry;
        this.organelleType = organelleType;
        this.organelleId = organelleId;
        this.config = config;
    }

    execute() {
        const organelle = this.organelleRegistry.create(
            this.organelleType,
            this.organelleId,
            this.config
        );
        this.cell.addOrganelle(organelle);
        return organelle;
    }
}

