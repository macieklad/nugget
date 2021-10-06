import React, { useState } from 'react'
// Import React FilePond
import { FilePond } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'
import { FilePondFile, ProcessServerConfigFunction } from 'filepond'

export type PondProps = React.ComponentProps<typeof FilePond>

export const Pond: React.FC<PondProps> = (props) => {
  const [files, setFiles] = useState<FilePondFile[]>([])
  return (
    <FilePond
      files={files as any}
      onupdatefiles={setFiles}
      server="/api"
      name="files"
      labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      {...props}
    />
  )
}

export const createPondEndpoint = ({
  model,
  fileId,
}: {
  model: string
  fileId: string
}) => ({
  url: `http://${process.env.NEXT_PUBLIC_API_URL}`,
  process: {
    url: '/file',
    method: 'POST',
    ondata: (formData: FormData) => {
      formData.append('model', model)
      formData.append('file_id', fileId)
      return formData
    },
  } as any as ProcessServerConfigFunction,
})
