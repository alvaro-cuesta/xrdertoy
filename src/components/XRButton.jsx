import { createDrawScene } from '../gl/scene'
import { useXRSession } from '../hooks/useXRSession'

const XRButton = () => {
  const {
    isAvailable,
    isSupported,
    isStarting,
    isRunning,
    start,
    stop,
  } = useXRSession(createDrawScene)

  const isDisabled = !isAvailable || !isSupported || isStarting
  const message = !isAvailable
    ? 'WebXR is not available'
    : !isSupported
    ? 'WebXR Immersive VR is not supported'
    : isStarting
    ? 'Starting VR...'
    : !isRunning
    ? 'Start VR'
    : 'Stop VR'
  const onClick = isRunning ? stop : start

  return (
    <button disabled={isDisabled} onClick={onClick}>
      {message}
    </button>
  )
}

export default XRButton
