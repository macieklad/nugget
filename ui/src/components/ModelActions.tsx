import { Button } from '@chakra-ui/button'
import { VStack } from '@chakra-ui/layout'
import React from 'react'
import { useModelContext } from '../context/ModelContext'
import { ModelFiles } from '../lib/api/constants'
import { DownloadModelButton } from './DownloadModelButton'
import { LinkButton } from './LinkButton'
import { ModelDiscoveryButton } from './ModelDiscoveryButton'

export type ModelActionsProps = {}

export const ModelActions: React.FC<ModelActionsProps> = ({}) => {
  const { state: model } = useModelContext()
  const isEditable = !model.files[ModelFiles.PROCESS]
  return (
    <VStack>
      <ModelDiscoveryButton />
      <LinkButton
        href={`/model/${model.name}/edit`}
        w="full"
        colorScheme="green"
        disabled={isEditable}
      >
        Wizualizacja i edycja modelu
      </LinkButton>
      <DownloadModelButton />
      <LinkButton
        href={`/model/${model.name}/metrics`}
        w="full"
        disabled={isEditable}
      >
        Zobacz metryki dla odkrytego modelu
      </LinkButton>
    </VStack>
  )
}
