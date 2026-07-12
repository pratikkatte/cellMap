import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '../app/store'
import { capsulePoint, mulberry32 } from '../utils/random'

const duration = 18
const oxygenCount = 56
const regulatoryCount = 24
const respirationCount = 28
const fermentationCount = 40

export function SystemsResponsePerturbation() {
  const panelOpen = useAppStore((state) => state.systemsPanelOpen)
  const example = useAppStore((state) => state.systemsExample)
  const running = useAppStore((state) => state.systemsRunning)
  const storedProgress = useAppStore((state) => state.systemsProgress)
  const runNonce = useAppStore((state) => state.systemsRunNonce)
  const paused = useAppStore((state) => state.paused)
  const lacPanelOpen = useAppStore((state) => state.lacPanelOpen)
  const knockoutPanelOpen = useAppStore((state) => state.knockoutPanelOpen)
  const setProgress = useAppStore((state) => state.setSystemsProgress)
  const finish = useAppStore((state) => state.finishSystemsExperiment)
  const setPanelOpen = useAppStore((state) => state.setSystemsPanelOpen)
  const group = useRef<THREE.Group>(null)
  const oxygen = useRef<THREE.InstancedMesh>(null)
  const regulators = useRef<THREE.InstancedMesh>(null)
  const respiration = useRef<THREE.InstancedMesh>(null)
  const fermentation = useRef<THREE.InstancedMesh>(null)
  const membranePulse = useRef<THREE.Mesh>(null)
  const elapsed = useRef(0)
  const lastNonce = useRef(runNonce)
  const lastUiUpdate = useRef(0)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const samples = useMemo(() => {
    const random = mulberry32(1515)
    const oxygenPositions = Array.from({ length: oxygenCount }, () => new THREE.Vector3(
      -.95 + random() * 1.9,
      .15 + random() * .72,
      -.54 + random() * 1.08,
    ))
    const regulatorPositions = Array.from({ length: regulatoryCount }, (_, index) => ({
      point: new THREE.Vector3(...capsulePoint(random, .21)),
      phase: random() * Math.PI * 2,
      up: index % 5 !== 1 && index % 5 !== 2,
    }))
    const respirationPhases = Array.from({ length: respirationCount }, () => random())
    const fermentationPhases = Array.from({ length: fermentationCount }, () => random())
    return { oxygenPositions, regulatorPositions, respirationPhases, fermentationPhases }
  }, [])

  useLayoutEffect(() => {
    samples.oxygenPositions.forEach((point, index) => {
      dummy.position.copy(point); dummy.scale.setScalar(.008 + (index % 4) * .001); dummy.updateMatrix()
      oxygen.current?.setMatrixAt(index, dummy.matrix)
    })
    if (oxygen.current) oxygen.current.instanceMatrix.needsUpdate = true
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
    if (!group.current || !oxygen.current || !regulators.current || !respiration.current || !fermentation.current) return
    group.current.visible = (panelOpen || storedProgress > 0 || running) && !lacPanelOpen && !knockoutPanelOpen

    const withdrawal = THREE.MathUtils.smoothstep(progress, .13, .34)
    oxygen.current.count = Math.max(3, Math.floor(oxygenCount * (1 - withdrawal * .94)))
    for (let i = 0; i < oxygen.current.count; i++) {
      const point = samples.oxygenPositions[i]
      dummy.position.copy(point)
      dummy.position.y += Math.sin(i * 1.7 + elapsed.current * .45) * .018
      dummy.position.z += Math.cos(i * 2.1 + elapsed.current * .38) * .014
      dummy.scale.setScalar(.0075 + (i % 4) * .001); dummy.updateMatrix(); oxygen.current.setMatrixAt(i, dummy.matrix)
    }
    oxygen.current.instanceMatrix.needsUpdate = true

    const regulatoryShift = THREE.MathUtils.smoothstep(progress, .28, .52)
    regulators.current.count = example === 'precise' && regulatoryShift > .02 ? regulatoryCount : 0
    samples.regulatorPositions.forEach((sample, index) => {
      const pulse = 1 + Math.sin(elapsed.current * .8 + sample.phase) * .18
      dummy.position.copy(sample.point)
      dummy.position.y += Math.sin(elapsed.current * .31 + sample.phase) * .012
      dummy.scale.setScalar((sample.up ? .014 : .011) * pulse * regulatoryShift)
      dummy.rotation.set(sample.phase, elapsed.current * .16 + sample.phase, 0); dummy.updateMatrix()
      regulators.current?.setMatrixAt(index, dummy.matrix)
      regulators.current?.setColorAt(index, new THREE.Color(sample.up ? '#77c0b4' : '#a488b0'))
    })
    regulators.current.instanceMatrix.needsUpdate = true
    if (regulators.current.instanceColor) regulators.current.instanceColor.needsUpdate = true

    const respiratoryLoss = THREE.MathUtils.smoothstep(progress, .44, .68)
    respiration.current.count = example === 'iml1515' ? Math.max(2, Math.floor(respirationCount * (1 - respiratoryLoss * .9))) : 0
    for (let i = 0; i < respiration.current.count; i++) {
      const t = (samples.respirationPhases[i] + elapsed.current * .055) % 1
      dummy.position.set(-.62 + t * 1.25, Math.sin(t * Math.PI * 3 + i) * .13, .22 + Math.cos(t * Math.PI * 2 + i) * .055)
      dummy.scale.setScalar(.0085); dummy.updateMatrix(); respiration.current.setMatrixAt(i, dummy.matrix)
    }
    respiration.current.instanceMatrix.needsUpdate = true

    const fermentationRise = THREE.MathUtils.smoothstep(progress, .62, .9)
    fermentation.current.count = example === 'iml1515' ? Math.floor(fermentationCount * fermentationRise) : 0
    for (let i = 0; i < fermentation.current.count; i++) {
      const t = (samples.fermentationPhases[i] + elapsed.current * .035) % 1
      const branch = (i % 3) - 1
      dummy.position.set(-.2 + t * 1.15, branch * .13 + Math.sin(t * 7 + i) * .035, -.15 + branch * .055)
      if (t > .72) dummy.position.y += (t - .72) * branch * .55
      dummy.scale.setScalar(.008 + (i % 3) * .0015); dummy.updateMatrix(); fermentation.current.setMatrixAt(i, dummy.matrix)
    }
    fermentation.current.instanceMatrix.needsUpdate = true

    if (membranePulse.current) {
      membranePulse.current.visible = example === 'iml1515' && progress > .42
      membranePulse.current.rotation.x += paused ? 0 : dt * (.14 - respiratoryLoss * .25)
      membranePulse.current.rotation.y += paused ? 0 : dt * (.09 - respiratoryLoss * .18)
      const pulse = 1 + Math.sin(elapsed.current * 1.1) * .025
      membranePulse.current.scale.setScalar(pulse)
    }
  })

  return <group ref={group} visible={false} onClick={(event) => { event.stopPropagation(); setPanelOpen(true) }}>
    <instancedMesh ref={oxygen} args={[undefined, undefined, oxygenCount]}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#7ebfc6" emissive="#4c98a5" emissiveIntensity={.7} roughness={.55} transparent opacity={.82} />
    </instancedMesh>
    <instancedMesh ref={regulators} args={[undefined, undefined, regulatoryCount]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial vertexColors emissive="#3c5c62" emissiveIntensity={.55} roughness={.5} transparent opacity={.9} />
    </instancedMesh>
    <instancedMesh ref={respiration} args={[undefined, undefined, respirationCount]}>
      <sphereGeometry args={[1, 7, 5]} />
      <meshBasicMaterial color="#81d0c0" transparent opacity={.82} depthWrite={false} />
    </instancedMesh>
    <instancedMesh ref={fermentation} args={[undefined, undefined, fermentationCount]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#d59b62" emissive="#b26742" emissiveIntensity={.75} roughness={.55} transparent opacity={.88} />
    </instancedMesh>
    <mesh ref={membranePulse} rotation={[0, Math.PI / 2, 0]} visible={false}>
      <torusGeometry args={[.28, .004, 5, 72]} />
      <meshBasicMaterial color="#72b8ae" transparent opacity={.35} depthWrite={false} />
    </mesh>
    {(panelOpen || running) && <pointLight position={[.1, .2, .2]} color={example === 'precise' ? '#70ada8' : '#c58d58'} intensity={.35} distance={1.2} />}
  </group>
}
