import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '../app/store'

const duration = 16

export function TranscriptionTranslation() {
  const active = useAppStore((s) => s.processActive)
  const setActive = useAppStore((s) => s.setProcessActive)
  const paused = useAppStore((s) => s.paused)
  const group = useRef<THREE.Group>(null)
  const polymerase = useRef<THREE.Mesh>(null)
  const rna = useRef<THREE.Line>(null)
  const ribosomeA = useRef<THREE.Group>(null)
  const ribosomeB = useRef<THREE.Group>(null)
  const protein = useRef<THREE.Line>(null)
  const elapsed = useRef(0)
  const dnaCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-.27, .03, .05), new THREE.Vector3(-.12, .08, .02),
    new THREE.Vector3(.05, .055, -.02), new THREE.Vector3(.23, .02, .025),
  ]), [])
  const dnaGeometry = useMemo(() => new THREE.TubeGeometry(dnaCurve, 80, .009, 7, false), [dnaCurve])
  const rnaPoints = useMemo(() => Array.from({ length: 80 }, (_, i) => {
    const t = i / 79
    return new THREE.Vector3(-.08 + t * .32, .045 - t * .2, .025 + Math.sin(t * 16) * .014)
  }), [])
  const rnaGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(rnaPoints), [rnaPoints])
  const proteinPoints = useMemo(() => Array.from({ length: 36 }, (_, i) => new THREE.Vector3(0, -i * .007, Math.sin(i * .7) * .009)), [])
  const proteinGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(proteinPoints), [proteinPoints])
  const rnaObject = useMemo(() => new THREE.Line(rnaGeometry, new THREE.LineBasicMaterial({ color: '#ee9b58' })), [rnaGeometry])
  const proteinObject = useMemo(() => new THREE.Line(proteinGeometry, new THREE.LineBasicMaterial({ color: '#d6e186' })), [proteinGeometry])

  useFrame((_, dt) => {
    if (!active) { elapsed.current = 0; if (group.current) group.current.visible = false; return }
    if (group.current) group.current.visible = true
    if (!paused) elapsed.current += dt
    const t = elapsed.current
    if (t > duration) { setActive(false); return }
    const transcribe = THREE.MathUtils.clamp((t - 1.2) / 6.8, 0, 1)
    const polymeraseT = THREE.MathUtils.clamp((t - .8) / 7.2, 0, 1)
    if (polymerase.current) {
      polymerase.current.position.copy(dnaCurve.getPointAt(polymeraseT))
      polymerase.current.visible = t > .6 && t < 10.5
      polymerase.current.rotation.y += paused ? 0 : dt * .45
    }
    if (rna.current) {
      rna.current.geometry.setDrawRange(0, Math.max(2, Math.floor(rnaPoints.length * transcribe)))
      rna.current.visible = t > 1.2 && t < 14.8
    }
    const moveRibosome = (node: THREE.Group | null, delay: number, offset: number) => {
      if (!node) return
      const progress = THREE.MathUtils.clamp((t - delay) / 5, 0, 1)
      const index = Math.floor(progress * (rnaPoints.length - 1))
      node.position.copy(rnaPoints[index]).add(new THREE.Vector3(offset, 0, 0))
      node.visible = t > delay && t < delay + 6.2
    }
    moveRibosome(ribosomeA.current, 4.1, 0)
    moveRibosome(ribosomeB.current, 5.7, -.035)
    if (protein.current) {
      protein.current.visible = t > 5 && t < 15
      protein.current.geometry.setDrawRange(0, Math.max(2, Math.floor(proteinPoints.length * THREE.MathUtils.clamp((t - 5) / 6, 0, 1))))
      protein.current.position.copy(ribosomeA.current?.position ?? new THREE.Vector3())
    }
    if (group.current) group.current.scale.setScalar(1 + Math.sin(Math.min(t, duration - t) * .5) * .05)
  })
  if (!active) return null
  return <group ref={group} position={[0, .02, .06]}>
    <mesh geometry={dnaGeometry}><meshStandardMaterial color="#fff3cf" emissive="#d6aa7d" emissiveIntensity={.65} roughness={.5} /></mesh>
    <mesh ref={polymerase}><dodecahedronGeometry args={[.035, 1]} /><meshStandardMaterial color="#d8a25e" emissive="#9b612e" emissiveIntensity={.35} roughness={.7} /></mesh>
    <primitive ref={rna} object={rnaObject} />
    {[ribosomeA, ribosomeB].map((ref, i) => <group ref={ref} key={i}>
      <mesh scale={[.028, .022, .025]}><sphereGeometry args={[1, 10, 7]} /><meshStandardMaterial color="#dc806a" emissive="#87463e" emissiveIntensity={.3} /></mesh>
      <mesh position={[.01, .018, 0]} scale={[.02, .015, .018]}><sphereGeometry args={[1, 9, 7]} /><meshStandardMaterial color="#eba086" /></mesh>
    </group>)}
    <primitive ref={protein} object={proteinObject} />
    {active && <pointLight color="#f2b56b" intensity={.5} distance={.55} />}
  </group>
}
