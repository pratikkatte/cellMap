export function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function capsulePoint(random: () => number, radius: number, halfLength = 0.7) {
  while (true) {
    const x = (random() * 2 - 1) * (halfLength + radius)
    const y = (random() * 2 - 1) * radius
    const z = (random() * 2 - 1) * radius
    const capX = Math.max(Math.abs(x) - halfLength, 0)
    if (capX * capX + y * y + z * z <= radius * radius) return [x, y, z] as const
  }
}

export function capsuleSurfacePoint(random: () => number, radius: number, halfLength = 0.7) {
  const x = (random() * 2 - 1) * (halfLength + radius)
  const centerX = Math.max(-halfLength, Math.min(halfLength, x))
  const angle = random() * Math.PI * 2
  const capOffset = Math.abs(x) > halfLength ? Math.sqrt(Math.max(0, radius * radius - (x - centerX) ** 2)) : radius
  return { position: [x, Math.cos(angle) * capOffset, Math.sin(angle) * capOffset] as const, normal: [x - centerX, Math.cos(angle) * capOffset, Math.sin(angle) * capOffset] as const }
}
