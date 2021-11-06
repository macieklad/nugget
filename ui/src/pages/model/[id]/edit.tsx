import { Box, Center, HStack, Text, VStack } from '@chakra-ui/layout'
import type { GetServerSideProps, NextPage } from 'next'
import { useState } from 'react'
import { Card } from '../../../components/Card'
import { createModel } from '../../../lib/api/create-model'
import { loadModel } from '../../../lib/api/load-model'
import { ProcessModel } from '../../../lib/api/types'
import { ModelContextProvider } from '../../../context/ModelContext'
import { DiscoveryAlgorithm, ModelFiles } from '../../../lib/api/constants'
import dynamic from 'next/dynamic'
import { apiUrl } from '../../../lib/api/client'
import { Button } from '@chakra-ui/button'
import { LinkButton } from '../../../components/LinkButton'
import { algorithmNames } from '../../../lib/constants'
import { uploadRawFile } from '../../../lib/api/upload-raw-file'
import { useToast } from '@chakra-ui/toast'
import { useBoolean } from '@chakra-ui/hooks'
interface ModelPageProps {
  model: ProcessModel
}

const BpmnViewer = dynamic(() => import('../../../components/BpmnViewer'), {
  ssr: false,
})

const EditModelPage: NextPage<ModelPageProps> = ({ model: sourceModel }) => {
  const [model, setModel] = useState<ProcessModel>(sourceModel)
  const [isSaving, setSaving] = useBoolean()
  const url = apiUrl(`/file/${model.name}/${ModelFiles.PROCESS}`)
  const [viewer, setViewer] = useState<any>(null)
  const toast = useToast()

  const saveChanges = async () => {
    setSaving.on()
    const { xml } = await viewer.saveXML()
    const updated = await uploadRawFile(model.name, ModelFiles.PROCESS, xml)
    setModel(updated)
    toast({
      title: 'Model saved',
      status: 'success',
    })
    setSaving.off()
  }

  return (
    <ModelContextProvider model={model}>
      {typeof window !== 'undefined' && (
        <BpmnViewer url={url} onSetViewer={setViewer} />
      )}
      <Card position="fixed" m={16} right={0} bottom={0} title={`Menu`}>
        <VStack alignItems="flex-start" my={4}>
          <Text>
            <b>Edytowany model</b>: {model.name}
          </Text>
          <Text>
            <b>Wygenerowano z użyciem: </b>
            {
              algorithmNames[
                model.discovered_with || DiscoveryAlgorithm.UNKNOWN
              ]
            }
          </Text>
          <Text>
            <b>Ostatnio modyfikowany:</b>{' '}
            {model.files[ModelFiles.PROCESS].updated_at}
          </Text>
        </VStack>
        <HStack>
          <Button
            isLoading={isSaving}
            colorScheme="orange"
            flex={1}
            onClick={saveChanges}
          >
            Zapisz model
          </Button>
          <LinkButton flex={1} href={`/model/${model.name}`}>
            Wyjdź
          </LinkButton>
        </HStack>
      </Card>
    </ModelContextProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let name: string = ctx.params?.id as string
  let model: ProcessModel = {} as ProcessModel
  try {
    model = await loadModel(name)
  } catch (e) {
    model = await createModel(name)
  }

  return {
    props: {
      model,
    },
  }
}

export default EditModelPage
