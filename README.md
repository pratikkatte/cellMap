# Inside a Bacterial Cell

An immersive, browser-based exploration of a simplified *Escherichia coli*-inspired Gram-negative bacterium. The experience is built with React, TypeScript, Vite, Three.js, React Three Fiber, Drei, and Zustand. All biological forms are procedural; there are no downloaded 3D models or texture assets.

## Run locally

```bash
npm install
npm run dev
```

Open the local address printed by Vite. To create a production bundle:

```bash
npm run build
npm run preview
```

The output in `dist/` is a static application and can be deployed to any static host.

## Controls

### Exterior orbit

- Left drag: orbit
- Scroll: zoom
- Right drag: pan
- Click a structure or its name: select and focus
- `R`: reset the camera
- **Enter cell**: transition to interior exploration

### Interior exploration

- `W A S D`: move
- Mouse: look after double-clicking the scene
- `Q` / `E`: move down / up
- `Shift`: move faster
- `Escape`: release the pointer
- **Exit cell**: return to exterior orbit

Movement is deliberately slow, and a capsule-shaped boundary keeps the camera near the cell interior.

### Guided tour

Choose **Guided tour** and use Previous/Next to visit ten stops covering the complete cell, envelope, cytoplasm, nucleoid, ribosomes, coupled gene expression, and motility apparatus.

## Features and architecture

- Nested capsule layers represent the outer membrane, periplasm, thin peptidoglycan mesh, inner membrane, and cytoplasmic volume.
- Deterministically distributed instanced meshes render LPS-like stalks, porins, pili, ribosomes, metabolites, proteins, ions, and periplasmic particles without creating a React component for every molecule.
- The main chromosome is a closed, highly folded procedural curve with DNA-associated particles. It occupies an irregular translucent density field that is explicitly not a membrane.
- Plasmids are separate closed DNA loops.
- The flagellar basal body spans the envelope and drives a subtly rotating external helical filament. Pili are shorter and thinner.
- A sixteen-second coupled transcription/translation sequence highlights DNA, moves an RNA-polymerase-like complex, grows mRNA, recruits ribosomes before transcription finishes, and produces a nascent protein.
- A source-aware lac-operon perturbation experiment explores inducer level, glucose context, history dependence, population heterogeneity, lacZYA transcription, coupled translation, cytoplasmic LacZ, and inner-membrane LacY. Regulatory behavior is grounded in Ozbudak et al. (Nature, 2004); spatial counts and animation timing remain explicitly illustrative.
- A Keio/Nichols chemical-genetic experiment compares a TolC+ envelope with the Keio ΔtolC deletion under chloramphenicol, erythromycin, or ciprofloxacin exposure. The displayed concentrations and normalized fitness scores are exact subsets of Nichols et al. (Cell, 2011); drug paths, accumulation, and target engagement are clearly labeled explanatory encodings rather than measured trajectories.
- Two separate oxygen-withdrawal research examples use the same *E. coli* K-12 MG1655 and glucose-minimal-medium context. **PRECISE response** presents the eight largest iModulon activity shifts from 92 transcriptome-derived programs. **iML1515 metabolism** independently presents a parsimonious flux-balance prediction with reduced respiratory growth and increased formate, acetate, and ethanol secretion.
- Zustand owns coarse application state only. Per-particle animation stays inside the Three.js render loop and uses pooled transforms rather than per-frame React updates.
- Biological descriptions and tour content live in `src/data/` rather than UI components.
- Camera-aware membrane opacity exposes nearby layers as the viewer approaches the cell.
- WebGL failure has a readable fallback instead of leaving a blank screen.

## Quality settings

| Setting | Visible ribosomes | Cytoplasmic particles | Device pixel ratio |
| --- | ---: | ---: | ---: |
| Low | up to 150 | up to 500 | capped around 1.0 |
| Medium | up to 400 | up to 1,500 | capped around 1.5 |
| High | up to 800 | up to 4,000 | capped around 2.0 |

The density slider scales these counts from 25–100%. Adaptive DPR, low-poly shared geometry, instancing, deterministic procedural movement, frustum culling, and restrained lighting keep the experience responsive on integrated graphics. The production JavaScript bundle is well below the requested 10–15 MB initial-load target.

## Scientific scope and simplifications

This is an educational visualization, not a molecular-dynamics simulation. It preserves the major spatial and biological relationships of a Gram-negative prokaryote:

- There is no nucleus or other membrane-bound organelle.
- The thin peptidoglycan layer lies in the periplasm between the outer and inner membranes.
- ATP synthase and respiratory activity are associated with the inner membrane, not mitochondria.
- The nucleoid has no membrane, and ribosomes are somewhat excluded from its densest center.
- Transcription and translation share the cytoplasm and can be coupled without a nuclear-export step.
- The flagellar motor crosses the envelope and connects directly to its external filament.

Molecular sizes, concentrations, motion amplitudes, surface coverage, opacity, and abundance are visually compressed or enlarged for clarity and browser performance. The displayed population is representative rather than quantitative. Cytoplasmic motion uses smooth bounded drift rather than solvent-scale diffusion, and complex protein structures are recognizable abstractions rather than atomistic models.

The systems-response example deliberately keeps evidence types distinct. PRECISE iModulon activities are ICA-derived from measured RNA profiles and are reported in activity units, not expression fold changes. iML1515 fluxes are predictions from one parsimonious optimum at 99.9% of maximum growth with glucose uptake capped at 10 mmol gDW⁻¹ h⁻¹; the anaerobic condition closes oxygen exchange. Those fluxes are constraint-dependent and should not be interpreted as direct measurements.

## Connecting future data or models

The procedural abstractions can be replaced incrementally without changing the UI or exploration model. Experimentally derived structures could be loaded as compressed glTF assets in `src/cell/`, cryo-electron-tomography density could feed a dedicated volume shader, quantitative abundance tables could drive the quality-count maps, and measured trajectories or reaction events could replace seeded motion in the particle systems. Structure metadata and tour stops are already separated so citations, strain-specific values, or experimental annotations can be added independently.

The separate PRECISE and iML1515 examples share a compact, provenance-aware adapter in `src/data/systemsResponse.ts`, but remain distinct UI and animation modes. Future work can replace that static adapter with condition loaders for other PRECISE samples, differential-expression results, proteomics, metabolomics, gene knockouts, or flux ensembles. Model execution can remain offline during dataset preparation so the deployed visualization still works as a static Vite site.
