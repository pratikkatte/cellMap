import * as THREE from 'three';

/**
 * Manages scene lifecycle and composition
 * Handles multiple scenes and entity management
 */
export class SceneManager {
    constructor() {
        this.scenes = new Map();
        this.currentSceneName = null;
    }

    /**
     * Create a new scene
     * @param {string} name - Scene name
     * @returns {THREE.Scene} Created scene
     */
    createScene(name) {
        if (this.scenes.has(name)) {
            throw new Error(`Scene ${name} already exists`);
        }
        const scene = new THREE.Scene();
        this.scenes.set(name, scene);
        return scene;
    }

    /**
     * Switch to a different scene
     * @param {string} name - Scene name
     * @returns {THREE.Scene} Current scene
     */
    switchScene(name) {
        if (!this.scenes.has(name)) {
            throw new Error(`Scene ${name} does not exist`);
        }
        this.currentSceneName = name;
        return this.getCurrentScene();
    }

    /**
     * Add an entity to a scene
     * @param {Object} entity - Entity with mesh or group property
     * @param {string} sceneName - Optional scene name (uses current if not provided)
     */
    addEntity(entity, sceneName = null) {
        const scene = sceneName ? this.getScene(sceneName) : this.getCurrentScene();
        if (!scene) {
            throw new Error('No scene available');
        }
        
        // Handle different entity types
        let obj = null;
        if (entity.mesh) {
            obj = entity.mesh;
        } else if (entity.group) {
            obj = entity.group;
        } else if (entity instanceof THREE.Object3D) {
            obj = entity;
        }
        
        if (obj) {
            scene.add(obj);
        }
    }

    /**
     * Remove an entity from a scene
     * @param {Object} entity - Entity to remove
     * @param {string} sceneName - Optional scene name
     */
    removeEntity(entity, sceneName = null) {
        const scene = sceneName ? this.getScene(sceneName) : this.getCurrentScene();
        if (!scene) {
            return;
        }
        
        let obj = null;
        if (entity.mesh) {
            obj = entity.mesh;
        } else if (entity.group) {
            obj = entity.group;
        } else if (entity instanceof THREE.Object3D) {
            obj = entity;
        }
        
        if (obj) {
            scene.remove(obj);
        }
    }

    /**
     * Get the current scene
     * @returns {THREE.Scene|null} Current scene
     */
    getCurrentScene() {
        if (!this.currentSceneName) {
            return null;
        }
        return this.scenes.get(this.currentSceneName);
    }

    /**
     * Get a scene by name
     * @param {string} name - Scene name
     * @returns {THREE.Scene|undefined} Scene
     */
    getScene(name) {
        return this.scenes.get(name);
    }

    /**
     * Remove a scene and dispose of its resources
     * @param {string} name - Scene name
     */
    removeScene(name) {
        const scene = this.scenes.get(name);
        if (scene) {
            // Dispose of all objects in scene
            scene.traverse((object) => {
                if (object.geometry) {
                    object.geometry.dispose();
                }
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(m => m.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
            this.scenes.delete(name);
            
            // If removed scene was current, clear current
            if (this.currentSceneName === name) {
                this.currentSceneName = null;
            }
        }
    }

    /**
     * Get current scene name
     * @returns {string|null} Current scene name
     */
    getCurrentSceneName() {
        return this.currentSceneName;
    }

    /**
     * Check if a scene exists
     * @param {string} name - Scene name
     * @returns {boolean} True if scene exists
     */
    hasScene(name) {
        return this.scenes.has(name);
    }
}

