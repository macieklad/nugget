import { Text } from '@chakra-ui/layout'
import { HStack, Square } from '@chakra-ui/react'

import React from 'react'

export interface ModelDiscoveryAlgorithmProps {
  name: string
  selected?: boolean
  onSelect?: () => void
}

export const ModelDiscoveryAlgorithm: React.FC<ModelDiscoveryAlgorithmProps> =
  ({ name, selected, onSelect }) => {
    return (
      <HStack
        boxShadow="md"
        py={3}
        px={4}
        spacing={4}
        w="full"
        transition=".2s box-shadow ease-in-out"
        _hover={{ boxShadow: 'lg', cursor: 'pointer' }}
        borderRadius="md"
        onClick={onSelect}
      >
        <Square
          size="32px"
          shadow="md"
          borderRadius="md"
          p={4}
          {...(selected && {
            backgroundColor: 'orange',
          })}
        >
          <Text
            fontWeight="bold"
            {...(selected && {
              color: 'white',
            })}
          >
            {name[0].toUpperCase()}
          </Text>
        </Square>
        <Text>{name}</Text>
      </HStack>
    )
  }
