import { Component } from 'react'
import { Edit3, Users, PieChart, Save } from 'react-feather'
import { Box, Button, Card, Flex, Text } from '@rebass/emotion'
import { Channel, ChannelCallback, Presence, Socket } from 'phoenix'

import Cards from './cards'
import Footer from './footer'
import { buildSocket } from '../utils/socket'
import Participants from './participants'
import {
  Content,
  FooterContainer,
  GridContainer,
  Header,
  ParticipantsContainer
} from './grid'

import ElectModel from '../models/elect'
import ResetModel from '../models/reset'
import ShowModel from '../models/show'
import EstimateModel from '../models/estimate'
import IconButton from './icon-button'
import Title from './title'
import RevealButton from './reveal'

interface EstimationProps {
  room: string
  username: string
  estimateValues: string[]
}

class Estimation extends Component<EstimationProps> {
  public state = {
    estimate: '',
    title: this.props.room
      .toLowerCase()
      .split('-')
      .map(s => `${s.charAt(0).toUpperCase()}${s.substring(1)}`)
      .join(' '),
    editingTitle: false,
    leader: false,
    username: '',
    pending: true,
    revealing: false,
    nameSelected: false,
    participants: new Map<string, string>(),
    participantsMode: true
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
      this.setState({ revealing: show, pending: false })
    )

    this.channel.on('reset', this.reset)

    this.channel.on('update_title', ({ title }) => this.setState({ title }))

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
    this.setState({
      participants: this.state.participants.set(user, estimate)
    })
    this.tallyEstimates()
  }

  private tallyEstimates = () => {
    let votes = 0
    this.state.participants.forEach(v => {
      if (v.length > 0) votes++
    })
    if (votes === this.state.participants.size) {
      this.setState({ pending: false })
    }
  }

  private sendEstimate = (estimate: string) => {
    if (!this.state.revealing) {
      this.channel.push('estimate', { estimate, user: this.props.username })
      this.setState({ estimate })
    }
  }

  private sendUpdateTitle = (title: string) => {
    if (this.state.leader) {
      this.channel.push('update_title', { title })
      this.setState({ title, editingTitle: false })
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
      pending: true,
      revealing: false,
      participants: resetParticipants
    })
  }

  public render () {
    const { estimateValues } = this.props
    const {
      participants,
      participantsMode,
      estimate,
      revealing,
      title,
      leader,
      pending,
      editingTitle
    } = this.state

    return (
      <GridContainer>
        <Flex
          justifyContent="center"
          alignItems="center"
          css={{ gridArea: 'edit' }}
        >
          {leader && (
            <IconButton
              active={editingTitle}
              onClick={() => this.setState({ editingTitle: !editingTitle })}
            >
              {editingTitle ? <Save /> : <Edit3 />}
            </IconButton>
          )}
        </Flex>
        <Header width={1}>
          <Title
            leader={leader}
            initialTitle={title}
            editing={editingTitle}
            submitTitle={this.sendUpdateTitle}
          />
        </Header>
        <Flex
          justifyContent="center"
          alignItems="center"
          css={{ gridArea: 'graph' }}
        >
          <IconButton
            onClick={() =>
              this.setState({
                participantsMode: !this.state.participantsMode
              })
            }
          >
            {participantsMode ? <PieChart /> : <Users />}
          </IconButton>
        </Flex>
        <ParticipantsContainer>
          <Participants participants={participants} open={participantsMode} />
        </ParticipantsContainer>
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
        {leader && (
          <RevealButton
            onReset={this.sendReset}
            onReveal={this.sendShow}
            pending={pending}
            showReset={revealing}
          />
        )}
      </GridContainer>
    )
  }
}

export default Estimation
