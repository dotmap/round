import mngen from 'mngen'
import { Link, RouteComponentProps } from '@reach/router'
import { Button } from '@rebass/emotion'
import { FC } from 'react'

const Home: FC<RouteComponentProps> = () => {
  const name = mngen.word(3)

  return (
    <Link to={`/room/${name}`}>
      <Button>{name}</Button>
    </Link>
  )
}

export default Home
