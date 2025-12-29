import { OrganelleFactoryAdapter } from '../../infrastructure/factories/OrganelleFactoryAdapter.js';
import { Nucleus } from '../../organelles/Nucleus.js';
import { EndoplasmicReticulum } from '../../organelles/EndoplasmicReticulum.js';
import { GolgiApparatus } from '../../organelles/GolgiApparatus.js';
import { Mitochondria } from '../../organelles/Mitochondria.js';
import { Lysosome } from '../../organelles/Lysosome.js';
import { Peroxisome } from '../../organelles/Peroxisome.js';
import { Ribosome } from '../../organelles/Ribosome.js';
import { Vacuole } from '../../organelles/Vacuole.js';
import { Centrosome } from '../../organelles/Centrosome.js';

/**
 * Plugin that registers all default organelles
 */
export const OrganellePlugin = {
    install(context) {
        const { organelleRegistry, materialManager } = context;

        // Register all organelles using adapter pattern
        const organelles = [
            { type: 'nucleus', Class: Nucleus },
            { type: 'endoplasmicReticulum', Class: EndoplasmicReticulum },
            { type: 'golgiApparatus', Class: GolgiApparatus },
            { type: 'mitochondria', Class: Mitochondria },
            { type: 'lysosome', Class: Lysosome },
            { type: 'peroxisome', Class: Peroxisome },
            { type: 'ribosome', Class: Ribosome },
            { type: 'vacuole', Class: Vacuole },
            { type: 'centrosome', Class: Centrosome }
        ];

        organelles.forEach(({ type, Class }) => {
            const factory = new OrganelleFactoryAdapter(type, Class, materialManager);
            organelleRegistry.register(factory);
        });
    }
};

