import * as THREE from 'three';

/**
 * Asset loading and caching
 * Manages textures, models, and JSON data
 */
export class ResourceManager {
    constructor() {
        this.cache = new Map();
        this.textureLoader = new THREE.TextureLoader();
        this.modelLoader = new THREE.ObjectLoader();
        this.loadingPromises = new Map();
    }

    /**
     * Load a texture
     * @param {string} path - Path to texture
     * @returns {Promise<THREE.Texture>} Loaded texture
     */
    async loadTexture(path) {
        if (this.cache.has(path)) {
            return this.cache.get(path);
        }
        
        // If already loading, return the existing promise
        if (this.loadingPromises.has(path)) {
            return this.loadingPromises.get(path);
        }
        
        const promise = new Promise((resolve, reject) => {
            this.textureLoader.load(
                path,
                (texture) => {
                    this.cache.set(path, texture);
                    this.loadingPromises.delete(path);
                    resolve(texture);
                },
                undefined,
                (error) => {
                    this.loadingPromises.delete(path);
                    reject(error);
                }
            );
        });
        
        this.loadingPromises.set(path, promise);
        return promise;
    }

    /**
     * Load a 3D model
     * @param {string} path - Path to model
     * @returns {Promise<THREE.Object3D>} Loaded model
     */
    async loadModel(path) {
        if (this.cache.has(path)) {
            return this.cache.get(path);
        }
        
        if (this.loadingPromises.has(path)) {
            return this.loadingPromises.get(path);
        }
        
        const promise = new Promise((resolve, reject) => {
            this.modelLoader.load(
                path,
                (model) => {
                    this.cache.set(path, model);
                    this.loadingPromises.delete(path);
                    resolve(model);
                },
                undefined,
                (error) => {
                    this.loadingPromises.delete(path);
                    reject(error);
                }
            );
        });
        
        this.loadingPromises.set(path, promise);
        return promise;
    }

    /**
     * Load JSON data
     * @param {string} path - Path to JSON file
     * @returns {Promise<Object>} Parsed JSON data
     */
    async loadJSON(path) {
        if (this.cache.has(path)) {
            return this.cache.get(path);
        }
        
        if (this.loadingPromises.has(path)) {
            return this.loadingPromises.get(path);
        }
        
        const promise = fetch(path)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${path}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                this.cache.set(path, data);
                this.loadingPromises.delete(path);
                return data;
            })
            .catch(error => {
                this.loadingPromises.delete(path);
                throw error;
            });
        
        this.loadingPromises.set(path, promise);
        return promise;
    }

    /**
     * Get cached resource
     * @param {string} path - Resource path
     * @returns {*} Cached resource or undefined
     */
    get(path) {
        return this.cache.get(path);
    }

    /**
     * Get the cache
     * @returns {Map} Cache map
     */
    getCache() {
        return this.cache;
    }

    /**
     * Clear the cache
     */
    clearCache() {
        // Dispose textures and other resources
        this.cache.forEach((resource) => {
            if (resource && typeof resource.dispose === 'function') {
                resource.dispose();
            }
        });
        this.cache.clear();
        this.loadingPromises.clear();
    }

    /**
     * Preload multiple resources
     * @param {Array<string>} paths - Array of resource paths
     * @returns {Promise<Array>} Promise resolving to array of loaded resources
     */
    async preload(paths) {
        const promises = paths.map(path => {
            // Try to determine type from extension
            if (path.endsWith('.json')) {
                return this.loadJSON(path);
            } else if (path.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                return this.loadTexture(path);
            } else {
                return this.loadModel(path);
            }
        });
        
        return Promise.all(promises);
    }
}

