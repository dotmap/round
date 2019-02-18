import { Link } from '@reach/router'
import { Link as LinkIcon } from 'react-feather'
import { Flex, Heading, Text, Button } from '@rebass/emotion'

const NavBar = () => (
  <Flex as="nav" p={[3, 4]} justifyContent="space-between">
    <Link to="/">
      <Heading css={{ textDecoration: 'none', color: 'black' }}>round</Heading>
    </Link>
    <Button
      bg="mediumspringgreen"
      color="black"
      css={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <LinkIcon size={18} />
      <Text ml={2}>Copy Room Link</Text>
    </Button>
  </Flex>
)

export default NavBar
