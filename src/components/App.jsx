import { QueryCache, ReactQueryCacheProvider } from 'react-query'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import Browser from './Browser'
import Viewer from './Viewer'

const queryCache = new QueryCache()

const App = () => (
  <Router>
    <QueryParamProvider ReactRouterRoute={Route}>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <h1>
          <Link to="/">XRderToy Viewer</Link>
        </h1>
        <Switch>
          <Route exact path="/" component={Browser} />
          <Route exact path="/view/:id" component={Viewer} />
        </Switch>
      </ReactQueryCacheProvider>
    </QueryParamProvider>
  </Router>
)

export default App
