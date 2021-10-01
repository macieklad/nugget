import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

const BpmnViewer = dynamic(() => import('../components/BpmnViewer'), {
  ssr: false,
})

const Home: NextPage = () => {
  const ref = useRef(null)
  const container = ref.current

  return (
    <div>
      <Head>
        <title>Tool home</title>
        <meta name="description" content="Process discovery tool" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/browse/bpmn-js@8.7.3/dist/assets/diagram-js.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/browse/bpmn-js@8.7.3/dist/assets/bpmn-font/css/bpmn.css"
        />
      </Head>
      {typeof window !== 'undefined' && (
        <BpmnViewer url={`http://${process.env.NEXT_PUBLIC_API_URL}/example`} />
      )}
    </div>
  )
}

export default Home
