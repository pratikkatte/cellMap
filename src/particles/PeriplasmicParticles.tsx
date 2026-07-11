import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useAppStore } from '../app/store'
import { capsuleSurfacePoint, mulberry32 } from '../utils/random'

export function PeriplasmicParticles() {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const density = useAppStore((s) => s.density)
  const count = Math.floor(110 * density)
  const points = useMemo(() => {
    const random = mulberry32(511)
    return Array.from({ length: count }, () => {
      const s = capsuleSurfacePoint(random, .35 + random() * .025)
      return { p: new THREE.Vector3(...s.position), scale: .006 + random() * .008 }
    })
  }, [count])
  useLayoutEffect(() => {
    const matrix = new THREE.Matrix4()
    points.forEach((point, i) => {
      matrix.compose(point.p, new THREE.Quaternion(), new THREE.Vector3(point.scale, point.scale, point.scale))
      mesh.current?.setMatrixAt(i, matrix)
    })
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true
  }, [points])
  return <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
    <icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#b6a77a" transparent opacity={.54} roughness={.8} />
  </instancedMesh>
}
