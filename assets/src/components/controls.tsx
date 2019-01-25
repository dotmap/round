import { Fragment, FC } from 'react'
import { Card, Flex, Button, Text, Heading } from '@rebass/emotion'

interface ControlsProps {
  leader: boolean
  reveal: () => void
  reset: () => void
}

const Controls: FC<ControlsProps> = ({ leader, reveal, reset }) => (
  <Card mt={3} boxShadow="0 2px 21px rgba(0,0,0,0.15)" borderRadius="7px" p={3} bg="white">
    <Flex justifyContent={leader ? 'space-between' : 'flex-start'} alignItems="center">
      <Heading>Controls</Heading>
      {leader && (
        <Text
          bg="rgba(19, 85, 255, 1)"
          py={2}
          px={3}
          css={{ borderRadius: '7px' }}
          fontSize={1}
          color="white"
        >
          leader
        </Text>
      )}
    </Flex>
    {leader && (
      <Fragment>
        <Button width={1} py={3} mt={3} bg="rgba(76, 255, 190, 1)" onClick={() => reveal()}>
          <Text color="black">Reveal Results</Text>
        </Button>
        <Button width={1} py={3} mt={2} bg="gainsboro" onClick={() => reset()}>
          <Text color="gray">Reset</Text>
        </Button>
      </Fragment>
    )}
  </Card>
)

export default Controls
