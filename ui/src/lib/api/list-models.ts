import { api } from "./client";
import { ProcessModel } from "./types";

export const listModels = async () => {
  const res = await api.get<ProcessModel[]>('/models')
  return res.data
}