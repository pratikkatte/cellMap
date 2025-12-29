# CellMap Architecture Documentation

## Overview

CellMap has been designed using **Clean Architecture** principles, following SOLID design patterns and Domain-Driven Design (DDD) concepts. This architecture provides:

- **Separation of Concerns**: Clear boundaries between domain logic, application logic, infrastructure, and presentation
- **Extensibility**: Easy to add new organelles, features, and modes through plugins
- **Testability**: Each layer can be tested independently
- **Maintainability**: Changes in one layer don't affect others

## Architecture Layers

### 1. Domain Layer (`src/domain/`)

The core business logic, independent of frameworks and external concerns.

#### Entities (`src/domain/entities/`)
- **Organelle**: Base class for all organelles
- **Cell**: Aggregate root managing organelles
- **Landscape**: Manages the world outside cells

#### Value Objects (`src/domain/valueObjects/`)
- **Position**: Immutable 3D position
- **Color**: Immutable color representation

#### Interfaces (`src/domain/interfaces/`)
- **IOrganelleFactory**: Interface for creating organelles
- **IRenderer**: Interface for rendering implementations
- **ICameraController**: Interface for camera control
- **IInputHandler**: Interface for input handling

#### Services (`src/domain/services/`)
- **OrganelleRegistry**: Registry for organelle factories
- **CellFactory**: Factory for creating cells with organelles

### 2. Application Layer (`src/application/`)

Contains use cases, commands, and application-specific logic.

#### Commands (`src/application/commands/`)
- **CreateCellCommand**: Creates a new cell
- **AddOrganelleCommand**: Adds an organelle to a cell
- **RemoveOrganelleCommand**: Removes an organelle from a cell

#### Use Cases (`src/application/useCases/`)
- **CreateLandscapeUseCase**: Creates a landscape with multiple cells
- **EnterCellUseCase**: Handles entering a cell interior
- **ExitCellUseCase**: Handles exiting a cell

#### Repositories (`src/application/repositories/`)
- **CellRepository**: Manages cell storage and retrieval

#### Modes (`src/application/modes/`)
- **NavigationMode**: Base class for navigation modes
- **LandscapeMode**: Landscape navigation mode
- **WalkthroughMode**: First-person walkthrough mode
- **OverviewMode**: Orbital camera overview mode
- **ModeManager**: Manages mode transitions

### 3. Infrastructure Layer (`src/infrastructure/`)

Implements domain interfaces using Three.js and browser APIs.

#### Rendering (`src/infrastructure/rendering/`)
- **ThreeRenderer**: Three.js implementation of IRenderer
- **ThreeCameraController**: Base Three.js camera controller
- **FirstPersonCameraController**: First-person camera implementation
- **OrbitalCameraController**: Orbital camera implementation
- **CellRenderer**: Renders cells to Three.js objects
- **OrganelleRenderer**: Renders organelles to Three.js objects
- **LandscapeRenderer**: Renders landscape cells

#### Input (`src/infrastructure/input/`)
- **InputHandler**: Handles keyboard, mouse, and touch input

#### Resources (`src/infrastructure/resources/`)
- **MaterialManager**: Manages Three.js materials

#### Factories (`src/infrastructure/factories/`)
- **OrganelleFactoryAdapter**: Adapter for legacy organelle classes

### 4. Presentation Layer (`src/presentation/`)

UI controllers and coordination logic.

#### Controllers (`src/presentation/controllers/`)
- **ApplicationController**: Base application controller
- **CellWorldController**: Main controller coordinating all layers

### 5. Plugins (`src/plugins/`)

Extensibility system for adding features.

- **PluginManager**: Manages plugin registration and installation
- **OrganellePlugin**: Registers default organelles

## Design Patterns Used

### 1. **Clean Architecture**
- Dependency rule: Inner layers don't depend on outer layers
- Domain layer is framework-agnostic
- Infrastructure implements domain interfaces

### 2. **Repository Pattern**
- Abstracts data access
- `CellRepository` manages cell storage

### 3. **Factory Pattern**
- `CellFactory` creates cells with organelles
- `OrganelleFactoryAdapter` adapts legacy organelles

### 4. **Strategy Pattern**
- Different camera controllers for different modes
- ModeManager switches between strategies

### 5. **Command Pattern**
- Commands encapsulate operations (CreateCellCommand, etc.)

### 6. **Adapter Pattern**
- `OrganelleFactoryAdapter` bridges legacy organelles to new architecture

