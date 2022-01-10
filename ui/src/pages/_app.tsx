import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'

import '../styles/app.css'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import theme from '../definitions/theme'
import { WebsocketContextProvider } from '../context/WebsocketContext'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WebsocketContextProvider>
        <Component {...pageProps} />
      </WebsocketContextProvider>
    </ChakraProvider>
  )
}
