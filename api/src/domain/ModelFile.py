from dataclasses import dataclass
from typing import List


@dataclass
class ModelFile:
    loc: str
    updated_at: str

    def json(self):
        return self.__dict__
