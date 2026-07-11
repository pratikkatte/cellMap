import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '../app/store'
import { capsuleSurfacePoint, mulberry32 } from '../utils/random'

function matrixOnSurface(position: readonly number[], normal: readonly number[], scale: THREE.Vector3) {
  const p = new THREE.Vector3(...position)
  const n = new THREE.Vector3(...normal).normalize()
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), n)
  return new THREE.Matrix4().compose(p, q, scale)
}

export function OuterSurface() {
  const stalks = useRef<THREE.InstancedMesh>(null)
  const heads = useRef<THREE.InstancedMesh>(null)
  const porins = useRef<THREE.InstancedMesh>(null)
  const density = useAppStore((s) => s.density)
  const quality = useAppStore((s) => s.quality)
  const setSelected = useAppStore((s) => s.setSelected)
  const setHovered = useAppStore((s) => s.setHovered)
  const maxCount = quality === 'high' ? 320 : quality === 'low' ? 110 : 210
  const count = Math.floor(maxCount * density)
  const samples = useMemo(() => {
    const random = mulberry32(1209)
    return Array.from({ length: maxCount }, () => capsuleSurfacePoint(random, 0.405))
  }, [maxCount])

  useLayoutEffect(() => {
    samples.forEach((sample, i) => {
      const n = new THREE.Vector3(...sample.normal).normalize()
      const stalkPos = new THREE.Vector3(...sample.position).addScaledVector(n, 0.025)
      const headPos = new THREE.Vector3(...sample.position).addScaledVector(n, 0.057 + (i % 5) * 0.002)
      stalks.current?.setMatrixAt(i, matrixOnSurface(stalkPos.toArray(), n.toArray(), new THREE.Vector3(0.006, 0.035, 0.006)))
      heads.current?.setMatrixAt(i, new THREE.Matrix4().compose(headPos, new THREE.Quaternion(), new THREE.Vector3(0.012 + (i % 3) * .002, 0.012, 0.012)))
    })
    stalks.current!.count = count
    heads.current!.count = count
    stalks.current!.instanceMatrix.needsUpdate = true
    heads.current!.instanceMatrix.needsUpdate = true
  }, [samples, count])

  useLayoutEffect(() => {
    const random = mulberry32(933)
    for (let i = 0; i < 38; i++) {
      const sample = capsuleSurfacePoint(random, 0.4)
      porins.current?.setMatrixAt(i, matrixOnSurface(sample.position, sample.normal, new THREE.Vector3(0.025, 0.035, 0.025)))
    }
    porins.current!.instanceMatrix.needsUpdate = true
  }, [])

  const hover = (id: 'outerMembrane' | 'porin') => (e: { stopPropagation: () => void }) => {
    e.stopPropagation(); setHovered(id); document.body.style.cursor = 'pointer'
  }
  const leave = () => { setHovered(null); document.body.style.cursor = 'default' }

  return (
    <group>
      <instancedMesh ref={stalks} args={[undefined, undefined, maxCount]} onClick={(e) => { e.stopPropagation(); setSelected('outerMembrane') }} onPointerOver={hover('outerMembrane')} onPointerOut={leave}>
        <cylinderGeometry args={[1, 1, 1, 5]} /><meshStandardMaterial color="#b77b55" roughness={0.8} />
      </instancedMesh>
      <instancedMesh ref={heads} args={[undefined, undefined, maxCount]} onClick={(e) => { e.stopPropagation(); setSelected('outerMembrane') }} onPointerOver={hover('outerMembrane')} onPointerOut={leave}>
        <dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#d09b68" roughness={0.75} />
      </instancedMesh>
      <instancedMesh ref={porins} args={[undefined, undefined, 38]} onClick={(e) => { e.stopPropagation(); setSelected('porin') }} onPointerOver={hover('porin')} onPointerOut={leave}>
        <cylinderGeometry args={[1, 1.15, 1, 8, 1, true]} /><meshStandardMaterial color="#6d727c" roughness={0.66} side={THREE.DoubleSide} />
      </instancedMesh>
    </group>
  )
}

export function InnerMembraneComplexes() {
  const group = useRef<THREE.Group>(null)
  const paused = useAppStore((s) => s.paused)
  const setSelected = useAppStore((s) => s.setSelected)
  const setHovered = useAppStore((s) => s.setHovered)
  const positions = useMemo(() => [
    [-.45, .27, .11], [-.12, -.28, .09], [.25, .18, -.23], [.56, -.13, -.27], [.72, .21, .08],
  ] as [number, number, number][], [])
  useFrame((_, dt) => { if (!paused && group.current) group.current.children.forEach((child, i) => { child.rotation.y += dt * (0.2 + i * .03) }) })
  return (
    <group ref={group}>
      {positions.map((position, i) => (
        <group key={i} position={position} rotation={[position[2] * 2, 0, position[1] > 0 ? 0 : Math.PI]}
          onClick={(e) => { e.stopPropagation(); setSelected('atpSynthase') }}
          onPointerOver={(e) => { e.stopPropagation(); setHovered('atpSynthase'); document.body.style.cursor = 'pointer' }}
          onPointerOut={() => { setHovered(null); document.body.style.cursor = 'default' }}>
          <mesh><cylinderGeometry args={[.028, .028, .07, 10]} /><meshStandardMaterial color="#d2b36e" roughness={.55} /></mesh>
          <mesh position={[0, .058, 0]}><sphereGeometry args={[.045, 10, 8]} /><meshStandardMaterial color="#c5aa72" roughness={.65} /></mesh>
          <mesh position={[0, -.045, 0]}><torusGeometry args={[.035, .011, 6, 12]} /><meshStandardMaterial color="#77998f" roughness={.65} /></mesh>
        </group>
      ))}
    </group>
  )
}
