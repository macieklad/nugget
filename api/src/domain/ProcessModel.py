from dataclasses import dataclass
from typing import Dict, List
from src.domain.ModelMetrics import ModelMetrics
from src.domain.constants import MODEL_FILE_EVENT_LOG
from src.domain.ModelFile import ModelFile


@dataclass
class ProcessModel:
    name: str
    files: Dict[str, ModelFile]
    discovered_with: str = None
    metrics: ModelMetrics = ModelMetrics({}, -1, -1, -1, -1)

    def json(self):
        return {
            "name": self.name,
            "discovered_with": self.discovered_with,
            "metrics": self.metrics.json(),
            "files": {key: value.json() for (key, value) in self.files.items()}
        }

    def has_event_log(self):
        return MODEL_FILE_EVENT_LOG in self.files.keys()

    def event_log(self):
        return self.files[MODEL_FILE_EVENT_LOG]

    @staticmethod
    def from_json(data: Dict):
        files = {key: ModelFile(loc=value["loc"], updated_at=value["updated_at"])
                 for (key, value) in data["files"].items()}
        return ProcessModel(name=data["name"], discovered_with=data.get("discovered_with"), metrics=ModelMetrics.from_json(data.get("metrics", {})), files=files)
