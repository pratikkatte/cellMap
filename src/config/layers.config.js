/**
 * Layer definitions for different detail levels
 */
export default [
    {
        id: 'molecular',
        name: 'Molecular Layer',
        description: 'Shows atoms and molecules',
        enabled: false,
        detailLevel: 'high',
        order: 0
    },
    {
        id: 'organelle',
        name: 'Organelle Layer',
        description: 'Shows cell organelles',
        enabled: true,
        detailLevel: 'medium',
        order: 1
    },
    {
        id: 'cellular',
        name: 'Cellular Layer',
        description: 'Shows cell structure',
        enabled: true,
        detailLevel: 'low',
        order: 2
    },
    {
        id: 'tissue',
        name: 'Tissue Layer',
        description: 'Shows multiple cells forming tissue',
        enabled: false,
        detailLevel: 'low',
        order: 3
    },
    {
        id: 'organ',
        name: 'Organ Layer',
        description: 'Shows tissue groups forming organs',
        enabled: false,
        detailLevel: 'low',
        order: 4
    }
];

