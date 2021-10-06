import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input'
import { Box, Center, VStack } from '@chakra-ui/layout'
import type { GetServerSideProps, NextPage } from 'next'
import { useState } from 'react'
import { Card } from '../../components/Card'
import { createModel } from '../../lib/api/create-model'
import { loadModel } from '../../lib/api/load-model'
import { ProcessModel } from '../../lib/api/types'
import { EditIcon } from '@chakra-ui/icons'
import { createPondEndpoint, Pond } from '../../components/Pond'
import { LinkButton } from '../../components/LinkButton'
import { Button } from '@chakra-ui/button'
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
        <Box py={2} />
        <Pond
          server={createPondEndpoint({
            model: model.name,
            fileId: 'event-log',
          })}
          labelIdle='Najpierw upuść tutaj, bądź <span class="filepond--label-action">wybierz</span> dziennik zdarzeń z twojego komputera'
        />
        <VStack>
          <LinkButton
            passHref
            href={`/model/${model.name}/edit`}
            w="full"
            colorScheme="orange"
          >
            Generowanie modelu
          </LinkButton>
          <LinkButton
            passHref
            href={`/model/${model.name}/edit`}
            w="full"
            colorScheme="green"
            disabled
          >
            Wizualizacja i edycja modelu
          </LinkButton>
          <Button colorScheme="blue" w="full" disabled>
            Eksportuj model do pliku
          </Button>
          <LinkButton
            passHref
            href={`/model/${model.name}/metrics`}
            w="full"
            disabled
          >
            Zobacz metryki dla odkrytego modelu
          </LinkButton>
        </VStack>
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
