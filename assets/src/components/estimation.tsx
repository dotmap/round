import { Component } from 'react'
import { Box, Button, Card, Flex, Text } from '@rebass/emotion'
import { Channel, ChannelCallback, Presence, Socket } from 'phoenix'

import Cards from './cards'
import Footer from './footer'
import { buildSocket } from '../utils/socket'
import Participants from './participants'
import { Content, FooterContainer, GridContainer, Header } from './grid'

import ElectModel from '../models/elect'
import ResetModel from '../models/reset'
import ShowModel from '../models/show'
import EstimateModel from '../models/estimate'

interface EstimationProps {
  room: string
  username: string
  estimateValues: string[]
}

class Estimation extends Component<EstimationProps> {
  public state = {
    estimate: '',
    leader: false,
    username: '',
    revealing: false,
    nameSelected: false,
    participants: new Map<string, string>()
  }

  /* eslint-disable-next-line camelcase */
  private socket: Socket<{ user_id: string }> = buildSocket(this.props.username)

  private channel: Channel<
    any,
    {},
    EstimateModel & ElectModel & ResetModel & ShowModel
  > = this.socket.channel(`room:${this.props.room}`)

  private presence: Presence = new Presence(this.channel)

  private configureChannel = () => {
    this.channel.on('estimate', this.receiveEstimate)

    this.channel.on('become_leader', ({ leader }: ElectModel) => {
      this.setState({ leader })
    })

    this.channel.on('show', ({ show }: ShowModel) =>
      this.setState({ revealing: show })
    )

    this.channel.on('reset', this.reset)

    this.channel
      .join()
      .receive('ok', res => console.log(res))
      .receive('error', err => console.log(err))
  }

  private configurePresence = () => {
    this.presence.onJoin(user => {
      console.log(user)
      this.setState({ participants: this.state.participants.set(user, '') })
      console.log('participants', this.state.participants)
    })
    this.presence.onLeave(user => {
      const people = this.state.participants
      if (people.delete(user)) {
        this.setState({ participants: people })
      }
    })
  }

  public constructor (props: EstimationProps) {
    super(props)

    this.configurePresence()
    this.configureChannel()
  }

  private receiveEstimate: ChannelCallback<EstimateModel> = ({
    user,
    estimate
  }) => {
    this.setState({ participants: this.state.participants.set(user, estimate) })
  }

  private sendEstimate = (estimate: string) => {
    if (!this.state.revealing) {
      this.channel.push('estimate', { estimate, user: this.props.username })
      this.setState({ estimate })
    }
  }

  private sendShow = () => {
    if (this.state.leader) {
      this.channel.push('show', { show: true })
    }
  }

  private sendReset = () => {
    if (this.state.leader) {
      this.channel.push('reset', { reset: true })
    }
  }

  private reset = () => {
    const resetParticipants = this.state.participants

    this.state.participants.forEach((val, key) =>
      resetParticipants.set(key, '')
    )

    this.setState({
      estimate: '',
      revealing: false,
      participants: resetParticipants
    })
  }

  public render () {
    const { estimateValues } = this.props
    const { participants, estimate, revealing } = this.state

    return (
      <GridContainer mt={4}>
        <Header width={1}>
          <Card
            boxShadow={[0]}
            borderRadius="default"
            py={3}
            pl={4}
            pr={3}
            bg="white"
            fontSize={5}
            width={1}
            css={{
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box width={1} mr={3} css={{ hyphens: 'auto' }} contentEditable>
              Meeting topic...
            </Box>
            <Button
              color="black"
              bg="gainsboro"
              fontSize={3}
              css={{
                height: '100%'
              }}
            >
              <Flex flexDirection="row">
                <Text>Participant</Text>
              </Flex>
            </Button>
          </Card>
        </Header>
        <Participants participants={participants} />
        <Content
          flexDirection={['column']}
          alignItems="center"
          justifyContent="center"
        >
          <Cards
            selected={estimate}
            cards={estimateValues}
            participants={participants}
            submit={this.sendEstimate}
            reveal={revealing}
          />
        </Content>
        <FooterContainer>
          <Footer />
        </FooterContainer>
      </GridContainer>
    )
  }
}

export default Estimation
