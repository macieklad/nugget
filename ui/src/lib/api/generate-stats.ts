import { api, apiUrl } from './client'
import { ProcessModel } from './types'

export const generateStats = async (model: string) => {
  return await download(apiUrl(`/model/stats/${model}`), 'statistics.zip')
}

async function download(url: string, filename: string) {
  return fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = filename
      link.click()
    })
}
