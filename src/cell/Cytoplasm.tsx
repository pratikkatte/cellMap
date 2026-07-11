import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '../app/store'
import { capsulePoint, mulberry32 } from '../utils/random'

function ParticleClass({ count, size, color, speed, opacity, seed }: { count: number, size: number, color: string, speed: number, opacity: number, seed: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const paused = useAppStore((s) => s.paused)
  const samples = useMemo(() => {
    const random = mulberry32(seed)
    return Array.from({ length: count }, (_, i) => ({ p: new THREE.Vector3(...capsulePoint(random, .285)), phase: random() * Math.PI * 2, scale: .65 + random() * .7, i }))
  }, [count, seed])
  const dummy = useMemo(() => new THREE.Object3D(), [])
  useLayoutEffect(() => {
    samples.forEach((s, i) => { dummy.position.copy(s.p); dummy.scale.setScalar(size * s.scale); dummy.updateMatrix(); mesh.current?.setMatrixAt(i, dummy.matrix) })
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true
  }, [samples, dummy, size])
  useFrame(({ clock }) => {
    if (paused || !mesh.current) return
    const t = clock.elapsedTime * speed
    samples.forEach((s, i) => {
      dummy.position.set(s.p.x + Math.sin(t + s.phase) * .008, s.p.y + Math.sin(t * .73 + s.phase * 1.7) * .006, s.p.z + Math.cos(t * .61 + s.phase) * .007)
      dummy.rotation.set(t * .08 + s.phase, t * .11, 0)
      dummy.scale.setScalar(size * s.scale)
      dummy.updateMatrix(); mesh.current!.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })
  return <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled>
    <icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color={color} transparent opacity={opacity} roughness={.8} />
  </instancedMesh>
}

export function Cytoplasm() {
  const quality = useAppStore((s) => s.quality)
  const density = useAppStore((s) => s.density)
  const layers = useAppStore((s) => s.layers)
  const base = quality === 'high' ? 4000 : quality === 'low' ? 500 : 1500
  const count = Math.floor(base * density)
  if (!layers.cytoplasm) return null
  return <group>
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <capsuleGeometry args={[.3, 1.4, 8, 20]} />
      <meshBasicMaterial color="#183f42" transparent opacity={.055} depthWrite={false} side={THREE.BackSide} />
    </mesh>
    <ParticleClass count={Math.floor(count * .74)} size={.006} color="#8ea8a0" speed={.22} opacity={.42} seed={8} />
    {layers.proteins && <ParticleClass count={Math.floor(count * .21)} size={.013} color="#8e9f73" speed={.13} opacity={.7} seed={15} />}
    <ParticleClass count={Math.floor(count * .05)} size={.004} color="#cbd58c" speed={.32} opacity={.72} seed={27} />
  </group>
}
