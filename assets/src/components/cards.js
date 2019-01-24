import styled from '@emotion/styled'
import { Card as RebassCard, Button, Flex, Box, Text } from '@rebass/emotion'

const CardBase = styled(Button)`
  display: grid;
  box-sizing: border-box;
  border-radius: 7px;
  height: 350px;
  width: 250px;
  box-shadow: 0 2px 21px
    ${props =>
      props.selected
        ? 'rgba(76, 255, 190, 0.45)'
        : props.unselected
        ? 'none'
        : 'rgba(0, 0, 0, 0.15)'};
  background: ${props => (props.selected ? 'rgba(76, 255, 190, 1)' : 'white')};
  color: black;
`

const Card = ({ value, submit, active, unselected, selectors }) => (
  <CardBase m={3} onClick={() => submit(value)} selected={active} unselected={unselected}>
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

const Cards = ({ cards, submit, selected, participants, reveal }) => {
  let selections, mode
  if (participants) {
    selections = cards.reduce((obj, value) => {
      obj[value] = []
      for (const participant of participants) {
        if (participant[1] === value) obj[value].push(participant[0])
      }
      return obj
    }, {})

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
                unselected={selected !== false && v !== selected}
                submit={submit}
              />
            )
          })}
    </Flex>
  )
}

export default Cards
