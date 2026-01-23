/**
 * Manages plugins for extensibility
 */
export class PluginManager {
    constructor() {
        this.plugins = new Map();
        this.installedPlugins = new Map();
        this.engine = null;
    }

    /**
     * Initialize plugin manager with engine
     * @param {Engine} engine - Engine instance
     */
    async initialize(engine) {
        this.engine = engine;
    }

    /**
     * Register a plugin
     * @param {string} name - Plugin name
     * @param {Object} plugin - Plugin object with install method
     */
    register(name, plugin) {
        if (!plugin || typeof plugin.install !== 'function') {
            throw new Error('Plugin must have an install method');
        }
        this.plugins.set(name, plugin);
    }

    /**
     * Install a plugin
     * @param {string} name - Plugin name
     * @param {Object} context - Context object passed to install method
     */
    install(name, context) {
        const plugin = this.plugins.get(name);
        if (!plugin) {
            throw new Error(`Plugin ${name} not found`);
        }
        plugin.install(context);
        this.installedPlugins.set(name, plugin);
    }

    /**
     * Install all registered plugins
     * @param {Object} context - Context object passed to install methods
     */
    installAll(context) {
        this.plugins.forEach((plugin, name) => {
            try {
                plugin.install(context);
                this.installedPlugins.set(name, plugin);
            } catch (error) {
                console.error(`Error installing plugin ${name}:`, error);
            }
        });
    }

    /**
     * Update all installed plugins
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        this.installedPlugins.forEach((plugin) => {
            if (plugin.update && typeof plugin.update === 'function') {
                plugin.update(deltaTime);
            }
        });
    }

    /**
     * Check if a plugin is registered
     * @param {string} name
     * @returns {boolean}
     */
    has(name) {
        return this.plugins.has(name);
    }

    /**
     * Get all registered plugin names
     * @returns {string[]}
     */
    getRegisteredPlugins() {
        return Array.from(this.plugins.keys());
    }
}

