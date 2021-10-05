import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input'
import { Center } from '@chakra-ui/layout'
import type { GetServerSideProps, NextPage } from 'next'
import { useState } from 'react'
import { Card } from '../../components/Card'
import { createModel } from '../../lib/api/create-model'
import { loadModel } from '../../lib/api/load-model'
import { ProcessModel } from '../../lib/api/types'
import { EditIcon } from '@chakra-ui/icons'
interface ModelPageProps {
  model: ProcessModel
}

const ModelPage: NextPage<ModelPageProps> = ({ model }) => {
  const [title, setTitle] = useState(model.name)
  return (
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
      </Card>
    </Center>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let name: string = ctx.params?.id as string
  let model: ProcessModel = { name: 'unknown', files: [] }
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
