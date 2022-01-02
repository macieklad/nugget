import { Button } from '@chakra-ui/button'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useBoolean,
  VStack,
  useToast,
} from '@chakra-ui/react'

import React, { useState } from 'react'
import { ModelAction, useModelContext } from '../context/ModelContext'
import { ModelDiscoveryAlgorithm } from './ModelDiscoveryAlgorithm'
import { DiscoveryAlgorithm, ModelFiles } from '../lib/api/constants'
import { discoverProcess } from '../lib/api/discover-model'
import { algorithmNames } from '../lib/constants'

export type ModelActionsProps = {}

export const ModelDiscoveryButton: React.FC<ModelActionsProps> = ({}) => {
  const { state: model, dispatch } = useModelContext()
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(
    DiscoveryAlgorithm.UNKNOWN
  )
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isFetching, setFetching] = useBoolean()
  const toast = useToast()

  const onSubmit = async () => {
    setFetching.on()
    try {
      const process = await discoverProcess(model.name, selectedAlgorithm)
    } catch (e: any) {
      toast({
        title: `Error encountered: ${e.response.data}`,
        status: 'error',
      })
      setFetching.off()
      return
    }

    toast({
      title: 'Model procesu został odkryty!',
      status: 'success',
    })
    dispatch({
      type: ModelAction.REFRESH,
      payload: process,
    })
    setFetching.off()
    onClose()
  }

  return (
    <>
      <Button
        w="full"
        colorScheme="orange"
        disabled={!model.files[ModelFiles.EVENT_LOG]}
        onClick={onOpen}
      >
        Generowanie modelu
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Wybierz algorytm odkrywania</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              {Object.entries(algorithmNames).map(([algorithm, title]) => (
                <ModelDiscoveryAlgorithm
                  name={title}
                  onSelect={() =>
                    setSelectedAlgorithm(algorithm as DiscoveryAlgorithm)
                  }
                  key={algorithm}
                  selected={selectedAlgorithm === algorithm}
                />
              ))}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              isDisabled={selectedAlgorithm == DiscoveryAlgorithm.UNKNOWN}
              isLoading={isFetching}
              colorScheme="orange"
              mr={3}
              onClick={onSubmit}
            >
              Generuj
            </Button>
            <Button variant="ghost">Zamknij</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
