import styled from '@emotion/styled'
import { Card, Flex, Heading, Text, Button, Box } from '@rebass/emotion'

import Cards from '../components/cards'
import Footer from '../components/footer'
import Controls from '../components/controls'
import Highlight from '../components/highlight'
import Participants from '../components/participants'
import { Header, Content, FooterContainer, GridContainer } from '../components/grid'

const Dot = styled.div`
  background: ${props => (props.submitted ? 'rgba(76, 255, 190, 1)' : 'transparent')};
  border: 3px solid lightgray;
  border-radius: 100%;
  width: 0.75rem;
  height: 0.75rem;
  box-sizing: border-box;
`

const Divider = styled.hr`
  color: lightgray;
`

const estimateValues = [0, 1, 2, 3, 5, 8, 13, 20, 40]
const participants = new Map([
  ['Mark', 3],
  ['Deepthi', 13],
  ['Aditya', false],
  ['Kris', 20],
  ['Xishao', 13],
  ['Corbyn', false],
  ['Alonso', 13]
])

const Format = () => (
  <GridContainer>
    <Header bg="white">
      <Highlight />
    </Header>
    <Content mt={3} p={3} flexDirection={['column', null, 'row']} justifyContent="center">
      <Flex justifyContent={['center', null, 'flex-end']} my={3} px={3}>
        <Flex flexDirection="column">
          <Box css={{ position: 'sticky', top: 32 }}>
            <Participants participants={participants} />
            <Controls leader />
          </Box>
        </Flex>
      </Flex>
      <Cards cards={estimateValues} participants={participants} reveal />
    </Content>
    <FooterContainer>
      <Footer />
    </FooterContainer>
  </GridContainer>
)

export default Format
