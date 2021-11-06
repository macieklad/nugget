import { DiscoveryAlgorithm } from "./constants";

export interface ProcessModel {
  name: string
  discovered_with?: DiscoveryAlgorithm
  files: Record<string, ModelFile>
  metrics: {
    fitness: Record<string, number>
    prec_etc: number
    prec_aetc: number
    gen: number
    simp: number
  }
}

export interface ModelFile {
  loc: string
  updated_at: string
}