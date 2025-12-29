import { IInputHandler } from '../../domain/interfaces/IInputHandler.js';

/**
 * Input handler implementation
 */
export class InputHandler extends IInputHandler {
    constructor() {
        super();
        this.keys = new Set();
        this.mouseButtons = new Set();
        this.mousePosition = { x: 0, y: 0 };
        this.eventListeners = new Map();
    }

    initialize() {
        // Keyboard events
        document.addEventListener('keydown', (event) => {
            this.keys.add(event.key.toLowerCase());
        });

        document.addEventListener('keyup', (event) => {
            this.keys.delete(event.key.toLowerCase());
        });

        // Mouse events
        document.addEventListener('mousemove', (event) => {
            this.mousePosition.x = event.clientX;
            this.mousePosition.y = event.clientY;
        });

        document.addEventListener('mousedown', (event) => {
            this.mouseButtons.add(event.button);
        });

        document.addEventListener('mouseup', (event) => {
            this.mouseButtons.delete(event.button);
        });

        // Wheel events
        document.addEventListener('wheel', (event) => {
            this.emit('wheel', { deltaY: event.deltaY, deltaX: event.deltaX });
        });

        // Touch events
        document.addEventListener('touchstart', (event) => {
            this.emit('touchstart', event);
        });

        document.addEventListener('touchmove', (event) => {
            this.emit('touchmove', event);
        });

        document.addEventListener('touchend', (event) => {
            this.emit('touchend', event);
        });
    }

    update(deltaTime = 0) {
        // Update logic if needed
    }

    isKeyPressed(key) {
        return this.keys.has(key.toLowerCase());
    }

    getMousePosition() {
        return { ...this.mousePosition };
    }

    isMouseButtonPressed(button) {
        return this.mouseButtons.has(button);
    }

    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.eventListeners.has(event)) {
            const callbacks = this.eventListeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                callback(data);
            });
        }
    }

    dispose() {
        // Remove event listeners would be handled by browser cleanup
        this.keys.clear();
        this.mouseButtons.clear();
        this.eventListeners.clear();
    }
}

