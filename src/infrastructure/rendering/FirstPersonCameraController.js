import { ThreeCameraController } from './ThreeCameraController.js';
import * as THREE from 'three';

/**
 * First-person camera controller implementation
 */
export class FirstPersonCameraController extends ThreeCameraController {
    constructor(camera) {
        super(camera);
        this.moveSpeed = 0.5;
        this.rotationSpeed = 0.002;
        
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            up: false,
            down: false
        };
        
        this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
        this.velocity = new THREE.Vector3();
        this.shouldRequestPointerLock = true;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (event) => {
            if (!this.enabled) return;
            switch(event.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    this.keys.forward = true;
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.keys.backward = true;
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.keys.left = true;
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.keys.right = true;
                    break;
                case ' ':
                case 'q':
                case 'Q':
                    this.keys.up = true;
                    break;
                case 'Shift':
                case 'z':
                case 'Z':
                    this.keys.down = true;
                    break;
            }
        });
        
        document.addEventListener('keyup', (event) => {
            switch(event.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    this.keys.forward = false;
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.keys.backward = false;
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.keys.left = false;
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.keys.right = false;
                    break;
                case ' ':
                case 'q':
                case 'Q':
                    this.keys.up = false;
                    break;
                case 'Shift':
                case 'z':
                case 'Z':
                    this.keys.down = false;
                    break;
            }
        });
        
        // Mouse controls
        let isPointerLocked = false;
        
        document.addEventListener('click', () => {
            if (this.enabled && this.shouldRequestPointerLock) {
                document.body.requestPointerLock();
            }
        });
        
        document.addEventListener('pointerlockchange', () => {
            isPointerLocked = document.pointerLockElement === document.body;
        });
        
        document.addEventListener('mousemove', (event) => {
            if (!isPointerLocked || !this.enabled) return;
            
            const movementX = event.movementX || 0;
            const movementY = event.movementY || 0;
            
            this.euler.setFromQuaternion(this.camera.quaternion);
            this.euler.y -= movementX * this.rotationSpeed;
            this.euler.x -= movementY * this.rotationSpeed;
            
            // Limit vertical rotation
            this.euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.euler.x));
            
            this.camera.quaternion.setFromEuler(this.euler);
        });
    }

    update(deltaTime = 0) {
        if (!this.enabled) return;

        const direction = new THREE.Vector3();
        const right = new THREE.Vector3();
        
        // Get camera direction (forward)
        this.camera.getWorldDirection(direction);
        const forwardXZ = direction.clone();
        forwardXZ.y = 0; // Keep horizontal movement
        forwardXZ.normalize();
        
        // Get right vector
        right.crossVectors(forwardXZ, this.camera.up).normalize();
        
        // Calculate movement
        this.velocity.set(0, 0, 0);
        
        if (this.keys.forward) {
            this.velocity.add(forwardXZ.multiplyScalar(this.moveSpeed));
        }
        if (this.keys.backward) {
            this.velocity.add(forwardXZ.multiplyScalar(-this.moveSpeed));
        }
        if (this.keys.left) {
            this.velocity.add(right.multiplyScalar(-this.moveSpeed));
        }
        if (this.keys.right) {
            this.velocity.add(right.multiplyScalar(this.moveSpeed));
        }
        
        // Vertical movement
        if (this.keys.up) {
            this.velocity.y += this.moveSpeed;
        }
        if (this.keys.down) {
            this.velocity.y -= this.moveSpeed;
        }
        
        // Apply movement
        this.camera.position.add(this.velocity);
    }

    reset() {
        this.euler.set(0, 0, 0, 'YXZ');
        this.camera.quaternion.setFromEuler(this.euler);
    }

    setShouldRequestPointerLock(should) {
        this.shouldRequestPointerLock = should;
    }
}

