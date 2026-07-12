import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '../app/store'
import { fitnessSeverity, knockoutDrugs } from '../data/knockoutDrug'
import { capsulePoint, capsuleSurfacePoint, mulberry32 } from '../utils/random'

const duration = 17
const maxDrugParticles = 92
const tolCCount = 12

function surfaceMatrix(position: readonly number[], normal: readonly number[], scale: THREE.Vector3) {
  const p = new THREE.Vector3(...position)
  const n = new THREE.Vector3(...normal).normalize()
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), n)
  return new THREE.Matrix4().compose(p, q, scale)
}

export function KnockoutDrugPerturbation() {
  const panelOpen = useAppStore((s) => s.knockoutPanelOpen)
  const lacPanelOpen = useAppStore((s) => s.lacPanelOpen)
  const systemsPanelOpen = useAppStore((s) => s.systemsPanelOpen)
  const running = useAppStore((s) => s.knockoutRunning)
  const storedProgress = useAppStore((s) => s.knockoutProgress)
  const drugId = useAppStore((s) => s.knockoutDrug)
  const doseIndex = useAppStore((s) => s.knockoutDoseIndex)
  const genotype = useAppStore((s) => s.knockoutGenotype)
  const runNonce = useAppStore((s) => s.knockoutRunNonce)
  const paused = useAppStore((s) => s.paused)
  const setProgress = useAppStore((s) => s.setKnockoutProgress)
  const finish = useAppStore((s) => s.finishKnockoutExperiment)
  const setPanelOpen = useAppStore((s) => s.setKnockoutPanelOpen)
  const drug = knockoutDrugs[drugId]
  const point = drug.doses[Math.min(doseIndex, drug.doses.length - 1)]

  const group = useRef<THREE.Group>(null)
  const tolC = useRef<THREE.InstancedMesh>(null)
  const deletionMarks = useRef<THREE.InstancedMesh>(null)
  const drugMesh = useRef<THREE.InstancedMesh>(null)
  const ribosomeTargets = useRef<THREE.InstancedMesh>(null)
  const dnaTarget = useRef<THREE.Mesh>(null)
  const elapsed = useRef(0)
  const lastNonce = useRef(runNonce)
  const lastUiUpdate = useRef(0)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const samples = useMemo(() => {
    const random = mulberry32(3026)
    const channels = Array.from({ length: tolCCount }, () => capsuleSurfacePoint(random, .404))
    const drugs = Array.from({ length: maxDrugParticles }, (_, i) => ({
      outside: new THREE.Vector3(-.75 + random() * 1.8, .58 + random() * .42, -.42 + random() * .84),
      inside: new THREE.Vector3(...capsulePoint(random, .255)),
      phase: random() * Math.PI * 2,
      scale: .006 + random() * .005,
      retained: i % 5 !== 0,
    }))
    const targets = Array.from({ length: 8 }, () => new THREE.Vector3(...capsulePoint(random, .24)))
    return { channels, drugs, targets }
  }, [])

  useLayoutEffect(() => {
    samples.channels.forEach((sample, i) => {
      tolC.current?.setMatrixAt(i, surfaceMatrix(sample.position, sample.normal, new THREE.Vector3(.026, .075, .026)))
      const n = new THREE.Vector3(...sample.normal).normalize()
      const markerPosition = new THREE.Vector3(...sample.position).addScaledVector(n, .02)
      deletionMarks.current?.setMatrixAt(i, new THREE.Matrix4().compose(markerPosition, new THREE.Quaternion(), new THREE.Vector3(.014, .014, .014)))
    })
    if (tolC.current) tolC.current.instanceMatrix.needsUpdate = true
    if (deletionMarks.current) deletionMarks.current.instanceMatrix.needsUpdate = true
    samples.targets.forEach((target, i) => {
      dummy.position.copy(target); dummy.rotation.set(i * .33, i * .7, 0); dummy.scale.setScalar(.026); dummy.updateMatrix()
      ribosomeTargets.current?.setMatrixAt(i, dummy.matrix)
    })
    if (ribosomeTargets.current) ribosomeTargets.current.instanceMatrix.needsUpdate = true
  }, [dummy, samples])

  useFrame((_, dt) => {
    if (lastNonce.current !== runNonce) {
      lastNonce.current = runNonce; elapsed.current = 0; lastUiUpdate.current = 0
    }
    if (running && !paused) elapsed.current = Math.min(duration, elapsed.current + dt)
    const progress = running ? elapsed.current / duration : storedProgress
    if (running && elapsed.current - lastUiUpdate.current > .12) {
      lastUiUpdate.current = elapsed.current; setProgress(progress)
    }
    if (running && elapsed.current >= duration) finish()
    if (!group.current || !drugMesh.current || !tolC.current || !deletionMarks.current) return
    group.current.visible = (panelOpen || storedProgress > 0 || running) && !lacPanelOpen && !systemsPanelOpen

    const deletion = genotype === 'deltaTolC' ? THREE.MathUtils.smoothstep(progress, .08, .2) : 0
    tolC.current.count = deletion > .55 ? 0 : tolCCount
    deletionMarks.current.count = genotype === 'deltaTolC' && progress > .1 ? tolCCount : 0
    deletionMarks.current.rotation.y += paused ? 0 : dt * .13

    const doseFraction = (Math.min(doseIndex, drug.doses.length - 1) + 1) / drug.doses.length
    const visibleCount = Math.floor(26 + doseFraction * 66)
    drugMesh.current.count = visibleCount
    const entry = THREE.MathUtils.smoothstep(progress, .26, .6)
    const targeting = THREE.MathUtils.smoothstep(progress, .58, .86)
    const knockoutRetention = genotype === 'deltaTolC' ? .92 : .32
    for (let i = 0; i < visibleCount; i++) {
      const sample = samples.drugs[i]
      const canEnter = i / visibleCount < knockoutRetention
      const localEntry = canEnter ? entry : entry * .22
      dummy.position.copy(sample.outside).lerp(sample.inside, localEntry)
      if (targeting > 0 && canEnter) {
        if (drug.target === 'nucleoid') {
          const target = new THREE.Vector3((i % 7 - 3) * .055, Math.sin(i * 1.9) * .105, Math.cos(i * 1.4) * .11)
          dummy.position.lerp(target, targeting * .72)
        } else {
          dummy.position.lerp(samples.targets[i % samples.targets.length], targeting * .68)
        }
      }
      dummy.position.x += Math.sin(progress * 15 + sample.phase) * .008
      dummy.position.z += Math.cos(progress * 12 + sample.phase) * .007
      dummy.rotation.set(sample.phase + progress * 2, progress * 3 + i, sample.phase * .4)
      dummy.scale.setScalar(sample.scale * (1 + targeting * .25)); dummy.updateMatrix()
      drugMesh.current.setMatrixAt(i, dummy.matrix)
    }
    drugMesh.current.instanceMatrix.needsUpdate = true

    const targetVisible = progress > .6 && panelOpen
    ribosomeTargets.current!.visible = targetVisible && drug.target === 'ribosome'
    if (ribosomeTargets.current!.visible) ribosomeTargets.current!.rotation.x += paused ? 0 : dt * .18
    if (dnaTarget.current) {
      dnaTarget.current.visible = targetVisible && drug.target === 'nucleoid'
      dnaTarget.current.rotation.x += paused ? 0 : dt * .08
      dnaTarget.current.rotation.y += paused ? 0 : dt * .12
      const pulse = .95 + Math.sin(progress * 45) * .08
      dnaTarget.current.scale.set(pulse * 2.5, pulse, pulse)
    }
  })

  const severity = genotype === 'deltaTolC' ? fitnessSeverity(point.score) : .08
  return <group ref={group} visible={false} onClick={(event) => { event.stopPropagation(); setPanelOpen(true) }}>
    <instancedMesh ref={tolC} args={[undefined, undefined, tolCCount]}>
      <cylinderGeometry args={[1, 1.12, 1, 9, 1, true]} />
      <meshStandardMaterial color="#5d7890" emissive="#293e50" emissiveIntensity={.28} roughness={.56} side={THREE.DoubleSide} />
    </instancedMesh>
    <instancedMesh ref={deletionMarks} args={[undefined, undefined, tolCCount]}>
      <octahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#c8665d" emissive="#9e3c38" emissiveIntensity={.75} transparent opacity={.82} roughness={.48} />
    </instancedMesh>
    <instancedMesh ref={drugMesh} args={[undefined, undefined, maxDrugParticles]}>
      <icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color={drug.color} emissive={drug.color} emissiveIntensity={.72} roughness={.46} transparent opacity={.88} />
    </instancedMesh>
    <instancedMesh ref={ribosomeTargets} args={[undefined, undefined, samples.targets.length]} visible={false}>
      <torusGeometry args={[1, .13, 6, 18]} /><meshBasicMaterial color={drug.color} transparent opacity={.74} depthWrite={false} />
    </instancedMesh>
    <mesh ref={dnaTarget} visible={false}>
      <sphereGeometry args={[.14, 18, 12]} /><meshBasicMaterial color={drug.color} transparent opacity={.12} wireframe depthWrite={false} />
    </mesh>
    {(panelOpen || running) && <pointLight position={[.05, .08, .18]} color={drug.color} intensity={.18 + severity * .85} distance={1.05} />}
  </group>
}
