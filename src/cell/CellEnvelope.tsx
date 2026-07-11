import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '../app/store'

interface ShellProps {
  id: 'outerMembrane' | 'innerMembrane' | 'periplasm'
  radius: number
  color: string
  opacity: number
  roughness?: number
}

function Shell({ id, radius, color, opacity, roughness = 0.58 }: ShellProps) {
  const material = useRef<THREE.MeshPhysicalMaterial>(null)
  const selected = useAppStore((s) => s.selected)
  const hovered = useAppStore((s) => s.hovered)
  const setSelected = useAppStore((s) => s.setSelected)
  const setHovered = useAppStore((s) => s.setHovered)

  useFrame(({ camera }) => {
    if (!material.current) return
    const distance = camera.position.length()
    const near = THREE.MathUtils.smoothstep(distance, 0.28, 1.35)
    const contextualOpacity = THREE.MathUtils.lerp(id === 'periplasm' ? 0.025 : 0.07, opacity, near)
    const dim = selected && selected !== id ? 0.58 : 1
    material.current.opacity = contextualOpacity * dim
    material.current.emissiveIntensity = hovered === id || selected === id ? 0.18 : 0.025
  })

  return (
    <mesh
      rotation={[0, 0, Math.PI / 2]}
      onClick={(event) => { event.stopPropagation(); setSelected(id) }}
      onPointerOver={(event) => { event.stopPropagation(); setHovered(id); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(null); document.body.style.cursor = 'default' }}
    >
      <capsuleGeometry args={[radius, 1.4, 10, 28]} />
      <meshPhysicalMaterial
        ref={material}
        color={color}
        emissive={color}
        emissiveIntensity={0.025}
        transparent
        opacity={opacity}
        roughness={roughness}
        metalness={0.02}
        transmission={0.05}
        thickness={0.06}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

function Peptidoglycan() {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = []
    const radius = 0.365
    const half = 0.7
    const rings = 22
    const sides = 24
    for (let i = 0; i < rings; i++) {
      const x = -half + (i / (rings - 1)) * half * 2
      for (let j = 0; j < sides; j++) {
        const a = (j / sides) * Math.PI * 2 + Math.sin(i * 1.7) * 0.035
        const b = ((j + 1) / sides) * Math.PI * 2 + Math.sin(i * 1.7) * 0.035
        points.push(new THREE.Vector3(x, Math.cos(a) * radius, Math.sin(a) * radius))
        points.push(new THREE.Vector3(x, Math.cos(b) * radius, Math.sin(b) * radius))
        if (i < rings - 1 && (i + j) % 2 === 0) {
          const nx = -half + ((i + 1) / (rings - 1)) * half * 2
          points.push(new THREE.Vector3(x, Math.cos(a) * radius, Math.sin(a) * radius))
          points.push(new THREE.Vector3(nx, Math.cos(b) * radius, Math.sin(b) * radius))
        }
      }
    }
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [])
  const selected = useAppStore((s) => s.selected)
  const setSelected = useAppStore((s) => s.setSelected)
  const setHovered = useAppStore((s) => s.setHovered)
  return (
    <lineSegments geometry={geometry}
      onClick={(e) => { e.stopPropagation(); setSelected('peptidoglycan') }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered('peptidoglycan'); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(null); document.body.style.cursor = 'default' }}
    >
      <lineBasicMaterial color={selected === 'peptidoglycan' ? '#fff1b9' : '#c8ad6b'} transparent opacity={selected && selected !== 'peptidoglycan' ? 0.16 : 0.58} />
    </lineSegments>
  )
}

export function CellEnvelope() {
  const layers = useAppStore((s) => s.layers)
  return (
    <group>
      {layers.outerMembrane && <Shell id="outerMembrane" radius={0.4} color="#9d563f" opacity={0.66} />}
      <Shell id="periplasm" radius={0.37} color="#6a938d" opacity={0.06} roughness={0.8} />
      {layers.peptidoglycan && <Peptidoglycan />}
      {layers.innerMembrane && <Shell id="innerMembrane" radius={0.33} color="#3b807b" opacity={0.48} />}
    </group>
  )
}
