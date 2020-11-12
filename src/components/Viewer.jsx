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
import ViewerButton from './ViewerButton'
import { Helmet } from 'react-helmet-async'
import useScrollToTopOnMount from '../hooks/useScrollToTopOnMount'
import BBCode from './BBCode'

const Viewer = () => {
  useScrollToTopOnMount()

  const { id } = useParams()
  const { isLoading, isError, error, data, refetch } = useQueryShader(id)

  if (isLoading) {
    return (
      <div>
        <Helmet>
          <title>{id} - XRderToy Viewer</title>
        </Helmet>
        Loading shader {id}
      </div>
    )
  }

  if (isError || data.Error) {
    return (
      <div>
        <Helmet>
          <title>{id} - XRderToy Viewer</title>
        </Helmet>
        Error loading shader {id}: {error?.message || data?.Error}{' '}
        <button onClick={refetch}>Retry</button>
      </div>
    )
  }

  const { info } = data?.Shader

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
      <Helmet>
        <title>
          {info.name} by {info.username} - XRderToy Viewer
        </title>
      </Helmet>

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

        <ViewerButton id={id} shader={data?.Shader} />
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
            Description: <BBCode string={info.description} />
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
