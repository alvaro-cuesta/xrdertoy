import { QueryCache, ReactQueryCacheProvider } from 'react-query'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import {
  ALVARO_ROOT_PATH,
  ROOT_PATH,
  SHADERTOY_ROOT_PATH,
  VIEW_PATH,
} from '../paths'
import Browser from './Browser'
import Viewer from './Viewer'
import Error404 from './Error404'
import styles from './App.module.scss'

const queryCache = new QueryCache()

const App = () => (
  <HelmetProvider>
    <Helmet>
      <title>XRderToy Viewer</title>
    </Helmet>

    <Router>
      <QueryParamProvider ReactRouterRoute={Route}>
        <ReactQueryCacheProvider queryCache={queryCache}>
          <div className={styles.App}>
            <header className={styles.header}>
              <h1>
                <Link to={ROOT_PATH}>XRderToy Viewer</Link>
              </h1>
            </header>

            <main className={styles.main}>
              <Switch>
                <Route exact path={ROOT_PATH}>
                  <Browser />
                </Route>

                <Route exact path={VIEW_PATH}>
                  <Viewer />
                </Route>

                <Route>
                  <Error404 />
                </Route>
              </Switch>
            </main>

            <footer className={styles.footer}>
              <ul>
                <li>
                  Made by <a href={ALVARO_ROOT_PATH}>Álvaro Cuesta</a>
                </li>
                <li>
                  Powered by <a href={SHADERTOY_ROOT_PATH}>ShaderToy.com</a> API
                </li>
              </ul>
            </footer>
          </div>
        </ReactQueryCacheProvider>
      </QueryParamProvider>
    </Router>
  </HelmetProvider>
)

App.propTypes = {}

export default App
