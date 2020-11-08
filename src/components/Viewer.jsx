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

const Viewer = () => {
  const { id } = useParams()
  const { isLoading, isError, data } = useQueryShader(id)

  if (isLoading) {
    return `Loading shader ${id}`
  }

  if (isError) {
    return `Error loading shader ${id}`
  }

  const {
    Shader: { ver, info, renderpass },
  } = data

  const viewPath = generatePath(VIEW_PATH, { id })
  const shaderToyPreviewPath = generatePath(SHADERTOY_PREVIEW_PATH, { id })
  const shaderToyViewPath = generatePath(SHADERTOY_VIEW_PATH, { id })
  const shaderToyProfilePath = info.username
    ? generatePath(SHADERTOY_USER_PATH, { username: info.username })
    : null

  return (
    <>
      <h2>
        <Link to={viewPath}>
          {info.name} v{ver}
        </Link>{' '}
        <a href={shaderToyViewPath}>(On ShaderToy)</a>
      </h2>

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
          By: <a href={shaderToyProfilePath}>{info.username}</a> on{' '}
          {new Date(info.date * 1000).toISOString()}
        </li>
        <li>
          Views: {info.viewed}, Likes: {info.likes}
        </li>
        <li>
          Tags:{' '}
          {info.tags.map((tag, i) => (
            <Fragment key={tag}>
              <Link to={`${BROWSER_PATH}?text=${tag}`}>{tag}</Link>
              {i !== info.tags.length - 1 ? ', ' : null}
            </Fragment>
          ))}
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
        <pre>{JSON.stringify(renderpass, null, 4)}</pre>
      </details>
    </>
  )
}

Viewer.propTypes = {}

export default Viewer
