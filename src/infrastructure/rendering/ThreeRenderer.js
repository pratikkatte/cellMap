import * as THREE from 'three';
import { IRenderer } from '../../domain/interfaces/IRenderer.js';

/**
 * Three.js implementation of IRenderer
 */
export class ThreeRenderer extends IRenderer {
    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.objects = new Map();
    }

    initialize() {
        // Create scene (can be overridden by setScene)
        this.scene = new THREE.Scene();

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            10000
        );

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Setup lighting
        this.setupLighting();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    /**
     * Set the scene from SceneManager
     * @param {THREE.Scene} scene - Scene from SceneManager
     */
    setScene(scene) {
        if (scene instanceof THREE.Scene) {
            // Move lighting from old scene to new scene
            if (this.scene) {
                const lights = [];
                this.scene.children.forEach(child => {
                    if (child instanceof THREE.Light) {
                        lights.push(child);
                    }
                });
                lights.forEach(light => {
                    this.scene.remove(light);
                    scene.add(light);
                });
            }
            this.scene = scene;
        }
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

    /**
     * Render the scene
     * @param {THREE.Scene} scene - Optional scene (uses this.scene if not provided)
     * @param {THREE.Camera} camera - Optional camera (uses this.camera if not provided)
     */
    render(scene = null, camera = null) {
        const renderScene = scene || this.scene;
        const renderCamera = camera || this.camera;
        
        if (this.renderer && renderScene && renderCamera) {
            this.renderer.render(renderScene, renderCamera);
        }
    }

    addToScene(object) {
        if (object && object.group) {
            this.scene.add(object.group);
            this.objects.set(object.id || Math.random().toString(), object);
        } else if (object instanceof THREE.Object3D) {
            this.scene.add(object);
            this.objects.set(Math.random().toString(), object);
        }
    }

    removeFromScene(object) {
        if (object && object.group) {
            this.scene.remove(object.group);
            this.objects.delete(object.id);
        } else if (object instanceof THREE.Object3D) {
            this.scene.remove(object);
        }
    }

    clearScene() {
        // Remove all objects
        this.objects.forEach((obj) => {
            this.removeFromScene(obj);
        });
        this.objects.clear();

        // Clear scene but keep lighting
        const childrenToRemove = [];
        this.scene.children.forEach((child) => {
            if (!(child instanceof THREE.Light)) {
                childrenToRemove.push(child);
            }
        });
        childrenToRemove.forEach((child) => {
            this.scene.remove(child);
        });
    }

    resize(width, height) {
        if (this.camera) {
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }
        if (this.renderer) {
            this.renderer.setSize(width, height);
        }
    }

    onWindowResize() {
        this.resize(window.innerWidth, window.innerHeight);
    }

    getScene() {
        return this.scene;
    }

    getCamera() {
        return this.camera;
    }

    getRenderer() {
        return this.renderer;
    }

    dispose() {
        // Dispose of all objects
        this.objects.forEach((obj) => {
            if (obj.dispose) {
                obj.dispose();
            }
        });
        this.objects.clear();

        // Dispose renderer
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

