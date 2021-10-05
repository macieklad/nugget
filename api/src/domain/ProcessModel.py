from dataclasses import dataclass
from typing import List


@dataclass
class ProcessModel:
    name: str
    files: List[str]

    def json(self):
        return self.__dict__
