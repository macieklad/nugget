import type { GetServerSideProps, NextPage } from 'next'
import { Link } from '../components/Link'
import { LinkButton } from '../components/LinkButton'
import { Box, Center, Heading, Text, VStack } from '@chakra-ui/layout'
import { listModels } from '../lib/api/list-models'
import { ProcessModel } from '../lib/api/types'
import { Button } from '@chakra-ui/button'

interface HomeProps {
  models: ProcessModel[]
}

const Home: NextPage<HomeProps> = ({ models }) => {
  return (
    <Center flexDirection="column" h="100vh">
      <Box shadow="lg" borderRadius="md" px={10} py={12} minW={420}>
        <Heading size="lg">Twoje modele</Heading>
        <VStack spacing={2} pt={4} pb={8} alignItems="flex-start">
          {models.map((model) => (
            <Link key={model.name} href={`/model/${model.name}`}>
              <Text fontSize="lg">- {model.name}</Text>
            </Link>
          ))}
          {models.length === 0 && (
            <Text fontSize="lg">Nie masz żadnych modeli, stwórz nowy</Text>
          )}
        </VStack>
        <VStack>
          <LinkButton href="/viewer" w="full" colorScheme="orange">
            Stwórz nowy model
          </LinkButton>
          <Button w="full">Instrukcja</Button>
        </VStack>
      </Box>
    </Center>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const models = await listModels()
  return {
    props: {
      models,
    },
  }
}

export default Home
