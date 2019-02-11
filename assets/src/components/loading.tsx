import { Flex } from '@rebass/emotion'
import { keyframes } from '@emotion/core'

const loadingAnim = keyframes`
  0% {
    top: 0;
    left: 50%;
    background: rgb(76, 255, 190);
  }

  25% {
    top: 50%;
    left: 50%;
    background: rgb(19,85,255);
  }

  50% {
    top: 50%;
    left: 0;
    background: white;
  }

  75% {
    top: 0;
    left: 0;
    background: rgb(255,19,175);
  }

  100% {
    top: 0;
    left: 50%;
  }
`

const Loading = () => (
  <Flex
    justifyContent="center"
    alignItems="center"
    flexDirection="column"
    width={1}
    css={{
      height: '100%'
    }}
  >
    <div css={{ height: '40px', width: '40px' }}>
      <div
        css={{
          background: 'rgb(76, 255, 190)',
          height: '20px',
          width: '20px',
          position: 'relative',
          borderRadius: '50%',
          boxShadow: '0 2px 21px rgba(0,0,0,0.15)',
          animation: `${loadingAnim} 1.5s ease infinite`
        }}
      />
    </div>
  </Flex>
)

export default Loading
