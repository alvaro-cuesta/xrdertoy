import { Fragment } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQueryShader } from '../hooks/useQueryShader'
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

  return (
    <>
      <h2>
        <Link to={`/view/${id}`}>
          {info.name} v{ver}
        </Link>{' '}
        <a href={`https://www.shadertoy.com/view/${id}`}>(On ShaderToy)</a>
      </h2>
      <Link to={`/view/${id}`}>
        <img
          className={styles.image}
          src={`https://www.shadertoy.com/media/shaders/${id}.jpg`}
          alt="Preview"
        />
      </Link>
      <XRButton />
      <ul>
        <li>
          By:{' '}
          <a href={`https://www.shadertoy.com/user/${info.username}`}>
            {info.username}
          </a>{' '}
          on {new Date(info.date * 1000).toISOString()}
        </li>
        <li>
          Views: {info.viewed}, Likes: {info.likes}
        </li>
        <li>
          Tags:{' '}
          {info.tags.map((tag, i) => (
            <Fragment key={tag}>
              <Link to={`/?text=${tag}`}>{tag}</Link>
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
      <pre>{JSON.stringify(renderpass, null, 4)}</pre>
    </>
  )
}

export default Viewer
