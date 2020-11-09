import PropTypes from 'prop-types'
import cx from 'classnames'
import { generatePath, Link } from 'react-router-dom'
import { SHADERTOY_PREVIEW_PATH, VIEW_PATH } from '../paths'
import styles from './Preview.module.scss'
import { ReactComponent as EyeIcon } from '../icons/eye.svg'
import { ReactComponent as HeartIcon } from '../icons/heart.svg'
import { ReactComponent as Spinner } from '../icons/spinner.svg'
import { ReactComponent as PlayIcon } from '../icons/play.svg'
import { ReactComponent as StopIcon } from '../icons/stop.svg'

const Preview = ({
  id,
  name,
  username,
  views,
  likes,
  isLoading,
  action,
  className,
}) => {
  const viewPath = generatePath(VIEW_PATH, { id })
  const shaderToyPreviewPath = generatePath(SHADERTOY_PREVIEW_PATH, { id })

  return (
    <div
      className={cx(
        styles.Preview,
        { [styles.isLoading]: isLoading },
        className,
      )}
    >
      <Link to={viewPath} className={styles.link}>
        <img className={styles.image} src={shaderToyPreviewPath} alt={''} />
      </Link>

      <div className={cx(styles.actionButton)}>
        {action === Preview.ACTIONS.PLAY ? (
          <PlayIcon />
        ) : action === Preview.ACTIONS.STOP ? (
          <StopIcon />
        ) : action === Preview.ACTIONS.SPIN ? (
          <Spinner />
        ) : null}
      </div>

      {views !== undefined || likes !== undefined ? (
        <div className={cx(styles.imageOverlay, styles.imageInfo)}>
          {views !== undefined ? (
            <div>
              {views} <EyeIcon className="icon" />
            </div>
          ) : null}
          {likes !== undefined ? (
            <div>
              {likes} <HeartIcon className="icon" />
            </div>
          ) : null}
        </div>
      ) : null}

      {name || username ? (
        <div className={cx(styles.imageOverlay, styles.imageName)}>
          {name && !username ? name : null}
          {!name && username ? `By ${username}` : null}
          {name && username ? `${name} by ${username}` : null}
        </div>
      ) : null}

      <div className={cx(styles.imageOverlay, styles.imageSpinner)}>
        <Spinner className="icon" />
      </div>
    </div>
  )
}

Preview.ACTIONS = {
  PLAY: 'PLAY',
  STOP: 'STOP',
  SPIN: 'SPIN',
}

Preview.propTypes = {
  name: PropTypes.string,
  username: PropTypes.string,
  views: PropTypes.number,
  likes: PropTypes.number,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  action: PropTypes.oneOf(Object.values(Preview.ACTIONS)),
}

export default Preview
