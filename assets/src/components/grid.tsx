import styled from '@emotion/styled'
import { Box, Flex } from '@rebass/emotion'
export const Header = styled(Flex)``

export const ParticipantsContainer = styled(Flex)``

export const Content = styled(Flex)`
  min-height: 100%;
`

export const FooterContainer = styled(Box)``

export const GridContainer = styled(Box)`
  min-height: 100%;
  display: grid;
  grid-gap: 32px;
  align-content: stretch;
  justify-content: center;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr minmax(auto, 815px) 1fr;
  grid-template-areas:
    'edit header .'
    'graph participants .'
    '. content .'
    'footer footer footer';

  ${Header} {
    grid-area: header;
    align-self: center;
    justify-self: center;
  }

  ${ParticipantsContainer} {
    grid-area: participants;
    align-self: center;
    justify-self: center;
    width: 100%;
  }

  ${Content} {
    grid-area: content;
  }

  ${FooterContainer} {
    grid-area: footer;
  }
`
