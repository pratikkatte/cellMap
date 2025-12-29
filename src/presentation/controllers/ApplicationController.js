/**
 * Main application controller
 * Coordinates between layers
 */
export class ApplicationController {
    constructor(config) {
        this.config = config;
        this.isRunning = false;
        this.lastTime = 0;
    }

    /**
     * Initialize the application
     */
    async initialize() {
        // Override in subclasses
    }

    /**
     * Start the application
     */
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.loop();
    }

    /**
     * Stop the application
     */
    stop() {
        this.isRunning = false;
    }

    /**
     * Main loop
     */
    loop() {
        if (!this.isRunning) return;

        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame(() => this.loop());
    }

    /**
     * Update logic
     * @param {number} deltaTime
     */
    update(deltaTime) {
        // Override in subclasses
    }

    /**
     * Render logic
     */
    render() {
        // Override in subclasses
    }

    /**
     * Dispose of resources
     */
    dispose() {
        this.stop();
    }
}

