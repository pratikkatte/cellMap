# CellMap Architecture Design

## Overview

This document outlines the state-of-the-art software architecture for the CellMap project. The architecture is designed to be scalable, maintainable, and extensible, supporting multiple layers of detail both inside and outside cells.

## Architecture Principles

1. **Separation of Concerns**: Clear boundaries between layers
2. **Single Responsibility**: Each module has one clear purpose
3. **Open/Closed Principle**: Open for extension, closed for modification
4. **Dependency Inversion**: Depend on abstractions, not concretions
5. **Composition over Inheritance**: Favor composition for flexibility
6. **Event-Driven**: Loose coupling through events
7. **Plugin Architecture**: Extensible through plugins
8. **Configuration-Driven**: Behavior controlled by configuration

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                  Presentation Layer                     │
│  (UI, Rendering, User Interaction, Visual Effects)     │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  Application Layer                      │
│  (Scene Management, Mode Management, Navigation)       │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  Domain Layer                           │
│  (Business Logic, Entities, Domain Services)           │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                   │
│  (Rendering Engine, Resource Loading, I/O)             │
└─────────────────────────────────────────────────────────┘
```

## Proposed Directory Structure

```
cellMap/
├── src/
│   ├── core/                          # Core framework
│   │   ├── Engine.js                 # Main engine orchestrator
│   │   ├── SceneManager.js            # Scene lifecycle management
│   │   ├── Renderer.js                # Rendering abstraction
│   │   ├── ResourceManager.js         # Asset loading & caching
│   │   └── EventBus.js                # Global event system
│   │
│   ├── domain/                        # Domain layer (business logic)
│   │   ├── entities/                  # Domain entities
│   │   │   ├── Cell.js                # Cell entity
│   │   │   ├── Organelle.js           # Base organelle entity
│   │   │   ├── Landscape.js           # Landscape entity
│   │   │   └── Layer.js                # Layer abstraction
│   │   │
│   │   ├── services/                  # Domain services
│   │   │   ├── CellService.js        # Cell business logic
│   │   │   ├── OrganelleService.js    # Organelle operations
│   │   │   ├── LayerService.js        # Layer management
│   │   │   └── NavigationService.js  # Navigation logic
│   │   │
│   │   └── repositories/              # Data access abstraction
│   │       ├── CellRepository.js
│   │       └── OrganelleRepository.js
│   │
│   ├── application/                   # Application layer
│   │   ├── modes/                     # Navigation modes
│   │   │   ├── ModeManager.js         # Mode state machine
│   │   │   ├── LandscapeMode.js
│   │   │   ├── OverviewMode.js
│   │   │   └── WalkthroughMode.js
│   │   │
│   │   ├── controllers/              # Application controllers
│   │   │   ├── CameraController.js   # Camera management
│   │   │   ├── InteractionController.js # User interactions
│   │   │   └── ZoomController.js     # Zoom management
│   │   │
│   │   └── commands/                 # Command pattern
│   │       ├── Command.js             # Base command
│   │       ├── EnterCellCommand.js
│   │       ├── ExitCellCommand.js
│   │       └── SwitchModeCommand.js
│   │
│   ├── infrastructure/                # Infrastructure layer
│   │   ├── rendering/                 # Rendering implementation
│   │   │   ├── ThreeRenderer.js      # Three.js renderer wrapper
│   │   │   ├── MaterialFactory.js    # Material creation
│   │   │   ├── GeometryFactory.js    # Geometry creation
│   │   │   └── ShaderManager.js      # Shader management
│   │   │
│   │   ├── resources/                # Resource loading
│   │   │   ├── TextureLoader.js
│   │   │   ├── ModelLoader.js
│   │   │   └── AssetCache.js
│   │   │
│   │   └── input/                    # Input handling
│   │       ├── KeyboardHandler.js
│   │       ├── MouseHandler.js
│   │       └── TouchHandler.js
│   │
│   ├── presentation/                  # Presentation layer
│   │   ├── components/               # UI components
│   │   │   ├── Component.js          # Base component
│   │   │   ├── ControlPanel.js
│   │   │   ├── ModeIndicator.js
│   │   │   └── InfoPanel.js
│   │   │
│   │   ├── visualizers/              # 3D visualizers
│   │   │   ├── Visualizer.js         # Base visualizer
│   │   │   ├── CellVisualizer.js
│   │   │   ├── OrganelleVisualizer.js
│   │   │   └── LandscapeVisualizer.js
│   │   │
│   │   └── effects/                 # Visual effects
│   │       ├── EffectManager.js
│   │       ├── AnimationSystem.js
│   │       └── ParticleSystem.js
│   │
│   ├── plugins/                      # Plugin system
│   │   ├── Plugin.js                 # Base plugin interface
│   │   ├── PluginManager.js          # Plugin lifecycle
│   │   └── examples/
│   │       ├── OrganellePlugin.js    # Example organelle plugin
│   │       └── LayerPlugin.js       # Example layer plugin
│   │
│   ├── config/                       # Configuration
│   │   ├── app.config.js            # Application config
│   │   ├── render.config.js         # Rendering config
│   │   ├── cell.config.js           # Cell-specific config
│   │   └── layers.config.js         # Layer definitions
│   │
│   ├── utils/                        # Utilities
│   │   ├── math/                    # Math utilities
│   │   ├── geometry/                # Geometry utilities
│   │   └── helpers/                 # General helpers
│   │
│   └── main.js                       # Application entry point
│
├── assets/                           # Static assets
│   ├── models/                      # 3D models
│   ├── textures/                    # Textures
│   ├── shaders/                     # Custom shaders
│   └── data/                        # Data files (JSON, etc.)
│
├── tests/                           # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── docs/                            # Documentation
    ├── architecture/
    ├── api/
    └── guides/
