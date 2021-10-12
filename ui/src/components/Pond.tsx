import React, { useMemo, useState } from 'react'
// Import React FilePond
import { FilePond } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'
import { FilePondCallbackProps } from 'filepond'
import { api, apiUrl } from '../lib/api/client'
import { ModelFile, ProcessModel } from '../lib/api/types'

export type PondProps = React.ComponentProps<typeof FilePond> & {
  model: ProcessModel
  fileId: string
  onFileChange: (id: string, file: ModelFile) => void
}

export const Pond: React.FC<PondProps> = ({ model, fileId, ...props }) => {
  const [files, setFiles] = useState(
    model.files[fileId]
      ? [
          {
            source: fileId,
            // set type to local to indicate an already uploaded file
            options: {
              type: 'local',
            },
          },
        ]
      : []
  )

  const onremovefile = useMemo<FilePondCallbackProps['onremovefile']>(
    () => () => api.delete(`/file/${model.name}/${fileId}`),
    [model.name, fileId]
  )

  return (
    <FilePond
      server={createPondEndpoint({ model: model.name, fileId })}
      files={files as any}
      onupdatefiles={setFiles as any}
      onremovefile={onremovefile}
      name="files"
      labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      {...props}
    />
  )
}

const createPondEndpoint = ({
  model,
  fileId,
}: {
  model: string
  fileId: string
}) => ({
  url: apiUrl(),
  process: `/file/${model}/${fileId}`,
  load: `/file/${model}/`,
  revert: `/file/${model}/${fileId}`,
})
