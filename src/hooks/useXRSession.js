const { useState, useEffect, useRef, useCallback } = require('react')

const xr = navigator.xr

export const useXRSession = (createDrawScene) => {
  const [isSupported, setIsSupported] = useState(null)

  useEffect(() => {
    if (!xr) {
      return
    }

    xr.isSessionSupported('immersive-vr').then(setIsSupported)
  }, [])

  const xrSession = useRef(null)

  const [isStarting, setIsStarting] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  const stop = useCallback(() => {
    if (xrSession.current) {
      xrSession.current.end()
    }

    xrSession.current = null

    setIsStarting(false)
    setIsRunning(false)
  }, [])

  const start = useCallback(() => {
    if (!createDrawScene) {
      return
    }

    setIsStarting(true)
    ;(async () => {
      xrSession.current = await xr.requestSession('immersive-vr', {
        requiredFeatures: ['local-floor'],
      })

      const onXRSessionEnded = () => {
        stop()
      }

      xrSession.current.addEventListener('end', onXRSessionEnded)

      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2', { xrCompatible: true })
      const drawScene = createDrawScene(gl)

      xrSession.current.updateRenderState({
        baseLayer: new global.XRWebGLLayer(xrSession.current, gl),
      })

      const xrRefSpace = await xrSession.current.requestReferenceSpace('local')

      setIsRunning(true)

      const drawXR = (time, frame) => {
        drawScene(time, frame, xrRefSpace)
        frame.session.requestAnimationFrame(drawXR)
      }

      xrSession.current.requestAnimationFrame(drawXR)
    })()
  }, [stop, createDrawScene])

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop, createDrawScene])

  return {
    isAvailable: !!xr,
    isSupported,
    isStarting,
    isRunning,
    start,
    stop,
  }
}
