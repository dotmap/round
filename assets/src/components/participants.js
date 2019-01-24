import { Fragment, useState } from 'react'
import styled from '@emotion/styled'
import Popover from 'react-popover'
import { ChevronRight } from 'react-feather'
import { Text, Flex, Card, Heading } from '@rebass/emotion'

const Dot = styled.div`
  background: ${props =>
    props.submitted !== false ? 'rgba(76, 255, 190, 1)' : 'rgba(255, 19, 175, 1)'};
  border-radius: 100%;
  width: 1rem;
  height: 1rem;
  box-sizing: border-box;
`

const StyledPopover = styled(Popover)`
  & .Popover-body {
    display: inline-flex;
    flex-direction: column;
    padding: 8px;
    background: ${props =>
      props.estimated !== false ? 'rgba(76, 255, 190, 1)' : 'rgba(255, 19, 175, 1)'};
    color: ${props => (props.estimated !== false ? 'black' : 'white')};
    border-radius: 5px;
  }

  & .Popover-tipShape {
    fill: ${props =>
      props.estimated !== false ? 'rgba(76, 255, 190, 1)' : 'rgba(255, 19, 175, 1)'};
  }
`

const Participant = ({ name, estimate }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <StyledPopover isOpen={hovered} preferPlace="below" body={name} estimated={estimate !== false}>
      <Flex alignItems="center">
        <Dot
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          submitted={estimate}
        />
      </Flex>
    </StyledPopover>
  )
}

const Participants = ({ participants }) => {
  return (
    <Card
      boxShadow="0 2px 21px rgba(0,0,0,0.15)"
      borderRadius="7px"
      p={3}
      width={'300px'}
      bg="white"
    >
      <Heading ml={2}>Participants</Heading>

      <Flex mt={3} flexDirection="row" justifyContent="space-evenly">
        {Array.from(participants).map(([participant, estimate]) => (
          <Flex key={participant} alignItems="center" my={2}>
            <Participant name={participant} estimate={estimate} />
          </Flex>
        ))}
      </Flex>
    </Card>
  )
}

export default Participants
