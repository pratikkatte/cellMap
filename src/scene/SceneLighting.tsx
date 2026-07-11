export function SceneLighting() {
  return <>
    <ambientLight intensity={.42} color="#b8d1cc" />
    <directionalLight position={[2.8, 3.2, 3.4]} intensity={2.3} color="#f0d0a8" />
    <directionalLight position={[-2.4, 1.1, -2.6]} intensity={1.35} color="#559aa0" />
    <pointLight position={[0, -2, 1.8]} intensity={1.1} color="#8a657e" distance={5} />
  </>
}
