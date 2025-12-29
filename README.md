# Cell World - 3D Interactive Exploration

An interactive 3D cell world built with Three.js where you can navigate through a landscape of cells and explore their interior organelles.

## 🏗️ Architecture

This project uses **Clean Architecture** principles with a layered design:

- **Domain Layer**: Core business logic (entities, value objects, interfaces)
- **Application Layer**: Use cases, commands, and application services
- **Infrastructure Layer**: Three.js rendering, input handling, resource management
- **Presentation Layer**: UI controllers and coordination
- **Plugin System**: Extensible architecture for adding features

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation.

## ✨ Features

- **Landscape Mode**: Navigate through a 3D world containing multiple cells
- **Walkthrough Mode**: First-person view to walk through the cell interior
- **Overview Mode**: Google Earth-style orbital view to see all cell components from above
- **Interactive Navigation**: Arrow keys for movement, mouse for looking around
- **All Organelles**: Nucleus, ER, Golgi, Mitochondria, Lysosomes, Peroxisomes, Ribosomes, Vacuole, and Centrosome
- **Extensible Architecture**: Easy to add new organelles, modes, and features through plugins

## 🚀 Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Start the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open your browser to the URL shown (typically `http://localhost:5173`)

## 🎮 Controls

### Landscape Mode
- **Arrow Keys / WASD**: Move forward, backward, left, right
- **Mouse**: Click to enable mouse look (pointer lock)
- **Click on a cell**: Enter the cell interior

### Walkthrough Mode (Inside Cell)
- **Arrow Keys / WASD**: Walk through the cell
- **Q / Space**: Move up
- **Z / Shift**: Move down
- **Mouse**: Look around (click to enable pointer lock)
- **Mouse Wheel**: Zoom out to Overview mode
- **E Key**: Exit cell and return to landscape

### Overview Mode (Google Earth Style)
- **Mouse Drag**: Rotate around the cell
- **Right-Click Drag**: Pan the view
- **Mouse Wheel / Pinch**: Zoom in/out
- **Zoom in**: Transition to Walkthrough mode
- **Zoom out**: Transition to Landscape mode
- **E Key**: Exit cell and return to landscape

## 🎯 How to Play

1. **Start in landscape mode** - you'll see multiple cells floating in space
2. **Navigate toward a cell** - use arrow keys to move around
3. **Enter the cell** - click on a cell or zoom in to enter
4. **Explore the cell**:
   - **Walkthrough Mode**: Walk through the cell like you're inside it
   - **Overview Mode**: See all organelles from different angles
   - **Zoom in/out**: Seamlessly transition between modes
5. **Exit the cell** - Press 'E' or zoom out to return to the landscape

## 📁 Project Structure

```
cellMap/
├── ARCHITECTURE.md          # Detailed architecture documentation
├── index.html               # Main HTML entry point
├── package.json             # Dependencies
├── README.md                # This file
├── src/
│   ├── main.js             # Application entry point
│   │
│   ├── domain/             # Domain Layer (Core Business Logic)
│   │   ├── entities/       # Domain entities (Cell, Organelle, Landscape)
│   │   ├── valueObjects/   # Value objects (Position, Color)
│   │   ├── interfaces/     # Domain interfaces
│   │   └── services/       # Domain services
│   │
│   ├── application/        # Application Layer (Use Cases)
│   │   ├── commands/       # Command pattern implementations
│   │   ├── useCases/       # Application use cases
│   │   ├── repositories/   # Data access abstractions
│   │   └── modes/          # Navigation modes
│   │
│   ├── infrastructure/     # Infrastructure Layer (Three.js)
│   │   ├── rendering/      # Three.js renderers
│   │   ├── input/         # Input handlers
│   │   ├── resources/     # Resource managers
│   │   └── factories/     # Factory implementations
│   │
│   ├── presentation/       # Presentation Layer (UI)
│   │   └── controllers/   # Application controllers
│   │
│   ├── plugins/            # Plugin System
│   │   ├── organelles/    # Organelle plugins
│   │   └── examples/      # Example plugins
│   │
│   ├── organelles/         # Legacy organelles (using adapter pattern)
│   ├── utils/             # Utility functions
│   └── styles.css         # Styles
```

## 🔌 Extending the Application

### Adding a New Organelle

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed instructions. Quick example:

1. Create your organelle class in `src/organelles/`
2. Create a plugin that registers it:
```javascript
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

3. Register the plugin in `main.js`

### Adding a New Navigation Mode

1. Create a mode class extending `NavigationMode`
2. Register it with `ModeManager`
3. Add transition logic in `CellWorldController`

See `src/plugins/examples/CustomOrganelleExample.js` for a complete example.

## 🛠️ Technologies

- **Three.js** (r160+) - 3D graphics library
- **Vanilla JavaScript** (ES6 modules) - No framework dependencies
- **Vite** - Development server and build tool
- **Clean Architecture** - Layered architecture pattern
- **SOLID Principles** - Object-oriented design principles
- **Domain-Driven Design** - Domain-centric design approach

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture documentation
- [src/plugins/examples/](./src/plugins/examples/) - Example plugins

## 🎨 Design Principles

- **Separation of Concerns**: Each layer has a specific responsibility
- **Dependency Inversion**: High-level modules don't depend on low-level modules
- **Open/Closed Principle**: Open for extension, closed for modification
- **Single Responsibility**: Each class has one reason to change
- **Plugin Architecture**: Extensible through plugins

## 🚧 Future Enhancements

- More detailed organelles (ribosomes, vesicles, etc.)
- Molecular-level visualization
- Simulation capabilities
- Educational annotations
- VR/AR support
- Multiplayer capabilities

## 📝 License

[Add your license here]

## 🤝 Contributing

Contributions are welcome! Please read the architecture documentation first to understand the design patterns used.
