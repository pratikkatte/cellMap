import * as THREE from 'three';

export class OrbitalCameraControls {
    constructor(camera, target = new THREE.Vector3(0, 0, 0)) {
        this.camera = camera;
        this.target = target;
        
        // Spherical coordinates
        this.radius = 15;
        this.theta = Math.PI / 3; // Vertical angle (0 = top, PI = bottom)
        this.phi = 0; // Horizontal angle
        
        // Zoom limits - aligned with mode transition thresholds
        this.minRadius = 2;  // Can zoom in close for walkthrough transition
        this.maxRadius = 20; // Can zoom out to landscape transition
        
        // Rotation speed
        this.rotationSpeed = 0.005;
        this.panSpeed = 0.02;
        this.zoomSpeed = 0.5;
        
        // Mouse state
        this.isMouseDown = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        
        // Auto-rotate
        this.autoRotate = false;
        this.autoRotateSpeed = 0.5;
        
        // Active state
        this.isActive = true;
        
        this.setupEventListeners();
        this.updateCameraPosition();
    }
    
    setActive(active) {
        this.isActive = active;
        if (!active) {
            this.isMouseDown = false;
        }
    }
    
    setupEventListeners() {
        // Mouse wheel for zooming - but main.js handles zoom for mode transitions
        // So we'll let main.js handle the wheel events
        // This handler is kept for backward compatibility but may not be used
        this.wheelHandler = (event) => {
            if (!this.isActive) return;
            // Don't prevent default - let main.js handle it for zoom-based navigation
            // event.preventDefault();
        };
        // Don't add wheel listener here - main.js handles it
        
        // Mouse drag for rotation and panning
        this.isRightMouseDown = false;
        this.lastRightMouseX = 0;
        this.lastRightMouseY = 0;
        
        this.mouseDownHandler = (event) => {
            if (!this.isActive) return;
            if (event.button === 0) { // Left mouse button - rotation
                this.isMouseDown = true;
                this.lastMouseX = event.clientX;
                this.lastMouseY = event.clientY;
            } else if (event.button === 2) { // Right mouse button - panning
                this.isRightMouseDown = true;
                this.lastRightMouseX = event.clientX;
                this.lastRightMouseY = event.clientY;
            }
        };
        
        this.mouseUpHandler = () => {
            this.isMouseDown = false;
            this.isRightMouseDown = false;
        };
        
        this.mouseMoveHandler = (event) => {
            if (!this.isActive) return;
            
            if (this.isMouseDown) {
                // Left mouse drag - rotate
                const deltaX = event.clientX - this.lastMouseX;
                const deltaY = event.clientY - this.lastMouseY;
                
                // Rotate around target
                this.phi -= deltaX * this.rotationSpeed;
                this.theta += deltaY * this.rotationSpeed;
                
                // Limit vertical rotation
                this.theta = Math.max(0.1, Math.min(Math.PI - 0.1, this.theta));
                
                this.lastMouseX = event.clientX;
                this.lastMouseY = event.clientY;
                
                this.updateCameraPosition();
            } else if (this.isRightMouseDown) {
                // Right mouse drag - pan
                const deltaX = event.clientX - this.lastRightMouseX;
                const deltaY = event.clientY - this.lastRightMouseY;
                
                // Calculate pan direction
                const forward = new THREE.Vector3();
                this.camera.getWorldDirection(forward);
                const right = new THREE.Vector3();
                right.crossVectors(forward, this.camera.up).normalize();
                const up = this.camera.up.clone();
                
                // Pan the target
                this.target.add(right.multiplyScalar(-deltaX * this.panSpeed));
                this.target.add(up.multiplyScalar(deltaY * this.panSpeed));
                
                this.lastRightMouseX = event.clientX;
                this.lastRightMouseY = event.clientY;
                
                this.updateCameraPosition();
            }
        };
        
        this.contextMenuHandler = (event) => {
            if (this.isActive) {
                event.preventDefault();
            }
        };
        
        document.addEventListener('contextmenu', this.contextMenuHandler);
        document.addEventListener('mousedown', this.mouseDownHandler);
        document.addEventListener('mouseup', this.mouseUpHandler);
        document.addEventListener('mousemove', this.mouseMoveHandler);
        
        // Touch controls for mobile
        this.touchStartDistance = 0;
        this.touchStartTheta = 0;
        this.touchStartPhi = 0;
        
        this.touchStartHandler = (event) => {
            if (!this.isActive) return;
            if (event.touches.length === 1) {
                this.isMouseDown = true;
                this.lastMouseX = event.touches[0].clientX;
                this.lastMouseY = event.touches[0].clientY;
            } else if (event.touches.length === 2) {
                // Pinch to zoom
                const dx = event.touches[0].clientX - event.touches[1].clientX;
                const dy = event.touches[0].clientY - event.touches[1].clientY;
                this.touchStartDistance = Math.sqrt(dx * dx + dy * dy);
                this.touchStartTheta = this.theta;
                this.touchStartPhi = this.phi;
            }
        };
        
        this.touchMoveHandler = (event) => {
            if (!this.isActive) return;
            event.preventDefault();
            if (event.touches.length === 1 && this.isMouseDown) {
                const deltaX = event.touches[0].clientX - this.lastMouseX;
                const deltaY = event.touches[0].clientY - this.lastMouseY;
                
                this.phi -= deltaX * this.rotationSpeed;
                this.theta += deltaY * this.rotationSpeed;
                this.theta = Math.max(0.1, Math.min(Math.PI - 0.1, this.theta));
                
                this.lastMouseX = event.touches[0].clientX;
                this.lastMouseY = event.touches[0].clientY;
                
                this.updateCameraPosition();
            } else if (event.touches.length === 2) {
                const dx = event.touches[0].clientX - event.touches[1].clientX;
                const dy = event.touches[0].clientY - event.touches[1].clientY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                const scale = distance / this.touchStartDistance;
                this.radius /= scale;
                this.radius = Math.max(this.minRadius, Math.min(this.maxRadius, this.radius));
                
                this.updateCameraPosition();
            }
        };
        
        this.touchEndHandler = () => {
            this.isMouseDown = false;
        };
        
        document.addEventListener('touchstart', this.touchStartHandler);
        document.addEventListener('touchmove', this.touchMoveHandler);
        document.addEventListener('touchend', this.touchEndHandler);
    }
    
