import { AxiosResponse } from "axios";
import { api } from "./client";
import { ProcessModel } from "./types";

export const createModel = async (name: string) => {
  const res = await api.post<{name: string}, AxiosResponse<ProcessModel>>('/models', {
    name
  })
  return res.data
}