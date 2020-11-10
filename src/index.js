import React from 'react'
import ReactDOM from 'react-dom'
import { QueryCache, ReactQueryCacheProvider } from 'react-query'
import { Router, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './components/App'
import reportWebVitals from './reportWebVitals'
import { createBrowserHistory } from 'history'

// Hack to prevent pushing the same URL again and again on Link click
// See https://github.com/ReactTraining/history/issues/470#issuecomment-445217562
const customHistory = createBrowserHistory()
const prevHistoryPush = customHistory.push
let lastLocation = customHistory.location

customHistory.listen((location) => {
  lastLocation = location
})

customHistory.push = (pathname, state = {}) => {
  if (
    lastLocation === null ||
    pathname !==
      lastLocation.pathname + lastLocation.search + lastLocation.hash ||
    JSON.stringify(state) !== JSON.stringify(lastLocation.state || {})
  ) {
    prevHistoryPush(pathname, state)
  }
}

const queryCache = new QueryCache()

ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <Router history={customHistory}>
          <QueryParamProvider ReactRouterRoute={Route}>
            <App />
          </QueryParamProvider>
        </Router>
      </ReactQueryCacheProvider>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
