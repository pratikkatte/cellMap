/**
 * Use case for entering a cell interior
 */
export class EnterCellUseCase {
    constructor(cellRepository, cameraController, renderer) {
        this.cellRepository = cellRepository;
        this.cameraController = cameraController;
        this.renderer = renderer;
    }

    /**
     * Execute the use case
     * @param {string} cellId - ID of the cell to enter
     * @returns {Object} Result with cell and camera position
     */
    execute(cellId) {
        const cell = this.cellRepository.getById(cellId);
        if (!cell) {
            throw new Error(`Cell with id ${cellId} not found`);
        }

        // Position camera for overview mode
        const overviewDistance = 10;
        const cameraPosition = {
            x: 0,
            y: overviewDistance,
            z: overviewDistance
        };

        this.cameraController.setPosition(cameraPosition);
        this.cameraController.reset();

        return {
            cell,
            cameraPosition
        };
    }
}

