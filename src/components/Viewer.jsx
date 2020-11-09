import { Fragment } from 'react'
import { generatePath, Link, useParams } from 'react-router-dom'
import { useQueryShader } from '../hooks/useQueryShader'
import {
  BROWSER_PATH,
  SHADERTOY_PREVIEW_PATH,
  SHADERTOY_USER_PATH,
  SHADERTOY_VIEW_PATH,
  VIEW_PATH,
} from '../paths'
import styles from './Viewer.module.css'
import XRButton from './XRButton'
import { ReactComponent as EyeIcon } from '../icons/eye.svg'
import { ReactComponent as HeartIcon } from '../icons/heart.svg'
import { getFlags } from '../shadertoy/flags'

const Viewer = () => {
  const { id } = useParams()
  const { isLoading, isError, data, refetch } = useQueryShader(id)

  if (isLoading) {
    return `Loading shader ${id}`
  }

  if (isError) {
    return (
      <div>
        Error loading shader {id} <button onClick={refetch}>Retry</button>
      </div>
    )
  }

  const {
    Shader: { info },
  } = data

  const viewPath = generatePath(VIEW_PATH, { id })
  const shaderToyPreviewPath = generatePath(SHADERTOY_PREVIEW_PATH, { id })
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
    <>
      <header className={styles.header}>
        <h2>
          <Link to={viewPath}>{info.name}</Link>{' '}
          <small>
            by <a href={shaderToyProfilePath}>{info.username}</a>{' '}
            <a href={shaderToyViewPath}>(on ShaderToy)</a>
          </small>
        </h2>
      </header>

      <Link to={viewPath}>
        <img
          className={styles.image}
          src={shaderToyPreviewPath}
          alt="Preview"
        />
      </Link>

      <XRButton />

      <ul>
        <li>
          <span className={styles.dateTime} title={dateTimeText}>
            {dateText}
          </span>
        </li>
        <li>
          <EyeIcon className="icon" /> {info.viewed}{' '}
          <HeartIcon className="icon" /> {info.likes}
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

      <details>
        <summary>Debug</summary>
        <pre>{JSON.stringify(data, null, 4)}</pre>
      </details>
    </>
  )
}

Viewer.propTypes = {}

export default Viewer
