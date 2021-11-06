from dataclasses import dataclass
from typing import Dict, List


@dataclass
class ModelMetrics:
    fitness: Dict
    prec_etc: float
    prec_aetc: float
    gen: float
    simp: float

    def json(self):
        return self.__dict__

    @staticmethod
    def from_json(data: Dict):
        return ModelMetrics(
            data.get("fitness", {}),
            data.get("prec_etc", -1),
            data.get("prec_aetc", -1),
            data.get("gen", -1),
            data.get("simp", -1)
        )
