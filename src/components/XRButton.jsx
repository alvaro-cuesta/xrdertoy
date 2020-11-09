import { useMemo } from 'react'
import { createDrawScene } from '../gl/scene'
import { useXRSession } from '../hooks/useXRSession'

const XRButton = ({ renderpass }) => {
  const myCreateDrawScene = useMemo(() => createDrawScene(renderpass), [
    renderpass,
  ])

  const {
    isAvailable,
    isSupported,
    isStarting,
    isRunning,
    start,
    stop,
  } = useXRSession(myCreateDrawScene)

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

XRButton.propTypes = {}

export default XRButton
