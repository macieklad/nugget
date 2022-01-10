import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input'
import { Box, Center, VStack } from '@chakra-ui/layout'
import type { GetServerSideProps, NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Card } from '../../../components/Card'
import { createModel } from '../../../lib/api/create-model'
import { loadModel } from '../../../lib/api/load-model'
import { ProcessModel } from '../../../lib/api/types'
import { EditIcon } from '@chakra-ui/icons'
import { Pond } from '../../../components/Pond'
import { ModelContextProvider } from '../../../context/ModelContext'
import { ModelActions } from '../../../components/ModelActions'
import { detectEventLogFileType } from '../../../lib/validation/detectEventLogFileType'
import { ModelFiles } from '../../../lib/api/constants'
interface ModelPageProps {
  model: ProcessModel
}

const ModelPage: NextPage<ModelPageProps> = ({ model }) => {
  const [title, setTitle] = useState(model.name)

  return (
    <ModelContextProvider model={model}>
      <Center flexDirection="column" h="100vh">
        <Card>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <EditIcon color="orange" />
            </InputLeftElement>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fontSize="lg"
              border="none"
              borderBottomWidth={1}
              borderBottomStyle="solid"
              borderBottomColor="orange"
              borderRadius="none"
              _focus={{
                outline: 'none',
              }}
            />
          </InputGroup>
          <Box py={2} />
          <Pond
            acceptedFileTypes={['text/csv', 'text/xml']}
            fileValidateTypeDetectType={detectEventLogFileType}
            model={model}
            fileId={ModelFiles.EVENT_LOG}
            labelIdle='Najpierw upuść tutaj, bądź <span class="filepond--label-action">wybierz</span> dziennik zdarzeń z twojego komputera'
          />
          <ModelActions />
        </Card>
      </Center>
    </ModelContextProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let name: string = ctx.params?.id as string
  let model: ProcessModel = { name: 'unknown', files: {}, metrics: {} as any }
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

export default ModelPage
