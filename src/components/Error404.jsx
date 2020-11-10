import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { BROWSER_PATH } from '../paths'

const Error404 = () => (
  <>
    <Helmet>
      <title>Not found - XRderToy Viewer</title>
    </Helmet>
    Error 404
    <Link to={BROWSER_PATH}>Go back to browser</Link>
  </>
)

export default Error404
