import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'

const readColors = () => {
  const s = getComputedStyle(document.documentElement)
  return [s.getPropertyValue('--accent').trim(), s.getPropertyValue('--accent2').trim()]
}

// Re-reads the CSS accent colours when the OS switches light/dark mode.
function useThemeColors() {
  const [colors, setColors] = useState(readColors)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => setColors(readColors())
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return colors
}

function Rig({ a, b, reduced }) {
  const group = useRef()
  const core = useRef()
  const knot = useRef()
  const ring1 = useRef()
  const ring2 = useRef()
  const stars = useRef()
  const invalidate = useThree((s) => s.invalidate)

  // Particle shell around the scene
  const positions = useMemo(() => {
    const n = 700
    const arr = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const r = 3.5 + Math.random() * 6
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th)
      arr[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th)
      arr[i * 3 + 2] = r * Math.cos(ph)
    }
    return arr
  }, [])

  // With reduced motion the loop only renders on scroll
  useEffect(() => {
    if (!reduced) return
    window.addEventListener('scroll', invalidate, { passive: true })
    return () => window.removeEventListener('scroll', invalidate)
  }, [reduced, invalidate])

  useFrame(({ clock, pointer, camera }) => {
    const t = reduced ? 0 : clock.elapsedTime
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const s = Math.min(1, window.scrollY / max)
    const wide = window.innerWidth > 800

    core.current.rotation.set(t * 0.08, t * 0.15 + s * 5, 0)
    knot.current.rotation.set(t * 0.35, t * 0.25, 0)
    ring1.current.rotation.set(Math.PI / 2.4, 0, t * 0.2)
    ring2.current.rotation.set(-t * 0.15, Math.PI / 3, 0)
    stars.current.rotation.y = t * 0.02 + s * 1.5

    const pulse = 1 + Math.sin(t * 1.5) * 0.04
    group.current.scale.setScalar(pulse * (1 - s * 0.25))
    group.current.position.x = wide ? 2.2 * Math.cos(s * Math.PI * 2) : 0
    group.current.position.y = wide ? Math.sin(s * Math.PI * 2) * 0.8 : 1.5 - s * 1.5

    // Camera parallax follows the pointer and pulls back while scrolling
    camera.position.x += (pointer.x * 0.6 - camera.position.x) * 0.05
    camera.position.y += (pointer.y * 0.6 - camera.position.y) * 0.05
    camera.position.z = 7 + s * 2
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <group ref={group}>
        <mesh ref={core}>
          <icosahedronGeometry args={[1.7, 1]} />
          <meshBasicMaterial wireframe transparent opacity={0.55} color={a} />
        </mesh>
        <mesh ref={knot}>
          <torusKnotGeometry args={[0.7, 0.22, 90, 12]} />
          <meshBasicMaterial wireframe transparent opacity={0.7} color={b} />
        </mesh>
        <mesh ref={ring1}>
          <torusGeometry args={[2.6, 0.02, 8, 100]} />
          <meshBasicMaterial wireframe transparent opacity={0.8} color={a} />
        </mesh>
        <mesh ref={ring2}>
          <torusGeometry args={[3.2, 0.02, 8, 100]} />
          <meshBasicMaterial wireframe transparent opacity={0.5} color={b} />
        </mesh>
      </group>
      <points ref={stars}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.03} transparent opacity={0.9} color={a} />
      </points>
    </>
  )
}

export default function Scene() {
  const [a, b] = useThemeColors()
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  return (
    <Canvas
      className="bg"
      aria-hidden="true"
      camera={{ fov: 55, position: [0, 0, 7] }}
      dpr={[1, 2]}
      frameloop={reduced ? 'demand' : 'always'}
      gl={{ alpha: true, antialias: true }}
      eventSource={document.body}
      eventPrefix="client"
    >
      <Rig a={a} b={b} reduced={reduced} />
    </Canvas>
  )
}
