import styled from '@emotion/styled'
import { Coffee, GitHub } from 'react-feather'
import { Flex, Image, Link } from '@rebass/emotion'

const Footer = () => (
  <Flex width={1} p={5} justifyContent="center" alignItems="center">
    <Flex
      css={{
        borderRadius: '50%',
        height: '36px',
        width: '36px',
        boxShadow: '0 2px 21px rgba(0,0,0,0.15)'
      }}
      bg="white"
      justifyContent="center"
      alignItems="center"
    >
      <Coffee size="18" />
    </Flex>
    <Link href="https://dotmap.co" mx={4}>
      <Image width="50px" src="/images/icon.png" />
    </Link>
    <Flex
      css={{
        borderRadius: '50%',
        height: '36px',
        width: '36px',
        boxShadow: '0 2px 21px rgba(0,0,0,0.15)'
      }}
      bg="white"
      justifyContent="center"
      alignItems="center"
    >
      <GitHub size="18" />
    </Flex>
  </Flex>
)

export default Footer
