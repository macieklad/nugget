import { AxiosResponse } from "axios";
import { api } from "./client";
import { DiscoveryAlgorithm } from "./constants";
import { ProcessModel } from './types'

export const discoverProcess = async (model: string, algorithm: DiscoveryAlgorithm) => {
  const res = await api.post<{algorithm: DiscoveryAlgorithm}, AxiosResponse<ProcessModel>>(`/models/${model}/discover`, {
    algorithm
  })
  return res.data
}