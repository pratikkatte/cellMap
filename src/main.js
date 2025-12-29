import * as THREE from 'three';
import { FirstPersonControls } from './camera.js';
import { OrbitalCameraControls } from './orbitalCamera.js';
import { CellLandscape } from './world/CellLandscape.js';
import { Cell } from './world/Cell.js';

class CellWorld {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            10000
        );
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('canvas'),
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        this.firstPersonControls = new FirstPersonControls(this.camera);
        // Disable pointer lock in landscape mode (so we can click cells)
        this.firstPersonControls.shouldRequestPointerLock = false;
        this.orbitalControls = null; // Will be created when entering overview mode
        this.currentMode = 'landscape'; // 'landscape', 'walkthrough', or 'overview'
        this.enteringCell = false; // Flag to prevent rapid re-entry
        
        // Raycasting for cell interaction
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hoveredCell = null;
        
        // Zoom-based navigation
        this.cellCenter = new THREE.Vector3(0, 0, 0);
        this.zoomSpeed = 0.5;
        this.targetDistance = 20; // Target camera distance for smooth zooming
        this.currentDistance = 20;
        this.zoomSmoothing = 0.1;
        
        // Distance thresholds for mode transitions
        this.distanceThresholds = {
            walkthrough: 5,   // < 5 = walkthrough
            overview: 15,     // 5-15 = overview
            landscape: 15     // > 15 = landscape
        };
        
        // Pinch gesture tracking
        this.touchStartDistance = 0;
        this.lastPinchDistance = 0;
        this.isPinching = false;
        
        this.setupLighting();
        this.setupEventListeners();
        this.init();
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 50);
        this.scene.add(directionalLight);
        
        // Additional fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-50, 30, -50);
        this.scene.add(fillLight);
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Mouse wheel for zooming
        document.addEventListener('wheel', (event) => {
            event.preventDefault();
            this.handleZoom(event.deltaY);
        }, { passive: false });
        
        // Touch events for pinch gesture
        document.addEventListener('touchstart', (event) => {
            this.handleTouchStart(event);
        });
        
        document.addEventListener('touchmove', (event) => {
            this.handleTouchMove(event);
        });
        
        document.addEventListener('touchend', (event) => {
            this.handleTouchEnd(event);
        });
        
        // Mouse click for cell entry (hybrid - still works)
        document.addEventListener('click', (event) => {
            if (this.currentMode === 'landscape') {
                this.onCellClick(event);
            }
        });
        
        // Mouse move for hover effect
        document.addEventListener('mousemove', (event) => {
            if (this.currentMode === 'landscape') {
                this.onMouseMove(event);
            }
        });
        
        // Exit cell with 'E' key (optional - zoom out also works)
        document.addEventListener('keydown', (event) => {
            if (event.key === 'e' || event.key === 'E') {
                if (this.currentMode === 'walkthrough' || this.currentMode === 'overview') {
                    this.exitCell();
                }
            }
        });
    }
    
    init() {
        // Start in landscape mode
        this.enterLandscapeMode();
        this.updateModeDisplay();
    }
    
    enterLandscapeMode() {
        this.currentMode = 'landscape';
        this.enteringCell = false;
        
        // Reset cell reference
        this.cell = null;
        
        // Disable pointer lock in landscape mode (so we can click cells)
        this.firstPersonControls.shouldRequestPointerLock = false;
        
        // Release pointer lock if active
        if (document.pointerLockElement === document.body) {
            document.exitPointerLock();
        }
        
        // Reset hover state
        if (this.hoveredCell) {
            const material = this.hoveredCell.material;
            if (material && material.emissive) {
                material.emissive.setHex(0x000000);
                material.emissiveIntensity = 0;
            }
            this.hoveredCell = null;
        }
        document.body.style.cursor = 'default';
        
        this.scene.clear();
        this.setupLighting();
        
        // Create landscape
        this.landscape = new CellLandscape();
        this.scene.add(this.landscape.group);
        
        // Position camera for landscape view
        this.camera.position.set(0, 5, 20);
        this.firstPersonControls.reset();
        
        // Clean up orbital controls if they exist
        if (this.orbitalControls) {
            this.orbitalControls.setActive(false);
            this.orbitalControls.dispose();
            this.orbitalControls = null;
        }
        
        // Reset zoom distance
        this.targetDistance = 20;
        this.currentDistance = 20;
        
        this.updateModeDisplay();
        
        // Add ground plane
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            roughness: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1;
        this.scene.add(ground);
    }
    
    enterCellInterior(cellPosition) {
        if (this.enteringCell) return; // Prevent rapid re-entry
        this.enteringCell = true;
        
        // Reset hover state
        if (this.hoveredCell) {
            const material = this.hoveredCell.material;
            if (material && material.emissive) {
                material.emissive.setHex(0x000000);
                material.emissiveIntensity = 0;
            }
            this.hoveredCell = null;
        }
        document.body.style.cursor = 'default';
        
        // Enable pointer lock for walkthrough mode
        this.firstPersonControls.shouldRequestPointerLock = true;
        
        // Start in overview mode (medium zoom) - user can zoom in to walkthrough
        this.currentMode = 'overview';
        this.scene.clear();
        this.setupLighting();
        
        // Create cell interior
        this.cell = new Cell();
        this.scene.add(this.cell.group);
        
        // Set up orbital controls for overview mode
        if (!this.orbitalControls) {
            this.orbitalControls = new OrbitalCameraControls(this.camera, this.cellCenter);
        }
        this.orbitalControls.setActive(true);
        
        // Position camera at overview distance (between thresholds)
        const overviewDistance = 10; // Between 5 and 15
        this.targetDistance = overviewDistance;
        this.currentDistance = overviewDistance;
        this.orbitalControls.setRadius(overviewDistance);
        this.orbitalControls.reset();
        
        this.firstPersonControls.reset();
        
        // Update UI
        this.updateModeDisplay();
    }
    
    // These methods are kept for backward compatibility but zoom-based transitions are preferred
    switchToWalkthroughMode() {
        this.transitionToWalkthrough();
    }
    
    switchToOverviewMode() {
        this.transitionToOverview();
    }
    
    updateModeDisplay() {
        const modeDisplay = document.getElementById('mode-display');
        const landscapeControls = document.getElementById('landscape-controls');
        const walkthroughControls = document.getElementById('walkthrough-controls');
        const overviewControls = document.getElementById('overview-controls');
        
        // Hide all control sections
        if (landscapeControls) landscapeControls.style.display = 'none';
        if (walkthroughControls) walkthroughControls.style.display = 'none';
        if (overviewControls) overviewControls.style.display = 'none';
        
        if (modeDisplay) {
            if (this.currentMode === 'walkthrough') {
                modeDisplay.textContent = 'Mode: Walkthrough (Zoom out for Overview)';
                if (walkthroughControls) walkthroughControls.style.display = 'block';
            } else if (this.currentMode === 'overview') {
                const distance = this.calculateDistanceFromCellCenter();
                modeDisplay.textContent = `Mode: Overview (Distance: ${distance.toFixed(1)}) - Zoom in/out to change mode`;
                if (overviewControls) overviewControls.style.display = 'block';
            } else {
                modeDisplay.textContent = 'Mode: Landscape - Click cell or use arrow keys';
                if (landscapeControls) landscapeControls.style.display = 'block';
            }
        }
    }
    
    exitCell() {
        this.enterLandscapeMode();
    }
    
    onMouseMove(event) {
        // Calculate mouse position in normalized device coordinates (-1 to +1)
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Get all cell meshes
        if (!this.landscape || !this.landscape.cells) return;
        const cellMeshes = this.landscape.cells.map(cell => cell.mesh);
        
        // Check for intersections
        const intersects = this.raycaster.intersectObjects(cellMeshes);
        
        // Reset previous hover
        if (this.hoveredCell) {
            const material = this.hoveredCell.material;
            if (material && material.emissive) {
                material.emissive.setHex(0x000000);
                material.emissiveIntensity = 0;
            }
        }
        
        // Highlight hovered cell
        if (intersects.length > 0) {
            this.hoveredCell = intersects[0].object;
            const material = this.hoveredCell.material;
            if (material && material.emissive) {
                material.emissive.setHex(0xd7bde2);
                material.emissiveIntensity = 0.8;
            }
            document.body.style.cursor = 'pointer';
        } else {
            this.hoveredCell = null;
            document.body.style.cursor = 'default';
        }
    }
    
    onCellClick(event) {
        // Calculate mouse position in normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Get all cell meshes
        if (!this.landscape || !this.landscape.cells) return;
        const cellMeshes = this.landscape.cells.map(cell => cell.mesh);
        
        // Check for intersections
        const intersects = this.raycaster.intersectObjects(cellMeshes);
        
        if (intersects.length > 0) {
            // Prevent pointer lock when clicking on a cell
            event.stopPropagation();
            
            // Find which cell was clicked
            const clickedMesh = intersects[0].object;
            const clickedCell = this.landscape.cells.find(cell => cell.mesh === clickedMesh);
            
            if (clickedCell) {
                this.enterCellInterior(clickedCell.position);
            }
        }
    }
    
    update() {
        // Smooth zoom interpolation
        if (this.currentMode === 'overview' && this.orbitalControls) {
            this.currentDistance = THREE.MathUtils.lerp(
                this.currentDistance,
                this.targetDistance,
                this.zoomSmoothing
            );
            this.orbitalControls.setRadius(this.currentDistance);
        }
        
        // Check distance and update mode automatically
        this.checkDistanceAndUpdateMode();
        
        // Update appropriate controls based on mode
        if (this.currentMode === 'walkthrough') {
            // First-person controls for walkthrough
            this.firstPersonControls.update();
        } else if (this.currentMode === 'overview' && this.orbitalControls) {
            // Orbital controls for overview (rotation, pan)
            this.orbitalControls.update();
        } else if (this.currentMode === 'landscape') {
            // First-person controls for landscape (arrow keys for movement)
            this.firstPersonControls.update();
        }
        
        // Update landscape animations
        if (this.currentMode === 'landscape' && this.landscape) {
            this.landscape.update();
        }
        
        if ((this.currentMode === 'walkthrough' || this.currentMode === 'overview') && this.cell) {
            this.cell.update();
        }
    }
    
    calculateDistanceFromCellCenter() {
        if (!this.cell) return Infinity;
        return this.camera.position.distanceTo(this.cellCenter);
    }
    
    checkDistanceAndUpdateMode() {
        // Only check if we're in overview or walkthrough mode (inside a cell)
        if (this.currentMode === 'landscape' || !this.cell) return;
        
        const distance = this.calculateDistanceFromCellCenter();
        
        // Update target distance for smooth zooming in overview mode
        if (this.currentMode === 'overview' && this.orbitalControls) {
            // Keep target distance synced with actual distance for smooth transitions
            if (Math.abs(this.targetDistance - distance) > 0.5) {
                this.targetDistance = distance;
            }
        }
        
        // Transition to walkthrough if zoomed in close enough
        if (distance < this.distanceThresholds.walkthrough && this.currentMode === 'overview') {
            this.transitionToWalkthrough();
        }
        // Transition to overview if zoomed out from walkthrough
        else if (distance > this.distanceThresholds.walkthrough && this.currentMode === 'walkthrough') {
            this.transitionToOverview();
        }
        // Transition to landscape if zoomed out far enough
        else if (distance > this.distanceThresholds.landscape && this.currentMode === 'overview') {
            this.exitCell();
        }
    }
    
    handleZoom(deltaY) {
        // deltaY > 0 means scroll down (zoom out)
        // deltaY < 0 means scroll up (zoom in)
        const zoomDelta = -deltaY * 0.01 * this.zoomSpeed;
        
        if (this.currentMode === 'landscape') {
            // In landscape mode, zooming doesn't change modes
            // User should click on a cell to enter
            return;
        } else if (this.currentMode === 'overview' && this.orbitalControls) {
            // Zoom in overview mode - adjust target distance
            this.targetDistance = Math.max(
                this.orbitalControls.minRadius,
                Math.min(
                    this.orbitalControls.maxRadius,
                    this.targetDistance + zoomDelta
                )
            );
            // Update orbital controls radius immediately for responsive feel
            this.orbitalControls.setRadius(this.targetDistance);
        } else if (this.currentMode === 'walkthrough') {
            // In walkthrough mode, zooming out moves camera back
            // This will trigger transition to overview when distance > threshold
            const direction = new THREE.Vector3();
            this.camera.getWorldDirection(direction);
            direction.multiplyScalar(-zoomDelta * 5); // Move camera back
            this.camera.position.add(direction);
        }
    }
    
    handleTouchStart(event) {
        if (event.touches.length === 2) {
            this.isPinching = true;
            const dx = event.touches[0].clientX - event.touches[1].clientX;
            const dy = event.touches[0].clientY - event.touches[1].clientY;
            this.touchStartDistance = Math.sqrt(dx * dx + dy * dy);
            this.lastPinchDistance = this.touchStartDistance;
        }
    }
    
    handleTouchMove(event) {
        if (this.isPinching && event.touches.length === 2) {
            event.preventDefault();
            const dx = event.touches[0].clientX - event.touches[1].clientX;
            const dy = event.touches[0].clientY - event.touches[1].clientY;
            const currentDistance = Math.sqrt(dx * dx + dy * dy);
            
            const scale = currentDistance / this.lastPinchDistance;
            const zoomDelta = (1 - scale) * this.zoomSpeed * 10;
            
            // Apply zoom similar to mouse wheel
            if (this.currentMode === 'overview' && this.orbitalControls) {
                this.targetDistance = Math.max(
                    this.orbitalControls.minRadius,
                    Math.min(
                        this.orbitalControls.maxRadius,
                        this.targetDistance + zoomDelta
                    )
                );
            }
            
            this.lastPinchDistance = currentDistance;
        }
    }
    
    handleTouchEnd(event) {
        if (event.touches.length < 2) {
            this.isPinching = false;
            this.touchStartDistance = 0;
            this.lastPinchDistance = 0;
        }
    }
    
    transitionToWalkthrough() {
        if (this.currentMode === 'walkthrough') return;
        
        this.currentMode = 'walkthrough';
        
        // Release pointer lock if active
        if (document.pointerLockElement === document.body) {
            document.exitPointerLock();
        }
        
        // Enable pointer lock for walkthrough mode
        this.firstPersonControls.shouldRequestPointerLock = true;
        
        // Disable orbital controls
        if (this.orbitalControls) {
            this.orbitalControls.setActive(false);
        }
        
        // Position camera inside cell for walkthrough (close to center but not exactly at center)
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        direction.normalize();
        // Position camera at walkthrough distance (2-3 units from center)
        const walkthroughDistance = 2.5;
        this.camera.position.set(
            direction.x * walkthroughDistance,
            direction.y * walkthroughDistance + 0.5, // Slight elevation
            direction.z * walkthroughDistance
        );
        this.firstPersonControls.reset();
        
        this.updateModeDisplay();
    }
    
    transitionToOverview() {
        if (this.currentMode === 'overview') return;
        
        this.currentMode = 'overview';
        
        // Release pointer lock if active
        if (document.pointerLockElement === document.body) {
            document.exitPointerLock();
        }
        
        // Disable pointer lock in overview mode
        this.firstPersonControls.shouldRequestPointerLock = false;
        
        // Create orbital controls if they don't exist
        if (!this.orbitalControls) {
            this.orbitalControls = new OrbitalCameraControls(this.camera, this.cellCenter);
        }
        
        // Activate orbital controls
        this.orbitalControls.setActive(true);
        
        // Set distance based on current camera position
        const distance = this.calculateDistanceFromCellCenter();
        // Clamp distance to overview range
        this.targetDistance = Math.max(5, Math.min(15, distance));
        this.currentDistance = this.targetDistance;
        this.orbitalControls.setRadius(this.targetDistance);
        
        // Update orbital camera position to match current camera position
        // Calculate spherical coordinates from current position
        const relativePos = new THREE.Vector3().subVectors(this.camera.position, this.cellCenter);
        this.orbitalControls.radius = relativePos.length();
        this.orbitalControls.theta = Math.acos(relativePos.y / this.orbitalControls.radius);
        this.orbitalControls.phi = Math.atan2(relativePos.z, relativePos.x);
        this.orbitalControls.updateCameraPosition();
        
        this.updateModeDisplay();
    }
    
    render() {
        this.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.render());
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    start() {
        this.render();
    }
}

// Initialize and start the application
const app = new CellWorld();
app.start();

