# Cell World - 3D Interactive Exploration

An interactive 3D cell world built with Three.js where you can navigate through a landscape of cells and explore their interior organelles.

## Features

- **Landscape Mode**: Navigate through a 3D world containing multiple cells
- **Walkthrough Mode**: First-person view to walk through the cell interior
- **Overview Mode**: Google Earth-style orbital view to see all cell components from above
- **Interactive Navigation**: Arrow keys for movement, mouse for looking around
- **All Organelles**: Nucleus, ER, Golgi, Mitochondria, Lysosomes, Peroxisomes, Ribosomes, Vacuole, and Centrosome

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown (typically `http://localhost:5173`)

## Controls

### Landscape Mode
- **Arrow Keys / WASD**: Move forward, backward, left, right
- **Mouse**: Click to enable mouse look (pointer lock)
- Approach a cell to enter it

### Walkthrough Mode (Inside Cell)
- **Arrow Keys / WASD**: Walk through the cell
- **Q / Space**: Move up
- **Z / Shift**: Move down
- **Mouse**: Look around (click to enable pointer lock)
- **M Key**: Switch to Overview mode
- **E Key**: Exit cell and return to landscape

### Overview Mode (Google Earth Style)
- **Mouse Drag**: Rotate around the cell
- **Right-Click Drag**: Pan the view
- **Mouse Wheel**: Zoom in/out
- **M Key**: Switch to Walkthrough mode
- **E Key**: Exit cell and return to landscape

## How to Play

1. **Start in landscape mode** - you'll see multiple cells floating in space
2. **Navigate toward a cell** - use arrow keys to move around
3. **Enter the cell** - when you get close, you'll automatically enter in Walkthrough mode
4. **Explore the cell**:
   - **Walkthrough Mode**: Walk through the cell like you're inside it
   - **Press 'M'** to switch to Overview mode for a Google Earth-style view
   - **Press 'M' again** to switch back to Walkthrough mode
5. **Exit the cell** - Press 'E' to return to the landscape

The Overview mode lets you see all organelles from different angles, zoom in/out, and rotate around the cell - perfect for understanding the cell's structure!

## Project Structure

```
cellMap/
├── index.html              # Main HTML entry point
├── package.json            # Dependencies
├── src/
│   ├── main.js            # Application entry point
│   ├── camera.js          # First-person camera controls
│   ├── world/             # World and cell classes
│   ├── organelles/        # Individual organelle models
│   └── utils/             # Helper utilities
```

## Technologies

- Three.js (r160+)
- Vanilla JavaScript (ES6 modules)
- Vite (development server)

