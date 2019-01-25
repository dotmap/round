import { FC } from 'react'
import styled from '@emotion/styled'
import { Button, Flex, Text } from '@rebass/emotion'

const CardBase = styled(Button)`
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
`

interface CardProps {
  value: string
  submit?: (value: string) => void
  active: boolean
  unselected?: boolean
  selectors?: string[]
}

const Card: FC<CardProps> = ({ value, submit, active, unselected, selectors }) => (
  <CardBase m={3} onClick={() => submit && submit(value)} selected={active} unselected={unselected}>
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
    <Flex px={2} alignItems="flex-end" justifyContent="flex-start" css={{ height: '100%' }}>
      <Text fontSize={128} color={unselected ? 'gainsboro' : 'black'}>
        {value}
      </Text>
    </Flex>
  </CardBase>
)

interface CardsProps {
  cards: string[]
  submit: (value: string) => void
  selected: string
  participants: Map<string, string>
  reveal: boolean
}

const Cards: FC<CardsProps> = ({ cards, submit, selected, participants, reveal }) => {
  let selections: { [index: string]: string[] } = {}
  let mode: number
  if (participants) {
    selections = cards.reduce(
      (obj, value) => {
        obj[value] = []
        for (const participant of participants) {
          if (participant[1] === value) obj[value].push(participant[0])
        }
        return obj
      },
      {} as { [index: string]: string[] }
    )

    mode = Math.max.apply(null, Object.values(selections).map(s => s.length))
  }

  return (
    <Flex
      flexWrap="wrap"
      justifyContent="center"
      css={{ alignItems: 'space-around', maxWidth: '860px' }}
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
        : cards.map(v => {
            console.log('selected', selected, 'value', v, v === selected)
            return (
              <Card
                key={v}
                value={v}
                active={v === selected}
                unselected={selected.length > 0 && v !== selected}
                submit={submit}
              />
            )
          })}
    </Flex>
  )
}

export default Cards
