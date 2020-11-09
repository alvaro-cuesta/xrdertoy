import PropTypes from 'prop-types'
import cx from 'classnames'
import { generatePath, Link } from 'react-router-dom'
import { useQueryShader } from '../hooks/useQueryShader'
import { SHADERTOY_PREVIEW_PATH, VIEW_PATH } from '../paths'
import styles from './ListItem.module.css'
import { ReactComponent as EyeIcon } from '../icons/eye.svg'
import { ReactComponent as HeartIcon } from '../icons/heart.svg'

const ShaderListItem = ({ id }) => {
  const { data } = useQueryShader(id)
  const { name, username, viewed: views, likes } = data?.Shader?.info || {}

  const viewPath = generatePath(VIEW_PATH, { id })
  const shaderToyPreviewPath = generatePath(SHADERTOY_PREVIEW_PATH, { id })

  return (
    <div className={styles.ListItem}>
      <div className={styles.imageWrapper}>
        <Link to={viewPath} className={styles.link}>
          <img
            className={styles.image}
            src={shaderToyPreviewPath}
            alt={
              data?.Shader ? `Preview` : `Preview for shader ${id} (loading)`
            }
          />
        </Link>
        {data?.Shader ? (
          <>
            <div className={cx(styles.imageOverlay, styles.imageInfo)}>
              <div>
                {views} <EyeIcon className="icon" />
              </div>
              <div>
                {likes} <HeartIcon className="icon" />
              </div>
            </div>
            <div className={cx(styles.imageOverlay, styles.imageName)}>
              {name} by {username}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

ShaderListItem.propTypes = {
  id: PropTypes.string.isRequired,
}

export default ShaderListItem
