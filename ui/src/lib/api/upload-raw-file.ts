import { AxiosResponse } from "axios";
import { api } from "./client";
import { ModelFiles } from "./constants";
import { ProcessModel } from "./types";

export const uploadRawFile = async (model: string, file: ModelFiles, contents: string) => {
  const res = await api.post<{contents: string}, AxiosResponse<ProcessModel>>(`/file/${model}/${file}/raw`, {
    contents
  })
  return res.data
}