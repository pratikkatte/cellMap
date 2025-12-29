/**
 * Use case for exiting a cell and returning to landscape
 */
export class ExitCellUseCase {
    constructor(cameraController, renderer) {
        this.cameraController = cameraController;
        this.renderer = renderer;
    }

    /**
     * Execute the use case
     * @returns {Object} Result with camera position for landscape
     */
    execute() {
        const landscapePosition = {
            x: 0,
            y: 5,
            z: 20
        };

        this.cameraController.setPosition(landscapePosition);
        this.cameraController.reset();

        return {
            cameraPosition: landscapePosition
        };
    }
}

