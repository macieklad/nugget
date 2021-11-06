import { DiscoveryAlgorithm } from "./constants";

export interface ProcessModel {
  name: string
  discovered_with?: DiscoveryAlgorithm
  files: Record<string, ModelFile>
  metrics: {
    fitness: {
      averageFitness?: number,
      average_trace_fitness?: number,
      percFitTraces?: number,
      percentage_of_fitting_traces?: number
    }
    prec_etc: float
    prec_aetc: float
    gen: float
    simp: float
  }
}

export interface ModelFile {
  loc: string
  updated_at: string
}