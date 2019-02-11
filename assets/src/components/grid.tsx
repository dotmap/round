import styled from '@emotion/styled'
import { Box, Flex } from '@rebass/emotion'
import Participants from './participants'

export const Header = styled(Flex)``

export const Status = styled(Flex)``

export const Content = styled(Flex)`
  min-height: 100%;
`

export const FooterContainer = styled(Box)``

export const GridContainer = styled(Box)`
  min-height: 100vh;
  display: grid;
  grid-gap: 32px;
  align-content: stretch;
  justify-content: center;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr minmax(auto, 815px) 1fr;
  grid-template-areas:
    '. header .'
    '. participants .'
    '. content .'
    'footer footer footer';

  ${Header} {
    grid-area: header;
    align-self: center;
    justify-self: center;
  }

  ${Status} {
    grid-area: status;
    align-self: center;
    justify-self: start;
  }

  ${Content} {
    grid-area: content;
  }

  ${FooterContainer} {
    grid-area: footer;
  }
`
