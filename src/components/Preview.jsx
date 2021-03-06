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
import { useCallback, useState } from 'react'

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
  const [isImageError, setIsImageError] = useState(false)
  const viewPath = generatePath(VIEW_PATH, { id })
  const shaderToyPreviewPath = generatePath(SHADERTOY_PREVIEW_PATH, { id })

  const handleImageSuccess = useCallback(() => {
    setIsImageError(false)
  }, [])

  const handleImageError = useCallback(() => {
    setIsImageError(true)
  }, [])

  return (
    <div
      className={cx(
        styles.Preview,
        {
          [styles.isLoading]: isLoading,
          [styles.isError]: action === Preview.ACTIONS.ERROR,
        },
        className,
      )}
    >
      <Link to={viewPath} onClick={onClick}>
        <img
          className={cx(styles.image, { [styles.isImageError]: isImageError })}
          src={shaderToyPreviewPath}
          alt={''}
          onLoad={handleImageSuccess}
          onError={handleImageError}
        />
      </Link>

      <div className={styles.contentWrapper}>
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

        {message ? <div className={styles.message}>{message}</div> : null}
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
  message: PropTypes.element,
  views: PropTypes.number,
  likes: PropTypes.number,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  action: PropTypes.oneOf(Object.values(Preview.ACTIONS)),
  onClick: PropTypes.func,
}

export default Preview
