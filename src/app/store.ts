import { create } from 'zustand'
import type { CameraMode, LayerId, Quality, StructureId } from './types'

const allLayers: Record<LayerId, boolean> = {
  outerMembrane: true,
  peptidoglycan: true,
  innerMembrane: true,
  cytoplasm: true,
  nucleoid: true,
  ribosomes: true,
  proteins: true,
  membraneComplexes: true,
  pili: true,
  flagellum: true,
}

interface AppState {
  introOpen: boolean
  leftOpen: boolean
  rightOpen: boolean
  selected: StructureId | null
  hovered: StructureId | null
  mode: CameraMode
  quality: Quality
  density: number
  paused: boolean
  layers: Record<LayerId, boolean>
  tourIndex: number
  processActive: boolean
  resetNonce: number
  setIntroOpen: (value: boolean) => void
  setSelected: (value: StructureId | null) => void
  setHovered: (value: StructureId | null) => void
  setMode: (value: CameraMode) => void
  setQuality: (value: Quality) => void
  setDensity: (value: number) => void
  togglePaused: () => void
  toggleLayer: (id: LayerId) => void
  setLayers: (layers: Partial<Record<LayerId, boolean>>) => void
  setTourIndex: (value: number) => void
  setProcessActive: (value: boolean) => void
  togglePanel: (side: 'left' | 'right') => void
  resetCamera: () => void
}

export const useAppStore = create<AppState>((set) => ({
  introOpen: true,
  leftOpen: true,
  rightOpen: true,
  selected: null,
  hovered: null,
  mode: 'exterior',
  quality: 'medium',
  density: 0.75,
  paused: false,
  layers: allLayers,
  tourIndex: 0,
  processActive: false,
  resetNonce: 0,
  setIntroOpen: (introOpen) => set({ introOpen }),
  setSelected: (selected) => set((state) => ({ selected, rightOpen: selected ? true : state.rightOpen })),
  setHovered: (hovered) => set({ hovered }),
  setMode: (mode) => set({ mode }),
  setQuality: (quality) => set({ quality }),
  setDensity: (density) => set({ density }),
  togglePaused: () => set((state) => ({ paused: !state.paused })),
  toggleLayer: (id) => set((state) => ({ layers: { ...state.layers, [id]: !state.layers[id] } })),
  setLayers: (layers) => set((state) => ({ layers: { ...state.layers, ...layers } })),
  setTourIndex: (tourIndex) => set({ tourIndex }),
  setProcessActive: (processActive) => set({ processActive }),
  togglePanel: (side) => set((state) => side === 'left' ? { leftOpen: !state.leftOpen } : { rightOpen: !state.rightOpen }),
  resetCamera: () => set((state) => ({ mode: 'exterior', resetNonce: state.resetNonce + 1, selected: null })),
}))
