import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { BacteriumScene } from '../scene/BacteriumScene'
import { useAppStore } from './store'
import { TopBar } from '../ui/TopBar'
import { IntroModal } from '../ui/IntroModal'
import { StructurePanel } from '../ui/StructurePanel'
import { DetailsPanel } from '../ui/DetailsPanel'
import { TourPanel } from '../ui/TourPanel'
import { NavigationHint } from '../ui/NavigationHint'
import { LacExperimentPanel } from '../ui/LacExperimentPanel'
import { KnockoutDrugPanel } from '../ui/KnockoutDrugPanel'
import { SystemsResponsePanel } from '../ui/SystemsResponsePanel'

class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('3D scene error', error, info) }
  render() { return this.state.failed ? <div className="webgl-fallback"><h2>The 3D cell could not be rendered</h2><p>Try enabling hardware acceleration or opening this experience in a current desktop browser with WebGL support.</p></div> : this.props.children }
}

function hasWebGL() {
  try { const canvas = document.createElement('canvas'); return Boolean(window.WebGL2RenderingContext && canvas.getContext('webgl2')) } catch { return false }
}

export default function App() {
  const quality = useAppStore((s) => s.quality)
  const lacPanelOpen = useAppStore((s) => s.lacPanelOpen)
  const knockoutPanelOpen = useAppStore((s) => s.knockoutPanelOpen)
  const systemsPanelOpen = useAppStore((s) => s.systemsPanelOpen)
  const cap = quality === 'high' ? 2 : quality === 'low' ? 1 : 1.5
  return <main className="app-shell">
    <SceneErrorBoundary>
      {hasWebGL() ? <Canvas className="scene-canvas" camera={{ position: [2.7, 1.6, 2.8], fov: 48, near: .008, far: 30 }} dpr={[.75, cap]} gl={{ antialias: quality !== 'low', alpha: false, powerPreference: 'high-performance' }}>
        <BacteriumScene />
      </Canvas> : <div className="webgl-fallback"><h2>WebGL is unavailable</h2><p>This interactive 3D experience needs a modern browser with WebGL 2 and hardware acceleration enabled.</p></div>}
    </SceneErrorBoundary>
    <div className="vignette" />
    <TopBar /><StructurePanel />{systemsPanelOpen ? <SystemsResponsePanel /> : knockoutPanelOpen ? <KnockoutDrugPanel /> : lacPanelOpen ? <LacExperimentPanel /> : <DetailsPanel />}<TourPanel /><NavigationHint /><IntroModal />
  </main>
}
