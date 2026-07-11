import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '../app/store'
import { mulberry32 } from '../utils/random'

function makeChromosomeCurve() {
  const points: THREE.Vector3[] = []
  const turns = 64
  for (let i = 0; i < turns; i++) {
    const t = (i / turns) * Math.PI * 2
    points.push(new THREE.Vector3(
      .56 * Math.sin(t) * (0.64 + .25 * Math.sin(7 * t)),
      .15 * Math.sin(5 * t + .4) + .035 * Math.sin(17 * t),
      .16 * Math.cos(4 * t) + .03 * Math.sin(13 * t),
    ))
  }
  return new THREE.CatmullRomCurve3(points, true, 'centripetal', .28)
}

export function Nucleoid() {
  const group = useRef<THREE.Group>(null)
  const paused = useAppStore((s) => s.paused)
  const layers = useAppStore((s) => s.layers)
  const selected = useAppStore((s) => s.selected)
  const hovered = useAppStore((s) => s.hovered)
  const setSelected = useAppStore((s) => s.setSelected)
  const setHovered = useAppStore((s) => s.setHovered)
  const curve = useMemo(makeChromosomeCurve, [])
  const dnaGeometry = useMemo(() => new THREE.TubeGeometry(curve, 520, .0052, 6, true), [curve])
  const associated = useMemo(() => {
    const random = mulberry32(402)
    return Array.from({ length: 52 }, () => curve.getPointAt(random()))
  }, [curve])
  useFrame(({ clock }) => {
    if (!paused && group.current) {
      const t = clock.elapsedTime
      group.current.rotation.x = Math.sin(t * .09) * .018
      group.current.rotation.z = Math.sin(t * .12) * .012
      group.current.scale.y = 1 + Math.sin(t * .18) * .012
    }
  })
  if (!layers.nucleoid) return null
  const active = selected === 'nucleoid' || selected === 'chromosome' || hovered === 'nucleoid' || hovered === 'chromosome'
  return (
    <group ref={group}
      onClick={(e) => { e.stopPropagation(); setSelected('chromosome') }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered('chromosome'); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(null); document.body.style.cursor = 'default' }}>
      {/* This haze is a visual density cue, not a membrane around the nucleoid. */}
      <mesh scale={[1, .86, 1]} onClick={(e) => { e.stopPropagation(); setSelected('nucleoid') }}>
        <sphereGeometry args={[.245, 24, 18]} />
        <meshBasicMaterial color="#8b86aa" transparent opacity={active ? .105 : .045} depthWrite={false} />
      </mesh>
      <mesh geometry={dnaGeometry}>
        <meshStandardMaterial color={active ? '#fff4db' : '#d7d0df'} emissive="#8c7998" emissiveIntensity={active ? .38 : .08} roughness={.7} />
      </mesh>
      {associated.map((p, i) => <mesh key={i} position={p} scale={.012 + (i % 3) * .002}>
        <octahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#8193ac" roughness={.8} />
      </mesh>)}
    </group>
  )
}

export function Plasmids() {
  const setSelected = useAppStore((s) => s.setSelected)
  const setHovered = useAppStore((s) => s.setHovered)
  const paused = useAppStore((s) => s.paused)
  const group = useRef<THREE.Group>(null)
  useFrame((_, dt) => { if (!paused && group.current) group.current.rotation.x += dt * .025 })
  const plasmids = useMemo(() => [
    { p: [-.48, .16, .11] as [number, number, number], r: .055, rot: [1.2, .3, .2] as [number, number, number] },
    { p: [.43, -.16, .1] as [number, number, number], r: .045, rot: [.3, .9, .1] as [number, number, number] },
    { p: [.61, .1, -.12] as [number, number, number], r: .038, rot: [.7, .2, 1.1] as [number, number, number] },
  ], [])
  return <group ref={group} onClick={(e) => { e.stopPropagation(); setSelected('plasmid') }} onPointerOver={(e) => { e.stopPropagation(); setHovered('plasmid'); document.body.style.cursor = 'pointer' }} onPointerOut={() => { setHovered(null); document.body.style.cursor = 'default' }}>
    {plasmids.map((p, i) => <mesh key={i} position={p.p} rotation={p.rot}>
      <torusGeometry args={[p.r, .0045, 5, 38]} /><meshStandardMaterial color="#e3cce3" emissive="#796079" emissiveIntensity={.2} roughness={.7} />
    </mesh>)}
  </group>
}
