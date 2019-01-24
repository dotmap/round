import store, { set } from 'store2'
import { Presence } from 'phoenix'
import { Box, Flex, Text, Button, Card } from '@rebass/emotion'
import { useState, useEffect, Fragment, lazy, Suspense } from 'react'

import { buildSocket } from '../utils/socket'
import Controls from '../components/controls'
import Cards from '../components/cards'
import Footer from '../components/footer'
import Participants from '../components/participants'
import Highlight from '../components/highlight'

import { GridContainer, Header, Content, FooterContainer } from '../components/grid'

let socket, channel, presence
const estimateValues = [0, 1, 2, 3, 5, 8, 13, 20, 40]

const Room = ({ roomName }) => {
  const [estimate, setEstimate] = useState(false)
  const [leader, setLeader] = useState(false)
  const [username, setUsername] = useState('')
  const [estimated, setEstimated] = useState(false)
  const [revealing, setRevealing] = useState(false)
  const [nameSelected, setNameSelected] = useState(false)
  const [participants, setParticipants] = useState(new Map())

  const sendEstimate = estimate => {
    if (!revealing) {
      channel.push('estimate', { estimate, user: username })
      setEstimate(estimate)
      setEstimated(true)
    }
  }

  const sendShow = () => {
    if (store.has(roomName) && store(roomName).leader) channel.push('show')
  }

  const sendReset = () => {
    if (store.has(roomName) && store(roomName).leader) channel.push('reset')
  }

  const reset = () => {
    setEstimated(false)
    setEstimate(false)
    setRevealing(false)

    let resetParticipants = participants
    participants.forEach((val, key) => resetParticipants.set(key, false))
    setParticipants(resetParticipants)
  }

  if (nameSelected && !socket) {
    socket = buildSocket(username)
    channel = socket.channel(`room:${roomName}`)
    presence = new Presence(channel)

    channel.on('estimate', ({ user, estimate }) => {
      setParticipants(participants.set(user, estimate))
    })

    channel.on('become_leader', ({ leader }) => {
      store(roomName, { leader })
      setLeader(leader)
    })

    channel.on('show', ({ show }) => setRevealing(show))

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
            onChange={e => setUsername(e.target.value)}
          />
          <Button onClick={() => setNameSelected(true)}>Submit</Button>
        </Box>
      ) : (
        <GridContainer>
          <Header bg="white">
            <Highlight />
          </Header>
          <Content mt={3} p={3} flexDirection={['column', null, 'row']} justifyContent="center">
            <Flex justifyContent={['center', null, 'flex-end']} my={3} px={3}>
              <Flex flexDirection="column">
                <Box css={{ position: 'sticky', top: 32 }}>
                  <Participants participants={participants} />
                  <Controls leader={leader} reveal={sendShow} reset={sendReset} />
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
