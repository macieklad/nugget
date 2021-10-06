from dataclasses import dataclass
from typing import Dict, List

from .ModelFile import ModelFile


@dataclass
class ProcessModel:
    name: str
    files: Dict[str, ModelFile]

    def json(self):
        return {
            "name": self.name,
            "files": {key: value.json() for (key, value) in self.files.items()}
        }

    @staticmethod
    def from_json(data: Dict):
        files = {key: ModelFile(loc=value["loc"])
                 for (key, value) in data["files"].items()}
        return ProcessModel(name=data["name"], files=files)
