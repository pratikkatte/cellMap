import { cellTypes } from '../../config/cellTypes.config.js';

/**
 * Landing page component that displays cell types as clickable cards
 */
export class LandingPage {
    constructor(container, eventBus = null) {
        this.container = container;
        this.eventBus = eventBus;
        this.element = null;
        this.selectedCellType = null;
    }

    /**
     * Create the landing page DOM structure
     */
    create() {
        this.element = document.createElement('div');
        this.element.id = 'landing-page';

        // Header
        const header = document.createElement('div');
        header.className = 'landing-header';

        const title = document.createElement('h1');
        title.className = 'landing-title';
        title.textContent = 'CellMap';

        const subtitle = document.createElement('p');
        subtitle.className = 'landing-subtitle';
        subtitle.textContent = 'Explore the microscopic world of cells';

        header.appendChild(title);
        header.appendChild(subtitle);

        // Card grid
        const grid = document.createElement('div');
        grid.className = 'cell-card-grid';

        cellTypes.forEach(cellType => {
            const card = this.createCard(cellType);
            grid.appendChild(card);
        });

        // Footer
        const footer = document.createElement('div');
        footer.className = 'landing-footer';
        footer.innerHTML = 'Press <kbd>H</kbd> to return here from any view';

        this.element.appendChild(header);
        this.element.appendChild(grid);
        this.element.appendChild(footer);

        this.container.appendChild(this.element);
    }

    /**
     * Create a cell type card
     */
    createCard(cellType) {
        const card = document.createElement('div');
        card.className = 'cell-card';
        if (!cellType.available) {
            card.classList.add('disabled');
        }

        // Set CSS custom properties for colors
        card.style.setProperty('--card-color', cellType.color);
        card.style.setProperty('--card-accent-color', cellType.accentColor);

        // Preview circle
        const preview = document.createElement('div');
        preview.className = 'cell-preview';

        // Name
        const name = document.createElement('h3');
        name.className = 'cell-name';
        name.textContent = cellType.name;

        // Description
        const description = document.createElement('p');
        description.className = 'cell-description';
        description.textContent = cellType.description;

        card.appendChild(preview);
        card.appendChild(name);
        card.appendChild(description);

        // Coming soon badge for disabled cards
        if (!cellType.available) {
            const badge = document.createElement('div');
            badge.className = 'coming-soon-badge';
            badge.textContent = 'Coming Soon';
            card.appendChild(badge);
        }

        // Click handler
        if (cellType.available) {
            card.addEventListener('click', () => {
                this.onCellSelect(cellType);
            });
        }

        return card;
    }

    /**
     * Handle cell selection
     */
    onCellSelect(cellType) {
        this.selectedCellType = cellType;

        if (this.eventBus) {
            this.eventBus.publish('landing:cellSelected', { cellType });
        }

        // Also dispatch a custom DOM event for non-eventBus integrations
        const event = new CustomEvent('cellSelected', {
            detail: { cellType },
            bubbles: true
        });
        this.element.dispatchEvent(event);
    }

    /**
     * Show the landing page
     */
    show() {
        if (!this.element) {
            this.create();
        }
        // Force reflow before adding class
        void this.element.offsetWidth;
        this.element.classList.remove('hiding');
        this.element.classList.add('visible');
    }

    /**
     * Hide the landing page with animation
     */
    hide() {
        return new Promise((resolve) => {
            if (!this.element) {
                resolve();
                return;
            }

            this.element.classList.add('hiding');

            setTimeout(() => {
                this.element.classList.remove('visible', 'hiding');
                resolve();
            }, 500);
        });
    }

    /**
     * Check if landing page is visible
     */
    isVisible() {
        return this.element && this.element.classList.contains('visible');
    }

    /**
     * Get the selected cell type
     */
    getSelectedCellType() {
        return this.selectedCellType;
    }

    /**
     * Destroy the landing page
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }
}
