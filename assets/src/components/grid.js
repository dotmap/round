import styled from '@emotion/styled'
import { Box, Flex } from '@rebass/emotion'

export const Header = styled(Box)``

export const Content = styled(Flex)`
  min-height: 100%;
`

export const FooterContainer = styled(Box)``

export const GridContainer = styled.div`
  min-height: 100vh;
  display: grid;
  align-content: stretch;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    'header  header'
    'content content'
    'footer  footer';

  ${Header} {
    grid-area: header;
  }

  ${Content} {
    grid-area: content;
  }

  ${FooterContainer} {
    grid-area: footer;
  }
`
