import { ApplicationController } from './ApplicationController.js';
import { ThreeRenderer } from '../../infrastructure/rendering/ThreeRenderer.js';
import { FirstPersonCameraController } from '../../infrastructure/rendering/FirstPersonCameraController.js';
import { OrbitalCameraController } from '../../infrastructure/rendering/OrbitalCameraController.js';
import { InputHandler } from '../../infrastructure/input/InputHandler.js';
import { MaterialManager } from '../../infrastructure/resources/MaterialManager.js';
import { OrganelleRegistry } from '../../domain/services/OrganelleRegistry.js';
import { CellFactory } from '../../domain/services/CellFactory.js';
import { CellRepository } from '../../application/repositories/CellRepository.js';
import { CreateLandscapeUseCase } from '../../application/useCases/CreateLandscapeUseCase.js';
import { EnterCellUseCase } from '../../application/useCases/EnterCellUseCase.js';
import { ExitCellUseCase } from '../../application/useCases/ExitCellUseCase.js';
import { ModeManager } from '../../application/modes/ModeManager.js';
import { CellRenderer } from '../../infrastructure/rendering/CellRenderer.js';
import { LandscapeRenderer } from '../../infrastructure/rendering/LandscapeRenderer.js';
import { Position } from '../../domain/valueObjects/Position.js';
import { LandingPage } from '../views/LandingPage.js';
import * as THREE from 'three';

/**
 * Main controller for the Cell World application
 */
export class CellWorldController extends ApplicationController {
    constructor(canvas, config = {}) {
        super(config);
        this.canvas = canvas;
        
        // Infrastructure
        this.renderer = null;
        this.firstPersonCameraController = null;
        this.orbitalCameraController = null;
        this.inputHandler = null;
        this.materialManager = null;
        
        // Domain services
        this.organelleRegistry = null;
        this.cellFactory = null;
        
        // Application
        this.cellRepository = null;
        this.createLandscapeUseCase = null;
        this.enterCellUseCase = null;
        this.exitCellUseCase = null;
        this.modeManager = null;
        
        // Rendering
        this.cellRenderer = null;
        
        // State
        this.currentCell = null;
        this.landscape = null;
        this.currentMode = 'landing';
        this.currentCellType = null;

        // Landing page
        this.landingPage = null;
        
        // Zoom and mode transition
        this.targetDistance = 20;
        this.currentDistance = 20;
        this.zoomSmoothing = 0.1;
        this.distanceThresholds = {
            walkthrough: 5,
            overview: 15,
            landscape: 15
        };
        
        // Raycasting
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hoveredCell = null;
        
        // Engine architecture integration (optional, set by main.js)
        this.engine = null;
        this.eventBus = null;
        this.sceneManager = null;
    }

    async initialize() {
        // Initialize infrastructure
        this.renderer = new ThreeRenderer(this.canvas);
        this.renderer.initialize();
        
        this.materialManager = new MaterialManager();
        this.inputHandler = new InputHandler();
        this.inputHandler.initialize();
        
        // Initialize camera controllers
        const camera = this.renderer.getCamera();
        this.firstPersonCameraController = new FirstPersonCameraController(camera);
        this.orbitalCameraController = new OrbitalCameraController(
            camera,
            new Position(0, 0, 0)
        );
        
        // Initialize domain services
        this.organelleRegistry = new OrganelleRegistry();
        this.cellFactory = new CellFactory(this.organelleRegistry);
        
        // Initialize application
        this.cellRepository = new CellRepository();
        this.createLandscapeUseCase = new CreateLandscapeUseCase(
            this.cellFactory,
            this.organelleRegistry
        );
        this.enterCellUseCase = new EnterCellUseCase(
            this.cellRepository,
            this.orbitalCameraController,
            this.renderer
        );
        this.exitCellUseCase = new ExitCellUseCase(
            this.firstPersonCameraController,
            this.renderer
        );
        
        // Initialize mode manager with a composite camera controller
        const compositeCameraController = {
            update: (deltaTime) => {
                if (this.currentMode === 'walkthrough') {
                    this.firstPersonCameraController.update(deltaTime);
                } else if (this.currentMode === 'overview') {
                    this.orbitalCameraController.update(deltaTime);
                } else {
                    this.firstPersonCameraController.update(deltaTime);
                }
            },
            setPosition: (pos) => {
                const position = Position.from(pos);
                camera.position.set(position.x, position.y, position.z);
            },
            reset: () => {
                if (this.currentMode === 'walkthrough' || this.currentMode === 'landscape') {
                    this.firstPersonCameraController.reset();
                } else {
                    this.orbitalCameraController.reset();
                }
            },
            setEnabled: (enabled) => {
                this.firstPersonCameraController.setEnabled(enabled);
                this.orbitalCameraController.setEnabled(enabled);
            }
        };
        
        this.modeManager = new ModeManager(compositeCameraController, this.inputHandler);
        
        // Initialize rendering
        this.cellRenderer = new CellRenderer(this.materialManager);
        this.landscapeRenderer = new LandscapeRenderer(this.materialManager);

        // Initialize landing page
        const appContainer = document.getElementById('app');
        this.landingPage = new LandingPage(appContainer, this.eventBus);

        // Setup event listeners
        this.setupEventListeners();

        // Check URL and load appropriate view
        this.handleInitialRoute();
    }

