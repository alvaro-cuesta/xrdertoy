import Preview from './Preview'
import { useEffect, useMemo } from 'react'
import { createDrawScene } from '../gl/scene'
import { useXRSession } from '../hooks/useXRSession'
import styles from './ViewerButton.module.scss'

const ViewerButton = ({ id, shader }) => {
  const myCreateDrawScene = useMemo(
    () => (shader.renderpass ? createDrawScene(shader.renderpass) : null),
    [shader.renderpass],
  )

  const {
    isAvailable,
    isSupported,
    isStarting,
    isRunning,
    start,
    stop,
  } = useXRSession(myCreateDrawScene)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        stop()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [stop])

  return (
    <Preview
      id={id}
      views={shader.info.viewed}
      likes={shader.info.likes}
      message={
        !isAvailable
          ? 'WebXR is not available'
          : !isSupported
          ? 'WebXR Immersive VR is not supported'
          : undefined
      }
      className={styles.ViewerButton}
      action={
        !isAvailable || !isSupported
          ? Preview.ACTIONS.ERROR
          : isStarting
          ? Preview.ACTIONS.SPIN
          : !isRunning
          ? Preview.ACTIONS.PLAY
          : Preview.ACTIONS.STOP
      }
      onClick={
        !isAvailable || !isSupported
          ? undefined
          : isStarting
          ? undefined
          : !isRunning
          ? start
          : stop
      }
    />
  )
}

export default ViewerButton
