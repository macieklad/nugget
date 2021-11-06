import { Center, HStack, Text, VStack } from '@chakra-ui/layout'
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

const Stat: React.ComponentType<{ name: string; value?: number | string }> = ({
  name,
  value,
}) => (
  <Text>
    <strong>{name}</strong>: {value ?? 'Metric was not calculated yet'}
  </Text>
)

const EditModelPage: NextPage<ModelPageProps> = ({ model: sourceModel }) => {
  const [model, setModel] = useState<ProcessModel>(sourceModel)
  const url = apiUrl(`/file/${model.name}/${ModelFiles.PROCESS}`)
  const toast = useToast()

  return (
    <ModelContextProvider model={model}>
      <Center h="100vh">
        <VStack>
          <HStack>
            <Card title="Ewaluacja">
              <VStack mt={4} spacing={3} alignItems="flex-start">
                <Stat
                  name="Avarage fitness"
                  value={model.metrics.fitness.averageFitness}
                />
                <Stat
                  name="Avarage trace fitness"
                  value={model.metrics.fitness.average_trace_fitness}
                />
                <Stat
                  name="Precision (ETConformance)"
                  value={model.metrics.prec_etc}
                />
                <Stat
                  name="Precision (Align-ETConformance)"
                  value={model.metrics.prec_aetc}
                />
                <Stat name="Generalization" value={model.metrics.gen} />
                <Stat name="Simplicity" value={model.metrics.simp} />
              </VStack>
            </Card>
            <Card title="Statystyki dziennika"></Card>
          </HStack>
        </VStack>
      </Center>
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
