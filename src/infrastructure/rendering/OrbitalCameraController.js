import { ThreeCameraController } from './ThreeCameraController.js';
import * as THREE from 'three';
import { Position } from '../../domain/valueObjects/Position.js';

/**
 * Orbital camera controller implementation
 */
export class OrbitalCameraController extends ThreeCameraController {
    constructor(camera, target = new Position(0, 0, 0)) {
        super(camera);
        this.target = Position.from(target);
        
        // Spherical coordinates
        this.radius = 15;
        this.theta = Math.PI / 3;
        this.phi = 0;
        
        this.minRadius = 2;
        this.maxRadius = 20;
        
        this.rotationSpeed = 0.005;
        this.panSpeed = 0.02;
        
        // Mouse state
        this.isMouseDown = false;
        this.isRightMouseDown = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        
        this.autoRotate = false;
        this.autoRotateSpeed = 0.5;
        
        this.setupEventListeners();
        this.updateCameraPosition();
    }

    setupEventListeners() {
        this.mouseDownHandler = (event) => {
            if (!this.enabled) return;
            if (event.button === 0) {
                this.isMouseDown = true;
                this.lastMouseX = event.clientX;
                this.lastMouseY = event.clientY;
            } else if (event.button === 2) {
                this.isRightMouseDown = true;
                this.lastMouseX = event.clientX;
                this.lastMouseY = event.clientY;
            }
        };
        
        this.mouseUpHandler = () => {
            this.isMouseDown = false;
            this.isRightMouseDown = false;
        };
        
        this.mouseMoveHandler = (event) => {
            if (!this.enabled) return;
            
            if (this.isMouseDown) {
                const deltaX = event.clientX - this.lastMouseX;
                const deltaY = event.clientY - this.lastMouseY;
                
                this.phi -= deltaX * this.rotationSpeed;
                this.theta += deltaY * this.rotationSpeed;
                this.theta = Math.max(0.1, Math.min(Math.PI - 0.1, this.theta));
                
                this.lastMouseX = event.clientX;
                this.lastMouseY = event.clientY;
                
                this.updateCameraPosition();
            } else if (this.isRightMouseDown) {
                const deltaX = event.clientX - this.lastMouseX;
                const deltaY = event.clientY - this.lastMouseY;
                
                const forward = new THREE.Vector3();
                this.camera.getWorldDirection(forward);
                const right = new THREE.Vector3();
                right.crossVectors(forward, this.camera.up).normalize();
                const up = this.camera.up.clone();
                
                const targetVec = new THREE.Vector3(this.target.x, this.target.y, this.target.z);
                targetVec.add(right.multiplyScalar(-deltaX * this.panSpeed));
                targetVec.add(up.multiplyScalar(deltaY * this.panSpeed));
                this.target = Position.fromVector3(targetVec);
                
                this.lastMouseX = event.clientX;
                this.lastMouseY = event.clientY;
                
                this.updateCameraPosition();
            }
        };
        
        this.contextMenuHandler = (event) => {
            if (this.enabled) {
                event.preventDefault();
            }
        };
        
        document.addEventListener('contextmenu', this.contextMenuHandler);
        document.addEventListener('mousedown', this.mouseDownHandler);
        document.addEventListener('mouseup', this.mouseUpHandler);
        document.addEventListener('mousemove', this.mouseMoveHandler);
    }

    update(deltaTime = 0) {
        if (!this.enabled) return;
        
        if (this.autoRotate) {
            this.phi += this.autoRotateSpeed * 0.01;
            this.updateCameraPosition();
        }
    }

    updateCameraPosition() {
        const x = this.target.x + this.radius * Math.sin(this.theta) * Math.cos(this.phi);
        const y = this.target.y + this.radius * Math.cos(this.theta);
        const z = this.target.z + this.radius * Math.sin(this.theta) * Math.sin(this.phi);
        
        this.camera.position.set(x, y, z);
        this.camera.lookAt(this.target.x, this.target.y, this.target.z);
    }

    setTarget(target) {
        this.target = Position.from(target);
        this.updateCameraPosition();
    }

    setRadius(radius) {
        this.radius = Math.max(this.minRadius, Math.min(this.maxRadius, radius));
        this.updateCameraPosition();
    }

    getRadius() {
        return this.radius;
    }

    reset() {
        this.target = new Position(0, 0, 0);
        this.radius = 15;
        this.theta = Math.PI / 3;
        this.phi = 0;
        this.updateCameraPosition();
    }

    dispose() {
        document.removeEventListener('contextmenu', this.contextMenuHandler);
        document.removeEventListener('mousedown', this.mouseDownHandler);
        document.removeEventListener('mouseup', this.mouseUpHandler);
        document.removeEventListener('mousemove', this.mouseMoveHandler);
    }
}

