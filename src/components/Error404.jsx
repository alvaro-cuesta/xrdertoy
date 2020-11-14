import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import useScrollToTopOnMount from '../hooks/useScrollToTopOnMount'
import { BROWSER_PATH } from '../paths'
import { ReactComponent as ExclamationIcon } from '../icons/exclamation.svg'
import BigIcon from './BigIcon'

const Error404 = () => {
  useScrollToTopOnMount()

  return (
    <>
      <Helmet>
        <title>Not found - XRderToy Viewer</title>
      </Helmet>

      <BigIcon Icon={ExclamationIcon}>
        <h1>Error 404</h1>
        <Link to={BROWSER_PATH}>Go back to browser</Link>
      </BigIcon>
    </>
  )
}

export default Error404
