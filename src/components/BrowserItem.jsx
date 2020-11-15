import PropTypes from 'prop-types'
import { useQueryShader } from '../hooks/useQueryShader'
import Preview from './Preview'
import styles from './BrowserItem.module.scss'

const BrowserItem = ({ id }) => {
  const { isLoading, data } = useQueryShader(id)
  const { name, username, viewed: views, likes } = data?.Shader?.info || {}

  return (
    <Preview
      id={id}
      message={
        data?.Shader?.info ? (
          <>
            {name} <span className={styles.by}>by {username}</span>
          </>
        ) : null
      }
      views={views}
      likes={likes}
      isLoading={isLoading}
    />
  )
}

BrowserItem.propTypes = {
  id: PropTypes.string.isRequired,
}

export default BrowserItem
