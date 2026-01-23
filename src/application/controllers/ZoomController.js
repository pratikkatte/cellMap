/**
 * Application-level zoom controller
 * Manages zoom state and transitions
 */
export class ZoomController {
    constructor(eventBus, config = {}) {
        this.eventBus = eventBus;
        this.currentDistance = config.initialDistance || 20;
        this.targetDistance = config.initialDistance || 20;
        this.minDistance = config.minDistance || 1;
        this.maxDistance = config.maxDistance || 100;
        this.zoomSpeed = config.zoomSpeed || 0.5;
        this.smoothing = config.smoothing || 0.1;
        this.distanceThresholds = config.distanceThresholds || {
            walkthrough: 5,
            overview: 15,
            landscape: 15
        };
    }

    /**
     * Zoom in/out
     * @param {number} delta - Zoom delta (positive = zoom out, negative = zoom in)
     */
    zoom(delta) {
        const zoomDelta = delta * this.zoomSpeed;
        this.targetDistance = Math.max(
            this.minDistance,
            Math.min(
                this.maxDistance,
                this.targetDistance + zoomDelta
            )
        );
        
        this.eventBus?.publish('zoom:changed', {
            distance: this.targetDistance,
            delta: zoomDelta
        });
    }

    /**
     * Set target distance
     * @param {number} distance - Target distance
     */
    setDistance(distance) {
        this.targetDistance = Math.max(
            this.minDistance,
            Math.min(this.maxDistance, distance)
        );
        
        this.eventBus?.publish('zoom:changed', {
            distance: this.targetDistance
        });
    }

    /**
     * Get current distance
     * @returns {number} Current distance
     */
    getDistance() {
        return this.currentDistance;
    }

    /**
     * Get target distance
     * @returns {number} Target distance
     */
    getTargetDistance() {
        return this.targetDistance;
    }

    /**
     * Get current mode based on distance
     * @returns {string} Mode name
     */
    getModeFromDistance() {
        if (this.currentDistance < this.distanceThresholds.walkthrough) {
            return 'walkthrough';
        } else if (this.currentDistance < this.distanceThresholds.overview) {
            return 'overview';
        } else {
            return 'landscape';
        }
    }

    /**
     * Update zoom interpolation
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        // Smooth interpolation
        const diff = this.targetDistance - this.currentDistance;
        this.currentDistance += diff * this.smoothing;
        
        // Check if mode should change based on distance
        const currentMode = this.getModeFromDistance();
        this.eventBus?.publish('zoom:update', {
            distance: this.currentDistance,
            targetDistance: this.targetDistance,
            mode: currentMode
        });
    }

    /**
     * Reset zoom to default
     */
    reset() {
        this.targetDistance = 20;
        this.currentDistance = 20;
        this.eventBus?.publish('zoom:reset', {
            distance: this.currentDistance
        });
    }
}

