import { Cell } from '../entities/Cell.js';
import { Position } from '../valueObjects/Position.js';

/**
 * Factory for creating cells with organelles
 */
export class CellFactory {
    constructor(organelleRegistry) {
        this.organelleRegistry = organelleRegistry;
    }

    /**
     * Create a cell with default organelles
     * @param {string} id - Cell ID
     * @param {Object} config - Cell configuration
     * @returns {Cell}
     */
    createDefaultCell(id, config = {}) {
        const cell = new Cell(id, config.radius || 8);
        
        // Default organelles configuration
        const defaultOrganelles = config.organelles || [
            { type: 'nucleus', position: { x: 0, y: 0, z: 0 } },
            { type: 'endoplasmicReticulum', position: { x: 0, y: 1, z: 0 } },
            { type: 'golgiApparatus', position: { x: 3, y: -1, z: 2 } },
            { type: 'mitochondria', position: { x: -2, y: 0, z: 1 } },
            { type: 'lysosome', position: { x: 1, y: -1, z: -1 } },
            { type: 'peroxisome', position: { x: -1, y: 1, z: -2 } },
            { type: 'ribosome', position: { x: 2, y: 0, z: -1 } },
            { type: 'vacuole', position: { x: -2, y: -1, z: -2 } },
            { type: 'centrosome', position: { x: 0, y: -2, z: 0 } }
        ];

        defaultOrganelles.forEach((orgConfig, index) => {
            if (this.organelleRegistry.hasType(orgConfig.type)) {
                const organelleId = `${id}_${orgConfig.type}_${index}`;
                const position = Position.from(orgConfig.position);
                const organelle = this.organelleRegistry.create(
                    orgConfig.type,
                    organelleId,
                    { ...orgConfig.config, position }
                );
                cell.addOrganelle(organelle);
            }
        });

        return cell;
    }

    /**
     * Create a cell from configuration
     * @param {string} id - Cell ID
     * @param {Object} config - Full cell configuration
     * @returns {Cell}
     */
    createFromConfig(id, config) {
        const cell = new Cell(id, config.radius || 8);

        if (config.organelles && Array.isArray(config.organelles)) {
            config.organelles.forEach((orgConfig, index) => {
                if (this.organelleRegistry.hasType(orgConfig.type)) {
                    const organelleId = orgConfig.id || `${id}_${orgConfig.type}_${index}`;
                    const position = Position.from(orgConfig.position || { x: 0, y: 0, z: 0 });
                    const organelle = this.organelleRegistry.create(
                        orgConfig.type,
                        organelleId,
                        { ...orgConfig.config, position }
                    );
                    cell.addOrganelle(organelle);
                }
            });
        }

        return cell;
    }
}

