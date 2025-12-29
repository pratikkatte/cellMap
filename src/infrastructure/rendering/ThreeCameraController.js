import * as THREE from 'three';
import { ICameraController } from '../../domain/interfaces/ICameraController.js';
import { Position } from '../../domain/valueObjects/Position.js';

/**
 * Base Three.js camera controller
 */
export class ThreeCameraController extends ICameraController {
    constructor(camera) {
        super();
        this.camera = camera;
        this.enabled = true;
    }

    update(deltaTime = 0) {
        // Override in subclasses
    }

    getPosition() {
        return Position.fromVector3(this.camera.position);
    }

    setPosition(position) {
        const pos = Position.from(position);
        this.camera.position.set(pos.x, pos.y, pos.z);
    }

    reset() {
        // Override in subclasses
    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }

    getCamera() {
        return this.camera;
    }
}

