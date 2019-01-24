import mngen from 'mngen'
import { Link } from '@reach/router'
import { Button } from '@rebass/emotion'

const Home = () => {
  const name = mngen.word(3)

  return (
    <Link to={`/room/${name}`}>
      <Button>{name}</Button>
    </Link>
  )
}

export default Home
