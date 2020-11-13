import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import useScrollToTopOnMount from '../hooks/useScrollToTopOnMount'
import { BROWSER_PATH } from '../paths'
import { ReactComponent as ExclamationIcon } from '../icons/exclamation.svg'
import styles from './Error404.module.scss'

const Error404 = () => {
  useScrollToTopOnMount()

  return (
    <>
      <Helmet>
        <title>Not found - XRderToy Viewer</title>
      </Helmet>

      <div className={styles.wrapper}>
        <ExclamationIcon className={styles.icon} />
        <h1>Error 404</h1>
        <div>
          <Link to={BROWSER_PATH}>Go back to browser</Link>
        </div>
      </div>
    </>
  )
}

export default Error404
