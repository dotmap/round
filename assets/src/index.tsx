import { lazy, Suspense, Fragment, FC } from 'react'
import { render } from 'react-dom'
import { Router } from '@reach/router'
import { Global } from '@emotion/core'
import { ThemeProvider } from 'emotion-theming'

import theme from './theme'
import Loading from './components/loading'
import Highlight from './components/highlight'

const Home = lazy(() => import(/* webpackChunkName: "home" */ './pages/home'))
const Room = lazy(() => import(/* webpackChunkName: "room" */ './pages/room'))

const App: FC = () => (
  <Fragment>
    <Global
      styles={{
        body: {
          margin: 0,
          background:
            'rgba(0, 0, 0, 0) url("https://www.toptal.com/designers/subtlepatterns/patterns/geometry.png") repeat scroll 0% 0%'
        },
        html: {
          fontFamily: 'Inter, -apple-system, sans-serif'
        }
      }}
    />
    <ThemeProvider theme={theme}>
      <Highlight />
      <Suspense fallback={<Loading />}>
        <Router>
          <Home path="/" />
          <Room path="/room/:room" />
        </Router>
      </Suspense>
    </ThemeProvider>
  </Fragment>
)

render(<App />, document.getElementById('main'))
