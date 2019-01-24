import { useState, Fragment } from 'react'
import { ChevronRight, Sun, Moon } from 'react-feather'
import { Card, Flex, Box, Button, Text, Heading } from '@rebass/emotion'

const Controls = ({ name, leader, reveal, reset }) => {
  const [expanded, setExpanded] = useState(true)

  return (
    <Card mt={3} boxShadow="0 2px 21px rgba(0,0,0,0.15)" borderRadius="7px" p={3} bg="white">
      <Flex justifyContent={leader ? 'space-between' : 'flex-start'} alignItems="center">
        <Flex alignItems="center">
          <ChevronRight onClick={() => setExpanded(!expanded)} />
          <Heading ml={2}>Controls</Heading>
        </Flex>
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
      {expanded && leader && (
        <Fragment>
          <Button width={1} py={3} mt={3} bg="rgba(76, 255, 190, 1)" onClick={() => reveal()}>
            <Text color="black">Reveal Results</Text>
          </Button>
          {/* <Button width={1} py={3} mt={2} bg="gainsboro" onClick={() => reset()}>
            <Text color="gray">Reset</Text>
          </Button> */}
          <Flex mt={3}>
            <Button
              width={1 / 2}
              bg={'black'}
              css={{
                borderRadius: '4px 0 0 4px',
                border: '3px solid black',
                borderRight: '1.5px solid black'
              }}
            >
              <Sun />
            </Button>
            <Button
              width={1 / 2}
              bg="white"
              css={{
                borderRadius: '0 4px 4px 0',
                border: '3px solid black',
                borderLeft: '1.5px solid black'
              }}
            >
              <Moon color="black" />
            </Button>
          </Flex>
        </Fragment>
      )}
    </Card>
  )
}

export default Controls
