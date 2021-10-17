import React, { useMemo, useState } from 'react'
import { FilePond } from 'react-filepond'
import { FilePondCallbackProps, registerPlugin } from 'filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import { api, apiUrl } from '../lib/api/client'
import { ProcessModel } from '../lib/api/types'
import { ModelAction, useModelContext } from '../context/ModelContext'

import 'filepond/dist/filepond.min.css'
registerPlugin(FilePondPluginFileValidateType)

export type PondProps = React.ComponentProps<typeof FilePond> & {
  model: ProcessModel
  fileId: string
  // onFileChange: (id: string, file: ModelFile) => void
}

export const Pond: React.FC<PondProps> = ({ model, fileId, ...props }) => {
  const { dispatch } = useModelContext()
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
    () => async () => {
      await api.delete(`/file/${model.name}/${fileId}`)
      dispatch({
        type: ModelAction.REMOVE_FILES,
        payload: [fileId],
      })
    },
    [model.name, fileId, dispatch]
  )

  const onprocessfile = useMemo<FilePondCallbackProps['onprocessfile']>(
    () => (error, file) => {
      if (error) {
        return
      }
      const meta = JSON.parse(file.serverId)
      dispatch({
        type: ModelAction.UPDATE_FILES,
        payload: {
          [meta.id]: meta.data,
        },
      })
    },
    [dispatch]
  )

  return (
    <FilePond
      server={createPondEndpoint({ model: model.name, fileId })}
      files={files as any}
      onupdatefiles={setFiles as any}
      onremovefile={onremovefile}
      onprocessfile={onprocessfile}
      onerror={(error) => console.log(error)}
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
