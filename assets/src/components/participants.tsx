import { FC, useState, useEffect, Fragment, useRef } from 'react'
import styled from '@emotion/styled'
import Popover from 'react-popover'
import {
  useSpring,
  animated,
  config,
  useTransition,
  useChain
} from 'react-spring'
import { Flex, Card } from '@rebass/emotion'

const AnimatedCard = animated(Card)

const Dot = styled.div`
  background: ${(props: { submitted: string }) =>
    props.submitted.length > 0
      ? 'rgba(76, 255, 190, 1)'
      : 'rgba(255, 19, 175, 1)'};
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
    background: ${(props: { estimated: boolean }) =>
      props.estimated ? 'rgba(76, 255, 190, 1)' : 'rgba(255, 19, 175, 1)'};
    color: ${(props: { estimated: boolean }) =>
      props.estimated ? 'black' : 'white'};
    border-radius: 5px;
  }

  & .Popover-tipShape {
    fill: ${(props: { estimated: boolean }) =>
      props.estimated ? 'rgba(76, 255, 190, 1)' : 'rgba(255, 19, 175, 1)'};
  }
`

interface ParticipantProps {
  name: string
  estimate: string
}

const Participant: FC<ParticipantProps> = ({ name, estimate }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <StyledPopover isOpen={hovered} body={name} estimated={estimate.length > 0}>
      <Flex alignItems="center" justifyContent="center">
        <Dot
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          submitted={estimate}
        />
      </Flex>
    </StyledPopover>
  )
}

interface ParticipantsProps {
  participants: Map<string, string>
  open?: boolean
  // mode?: ParticipantsMode
}

const Participants: FC<ParticipantsProps> = ({
  participants,
  open = true
  // mode = ParticipantsMode.bar
}) => {
  const [mode, set] = useState(open)
  const [progressShowing, setProgressShowing] = useState(false)
  const [votes, setVotes] = useState(0)

  useEffect(() => {
    set(open)
  }, [open])

  const containerPaddingRef = useRef(null)
  const { padding, ...other } = useSpring({
    ref: containerPaddingRef,
    config: config.stiff,
    initial: { padding: 12 },
    from: { padding: 12 },
    to: { padding: mode ? 12 : 0 }
  })

  const containerColorRef = useRef(null)
  const { background, opacity, ...rest } = useSpring({
    ref: containerColorRef,
    config: config.stiff,
    initial: { background: 'white' },
    from: { background: 'rgb(255, 19, 175)' },
    to: {
      background: mode ? 'white' : 'rgb(255, 19, 175)'
    }
  })

  const progressWidthRef = useRef(null)
  const { width, ...stuff } = useSpring({
    ref: progressWidthRef,
    config: config.stiff,
    clamp: true,
    from: {
      width: 0,
      opacity: 0,
      background: 'rgb(76, 255, 190)'
    },
    to: { width: mode ? 0 : votes / participants.size, opacity: mode ? 0 : 1 }
  })

  const progressHeightRef = useRef(null)
  const { height } = useSpring({
    ref: progressHeightRef,
    config: config.stiff,
    clamp: true,
    from: { height: 0 },
    to: { height: mode ? 0 : 100 }
  })

  useEffect(() => {
    let newVotes = 0
    participants.forEach(val => {
      if (val.trim().length !== 0) {
        newVotes++
      }
    })
    setVotes(newVotes)
  })

  const peopleRef = useRef(null)
  const personTransitions = useTransition(
    mode ? Array.from(participants) : [],
    item => item[0],
    {
      ref: peopleRef,
      unique: true,
      trail: 200 / participants.size,
      from: { opacity: 0, transform: 'scale(0)' },
      enter: { opacity: 1, transform: 'scale(1)' },
      leave: { opacity: 0, transform: 'scale(0)' }
    }
  )

  useChain(
    mode
      ? [
          progressWidthRef,
          progressHeightRef,
          containerColorRef,
          containerPaddingRef,
          peopleRef
        ]
      : [
          peopleRef,
          containerPaddingRef,
          containerColorRef,
          progressHeightRef,
          progressWidthRef
        ],
    [0, 0.3, 0.5, 0.7, 0.9]
  )

  return (
    <StyledPopover
      isOpen={progressShowing}
      estimated={votes > 0}
      body={`${votes} collected | ${participants.size - votes} pending`}
    >
      <AnimatedCard
        width={1}
        boxShadow={[0]}
        borderRadius="default"
        onPointerEnter={() => !mode && setProgressShowing(true)}
        onPointerLeave={() => !mode && setProgressShowing(false)}
        css={{
          // display: 'flex',
          // flexWrap: 'wrap',
          // alignItems: 'center',
          overflow: 'hidden',
          // textAlign: 'center',
          // justifyContent: 'space-evenly',
          minHeight: '48px'
        }}
        style={{ padding, background, ...rest, ...other }}
      >
        <AnimatedCard
          // borderRadius="default"
          style={{
            width: width.interpolate(w => `${w * 100}%`),
            height: height.interpolate(h => `${h}%`),
            ...stuff
          }}
        />
        <Flex
          width="100%"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="space-evenly"
          css={{ display: 'flex', height: '100%' }}
        >
          {personTransitions.map(({ item, key, props }) => (
            <AnimatedCard
              key={key}
              style={props}
              css={{
                flexBasis: '7%',
                flexDirection: 'row',
                height: '100%',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Participant estimate={item[1]} name={item[0]} />
            </AnimatedCard>
          ))}
        </Flex>
      </AnimatedCard>
    </StyledPopover>
  )
}

export default Participants
