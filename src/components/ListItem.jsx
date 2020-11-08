import PropTypes from 'prop-types'
import { generatePath, Link } from 'react-router-dom'
import { useQueryShader } from '../hooks/useQueryShader'
import {
  SHADERTOY_PREVIEW_PATH,
  SHADERTOY_USER_PATH,
  SHADERTOY_VIEW_PATH,
  VIEW_PATH,
} from '../paths'
import styles from './ListItem.module.css'
import { ReactComponent as EyeIcon } from '../icons/eye.svg'
import { ReactComponent as HeartIcon } from '../icons/heart.svg'

const ShaderListItemInfo = ({ id, info }) => {
  const { name, username, viewed: views, likes } = info

  const viewPath = generatePath(VIEW_PATH, { id })
  const shaderToyProfilePath = username
    ? generatePath(SHADERTOY_USER_PATH, { username })
    : null

  return (
    <>
      <Link to={viewPath}>{name}</Link> by{' '}
      <a href={shaderToyProfilePath}>{username}</a>
      <EyeIcon className="icon" /> {views}
      <HeartIcon className="icon" /> {likes}
    </>
  )
}

ShaderListItemInfo.propTypes = {
  id: PropTypes.string.isRequired,
  info: PropTypes.shape({
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    viewed: PropTypes.number.isRequired,
    likes: PropTypes.number.isRequired,
  }).isRequired,
}

const ShaderListItem = ({ id }) => {
  const { data } = useQueryShader(id)

  const viewPath = generatePath(VIEW_PATH, { id })
  const shaderToyPreviewPath = generatePath(SHADERTOY_PREVIEW_PATH, { id })
  const shaderToyViewPath = generatePath(SHADERTOY_VIEW_PATH, { id })

  return (
    <div className={styles.ListItem}>
      <Link to={viewPath} className={styles.link}>
        <img
          className={styles.image}
          src={shaderToyPreviewPath}
          alt={data?.Shader ? `Preview` : `Preview for shader ${id} (loading)`}
        />
      </Link>
      <div>
        {data?.Shader ? (
          <ShaderListItemInfo id={id} info={data?.Shader.info} />
        ) : null}
      </div>
      <a href={shaderToyViewPath}>On ShaderToy</a>
    </div>
  )
}

ShaderListItem.propTypes = {
  id: PropTypes.string.isRequired,
}

export default ShaderListItem
