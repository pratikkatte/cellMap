import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '../app/store'
import { lacExpressionLevel } from '../data/lacOperon'
import { mulberry32 } from '../utils/random'

const duration = 19
const maxLacY = 16
const maxLacZ = 12

function RibosomeModel({ modelRef }: { modelRef: React.RefObject<THREE.Group | null> }) {
  return <group ref={modelRef} visible={false}>
    <mesh scale={[.025, .019, .022]}><sphereGeometry args={[1, 9, 7]} /><meshStandardMaterial color="#da7764" roughness={.74} /></mesh>
    <mesh position={[.009, .016, 0]} scale={[.018, .013, .016]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#e99b7d" roughness={.72} /></mesh>
  </group>
}

export function LacOperonPerturbation() {
  const panelOpen = useAppStore((s) => s.lacPanelOpen)
  const knockoutPanelOpen = useAppStore((s) => s.knockoutPanelOpen)
  const systemsPanelOpen = useAppStore((s) => s.systemsPanelOpen)
  const running = useAppStore((s) => s.lacRunning)
  const storedProgress = useAppStore((s) => s.lacProgress)
  const inducer = useAppStore((s) => s.lacInducer)
  const glucose = useAppStore((s) => s.lacGlucose)
  const preinduced = useAppStore((s) => s.lacPreinduced)
  const runNonce = useAppStore((s) => s.lacRunNonce)
  const paused = useAppStore((s) => s.paused)
  const setProgress = useAppStore((s) => s.setLacProgress)
  const finish = useAppStore((s) => s.finishLacExperiment)
  const setPanelOpen = useAppStore((s) => s.setLacPanelOpen)
  const group = useRef<THREE.Group>(null)
  const locusGlow = useRef<THREE.MeshStandardMaterial>(null)
  const repressor = useRef<THREE.Group>(null)
  const polymerase = useRef<THREE.Mesh>(null)
  const mrna = useRef<THREE.Line>(null)
  const ribosomeA = useRef<THREE.Group>(null)
  const ribosomeB = useRef<THREE.Group>(null)
  const lacY = useRef<THREE.InstancedMesh>(null)
  const lacZ = useRef<THREE.InstancedMesh>(null)
  const inducerMesh = useRef<THREE.InstancedMesh>(null)
  const elapsed = useRef(0)
  const lastNonce = useRef(runNonce)
  const lastUiUpdate = useRef(0)
  const expression = lacExpressionLevel(inducer, glucose, preinduced)

  const dnaCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-.32, .065, .105), new THREE.Vector3(-.16, .08, .095),
    new THREE.Vector3(.02, .055, .085), new THREE.Vector3(.24, .072, .095),
  ]), [])
  const dnaGeometry = useMemo(() => new THREE.TubeGeometry(dnaCurve, 100, .008, 7, false), [dnaCurve])
  const genes = useMemo(() => [
    { start: 0, length: .55, color: '#d5ad62' },
    { start: .58, length: .25, color: '#74aaa1' },
    { start: .85, length: .14, color: '#a78ca9' },
  ].map((gene) => {
    const curve = new THREE.CatmullRomCurve3(Array.from({ length: 8 }, (_, i) => dnaCurve.getPointAt(gene.start + gene.length * (i / 7))))
    return { ...gene, geometry: new THREE.TubeGeometry(curve, 48, .011, 7, false) }
  }), [dnaCurve])
  const rnaPoints = useMemo(() => Array.from({ length: 110 }, (_, i) => {
    const t = i / 109
    return new THREE.Vector3(-.11 + t * .38, .055 - t * .25, .1 + Math.sin(t * 22) * .012)
  }), [])
  const rnaGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(rnaPoints), [rnaPoints])
  const rnaObject = useMemo(() => new THREE.Line(rnaGeometry, new THREE.LineBasicMaterial({ color: '#ed9a55', transparent: true, opacity: .96 })), [rnaGeometry])
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), [])
  const randomPositions = useMemo(() => {
    const random = mulberry32(1957)
    return {
      lacZ: Array.from({ length: maxLacZ }, () => new THREE.Vector3(-.35 + random() * .75, -.2 + random() * .27, -.12 + random() * .2)),
      lacY: Array.from({ length: maxLacY }, (_, i) => {
        const angle = -.9 + (i / maxLacY) * 1.8
        return { p: new THREE.Vector3(-.52 + (i % 8) * .14, Math.cos(angle) * .325, Math.sin(angle) * .325), n: new THREE.Vector3(0, Math.cos(angle), Math.sin(angle)) }
      }),
      phase: Array.from({ length: 24 }, () => random() * Math.PI * 2),
    }
  }, [])

  useLayoutEffect(() => {
    if (!lacY.current || !lacZ.current || !inducerMesh.current) return
    lacY.current.count = 0; lacZ.current.count = 0
    for (let i = 0; i < 24; i++) {
      dummy.position.set(-.35 + (i % 8) * .09, .47 + Math.floor(i / 8) * .055, -.04 + (i % 3) * .04)
      dummy.scale.setScalar(.008); dummy.updateMatrix(); inducerMesh.current.setMatrixAt(i, dummy.matrix)
    }
    inducerMesh.current.instanceMatrix.needsUpdate = true
  }, [dummy])

  useFrame((_, dt) => {
    if (lastNonce.current !== runNonce) {
      lastNonce.current = runNonce; elapsed.current = 0; lastUiUpdate.current = 0
    }
    if (running && !paused) elapsed.current = Math.min(duration, elapsed.current + dt)
    const progress = running ? elapsed.current / duration : storedProgress
    const activation = expression * THREE.MathUtils.smoothstep(progress, .1, .95)
    if (running && elapsed.current - lastUiUpdate.current > .12) {
      lastUiUpdate.current = elapsed.current; setProgress(progress)
    }
    if (running && elapsed.current >= duration) finish()
    if (!group.current) return
    group.current.visible = (panelOpen || storedProgress > 0 || running) && !knockoutPanelOpen && !systemsPanelOpen

    const induction = THREE.MathUtils.smoothstep(progress, .1, .26) * expression
    if (repressor.current) {
      repressor.current.position.set(-.27, .075 + induction * .12, .098 + induction * .1)
      repressor.current.rotation.z = induction * 1.4
    }
    if (locusGlow.current) locusGlow.current.emissiveIntensity = .18 + activation * .85

    const transcribe = THREE.MathUtils.clamp((progress - .25) / .34, 0, 1) * expression
    if (polymerase.current) {
      polymerase.current.visible = progress > .2 && progress < .74 && expression > .08
      polymerase.current.position.copy(dnaCurve.getPointAt(Math.min(.99, .05 + transcribe * .9)))
      polymerase.current.rotation.y += paused ? 0 : dt * .4
    }
    if (mrna.current) {
      mrna.current.visible = transcribe > .02
      mrna.current.geometry.setDrawRange(0, Math.max(2, Math.floor(rnaPoints.length * transcribe)))
    }
    const moveRibosome = (node: THREE.Group | null, delay: number) => {
      if (!node) return
      const translation = THREE.MathUtils.clamp((progress - delay) / .32, 0, 1) * expression
      node.visible = translation > .04
      node.position.copy(rnaPoints[Math.min(rnaPoints.length - 1, Math.floor(translation * (rnaPoints.length - 1)))])
      node.rotation.y += paused ? 0 : dt * .3
    }
    moveRibosome(ribosomeA.current, .44); moveRibosome(ribosomeB.current, .55)

    if (lacY.current && lacZ.current) {
      const proteinProgress = THREE.MathUtils.smoothstep(progress, .62, .95) * expression
      const yCount = Math.floor(maxLacY * proteinProgress)
      const zCount = Math.floor(maxLacZ * proteinProgress)
      lacY.current.count = yCount; lacZ.current.count = zCount
      for (let i = 0; i < yCount; i++) {
        const point = randomPositions.lacY[i]
        dummy.position.copy(point.p); dummy.quaternion.setFromUnitVectors(up, point.n)
        dummy.scale.set(.017, .045, .017); dummy.updateMatrix(); lacY.current.setMatrixAt(i, dummy.matrix)
      }
      for (let i = 0; i < zCount; i++) {
        dummy.position.copy(randomPositions.lacZ[i]); dummy.rotation.set(i * .71, progress + i, i * .37)
        dummy.scale.setScalar(.026); dummy.updateMatrix(); lacZ.current.setMatrixAt(i, dummy.matrix)
      }
      lacY.current.instanceMatrix.needsUpdate = true; lacZ.current.instanceMatrix.needsUpdate = true
    }
    if (inducerMesh.current) {
      inducerMesh.current.count = Math.max(2, Math.floor(24 * inducer))
      for (let i = 0; i < inducerMesh.current.count; i++) {
        const phase = randomPositions.phase[i]
        const uptake = activation * (.35 + (i % 7) / 9)
        dummy.position.set(-.35 + (i % 8) * .09, .48 - uptake * .26 + Math.sin(progress * 12 + phase) * .012, -.05 + (i % 4) * .03)
        dummy.scale.setScalar(.007); dummy.updateMatrix(); inducerMesh.current.setMatrixAt(i, dummy.matrix)
      }
      inducerMesh.current.instanceMatrix.needsUpdate = true
    }
  })

  return <group ref={group} visible={false} onClick={(event) => { event.stopPropagation(); setPanelOpen(true) }}>
    <group>
      <mesh geometry={dnaGeometry}>
        <meshStandardMaterial ref={locusGlow} color="#e7dcc9" emissive="#d5a552" emissiveIntensity={.18} roughness={.58} />
      </mesh>
      {genes.map((gene, i) => <mesh geometry={gene.geometry} key={i}>
        <meshStandardMaterial color={gene.color} emissive={gene.color} emissiveIntensity={.25} roughness={.62} />
      </mesh>)}
      <group ref={repressor} position={[-.27, .075, .098]}>
        <mesh position={[-.012, 0, 0]} scale={[.018, .024, .018]}><sphereGeometry args={[1, 9, 7]} /><meshStandardMaterial color="#6d7182" roughness={.7} /></mesh>
        <mesh position={[.012, 0, 0]} scale={[.018, .024, .018]}><sphereGeometry args={[1, 9, 7]} /><meshStandardMaterial color="#7b8092" roughness={.7} /></mesh>
      </group>
      <mesh ref={polymerase} visible={false}><dodecahedronGeometry args={[.034, 1]} /><meshStandardMaterial color="#d6a159" emissive="#9b642f" emissiveIntensity={.32} roughness={.66} /></mesh>
      <primitive ref={mrna} object={rnaObject} />
      <RibosomeModel modelRef={ribosomeA} /><RibosomeModel modelRef={ribosomeB} />
    </group>
    <instancedMesh ref={lacY} args={[undefined, undefined, maxLacY]}>
      <cylinderGeometry args={[1, 1.15, 1, 8, 1, true]} /><meshStandardMaterial color="#68a9a0" emissive="#356f6c" emissiveIntensity={.25} roughness={.58} side={THREE.DoubleSide} />
    </instancedMesh>
    <instancedMesh ref={lacZ} args={[undefined, undefined, maxLacZ]}>
      <dodecahedronGeometry args={[1, 1]} /><meshStandardMaterial color="#d2ad66" emissive="#7e6131" emissiveIntensity={.18} roughness={.7} />
    </instancedMesh>
    <instancedMesh ref={inducerMesh} args={[undefined, undefined, 24]}>
      <icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#d7dc81" emissive="#9ba54d" emissiveIntensity={.55} roughness={.5} />
    </instancedMesh>
    {(panelOpen || running) && <pointLight position={[-.05, .05, .1]} color="#d9a65a" intensity={.5 * expression} distance={.65} />}
  </group>
}
