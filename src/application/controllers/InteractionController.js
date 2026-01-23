/**
 * Application-level interaction controller
 * Handles user interactions and publishes events
 */
export class InteractionController {
    constructor(inputHandler, eventBus) {
        this.inputHandler = inputHandler;
        this.eventBus = eventBus;
        this.selectedEntity = null;
        this.hoveredEntity = null;
    }

    /**
     * Handle mouse click
     * @param {Object} event - Mouse event
     * @param {Object} entity - Clicked entity
     */
    handleClick(event, entity) {
        if (entity) {
            this.selectedEntity = entity;
            this.eventBus?.publish('entity:selected', { entity, event });
            
            // Handle cell clicks
            if (entity.type === 'cell') {
                this.eventBus?.publish('cell:clicked', { cell: entity, event });
            }
            
            // Handle organelle clicks
            if (entity.type === 'organelle') {
                this.eventBus?.publish('organelle:selected', { organelle: entity, event });
            }
        }
    }

    /**
     * Handle mouse hover
     * @param {Object} event - Mouse event
     * @param {Object} entity - Hovered entity
     */
    handleHover(event, entity) {
        if (this.hoveredEntity !== entity) {
            // Exit previous hover
            if (this.hoveredEntity) {
                this.eventBus?.publish('entity:hover:exit', { entity: this.hoveredEntity });
            }
            
            // Enter new hover
            this.hoveredEntity = entity;
            if (entity) {
                this.eventBus?.publish('entity:hover:enter', { entity, event });
            }
        }
    }

    /**
     * Get selected entity
     * @returns {Object|null} Selected entity
     */
    getSelectedEntity() {
        return this.selectedEntity;
    }

    /**
     * Clear selection
     */
    clearSelection() {
        if (this.selectedEntity) {
            this.eventBus?.publish('entity:deselected', { entity: this.selectedEntity });
            this.selectedEntity = null;
        }
    }

    /**
     * Update interaction state
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        // Update input handler if needed
        if (this.inputHandler && this.inputHandler.update) {
            this.inputHandler.update(deltaTime);
        }
    }
}

