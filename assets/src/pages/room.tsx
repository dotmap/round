import { session } from 'store2'
import { RouteComponentProps } from '@reach/router'
import { FC, FormEvent, Fragment, useState } from 'react'
import { Box, Button, Card, Flex, Text } from '@rebass/emotion'
import { Channel, ChannelCallback, Presence, Socket } from 'phoenix'

import Cards from '../components/cards'
import Footer from '../components/footer'
import Controls from '../components/controls'
import { buildSocket } from '../utils/socket'
import Highlight from '../components/highlight'
import Participants from '../components/participants'
import {
  Content,
  FooterContainer,
  GridContainer,
  Header
} from '../components/grid'

let socket: Socket<any> | undefined, presence: Presence | undefined
let channel: Channel<any, {}, EstimateMessage & ElectMessage & RevealMessage>
const estimateValues = ['0', '1', '2', '3', '5', '8', '13', '20', '40']

interface RoomProps extends RouteComponentProps {
  roomName?: string
}

interface EstimateMessage {
  user: string
  estimate: number
}

interface ElectMessage {
  leader: boolean
}

interface RevealMessage {
  show: true
}

const Room: FC<RoomProps> = ({ roomName }) => {
  const [estimate, setEstimate] = useState('')
  const [leader, setLeader] = useState(false)
  const [username, setUsername] = useState('')
  const [estimated, setEstimated] = useState(false)
  const [revealing, setRevealing] = useState(false)
  const [nameSelected, setNameSelected] = useState(false)
  const [participants, setParticipants] = useState(new Map())

  const sendEstimate = (estimate: string): void => {
    if (!revealing) {
      channel.push('estimate', { estimate, user: username })
      setEstimate(estimate)
      setEstimated(true)
    }
  }

  const sendShow = () => {
    if (session.has(roomName) && session(roomName).leader)
      channel.push('show', { show: true })
  }

  const sendReset = () => {
    if (session.has(roomName) && session(roomName).leader)
      channel.push('reset', { reset: true })
  }

  const estimateHandler: ChannelCallback<EstimateMessage> = ({
    user,
    estimate
  }) => setParticipants(participants.set(user, estimate))

  const reset = () => {
    setEstimated(false)
    setEstimate('')
    setRevealing(false)

    let resetParticipants = participants
    participants.forEach((val, key) => resetParticipants.set(key, false))
    setParticipants(resetParticipants)
  }

  if (nameSelected && !socket) {
    socket = buildSocket(username)
    channel = socket.channel(`room:${roomName}`)
    presence = new Presence(channel)

    channel.on('estimate', estimateHandler)

    channel.on('become_leader', ({ leader }) => {
      session(roomName, { leader })
      setLeader(leader)
    })

    channel.on('show', ({ show }: RevealMessage) => setRevealing(show))

    channel.on('reset', reset)

    channel
      .join()
      .receive('ok', res => console.log(res))
      .receive('error', err => console.log(err))
  }

  if (presence) {
    presence.onJoin(user => setParticipants(participants.set(user, false)))
    presence.onLeave(user => {
      const people = participants
      if (people.delete(user)) {
        setParticipants(people)
      }
    })
  }

  return (
    <Fragment>
      {!nameSelected ? (
        <Box>
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
        </Box>
      ) : (
        <GridContainer>
          <Header bg="white">
            <Highlight />
          </Header>
          <Content
            mt={3}
            p={3}
            flexDirection={['column', null, 'row']}
            justifyContent="center"
          >
            <Flex justifyContent={['center', null, 'flex-end']} my={3} px={3}>
              <Flex flexDirection="column">
                <Box css={{ position: 'sticky', top: 32 }}>
                  <Participants participants={participants} />
                  <Controls
                    leader={leader}
                    reveal={sendShow}
                    reset={sendReset}
                  />
                </Box>
              </Flex>
            </Flex>
            <Cards
              selected={estimate}
              cards={estimateValues}
              participants={participants}
              submit={sendEstimate}
              reveal={revealing}
            />
          </Content>
          <FooterContainer>
            <Footer />
          </FooterContainer>
        </GridContainer>
      )}
    </Fragment>
  )
}

export default Room
