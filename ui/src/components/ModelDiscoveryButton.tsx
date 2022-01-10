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
  Box,
} from '@chakra-ui/react'

import React, { useEffect, useState } from 'react'
import { ModelAction, useModelContext } from '../context/ModelContext'
import { ModelDiscoveryAlgorithm } from './ModelDiscoveryAlgorithm'
import { DiscoveryAlgorithm, ModelFiles } from '../lib/api/constants'
import { discoverProcess } from '../lib/api/discover-model'
import { algorithmNames } from '../lib/constants'
import { useWebsocketContext } from '../context/WebsocketContext'

export type ModelActionsProps = {}

export const ModelDiscoveryButton: React.FC<ModelActionsProps> = ({}) => {
  const { state: model, dispatch } = useModelContext()
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(
    DiscoveryAlgorithm.UNKNOWN
  )
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isFetching, setFetching] = useBoolean()
  const toast = useToast()
  const { getWebSocket, sessionID, messageHistory } = useWebsocketContext()

  const discoveryMessages = messageHistory
    .filter(Boolean)
    .filter((ev: any) => ev?.data.includes(`${sessionID}-discovery:`))
    .map((ev: any) => ev.data.replace(`${sessionID}-discovery:`, ''))

  const onSubmit = async () => {
    setFetching.on()
    try {
      const process = await discoverProcess(
        model.name,
        selectedAlgorithm,
        sessionID
      )

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
    } catch (e: any) {
      toast({
        title: `Error encountered: ${e.response?.data || e}`,
        status: 'error',
      })
      setFetching.off()
    }
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
            <Box py={4} maxH="200px" overflowY="scroll">
              <details>
                <summary>Logi odkrywania</summary>
                {discoveryMessages.map((message, index) => (
                  <Box key={index} py={2}>
                    {message}
                  </Box>
                ))}
              </details>
            </Box>
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
            <Button variant="ghost" onClick={onClose}>
              Zamknij
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
