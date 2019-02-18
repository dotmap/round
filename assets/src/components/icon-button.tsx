import { useSpring, animated } from 'react-spring'
import { Button, Card } from '@rebass/emotion'
import { ReactNode, FC, useEffect } from 'react'

interface IconButtonProps {
  children: ReactNode
  active?: boolean
  onClick?: (e: React.SyntheticEvent) => void
}

const AnimatedButton = animated(Button)

const IconButton: FC<IconButtonProps> = ({
  onClick,
  active = false,
  children
}) => {
  const [{ scale }, setScale] = useSpring(() => ({
    scale: 1,
    config: { mass: 1, tension: 500, friction: 20 }
  }))

  const [colors, setColors] = useSpring(() => ({
    background: active ? 'rgba(76, 255, 190, 1)' : 'white',
    boxShadow: active
      ? '0 2px 21px rgba(76, 255, 190, 0.45)'
      : '0 2px 21px rgba(0,0,0,0.15)',
    color: active ? 'black' : 'gainsboro',
    config: { mass: 1, tension: 500, friction: 20 }
  }))

  useEffect(() => {
    if (active) {
      setColors({
        background: 'rgba(76, 255, 190, 1)',
        boxShadow: '0 2px 21px rgba(76, 255, 190, 0.45)',
        color: 'black'
      })
    } else {
      setColors({
        background: 'white',
        boxShadow: '0 2px 21px rgba(0,0,0,0.15)',
        color: 'gainsboro'
      })
    }
  }, [active])

  return (
    <AnimatedButton
      onClick={onClick}
      css={{
        borderRadius: '7px',
        padding: '0'
      }}
      onPointerEnter={() => setScale({ scale: 1.1 })}
      onPointerLeave={() => setScale({ scale: 1 })}
      style={{
        transform: scale.interpolate((s: number) => `scale(${s})`),
        ...colors
      }}
    >
      <Card
        p={2}
        width="3em"
        css={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '3em'
        }}
      >
        {children}
      </Card>
    </AnimatedButton>
  )
}

export default IconButton
