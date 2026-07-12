import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '../app/store'
import { capsulePoint, mulberry32 } from '../utils/random'

export function Ribosomes() {
  const large = useRef<THREE.InstancedMesh>(null)
  const small = useRef<THREE.InstancedMesh>(null)
  const quality = useAppStore((s) => s.quality)
  const density = useAppStore((s) => s.density)
  const paused = useAppStore((s) => s.paused)
  const layers = useAppStore((s) => s.layers)
  const selected = useAppStore((s) => s.selected)
  const setSelected = useAppStore((s) => s.setSelected)
  const setHovered = useAppStore((s) => s.setHovered)
  const lacPanelOpen = useAppStore((s) => s.lacPanelOpen)
  const knockoutPanelOpen = useAppStore((s) => s.knockoutPanelOpen)
  const systemsPanelOpen = useAppStore((s) => s.systemsPanelOpen)
  const base = quality === 'high' ? 800 : quality === 'low' ? 150 : 400
  const count = Math.floor(base * density)
  const samples = useMemo(() => {
    const random = mulberry32(821)
    const result: { p: THREE.Vector3; phase: number; scale: number; q: THREE.Quaternion }[] = []
    while (result.length < count) {
      const p = new THREE.Vector3(...capsulePoint(random, .278))
      const core = (p.x / .54) ** 2 + (p.y / .15) ** 2 + (p.z / .17) ** 2
      if (core < 1 && random() < .78) continue
      result.push({ p, phase: random() * Math.PI * 2, scale: .82 + random() * .42, q: new THREE.Quaternion().setFromEuler(new THREE.Euler(random() * 3, random() * 3, random() * 3)) })
    }
    return result
  }, [count])
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useLayoutEffect(() => {
    if (!large.current || !small.current) return
    samples.forEach((s, i) => {
      dummy.position.copy(s.p); dummy.quaternion.copy(s.q); dummy.scale.setScalar(s.scale); dummy.updateMatrix(); large.current!.setMatrixAt(i, dummy.matrix)
      dummy.position.y += .015 * s.scale; dummy.position.x += .006; dummy.scale.setScalar(s.scale * .72); dummy.updateMatrix(); small.current!.setMatrixAt(i, dummy.matrix)
    })
    large.current.instanceMatrix.needsUpdate = true; small.current.instanceMatrix.needsUpdate = true
  }, [samples, dummy])

  useFrame(({ clock }) => {
    if (paused || !large.current || !small.current) return
    const t = clock.elapsedTime
    samples.forEach((s, i) => {
      dummy.position.set(s.p.x + Math.sin(t * .17 + s.phase) * .004, s.p.y + Math.sin(t * .11 + s.phase * 2) * .004, s.p.z + Math.cos(t * .13 + s.phase) * .004)
      dummy.quaternion.copy(s.q).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, t * .035, 0)))
      dummy.scale.setScalar(s.scale); dummy.updateMatrix(); large.current!.setMatrixAt(i, dummy.matrix)
      dummy.position.y += .015 * s.scale; dummy.position.x += .006; dummy.scale.setScalar(s.scale * .72); dummy.updateMatrix(); small.current!.setMatrixAt(i, dummy.matrix)
    })
    large.current.instanceMatrix.needsUpdate = true; small.current.instanceMatrix.needsUpdate = true
  })
  if (!layers.ribosomes) return null
  const opacity = (selected && selected !== 'ribosome' ? .3 : 1) * (lacPanelOpen || knockoutPanelOpen || systemsPanelOpen ? .2 : 1)
  const events = {
    onClick: (e: { stopPropagation: () => void }) => { e.stopPropagation(); setSelected('ribosome') },
    onPointerOver: (e: { stopPropagation: () => void }) => { e.stopPropagation(); setHovered('ribosome'); document.body.style.cursor = 'pointer' },
    onPointerOut: () => { setHovered(null); document.body.style.cursor = 'default' },
  }
  return <group>
    <instancedMesh ref={large} args={[undefined, undefined, count]} {...events}>
      <sphereGeometry args={[.018, 7, 5]} /><meshStandardMaterial color="#b9695e" roughness={.83} transparent opacity={opacity} />
    </instancedMesh>
    <instancedMesh ref={small} args={[undefined, undefined, count]} {...events}>
      <sphereGeometry args={[.014, 7, 5]} /><meshStandardMaterial color="#d08772" roughness={.82} transparent opacity={opacity} />
    </instancedMesh>
  </group>
}
