import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Line } from '@react-three/drei'
import { useAppStore } from '../app/store'
import { capsuleSurfacePoint, mulberry32 } from '../utils/random'

export function Pili() {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const setSelected = useAppStore((s) => s.setSelected)
  const setHovered = useAppStore((s) => s.setHovered)
  const samples = useMemo(() => {
    const random = mulberry32(712)
    return Array.from({ length: 22 }, () => ({ ...capsuleSurfacePoint(random, .405), length: .14 + random() * .22 }))
  }, [])
  useLayoutEffect(() => {
    const up = new THREE.Vector3(0, 1, 0)
    samples.forEach((sample, i) => {
      const n = new THREE.Vector3(...sample.normal).normalize()
      const p = new THREE.Vector3(...sample.position).addScaledVector(n, sample.length * .5)
      const matrix = new THREE.Matrix4().compose(p, new THREE.Quaternion().setFromUnitVectors(up, n), new THREE.Vector3(.003, sample.length, .003))
      mesh.current?.setMatrixAt(i, matrix)
    })
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true
  }, [samples])
  return <instancedMesh ref={mesh} args={[undefined, undefined, samples.length]}
    onClick={(e) => { e.stopPropagation(); setSelected('pilus') }}
    onPointerOver={(e) => { e.stopPropagation(); setHovered('pilus'); document.body.style.cursor = 'pointer' }}
    onPointerOut={() => { setHovered(null); document.body.style.cursor = 'default' }}>
    <cylinderGeometry args={[1, .8, 1, 5]} /><meshStandardMaterial color="#927668" roughness={.85} />
  </instancedMesh>
}

export function FlagellarMotor() {
  const rotor = useRef<THREE.Group>(null)
  const paused = useAppStore((s) => s.paused)
  const setSelected = useAppStore((s) => s.setSelected)
  const setHovered = useAppStore((s) => s.setHovered)
  useFrame((_, dt) => { if (!paused && rotor.current) rotor.current.rotation.y += dt * 1.2 })
  return <group position={[-.66, -.24, -.23]} rotation={[.75, 0, -.6]}
    onClick={(e) => { e.stopPropagation(); setSelected('flagellarMotor') }}
    onPointerOver={(e) => { e.stopPropagation(); setHovered('flagellarMotor'); document.body.style.cursor = 'pointer' }}
    onPointerOut={() => { setHovered(null); document.body.style.cursor = 'default' }}>
    <group ref={rotor}>
      <mesh><cylinderGeometry args={[.07, .07, .16, 18]} /><meshStandardMaterial color="#9b816e" roughness={.6} /></mesh>
      <mesh position={[0, .1, 0]}><torusGeometry args={[.085, .018, 8, 18]} /><meshStandardMaterial color="#c9a26e" roughness={.62} /></mesh>
      <mesh position={[0, -.1, 0]}><torusGeometry args={[.055, .012, 7, 16]} /><meshStandardMaterial color="#658c89" roughness={.62} /></mesh>
    </group>
    <mesh position={[0, .18, 0]} rotation={[0, 0, .15]}><cylinderGeometry args={[.018, .025, .2, 8]} /><meshStandardMaterial color="#c2a57d" /></mesh>
  </group>
}

export function Flagellum() {
  const group = useRef<THREE.Group>(null)
  const paused = useAppStore((s) => s.paused)
  const setSelected = useAppStore((s) => s.setSelected)
  const setHovered = useAppStore((s) => s.setHovered)
  const points = useMemo(() => Array.from({ length: 170 }, (_, i) => {
    const t = i / 169
    return new THREE.Vector3(-.68 - t * 2.75, -.15 + .11 * Math.cos(t * Math.PI * 15), -.21 + .11 * Math.sin(t * Math.PI * 15))
  }), [])
  useFrame((_, dt) => { if (!paused && group.current) group.current.rotation.x += dt * .36 })
  return <group ref={group} position={[0, -.11, -.05]}
    onClick={(e) => { e.stopPropagation(); setSelected('flagellum') }}
    onPointerOver={(e) => { e.stopPropagation(); setHovered('flagellum'); document.body.style.cursor = 'pointer' }}
    onPointerOut={() => { setHovered(null); document.body.style.cursor = 'default' }}>
    <Line points={points} color="#a58b72" lineWidth={1.5} transparent opacity={.88} />
  </group>
}
