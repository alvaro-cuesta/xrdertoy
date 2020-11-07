import { Link } from 'react-router-dom'
import { useQueryShader } from '../hooks/useQueryShader'
import styles from './ListItem.module.css'

const ShaderListItem = ({ id }) => {
  const { data } = useQueryShader(id)

  return (
    <>
      <Link to={`/view/${id}`}>
        <img
          className={styles.image}
          src={`https://www.shadertoy.com/media/shaders/${id}.jpg`}
          alt={
            data?.Shader
              ? `Shader ${data.Shader.info.name} (${id}) thumbnail`
              : `Shader ${id} thumbnail`
          }
          title={data?.Shader ? `${data.Shader.info.name} (${id})` : id}
        />
      </Link>
      {data?.Shader ? (
        <>
          <Link to={`/view/${id}`}>{data.Shader.info.name}</Link> by{' '}
          <a
            href={`https://www.shadertoy.com/user/${data.Shader.info.username}`}
          >
            {data.Shader.info.username}
          </a>
          (Views: {data.Shader.info.viewed}, Likes: {data.Shader.info.likes})
        </>
      ) : null}
      <a href={`https://www.shadertoy.com/view/${id}`}>On ShaderToy</a>
    </>
  )
}

export default ShaderListItem
