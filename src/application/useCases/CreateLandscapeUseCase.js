import { Landscape } from '../../domain/entities/Landscape.js';
import { CreateCellCommand } from '../commands/CreateCellCommand.js';

/**
 * Use case for creating a landscape
 */
export class CreateLandscapeUseCase {
    constructor(cellFactory, organelleRegistry) {
        this.cellFactory = cellFactory;
        this.organelleRegistry = organelleRegistry;
    }

    /**
     * Execute the use case
     * @param {Object} config - Configuration for landscape
     * @returns {Landscape}
     */
    execute(config = {}) {
        const landscape = new Landscape(config.id || 'landscape_1');
        
        const cellCount = config.cellCount || 8;
        const spacing = config.spacing || 15;

        for (let i = 0; i < cellCount; i++) {
            const cellId = `cell_${i}`;
            const row = Math.floor(i / 3);
            const col = i % 3;
            
            const cellConfig = {
                radius: config.cellRadius || 2,
                organelles: config.organelles || undefined
            };

            const createCellCommand = new CreateCellCommand(
                this.cellFactory,
                cellId,
                cellConfig
            );
            
            const cell = createCellCommand.execute();
            
            // Set cell position (we'll need to extend Cell to support position)
            cell.position = {
                x: (col - 1) * spacing + (Math.random() - 0.5) * 5,
                y: 0,
                z: (row - 1) * spacing + (Math.random() - 0.5) * 5
            };

            landscape.addCell(cell);
        }

        return landscape;
    }
}

