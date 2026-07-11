import { useEffect, useMemo, useRef } from 'react'
import type { ComponentRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '../app/store'
import { tourStops } from '../data/tourStops'
import type { StructureId } from '../app/types'

const focusPoints: Partial<Record<StructureId, THREE.Vector3>> = {
  outerMembrane: new THREE.Vector3(.1, 0, 0), porin: new THREE.Vector3(.25, .35, .12),
  periplasm: new THREE.Vector3(.2, 0, 0), peptidoglycan: new THREE.Vector3(.18, 0, 0),
  innerMembrane: new THREE.Vector3(.12, 0, 0), atpSynthase: new THREE.Vector3(-.12, -.28, .09),
  nucleoid: new THREE.Vector3(0, 0, 0), chromosome: new THREE.Vector3(0, 0, 0),
  ribosome: new THREE.Vector3(.32, .12, .08), plasmid: new THREE.Vector3(-.48, .16, .11),
  flagellarMotor: new THREE.Vector3(-.66, -.24, -.23), flagellum: new THREE.Vector3(-1.35, -.15, -.2),
  pilus: new THREE.Vector3(.2, .42, .05),
}

export function CameraController() {
  const { camera, gl } = useThree()
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null)
  const mode = useAppStore((s) => s.mode)
  const selected = useAppStore((s) => s.selected)
  const tourIndex = useAppStore((s) => s.tourIndex)
  const resetNonce = useAppStore((s) => s.resetNonce)
  const resetCamera = useAppStore((s) => s.resetCamera)
  const keys = useRef<Record<string, boolean>>({})
  const yaw = useRef(0)
  const pitch = useRef(0)
  const focus = useRef({ active: false, target: new THREE.Vector3(), position: new THREE.Vector3() })
  const lastSelected = useRef<StructureId | null>(null)
  const interiorEntry = useRef(0)
  const vectors = useMemo(() => ({ forward: new THREE.Vector3(), right: new THREE.Vector3(), move: new THREE.Vector3(), up: new THREE.Vector3(0, 1, 0) }), [])

  useEffect(() => {
    camera.position.set(2.7, 1.6, 2.8); camera.lookAt(0, 0, 0); controls.current?.target.set(0, 0, 0); controls.current?.update()
  }, [camera, resetNonce])

  useEffect(() => {
    const down = (e: KeyboardEvent) => { keys.current[e.code] = true; if (e.code === 'KeyR') resetCamera() }
    const up = (e: KeyboardEvent) => { keys.current[e.code] = false }
    const mouse = (e: MouseEvent) => {
      if (document.pointerLockElement !== gl.domElement || mode !== 'interior') return
      yaw.current -= e.movementX * .0014; pitch.current = THREE.MathUtils.clamp(pitch.current - e.movementY * .0014, -1.45, 1.45)
    }
    const lock = () => { if (mode === 'interior' && document.pointerLockElement !== gl.domElement) gl.domElement.requestPointerLock() }
    window.addEventListener('keydown', down); window.addEventListener('keyup', up); window.addEventListener('mousemove', mouse); gl.domElement.addEventListener('dblclick', lock)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); window.removeEventListener('mousemove', mouse); gl.domElement.removeEventListener('dblclick', lock) }
  }, [camera, gl, mode, resetCamera])

  useEffect(() => { if (mode === 'interior') interiorEntry.current = 1 }, [mode])

  useFrame((_, dt) => {
    if (mode === 'tour') {
      const stop = tourStops[tourIndex]
      const desired = new THREE.Vector3(...stop.position)
      const target = new THREE.Vector3(...stop.target)
      camera.position.lerp(desired, 1 - Math.exp(-dt * 1.6))
      camera.lookAt(target)
      return
    }
    if (mode === 'interior') {
      if (interiorEntry.current > .01) {
        camera.position.lerp(new THREE.Vector3(.12, .05, .22), 1 - Math.exp(-dt * 2.5))
        interiorEntry.current *= Math.exp(-dt * 2.4)
      }
      camera.quaternion.setFromEuler(new THREE.Euler(pitch.current, yaw.current, 0, 'YXZ'))
      vectors.forward.set(0, 0, -1).applyQuaternion(camera.quaternion)
      vectors.right.set(1, 0, 0).applyQuaternion(camera.quaternion)
      vectors.move.set(0, 0, 0)
      if (keys.current.KeyW) vectors.move.add(vectors.forward)
      if (keys.current.KeyS) vectors.move.sub(vectors.forward)
      if (keys.current.KeyD) vectors.move.add(vectors.right)
      if (keys.current.KeyA) vectors.move.sub(vectors.right)
      if (keys.current.KeyE) vectors.move.add(vectors.up)
      if (keys.current.KeyQ) vectors.move.sub(vectors.up)
      const speed = keys.current.ShiftLeft || keys.current.ShiftRight ? .32 : .115
      if (vectors.move.lengthSq()) camera.position.addScaledVector(vectors.move.normalize(), dt * speed)
      // A soft capsule constraint keeps free-flight exploration close to the bacterium.
      camera.position.x = THREE.MathUtils.clamp(camera.position.x, -1.02, 1.02)
      const radialLimit = Math.sqrt(Math.max(.03, .29 ** 2 - Math.max(0, Math.abs(camera.position.x) - .7) ** 2))
      const radial = Math.hypot(camera.position.y, camera.position.z)
      if (radial > radialLimit) { camera.position.y *= radialLimit / radial; camera.position.z *= radialLimit / radial }
      return
    }
    if (selected !== lastSelected.current) {
      lastSelected.current = selected
      const target = selected ? focusPoints[selected] : null
      if (target) {
        focus.current.active = true; focus.current.target.copy(target)
        const direction = camera.position.clone().sub(target).normalize()
        focus.current.position.copy(target).addScaledVector(direction, selected === 'flagellum' ? 1.5 : .95)
      }
    }
    if (focus.current.active) {
      camera.position.lerp(focus.current.position, 1 - Math.exp(-dt * 2.1))
      controls.current?.target.lerp(focus.current.target, 1 - Math.exp(-dt * 2.1))
      controls.current?.update()
      if (camera.position.distanceTo(focus.current.position) < .015) focus.current.active = false
    }
  })

  return mode === 'exterior' ? <OrbitControls ref={controls} makeDefault enableDamping dampingFactor={.07} minDistance={.48} maxDistance={7} panSpeed={.45} rotateSpeed={.55} /> : null
}
