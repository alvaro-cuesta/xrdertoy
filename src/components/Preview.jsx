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
import { ReactComponent as ExclamationIcon } from '../icons/exclamation.svg'

const Preview = ({
  id,
  message,
  views,
  likes,
  isLoading,
  action,
  onClick,
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
      <Link to={viewPath} onClick={onClick}>
        <img className={styles.image} src={shaderToyPreviewPath} alt={''} />
      </Link>

      <div className={styles.action}>
        {action === Preview.ACTIONS.PLAY ? (
          <PlayIcon />
        ) : action === Preview.ACTIONS.STOP ? (
          <StopIcon />
        ) : action === Preview.ACTIONS.SPIN ? (
          <Spinner />
        ) : action === Preview.ACTIONS.ERROR ? (
          <ExclamationIcon />
        ) : null}
      </div>

      {views !== undefined || likes !== undefined ? (
        <div className={cx(styles.overlay, styles.info)}>
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

      {message ? (
        <div className={cx(styles.overlay, styles.message)}>{message}</div>
      ) : null}

      <div className={cx(styles.overlay, styles.spinner)}>
        <Spinner className="icon" />
      </div>
    </div>
  )
}

Preview.ACTIONS = {
  PLAY: 'PLAY',
  STOP: 'STOP',
  SPIN: 'SPIN',
  ERROR: 'ERROR',
}

Preview.propTypes = {
  name: PropTypes.string,
  username: PropTypes.string,
  views: PropTypes.number,
  likes: PropTypes.number,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  action: PropTypes.oneOf(Object.values(Preview.ACTIONS)),
  onClick: PropTypes.func,
}

export default Preview
