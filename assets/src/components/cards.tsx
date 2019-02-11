import { FC, useRef, ReactInstance, useEffect } from 'react'
import styled from '@emotion/styled'
import { findDOMNode } from 'react-dom'
import { useSpring, useTransition, animated } from 'react-spring'
import { Button, Flex, Text } from '@rebass/emotion'

const CardBase = animated(styled(Button)`
  display: grid;
  box-sizing: border-box;
  border-radius: 7px;
  height: 350px;
  width: 250px;
  box-shadow: 0 2px 21px
    ${(props: { selected: boolean; unselected: boolean }) =>
      props.selected
        ? 'rgba(76, 255, 190, 0.45)'
        : props.unselected
        ? 'none'
        : 'rgba(0, 0, 0, 0.15)'};
  background: ${(props: { selected: boolean }) =>
    props.selected ? 'rgba(76, 255, 190, 1)' : 'white'};
  color: black;
`)

interface CardProps {
  value: string
  submit?: (value: string) => void
  active: boolean
  unselected?: boolean
  selectors?: string[]
}

const Card: FC<CardProps> = ({
  value,
  submit,
  active,
  unselected,
  selectors
}) => {
  const [tiltProps, setTilt] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 1, tension: 500, friction: 20 }
  }))

  const [colorProps, setColors] = useSpring(() => ({
    background: 'white',
    boxShadow: '0 2px 21px rgba(0,0,0,0.15)',
    color: 'black',
    config: { mass: 1, tension: 500, friction: 20 }
  }))

  const cardRef = useRef(null)

  useEffect(() => {
    if (active) {
      setColors({
        background: 'rgba(76, 255, 190, 1)',
        boxShadow: '0 2px 21px rgba(76, 255, 190, 0.45)'
      })
    } else if (unselected) {
      setColors({
        background: 'white',
        boxShadow: '0 2px 21px rgba(0,0,0,0)',
        color: 'gainsboro'
      })
    }
  }, [active, unselected])

  const calc = (x: number, y: number) => {
    if (cardRef.current !== null) {
      const { x: cardX, y: cardY, width, height } = findDOMNode(
        cardRef.current as ReactInstance
      ).getBoundingClientRect()

      return [
        -(y - (cardY + height / 2)) / 20,
        (x - (cardX + width / 2)) / 20,
        1.05
      ]
    }
  }
  const trans = (x: number, y: number, s: number) =>
    `perspective(900px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`

  return (
    <CardBase
      onClick={() => {
        submit && submit(value)
      }}
      ref={cardRef}
      selected={active}
      unselected={unselected}
      onPointerMove={({ clientX: x, clientY: y }) =>
        setTilt({ xys: calc(x, y) })
      }
      onPointerLeave={() => setTilt({ xys: [0, 0, 1] })}
      style={{
        transform: tiltProps.xys.interpolate(trans),
        ...colorProps
      }}
    >
      {selectors && (
        <Flex m={3} flexDirection="row" justifyContent="space-between">
          <Text fontSize={5}>{`x${selectors.length}`}</Text>
          <Flex flexDirection="column" alignItems="flex-end">
            {selectors.map(name => (
              <Text key={name}>{name}</Text>
            ))}
          </Flex>
        </Flex>
      )}
      <Flex
        px={2}
        alignItems="flex-end"
        justifyContent="flex-start"
        css={{ height: '100%' }}
      >
        <Text fontSize={128} color={unselected ? 'gainsboro' : 'black'}>
          {value}
        </Text>
      </Flex>
    </CardBase>
  )
}

interface CardsProps {
  cards: string[]
  submit: (value: string) => void
  selected: string
  participants: Map<string, string>
  reveal: boolean
}

const Cards: FC<CardsProps> = ({
  cards,
  submit,
  selected,
  participants,
  reveal
}) => {
  const transitions = useTransition(cards, card => card, {
    from: { opacity: 0, transform: 'scale(0.75)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0 },
    trail: 200
  })

  let selections: { [index: string]: string[] } = {}
  let mode: number
  if (participants) {
    cards.reduce((obj, value) => {
      obj[value] = []
      for (const participant of participants) {
        if (participant[1] === value) obj[value].push(participant[0])
      }
      return obj
    }, selections)

    mode = Math.max.apply(null, Object.values(selections).map(s => s.length))
  }

  return (
    <Flex
      flexWrap="wrap"
      width={1}
      css={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        justifyContent: 'center',
        gridGap: '32px'
      }}
    >
      {reveal && selections
        ? cards.map(v => {
            if (selections[v].length > 0) {
              return (
                <Card
                  key={v}
                  value={v}
                  active={selections[v].length === mode}
                  selectors={selections[v]}
                />
              )
            }
          })
        : transitions.map(({ item, props, key }) => {
            return (
              <animated.div key={key} style={props}>
                <Card
                  value={item}
                  active={item === selected}
                  unselected={selected.length > 0 && item !== selected}
                  submit={submit}
                />
              </animated.div>
            )
          })}
    </Flex>
  )
}

export default Cards
