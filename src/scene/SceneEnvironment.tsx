import { useMemo } from 'react'
import { Points, PointMaterial } from '@react-three/drei'
import { mulberry32 } from '../utils/random'

export function SceneEnvironment() {
  const positions = useMemo(() => {
    const random = mulberry32(98)
    const values = new Float32Array(900)
    for (let i = 0; i < values.length; i += 3) {
      const r = 2.4 + random() * 4.5
      const a = random() * Math.PI * 2
      const z = (random() * 2 - 1) * 3
      values[i] = Math.cos(a) * r; values[i + 1] = Math.sin(a) * r; values[i + 2] = z
    }
    return values
  }, [])
  return <>
    <color attach="background" args={['#050a0c']} />
    <fogExp2 attach="fog" args={['#071113', .085]} />
    <Points positions={positions} stride={3} frustumCulled>
      <PointMaterial transparent color="#789190" size={.012} sizeAttenuation depthWrite={false} opacity={.28} />
    </Points>
  </>
}
