/**
 * Cell-specific configuration
 */
export default {
    defaultRadius: 8,
    membraneOpacity: 0.2,
    membraneColor: 0x00ff00,
    cytoplasmColor: 0x0000ff,
    organelleCount: {
        mitochondria: 4,
        lysosomes: 6,
        ribosomes: 20,
        peroxisomes: 3,
        golgi: 1,
        er: 1,
        nucleus: 1,
        vacuole: 1,
        centrosome: 1
    },
    organellePositions: {
        // Relative positions within cell (normalized)
        nucleus: { x: 0, y: 0, z: 0 },
        mitochondria: [
            { x: 0.3, y: 0.2, z: 0.3 },
            { x: -0.3, y: 0.2, z: 0.3 },
            { x: 0.3, y: -0.2, z: -0.3 },
            { x: -0.3, y: -0.2, z: -0.3 }
        ]
    }
};

