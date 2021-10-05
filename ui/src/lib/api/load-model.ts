import { api } from "./client";
import { ProcessModel } from "./types";

export const loadModel = async (name: string) => {
  const res = await api.get<ProcessModel>(`/models/${name}`)
  return res.data
}