import { useEffect, useState, useRef, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { EffectComposer } from "@react-three/postprocessing"
import { Vector2, CanvasTexture } from "three"
import { AsciiEffect } from "./ui/ascii-effect"
import { useTheme } from "@/hooks/useTheme"

function SceneWithDelayedComposer({ resolution, mousePos, theme }: { resolution: Vector2, mousePos: Vector2, theme: string }) {
  const { gl, viewport } = useThree()
  const [composerReady, setComposerReady] = useState(false)
  const frameCount = useRef(0)

  const trailCanvas = useMemo(() => document.createElement('canvas'), [])
  const trailTexture = useMemo(() => new CanvasTexture(trailCanvas), [trailCanvas])
  const lastMousePos = useRef(new Vector2())

  useEffect(() => {
    if (resolution.x > 0 && resolution.y > 0) {
      trailCanvas.width = resolution.x / 2
      trailCanvas.height = resolution.y / 2
      const ctx = trailCanvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, trailCanvas.width, trailCanvas.height)
      }
    }
  }, [resolution, trailCanvas])

  useFrame(() => {
    frameCount.current++
    if (frameCount.current >= 3 && !composerReady) {
      setTimeout(() => {
        try {
          const context = gl.getContext()
          if (context && !(context as WebGLRenderingContext).isContextLost?.()) {
            setComposerReady(true)
          }
        } catch (e) {
          /* ignore WebGL context errors */
        }
      }, 100)
    }

    const ctx = trailCanvas.getContext('2d')
    if (frameCount.current % 2 !== 0) return; // Limit to ~30fps for the trail fade to save CPU

    if (ctx && trailCanvas.width > 0) {
      // Fade out previous frames
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)' // Stronger fade to compensate for skipped frames
      ctx.fillRect(0, 0, trailCanvas.width, trailCanvas.height)

      const x = (mousePos.x / resolution.x) * trailCanvas.width
      const y = (mousePos.y / resolution.y) * trailCanvas.height

      const dist = lastMousePos.current.distanceTo(mousePos)

      if (dist > 0.1) {
        lastMousePos.current.copy(mousePos)

        // Radius is small but expands slightly on fast movement
        const targetRadius = Math.max(30, Math.min(60, 30 + dist * 0.4))
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, targetRadius)
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, targetRadius, 0, Math.PI * 2)
        ctx.fill()
      }
      
      trailTexture.needsUpdate = true
    }
  })

  return (
    <>
      <color attach="background" args={[theme === 'light' ? '#ffffff' : '#000000']} />
      
      <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial map={trailTexture} />
      </mesh>
      
      {composerReady && (
        <EffectComposer>
          <AsciiEffect
            style="standard"
            cellSize={10}
            invert={false}
            color={true}
            characterSet="terminal"
            volumeShading={false}
            tintColor="#E52B50"
            bgColor={theme === 'light' ? '#ffffff' : '#000000'}
            resolution={resolution}
            mousePos={mousePos}
            postfx={{
              contrastAdjust: 1.0,
              brightnessAdjust: 0.0,
              mouseGlowEnabled: false,
              mouseGlowOnly: false,
              scanlineIntensity: 0.0,
              noiseIntensity: 0.0,
              noiseScale: 20.0,
            }}
          />
        </EffectComposer>
      )}
    </>
  )
}

export function AsciiAnimation() {
  const { theme } = useTheme()
  const [mousePos] = useState(() => new Vector2(0, 0))
  const [resolution] = useState(() => new Vector2(1920, 1080))
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReducedMotion(mediaQuery.matches)
      
      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }
  }, [])

  useEffect(() => {
    const updateResolution = () => {
      resolution.set(window.innerWidth, window.innerHeight)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.set(e.clientX, e.clientY) // window coordinates directly
    }

    updateResolution()
    window.addEventListener('resize', updateResolution)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener('resize', updateResolution)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [mousePos, resolution])

  if (reducedMotion) {
    return (
      <div className="pointer-events-none fixed inset-0 z-0 bg-white dark:bg-[#1A030A]" />
    )
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-white dark:bg-black"
    >
      <Canvas
        dpr={Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5)}
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: false, antialias: false }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.0
        }}
      >
        <SceneWithDelayedComposer
          resolution={resolution}
          mousePos={mousePos}
          theme={theme}
        />
      </Canvas>
    </div>
  )
}
