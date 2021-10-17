import { Button } from '@chakra-ui/button'
import { VStack } from '@chakra-ui/layout'
import React from 'react'
import { useModelContext } from '../context/ModelContext'
import { LinkButton } from './LinkButton'

export type ModelActionsProps = {}

export const ModelActions: React.FC<ModelActionsProps> = ({}) => {
  const { state: model } = useModelContext()
  const isEditable = !model.files['process']
  return (
    <VStack>
      <LinkButton
        passHref
        href={`/model/${model.name}/edit`}
        w="full"
        colorScheme="orange"
        disabled={!model.files['event-log']}
      >
        Generowanie modelu
      </LinkButton>
      <LinkButton
        passHref
        href={`/model/${model.name}/edit`}
        w="full"
        colorScheme="green"
        disabled={isEditable}
      >
        Wizualizacja i edycja modelu
      </LinkButton>
      <Button colorScheme="blue" w="full" disabled={isEditable}>
        Eksportuj model do pliku
      </Button>
      <LinkButton
        passHref
        href={`/model/${model.name}/metrics`}
        w="full"
        disabled={isEditable}
      >
        Zobacz metryki dla odkrytego modelu
      </LinkButton>
    </VStack>
  )
}
