export interface ProcessModel {
  name: string
  files: Record<string, ModelFile>
}

export interface ModelFile {
  loc: string
}