```

## Core Components

### 1. Engine (Core/Engine.js)
**Responsibility**: Main application orchestrator

```javascript
class Engine {
    constructor(config) {
        this.sceneManager = new SceneManager();
        this.renderer = new Renderer();
        this.resourceManager = new ResourceManager();
        this.eventBus = new EventBus();
        this.pluginManager = new PluginManager();
        this.modeManager = new ModeManager();
    }
    
    async initialize() { }
    start() { }
    update(deltaTime) { }
    render() { }
    dispose() { }
}
```

### 2. Event Bus (Core/EventBus.js)
**Responsibility**: Global event communication

```javascript
class EventBus {
    subscribe(event, callback) { }
    unsubscribe(event, callback) { }
    publish(event, data) { }
    once(event, callback) { }
}
```

**Events**:
- `cell:entered`
- `cell:exited`
- `mode:changed`
- `organelle:selected`
- `layer:activated`
- `zoom:changed`

### 3. Scene Manager (Core/SceneManager.js)
**Responsibility**: Scene lifecycle and composition

```javascript
class SceneManager {
    createScene(name) { }
    switchScene(name) { }
    addEntity(entity, scene) { }
    removeEntity(entity, scene) { }
    getCurrentScene() { }
}
```

### 4. Resource Manager (Core/ResourceManager.js)
**Responsibility**: Asset loading and caching

```javascript
class ResourceManager {
    async loadTexture(path) { }
    async loadModel(path) { }
    async loadJSON(path) { }
    getCache() { }
    clearCache() { }
}
```

### 5. Mode Manager (Application/Modes/ModeManager.js)
**Responsibility**: Navigation mode state machine

```javascript
class ModeManager {
    constructor() {
        this.modes = {
            landscape: new LandscapeMode(),
            overview: new OverviewMode(),
            walkthrough: new WalkthroughMode()
        };
        this.currentMode = null;
    }
    
    switchMode(modeName) { }
    getCurrentMode() { }
    canTransition(from, to) { }
}
```

## Domain Layer

### Entity Pattern

```javascript
// Base Entity
class Entity {
    constructor(id, type) {
        this.id = id;
        this.type = type;
        this.components = new Map();
        this.layers = [];
    }
    
    addComponent(component) { }
    getComponent(type) { }
    addLayer(layer) { }
    update(deltaTime) { }
}

// Cell Entity
class Cell extends Entity {
    constructor(id, config) {
        super(id, 'cell');
        this.organelles = [];
        this.membrane = null;
        this.cytoplasm = null;
    }
    
    addOrganelle(organelle) { }
    removeOrganelle(organelle) { }
}

// Organelle Entity (Base)
class Organelle extends Entity {
    constructor(id, type, config) {
        super(id, 'organelle');
        this.type = type;
        this.position = new Vector3();
        this.scale = new Vector3(1, 1, 1);
    }
}
```

### Service Layer

```javascript
// Cell Service
class CellService {
    constructor(cellRepository, eventBus) {
        this.repository = cellRepository;
        this.eventBus = eventBus;
    }
    
    createCell(config) { }
    getCell(id) { }
    updateCell(cell) { }
    addOrganelle(cellId, organelle) { }
}

// Layer Service
class LayerService {
    constructor() {
        this.layers = new Map();
    }
    
    registerLayer(layer) { }
    activateLayer(layerId) { }
    deactivateLayer(layerId) { }
    getLayer(layerId) { }
}
```

## Plugin System

### Plugin Interface

```javascript
class Plugin {
    constructor(name, version) {
        this.name = name;
        this.version = version;
        this.enabled = false;
    }
    
    async initialize(engine) { }
    async activate() { }
    async deactivate() { }
    update(deltaTime) { }
    dispose() { }
}

