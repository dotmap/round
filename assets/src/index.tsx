import { lazy, Suspense, Fragment, FC } from 'react'
import { render } from 'react-dom'
import { Router } from '@reach/router'
import { Global } from '@emotion/core'

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
          fontFamily: 'Inter UI, -apple-system, sans-serif'
        }
      }}
    />
    <Suspense fallback={<p>Loading</p>}>
      <Router>
        <Home path="/" />
        <Room path="/room/:roomName" />
      </Router>
    </Suspense>
  </Fragment>
)

render(<App />, document.getElementById('main'))
