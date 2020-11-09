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

const ShaderListItem = ({ id }) => {
  const { data } = useQueryShader(id)
  const { name, username, viewed: views, likes } = data?.Shader?.info || {}

  const viewPath = generatePath(VIEW_PATH, { id })
  const shaderToyPreviewPath = generatePath(SHADERTOY_PREVIEW_PATH, { id })
  const shaderToyViewPath = generatePath(SHADERTOY_VIEW_PATH, { id })
  const shaderToyProfilePath = username
    ? generatePath(SHADERTOY_USER_PATH, { username })
    : null

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
        <div className={styles.bottomInfo}>
          {data?.Shader ? (
            <>
              <div>
                <Link to={viewPath}>{name}</Link>
              </div>
              <div>
                {data?.Shader ? (
                  <>
                    <EyeIcon className="icon" /> {views}{' '}
                    <HeartIcon className="icon" /> {likes}
                  </>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
        <div className={styles.bottomInfo}>
          <div>
            by <a href={shaderToyProfilePath}>{username}</a>
          </div>
          <div>
            <a href={shaderToyViewPath}>On ShaderToy</a>
          </div>
        </div>
      </div>
    </div>
  )
}

ShaderListItem.propTypes = {
  id: PropTypes.string.isRequired,
}

export default ShaderListItem