### 7. **Plugin Pattern**
- Extensible system for adding organelles and features

## Adding New Features

### Adding a New Organelle

1. **Create the organelle class** (if using legacy pattern):
```javascript
// src/organelles/MyOrganelle.js
import * as THREE from 'three';
import { Materials } from '../utils/materials.js';

export class MyOrganelle {
    constructor() {
        this.group = new THREE.Group();
        this.createMyOrganelle();
    }
    
    createMyOrganelle() {
        // Create Three.js objects
    }
    
    update() {
        // Update animation
    }
}
```

2. **Register it in a plugin**:
```javascript
// src/plugins/organelles/MyOrganellePlugin.js
import { OrganelleFactoryAdapter } from '../../infrastructure/factories/OrganelleFactoryAdapter.js';
import { MyOrganelle } from '../../organelles/MyOrganelle.js';

export const MyOrganellePlugin = {
    install(context) {
        const { organelleRegistry, materialManager } = context;
        const factory = new OrganelleFactoryAdapter('myOrganelle', MyOrganelle, materialManager);
        organelleRegistry.register(factory);
    }
};
```

3. **Install the plugin** in `main.js`:
```javascript
import { MyOrganellePlugin } from './plugins/organelles/MyOrganellePlugin.js';

pluginManager.register('myOrganelle', MyOrganellePlugin);
pluginManager.install('myOrganelle', {
    organelleRegistry: controller.organelleRegistry,
    materialManager: controller.materialManager
});
```

### Adding a New Navigation Mode

1. **Create the mode class**:
```javascript
// src/application/modes/MyMode.js
import { NavigationMode } from './NavigationMode.js';

export class MyMode extends NavigationMode {
    constructor(cameraController, inputHandler) {
        super('myMode');
        this.cameraController = cameraController;
        this.inputHandler = inputHandler;
    }

    enter() {
        super.enter();
        // Setup for your mode
    }

    update(deltaTime) {
        if (!this.isActive) return;
        // Update logic
    }
}
```

2. **Register it in ModeManager**:
```javascript
modeManager.registerMode('myMode', new MyMode(cameraController, inputHandler));
```

### Creating a Custom Plugin

```javascript
// src/plugins/myFeature/MyFeaturePlugin.js
export const MyFeaturePlugin = {
    install(context) {
        const { organelleRegistry, cellFactory, modeManager } = context;
        
        // Register organelles
        // Register modes
        // Add custom features
    }
};
```

## Data Flow

1. **User Input** → `InputHandler` → `CellWorldController`
2. **Controller** → `Use Cases` → `Domain Services` → `Entities`
3. **Entities** → `Renderers` → `ThreeRenderer` → **Screen**

## Key Principles

### SOLID Principles

1. **Single Responsibility**: Each class has one reason to change
2. **Open/Closed**: Open for extension, closed for modification
3. **Liskov Substitution**: Subtypes are substitutable
4. **Interface Segregation**: Many specific interfaces
5. **Dependency Inversion**: Depend on abstractions, not concretions

### Domain-Driven Design

- **Entities**: Cell, Organelle, Landscape (have identity)
- **Value Objects**: Position, Color (immutable, no identity)
- **Aggregates**: Cell (aggregate root)
- **Services**: OrganelleRegistry, CellFactory (domain services)

## Testing Strategy

Each layer can be tested independently:

- **Domain Layer**: Pure JavaScript, no dependencies
- **Application Layer**: Mock repositories and services
- **Infrastructure Layer**: Mock Three.js objects
- **Presentation Layer**: Mock all dependencies

## Migration Path

The architecture uses an **Adapter Pattern** to bridge legacy organelles:

- Legacy organelles (`src/organelles/`) work through `OrganelleFactoryAdapter`
- Gradually migrate organelles to new domain model
- New organelles can use the new architecture directly

## Benefits

1. **Flexibility**: Easy to add new organelles, modes, and features
2. **Maintainability**: Clear separation makes code easier to understand
3. **Testability**: Each layer can be tested in isolation
4. **Scalability**: Architecture supports growth and complexity
5. **Extensibility**: Plugin system allows third-party extensions

## Future Enhancements

- Add more detailed organelles (ribosomes, vesicles, etc.)
- Add molecular-level visualization
- Add simulation capabilities
- Add educational annotations
- Add VR/AR support
- Add multiplayer capabilities

