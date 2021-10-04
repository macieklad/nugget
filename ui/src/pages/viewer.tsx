import type { NextPage } from 'next'
import dynamic from 'next/dynamic'

const BpmnViewer = dynamic(() => import('../components/BpmnViewer'), {
  ssr: false,
})

const Viewer: NextPage = () => {
  return (
    <div>
      {typeof window !== 'undefined' && (
        <BpmnViewer url={`http://${process.env.NEXT_PUBLIC_API_URL}/example`} />
      )}
    </div>
  )
}

export default Viewer
