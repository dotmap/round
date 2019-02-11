import { RouteComponentProps } from '@reach/router'
import { FC, FormEvent, Fragment, useState, lazy, Suspense } from 'react'
import { Flex, Button, Card, Text } from '@rebass/emotion'

import Loading from '../components/loading'

const Estimation = lazy(() =>
  import(/* webpackChunkName: "estimation" */ '../components/estimation')
)

interface RoomProps extends RouteComponentProps {
  room?: string
}

const Room: FC<RoomProps> = ({ room }) => {
  const [username, setUsername] = useState('')
  const [nameSelected, setNameSelected] = useState(false)

  const estimateValues = ['0', '1', '2', '3', '5', '8', '13', '20', '40']

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      css={{ minHeight: '90vh' }}
    >
      {!nameSelected ? (
        <Card p={3} boxShadow={[0]} borderRadius="default" bg="white">
          <Text>Enter a name:</Text>
          <Card
            as="input"
            type="text"
            value={username}
            onChange={(e: FormEvent<HTMLInputElement>) =>
              setUsername(e.currentTarget.value)
            }
          />
          <Button onClick={() => setNameSelected(true)}>Submit</Button>
        </Card>
      ) : (
        <Suspense fallback={<Loading />}>
          <Estimation
            room={room || ''}
            username={username}
            estimateValues={estimateValues}
          />
        </Suspense>
      )}
    </Flex>
  )
}

export default Room
