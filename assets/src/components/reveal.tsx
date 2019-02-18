import { FC, useState, Fragment } from 'react'
import { Card, Button, Text } from '@rebass/emotion'
import { Eye, EyeOff, Repeat } from 'react-feather'

interface RevealButtonProps {
  onReveal: () => void
  onReset: () => void
  pending?: boolean
  showReset?: boolean
}

const RevealButton: FC<RevealButtonProps> = ({
  onReveal,
  onReset,
  pending = true,
  showReset = false
}) => {
  const [hovered, setHovered] = useState(false)

  return (
    <Button
      onClick={() => {
        if (showReset) {
          onReset()
        } else if (!pending) {
          onReveal()
        }
      }}
      bg="transparent"
      css={{ position: 'fixed', right: '48px', bottom: '48px', padding: 0 }}
    >
      <Card
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        p={3}
        boxShadow={[0]}
        borderRadius="default"
        bg={pending ? 'white' : 'mediumspringgreen'}
        color="black"
        css={{ display: 'flex', alignItems: 'center' }}
      >
        {pending && (
          <Fragment>
            {hovered && <Text mr={3}>Waiting for estimates</Text>}
            <EyeOff />
          </Fragment>
        )}
        {!pending && !showReset && (
          <Fragment>
            {hovered && <Text mr={3}>Reveal estimates</Text>}
            <Eye />
          </Fragment>
        )}
        {!pending && showReset && (
          <Fragment>
            {hovered && <Text mr={3}>Reset estimates</Text>}
            <Repeat />
          </Fragment>
        )}
      </Card>
    </Button>
  )
}

export default RevealButton