    dispose() {
        // Remove event listeners (wheel handler not added, so skip it)
        if (this.mouseDownHandler) document.removeEventListener('mousedown', this.mouseDownHandler);
        if (this.mouseUpHandler) document.removeEventListener('mouseup', this.mouseUpHandler);
        if (this.mouseMoveHandler) document.removeEventListener('mousemove', this.mouseMoveHandler);
        if (this.contextMenuHandler) document.removeEventListener('contextmenu', this.contextMenuHandler);
        if (this.touchStartHandler) document.removeEventListener('touchstart', this.touchStartHandler);
        if (this.touchMoveHandler) document.removeEventListener('touchmove', this.touchMoveHandler);
        if (this.touchEndHandler) document.removeEventListener('touchend', this.touchEndHandler);
    }
    
    updateCameraPosition() {
        // Convert spherical coordinates to Cartesian
        const x = this.target.x + this.radius * Math.sin(this.theta) * Math.cos(this.phi);
        const y = this.target.y + this.radius * Math.cos(this.theta);
        const z = this.target.z + this.radius * Math.sin(this.theta) * Math.sin(this.phi);
        
        this.camera.position.set(x, y, z);
        this.camera.lookAt(this.target);
    }
    
    update() {
        if (this.autoRotate) {
            this.phi += this.autoRotateSpeed * 0.01;
            this.updateCameraPosition();
        }
    }
    
    setTarget(target) {
        this.target.copy(target);
        this.updateCameraPosition();
    }
    
    setRadius(radius) {
        this.radius = Math.max(this.minRadius, Math.min(this.maxRadius, radius));
        this.updateCameraPosition();
    }
    
    reset() {
        this.target.set(0, 0, 0);
        this.radius = 15;
        this.theta = Math.PI / 3;
        this.phi = 0;
        this.updateCameraPosition();
    }
    
    toggleAutoRotate() {
        this.autoRotate = !this.autoRotate;
    }
}

