import { useState, useEffect, useRef, FC, FormEvent } from 'react'
import { useTransition, animated } from 'react-spring'
import { Card, Flex, Box, Text } from '@rebass/emotion'

const AnimatedBox = animated(Box)

interface TitleProps {
  leader?: boolean
  editing?: boolean
  submitTitle?: (title: string) => void
  initialTitle?: string
}

const Title: FC<TitleProps> = ({
  leader = false,
  editing = false,
  submitTitle,
  initialTitle
}) => {
  const inputEl = useRef(null)
  const [title, setTitle] = useState('')
  const [isTitleEdited, setTitleEdited] = useState(false)

  useEffect(() => {
    if (editing && inputEl.current) {
      ;((inputEl.current as unknown) as HTMLElement).focus()
    } else if (!editing && isTitleEdited && title.trim().length > 0) {
      submitTitle && submitTitle(title)
    } else if (!editing && title.trim().length === 0) {
      setTitleEdited(false)
    }
  }, [editing])

  useEffect(() => {
    if (title.trim().length > 0) {
      setTitleEdited(true)
    }
  }, [title])

  useEffect(() => {
    console.log('updated title', initialTitle)
    setTitle(initialTitle || '')
  }, [initialTitle])

  return (
    <Card
      boxShadow={[0]}
      borderRadius="default"
      p={4}
      bg="white"
      fontSize={5}
      width={1}
      css={{
        fontWeight: 700
      }}
    >
      <Flex alignItems="center" justifyContent="space-between">
        {editing ? (
          <AnimatedBox
            as="input"
            ref={inputEl}
            type="text"
            width={1}
            value={title}
            placeholder="Meeting title..."
            onChange={(e: FormEvent<HTMLInputElement>) =>
              setTitle(e.currentTarget.value)
            }
            mr={3}
            css={{
              hyphens: 'auto',
              fontSize: '32px',
              fontWeight: '700',
              border: 'none',
              fontFamily: 'Inter, -apple-system, sans-serif'
            }}
          />
        ) : (
          <AnimatedBox width={1} mr={3} css={{ hyphens: 'auto' }}>
            {isTitleEdited ? title : initialTitle}
          </AnimatedBox>
        )}
        <Box
          color={leader ? 'white' : 'black'}
          bg={leader ? 'rgba(19, 85, 255, 1)' : 'gainsboro'}
          fontSize={3}
          p={2}
          py={2}
          px={3}
          css={{
            height: '100%',
            borderRadius: '3px'
          }}
        >
          <Flex flexDirection="row">
            <Text>{leader ? 'Leader' : 'Participant'}</Text>
          </Flex>
        </Box>
      </Flex>
    </Card>
  )
}

export default Title