    setupEventListeners() {
        // Mouse wheel for zooming
        document.addEventListener('wheel', (event) => {
            event.preventDefault();
            this.handleZoom(event.deltaY);
        }, { passive: false });

        // Mouse click for cell entry
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

        // Exit cell with 'E' key, return to landing with 'H' key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'e' || event.key === 'E') {
                if (this.currentMode === 'walkthrough' || this.currentMode === 'overview') {
                    this.exitCell();
                }
            }
            if (event.key === 'h' || event.key === 'H') {
                if (this.currentMode !== 'landing') {
                    this.enterLandingMode();
                }
            }
        });

        // Listen for cell selection from landing page
        document.addEventListener('cellSelected', (event) => {
            const { cellType } = event.detail;
            this.onLandingCellSelected(cellType);
        });

        // Input handler wheel events
        this.inputHandler.on('wheel', (data) => {
            this.handleZoom(data.deltaY);
        });

        // Handle browser back/forward navigation
        window.addEventListener('popstate', (event) => {
            this.handleRouteChange(event.state);
        });
    }

    /**
     * Handle initial route on page load
     */
    handleInitialRoute() {
        const path = window.location.pathname;
        const cellMatch = path.match(/^\/cell\/([a-z-]+)$/);

        if (cellMatch) {
            const cellId = cellMatch[1];
            // Import cellTypes to validate
            import('../../config/cellTypes.config.js').then(({ cellTypes }) => {
                const cellType = cellTypes.find(c => c.id === cellId && c.available);
                if (cellType) {
                    this.currentCellType = cellType;
                    this.enterCellInterior({ x: 0, y: 0, z: 0 });
                } else {
                    // Invalid cell type, go to landing
                    this.enterLandingMode();
                    this.updateUrl('/');
                }
            });
        } else {
            // Default to landing page
            this.enterLandingMode();
        }
    }

    /**
     * Handle route change from browser navigation
     */
    handleRouteChange(state) {
        if (state && state.cellType) {
            // Navigate to cell view
            this.currentCellType = state.cellType;
            if (this.landingPage.isVisible()) {
                this.landingPage.hide().then(() => {
                    this.enterCellInterior({ x: 0, y: 0, z: 0 });
                });
            } else {
                this.enterCellInterior({ x: 0, y: 0, z: 0 });
            }
        } else {
            // Navigate to landing
            this.enterLandingMode();
        }
    }

    /**
     * Update the browser URL
     */
    updateUrl(path, state = null) {
        window.history.pushState(state, '', path);
    }

    /**
     * Replace the browser URL without adding to history
     */
    replaceUrl(path, state = null) {
        window.history.replaceState(state, '', path);
    }

    enterLandingMode(updateHistory = true) {
        this.currentMode = 'landing';
        this.currentCell = null;
        this.currentCellType = null;
        this.landscape = null;

        // Exit pointer lock if active
        if (document.pointerLockElement === document.body) {
            document.exitPointerLock();
        }

        // Disable camera controllers
        this.firstPersonCameraController.setEnabled(false);
        this.orbitalCameraController.setEnabled(false);

        // Clear the 3D scene
        this.renderer.clearScene();

        // Show landing page
        this.landingPage.show();

        // Update URL
        if (updateHistory) {
            this.updateUrl('/', null);
        }

        // Update mode display
        this.updateModeDisplay();

        // Publish event if eventBus is available
        if (this.eventBus) {
            this.eventBus.publish('mode:changed', { mode: 'landing' });
        }
    }

    async onLandingCellSelected(cellType) {
        // Store selected cell type
        this.currentCellType = cellType;

        // Update URL
        this.updateUrl(`/cell/${cellType.id}`, { cellType });

        // Hide landing page
        await this.landingPage.hide();

        // Enter cell interior directly (skip landscape for now)
        this.enterCellInterior({ x: 0, y: 0, z: 0 });
    }

    enterLandscapeMode() {
        this.currentMode = 'landscape';
        this.currentCell = null;
        
        this.firstPersonCameraController.setShouldRequestPointerLock(false);
        if (document.pointerLockElement === document.body) {
            document.exitPointerLock();
        }

        // Reset hover state
        this.resetHoverState();

        this.renderer.clearScene();
        
        // Create landscape
        this.landscape = this.createLandscapeUseCase.execute({
            cellCount: 8,
            spacing: 15,
            cellRadius: 2
        });

        // Render landscape cells (simplified representation)
        this.landscape.getAllCells().forEach(cell => {
            const position = cell.position || { x: 0, y: 0, z: 0 };
            const cellMesh = this.landscapeRenderer.renderLandscapeCell(cell, position);
            this.renderer.addToScene(cellMesh);
        });

        // Position camera for landscape view
        const camera = this.renderer.getCamera();
        camera.position.set(0, 5, 20);
        this.firstPersonCameraController.reset();

        // Disable orbital controls
        this.orbitalCameraController.setEnabled(false);

        // Reset zoom distance
        this.targetDistance = 20;
        this.currentDistance = 20;

        this.modeManager.switchTo('landscape');
        this.updateModeDisplay();
        
        // Publish event if eventBus is available
        if (this.eventBus) {
            this.eventBus.publish('mode:changed', { mode: 'landscape' });
        }
        
        // Add ground plane
        this.addGroundPlane();
    }

    enterCellInterior(cellPosition) {
        // Reset hover state
        this.resetHoverState();

        // Enable pointer lock for walkthrough mode
        this.firstPersonCameraController.setShouldRequestPointerLock(true);

        // Start in overview mode
        this.currentMode = 'overview';
        this.renderer.clearScene();

        // Create cell interior
        const cellId = 'current_cell';
        const cell = this.cellFactory.createDefaultCell(cellId);
        this.currentCell = cell;
        this.cellRepository.save(cell);

        // Render cell
        const cellGroup = this.cellRenderer.render(cell);
        this.renderer.addToScene(cellGroup);

        // Set up orbital controls for overview mode
        this.orbitalCameraController.setEnabled(true);
        this.orbitalCameraController.setTarget(new Position(0, 0, 0));

        // Position camera at overview distance
        const overviewDistance = 10;
        this.targetDistance = overviewDistance;
        this.currentDistance = overviewDistance;
        this.orbitalCameraController.setRadius(overviewDistance);
        this.orbitalCameraController.reset();

        this.firstPersonCameraController.reset();

        this.modeManager.switchTo('overview');
        this.updateModeDisplay();
    }

    exitCell() {
        this.enterLandscapeMode();
    }

    resetHoverState() {
        if (this.hoveredCell) {
            const material = this.hoveredCell.material;
            if (material && material.emissive) {
                material.emissive.setHex(0x000000);
                material.emissiveIntensity = 0;
            }
            this.hoveredCell = null;
        }
        document.body.style.cursor = 'default';
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.renderer.getCamera());

        if (!this.landscape) return;
        const cellMeshes = this.landscape.getAllCells()
            .map(cell => {
                const scene = this.renderer.getScene();
                return scene.children.find(child => 
                    child.userData && child.userData.cellId === cell.getId()
                );
            })
            .filter(mesh => mesh !== undefined);

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
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.renderer.getCamera());

        if (!this.landscape) return;
        const cellMeshes = this.landscape.getAllCells()
            .map(cell => {
                const scene = this.renderer.getScene();
                return scene.children.find(child => 
                    child.userData && child.userData.cellId === cell.getId()
                );
            })
            .filter(mesh => mesh !== undefined);

        const intersects = this.raycaster.intersectObjects(cellMeshes);

        if (intersects.length > 0) {
            event.stopPropagation();
            const clickedMesh = intersects[0].object;
            const clickedCell = this.landscape.getAllCells().find(cell => {
                const scene = this.renderer.getScene();
                const mesh = scene.children.find(child => 
                    child.userData && child.userData.cellId === cell.getId()
                );
                return mesh === clickedMesh;
            });

            if (clickedCell) {
                this.enterCellInterior(clickedCell.position || { x: 0, y: 0, z: 0 });
            }
        }
    }

    handleZoom(deltaY) {
        const zoomDelta = -deltaY * 0.01 * 0.5;

        if (this.currentMode === 'landscape') {
            return;
        } else if (this.currentMode === 'overview') {
            this.targetDistance = Math.max(
                this.orbitalCameraController.minRadius,
                Math.min(
                    this.orbitalCameraController.maxRadius,
                    this.targetDistance + zoomDelta
                )
            );
            this.orbitalCameraController.setRadius(this.targetDistance);
            
            // Publish zoom event if eventBus is available
            if (this.eventBus) {
                this.eventBus.publish('zoom:changed', { 
                    distance: this.targetDistance,
                    mode: this.currentMode 
                });
            }
        } else if (this.currentMode === 'walkthrough') {
            const direction = new THREE.Vector3();
            this.renderer.getCamera().getWorldDirection(direction);
            direction.multiplyScalar(-zoomDelta * 5);
            this.renderer.getCamera().position.add(direction);
        }
    }

    calculateDistanceFromCellCenter() {
        if (!this.currentCell) return Infinity;
        const camera = this.renderer.getCamera();
        return camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
    }

    checkDistanceAndUpdateMode() {
        if (this.currentMode === 'landscape' || !this.currentCell) return;

        const distance = this.calculateDistanceFromCellCenter();

        if (this.currentMode === 'overview') {
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

    transitionToWalkthrough() {
        if (this.currentMode === 'walkthrough') return;

        this.currentMode = 'walkthrough';

        if (document.pointerLockElement === document.body) {
            document.exitPointerLock();
        }

        this.firstPersonCameraController.setShouldRequestPointerLock(true);
        this.orbitalCameraController.setEnabled(false);

        const camera = this.renderer.getCamera();
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        direction.normalize();
        const walkthroughDistance = 2.5;
        camera.position.set(
            direction.x * walkthroughDistance,
            direction.y * walkthroughDistance + 0.5,
            direction.z * walkthroughDistance
        );
        this.firstPersonCameraController.reset();

        this.modeManager.switchTo('walkthrough');
        this.updateModeDisplay();
        
        // Publish event if eventBus is available
        if (this.eventBus) {
            this.eventBus.publish('mode:changed', { mode: 'walkthrough' });
        }
    }

    transitionToOverview() {
        if (this.currentMode === 'overview') return;

        this.currentMode = 'overview';

        if (document.pointerLockElement === document.body) {
            document.exitPointerLock();
        }

        this.firstPersonCameraController.setShouldRequestPointerLock(false);
        this.orbitalCameraController.setEnabled(true);

        const distance = this.calculateDistanceFromCellCenter();
        this.targetDistance = Math.max(5, Math.min(15, distance));
        this.currentDistance = this.targetDistance;
        this.orbitalCameraController.setRadius(this.targetDistance);

        const camera = this.renderer.getCamera();
        const relativePos = new THREE.Vector3().subVectors(camera.position, new THREE.Vector3(0, 0, 0));
        this.orbitalCameraController.radius = relativePos.length();
        this.orbitalCameraController.theta = Math.acos(relativePos.y / this.orbitalCameraController.radius);
        this.orbitalCameraController.phi = Math.atan2(relativePos.z, relativePos.x);
        this.orbitalCameraController.updateCameraPosition();

        this.modeManager.switchTo('overview');
        this.updateModeDisplay();
        
        // Publish event if eventBus is available
        if (this.eventBus) {
            this.eventBus.publish('mode:changed', { mode: 'overview' });
        }
    }

    updateModeDisplay() {
        const modeDisplay = document.getElementById('mode-display');
        const controlsPanel = document.getElementById('controls');
        const landscapeControls = document.getElementById('landscape-controls');
        const walkthroughControls = document.getElementById('walkthrough-controls');
        const overviewControls = document.getElementById('overview-controls');

        if (landscapeControls) landscapeControls.style.display = 'none';
        if (walkthroughControls) walkthroughControls.style.display = 'none';
        if (overviewControls) overviewControls.style.display = 'none';

        // Hide controls panel when in landing mode
        if (controlsPanel) {
            controlsPanel.style.display = this.currentMode === 'landing' ? 'none' : 'block';
        }

        if (modeDisplay) {
            if (this.currentMode === 'landing') {
                modeDisplay.textContent = '';
            } else if (this.currentMode === 'walkthrough') {
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

    addGroundPlane() {
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            roughness: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1;
        this.renderer.addToScene(ground);
    }

    update(deltaTime) {
        // Smooth zoom interpolation
        if (this.currentMode === 'overview') {
            this.currentDistance = THREE.MathUtils.lerp(
                this.currentDistance,
                this.targetDistance,
                this.zoomSmoothing
            );
            this.orbitalCameraController.setRadius(this.currentDistance);
        }

        // Check distance and update mode automatically
        this.checkDistanceAndUpdateMode();

        // Update mode manager
        this.modeManager.update(deltaTime);

        // Update landscape animations
        if (this.currentMode === 'landscape' && this.landscape) {
            this.landscape.update(deltaTime);
            // Update visual representations
            const scene = this.renderer.getScene();
            scene.children.forEach(child => {
                if (child.userData && child.userData.cellId) {
                    this.landscapeRenderer.update(child);
                }
            });
        }

        // Update cell animations
        if ((this.currentMode === 'walkthrough' || this.currentMode === 'overview') && this.currentCell) {
            this.currentCell.update(deltaTime);
        }
    }

    render() {
        this.renderer.render();
    }

    /**
     * Register an organelle factory
     * @param {IOrganelleFactory} factory
     */
    registerOrganelleFactory(factory) {
        this.organelleRegistry.register(factory);
    }
}

