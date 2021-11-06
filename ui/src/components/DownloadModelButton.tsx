import { Button } from '@chakra-ui/button'
import { VStack } from '@chakra-ui/layout'
import React from 'react'
import { useModelContext } from '../context/ModelContext'
import { apiUrl } from '../lib/api/client'
import { ModelFiles } from '../lib/api/constants'

export type DownloadModelProps = {}

export const DownloadModelButton: React.FC<DownloadModelProps> = ({}) => {
  const { state: model } = useModelContext()
  const isEditable = !model.files[ModelFiles.PROCESS]

  const downloadModel = () => {
    const link = document.createElement('a')
    link.href = apiUrl(`/file/${model.name}/process`)
    link.download = 'model.bpmn'
    link.click()
  }

  return (
    <Button
      colorScheme="blue"
      w="full"
      disabled={isEditable}
      onClick={downloadModel}
    >
      Eksportuj model do pliku
    </Button>
  )
}
