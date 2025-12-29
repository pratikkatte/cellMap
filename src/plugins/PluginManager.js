/**
 * Manages plugins for extensibility
 */
export class PluginManager {
    constructor() {
        this.plugins = new Map();
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
    }

    /**
     * Install all registered plugins
     * @param {Object} context - Context object passed to install methods
     */
    installAll(context) {
        this.plugins.forEach((plugin, name) => {
            try {
                plugin.install(context);
            } catch (error) {
                console.error(`Error installing plugin ${name}:`, error);
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

