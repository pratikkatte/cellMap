/**
 * Main application configuration
 */
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
            ribosomes: 20,
            peroxisomes: 3,
            golgi: 1,
            er: 1,
            nucleus: 1,
            vacuole: 1,
            centrosome: 1
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
        },
        {
            id: 'cellular',
            name: 'Cellular Layer',
            enabled: true,
            detailLevel: 'low'
        }
    ]
};

