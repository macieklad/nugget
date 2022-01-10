import { AxiosResponse } from 'axios'
import { api } from './client'
import { DiscoveryAlgorithm } from './constants'
import { ProcessModel } from './types'

export const discoverProcess = async (
  model: string,
  algorithm: DiscoveryAlgorithm,
  sessionID: string
) => {
  const res = await api.post<
    { algorithm: DiscoveryAlgorithm; sessionID: string },
    AxiosResponse<ProcessModel>
  >(`/models/${model}/discover`, {
    algorithm,
    sessionID,
  })
  return res.data
}
