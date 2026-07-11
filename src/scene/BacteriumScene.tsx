import { AdaptiveDpr } from '@react-three/drei'
import { Bacterium } from '../cell/Bacterium'
import { CameraController } from './CameraController'
import { SceneEnvironment } from './SceneEnvironment'
import { SceneLighting } from './SceneLighting'
import { useAppStore } from '../app/store'

export function BacteriumScene() {
  const setSelected = useAppStore((s) => s.setSelected)
  return <>
    <SceneEnvironment />
    <SceneLighting />
    <group rotation={[.08, -.2, .09]} onPointerMissed={() => setSelected(null)}><Bacterium /></group>
    <CameraController />
    <AdaptiveDpr pixelated />
  </>
}
