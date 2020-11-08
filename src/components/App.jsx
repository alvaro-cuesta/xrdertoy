import { QueryCache, ReactQueryCacheProvider } from 'react-query'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import {
  ALVARO_ROOT_PATH,
  ROOT_PATH,
  SHADERTOY_ROOT_PATH,
  VIEW_PATH,
} from '../paths'
import Browser from './Browser'
import Viewer from './Viewer'

const queryCache = new QueryCache()

const App = () => (
  <Router>
    <QueryParamProvider ReactRouterRoute={Route}>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <header>
          <h1>
            <Link to={ROOT_PATH}>XRderToy Viewer</Link>
          </h1>
        </header>
        <Switch>
          <Route exact path={ROOT_PATH} component={Browser} />
          <Route exact path={VIEW_PATH} component={Viewer} />
        </Switch>
        <footer>
          <ul>
            <li>
              Made by <a href={ALVARO_ROOT_PATH}>Álvaro Cuesta</a>
            </li>
            <li>
              Powered by <a href={SHADERTOY_ROOT_PATH}>ShaderToy</a>
            </li>
          </ul>
        </footer>
      </ReactQueryCacheProvider>
    </QueryParamProvider>
  </Router>
)

App.propTypes = {}

export default App
