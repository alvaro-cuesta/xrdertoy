import { Link, useParams } from 'react-router-dom'
import { useQueryShader } from '../hooks/useQueryShader'

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
      <p>
        By:{' '}
        <a href={`https://www.shadertoy.com/user/${info.username}`}>
          {info.username}
        </a>{' '}
        on {new Date(info.date * 1000).toISOString()}
      </p>
      <p>
        Views: {info.viewed}, Likes: {info.likes}
      </p>
      <p>Tags: {info.tags.join(', ')}</p>
      <p>
        Description:{' '}
        {info.description.split(/\n+/).map((text) => (
          <p>{text}</p>
        ))}
      </p>
      <pre>{JSON.stringify(renderpass, null, 4)}</pre>
    </>
  )
}

export default Viewer
