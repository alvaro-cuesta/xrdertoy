import { generatePath, Link, useParams } from 'react-router-dom'
import { useQueryShader } from '../hooks/useQueryShader'
import {
  BROWSER_PATH,
  SHADERTOY_USER_PATH,
  SHADERTOY_VIEW_PATH,
  VIEW_PATH,
} from '../paths'
import styles from './Viewer.module.scss'
import { getFlags } from '../shadertoy/flags'
import Preview from './Preview'
import { useMemo } from 'react'
import { createDrawScene } from '../gl/scene'
import { useXRSession } from '../hooks/useXRSession'

const Viewer = () => {
  const { id } = useParams()
  const { isLoading, isError, error, data, refetch } = useQueryShader(id)
  const { info, renderpass } = data?.Shader || {}

  const myCreateDrawScene = useMemo(
    () => (renderpass ? createDrawScene(renderpass) : null),
    [renderpass],
  )

  const {
    isAvailable,
    isSupported,
    isStarting,
    isRunning,
    start,
    stop,
  } = useXRSession(myCreateDrawScene)

  if (isLoading) {
    return `Loading shader ${id}`
  }

  if (isError || data.Error) {
    return (
      <div>
        Error loading shader {id}: {error?.message || data?.Error}{' '}
        <button onClick={refetch}>Retry</button>
      </div>
    )
  }

  const viewPath = generatePath(VIEW_PATH, { id })
  const shaderToyViewPath = generatePath(SHADERTOY_VIEW_PATH, { id })
  const shaderToyProfilePath = info.username
    ? generatePath(SHADERTOY_USER_PATH, { username: info.username })
    : null

  const date = info.date ? new Date(info.date * 1000) : null
  const dateText = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
  const timeText = `${date
    .getHours()
    .toString()
    .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  const dateTimeText = `${dateText} ${timeText}`

  const flags = getFlags(info.flags)

  return (
    <div className={styles.Viewer}>
      <div className={styles.main}>
        <header className={styles.header}>
          <h2>
            <Link to={viewPath}>{info.name}</Link>{' '}
            <small>
              by{' '}
              <Link to={`${BROWSER_PATH}?text=${info.username}`}>
                {info.username}
              </Link>
            </small>
          </h2>
        </header>

        <Preview
          id={id}
          views={info.viewed}
          likes={info.likes}
          message={
            !isAvailable
              ? 'WebXR is not available'
              : !isSupported
              ? 'WebXR Immersive VR is not supported'
              : undefined
          }
          className={styles.preview}
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
      </div>

      <div className={styles.info}>
        <ul>
          <li>
            <span className={styles.dateTime} title={dateTimeText}>
              {dateText}
            </span>
          </li>
          <li>
            On ShaderToy: <a href={shaderToyViewPath}>{info.name}</a>,{' '}
            <a href={shaderToyProfilePath}>{info.username}</a>
          </li>
          <li>
            Tags:{' '}
            <ul className={styles.commaList}>
              {info.tags.map((tag, i) => (
                <li key={tag}>
                  <Link to={`${BROWSER_PATH}?text=${tag}`}>{tag}</Link>
                </li>
              ))}
            </ul>
          </li>
          <li>
            Flags:{' '}
            <ul className={styles.commaList}>
              {flags.vr && (
                <li>
                  <Link to={BROWSER_PATH}>VR</Link>
                </li>
              )}
              {flags.multipass && (
                <li>
                  <Link to={`${BROWSER_PATH}?multipass=1`}>Multipass</Link>
                </li>
              )}
              {flags.gpuSound && (
                <li>
                  <Link to={`${BROWSER_PATH}?gpusound=1`}>GPU Sound</Link>
                </li>
              )}
              {flags.microphone && (
                <li>
                  <Link to={`${BROWSER_PATH}?microphone=1`}>Microphone</Link>
                </li>
              )}
              {flags.soundCloud && (
                <li>
                  <Link to={`${BROWSER_PATH}?soundcloud=1`}>SoundCloud</Link>
                </li>
              )}
              {flags.webcam && (
                <li>
                  <Link to={`${BROWSER_PATH}?webcam=1`}>Webcam</Link>
                </li>
              )}
              {flags.keyboard && (
                <li>
                  <Link to={`${BROWSER_PATH}?keyboard=1`}>Keyboard</Link>
                </li>
              )}
            </ul>
          </li>
          <li>
            Description:{' '}
            {info.description.split(/\n+/).map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </li>
        </ul>
      </div>

      <div className={styles.side}>
        <details>
          <summary>Debug</summary>
          <pre>{JSON.stringify(data, null, 4)}</pre>
        </details>
      </div>
    </div>
  )
}

Viewer.propTypes = {}

export default Viewer