// Example: Organelle Plugin
class OrganellePlugin extends Plugin {
    constructor() {
        super('CustomOrganelle', '1.0.0');
    }
    
    async initialize(engine) {
        // Register custom organelle
        engine.domain.services.organelleService.registerType('custom', CustomOrganelle);
    }
}
```

## Layer System

### Layer Abstraction

```javascript
class Layer {
    constructor(id, name, config) {
        this.id = id;
        this.name = name;
        this.config = config;
        this.active = false;
        this.entities = [];
        this.visualizer = null;
    }
    
    activate() { }
    deactivate() { }
    addEntity(entity) { }
    removeEntity(entity) { }
    update(deltaTime) { }
}

// Example Layers:
// - Molecular Layer (atoms, molecules)
// - Organelle Layer (current organelles)
// - Cellular Layer (cell structure)
// - Tissue Layer (multiple cells)
// - Organ Layer (tissue groups)
```

## Configuration System

### Configuration Structure

```javascript
// app.config.js
export default {
    rendering: {
        antialias: true,
        shadowMap: true,
        shadowMapType: 'PCFSoft',
        pixelRatio: 'auto'
    },
    
    navigation: {
        zoomSpeed: 0.5,
        moveSpeed: 0.5,
        distanceThresholds: {
            walkthrough: 5,
            overview: 15,
            landscape: 15
        }
    },
    
    cells: {
        defaultRadius: 8,
        membraneOpacity: 0.2,
        organelleCount: {
            mitochondria: 4,
            lysosomes: 6,
            // ...
        }
    },
    
    layers: [
        {
            id: 'molecular',
            name: 'Molecular Layer',
            enabled: false,
            detailLevel: 'high'
        },
        {
            id: 'organelle',
            name: 'Organelle Layer',
            enabled: true,
            detailLevel: 'medium'
        }
    ]
};
```

## Design Patterns

### 1. Factory Pattern
- `MaterialFactory`: Creates materials
- `GeometryFactory`: Creates geometries
- `OrganelleFactory`: Creates organelles
- `VisualizerFactory`: Creates visualizers

### 2. Strategy Pattern
- `CameraStrategy`: Different camera behaviors per mode
- `RenderingStrategy`: Different rendering approaches
- `InteractionStrategy`: Different interaction modes

### 3. Observer Pattern
- Event Bus for loose coupling
- Entity observers for updates

### 4. Command Pattern
- Undo/redo support
- Command queue for actions

### 5. Component Pattern
- Entity-Component-System (ECS) for flexibility
- Reusable components

## State Management

```javascript
class StateManager {
    constructor() {
        this.state = {
            currentMode: 'landscape',
            currentCell: null,
            activeLayers: [],
            camera: {
                position: new Vector3(),
                rotation: new Euler()
            }
        };
        this.listeners = [];
    }
    
    setState(updates) { }
    getState() { }
    subscribe(callback) { }
}
```

## Performance Optimization

1. **Level of Detail (LOD)**: Different detail levels based on distance
2. **Frustum Culling**: Only render visible objects
3. **Occlusion Culling**: Skip hidden objects
4. **Instancing**: Batch similar objects
5. **Texture Atlasing**: Combine textures
6. **Geometry Pooling**: Reuse geometries
7. **Update Scheduling**: Prioritize updates

## Testing Strategy

1. **Unit Tests**: Test individual components
2. **Integration Tests**: Test layer interactions
3. **E2E Tests**: Test user workflows
4. **Performance Tests**: Benchmark rendering

## Migration Plan

### Phase 1: Core Infrastructure
1. Create core framework (Engine, EventBus, SceneManager)
2. Implement resource management
3. Set up configuration system

### Phase 2: Domain Layer
1. Refactor entities to domain layer
2. Implement services
3. Create repositories

### Phase 3: Application Layer
1. Refactor modes to application layer
2. Implement controllers
3. Add command pattern

### Phase 4: Presentation Layer
1. Create visualizer system
2. Implement component system
3. Add effect system

### Phase 5: Plugin System
1. Implement plugin interface
2. Create plugin manager
3. Migrate organelles to plugins

### Phase 6: Layer System
1. Implement layer abstraction
2. Create layer service
3. Add layer configuration

## Benefits of This Architecture

1. **Scalability**: Easy to add new features
2. **Maintainability**: Clear separation of concerns
3. **Testability**: Each layer can be tested independently
4. **Extensibility**: Plugin system allows easy extensions
5. **Flexibility**: Configuration-driven behavior
6. **Performance**: Optimized rendering pipeline
7. **Collaboration**: Clear structure for team development

## Next Steps

1. Review and approve architecture
2. Create detailed implementation plan
3. Set up project structure
4. Begin Phase 1 migration
5. Establish coding standards and guidelines
