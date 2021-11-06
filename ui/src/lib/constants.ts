import { DiscoveryAlgorithm } from "./api/constants";

export const algorithmNames: Partial<Record<DiscoveryAlgorithm, string>> = {
  [DiscoveryAlgorithm.ALPHA_MINER]: 'Alpha miner',
  [DiscoveryAlgorithm.INDUCTIVE_MINER]: 'Inductive miner',
  [DiscoveryAlgorithm.HEURISTIC_MINER]: 'Heuristic miner',
  [DiscoveryAlgorithm.DFG]: 'Driectly-Follows Graph',
}