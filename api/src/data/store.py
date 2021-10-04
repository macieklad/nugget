from typing import List
from ..domain.ProcessModel import ProcessModel


class Datastore:
    def list_models(self) -> List[ProcessModel]:
        pass

    def create_model(self, model: str) -> ProcessModel:
        pass

    def delete_model(self, model: str):
        pass

    def store_file(self, model: str, file: str) -> ProcessModel:
        pass

    def read_file(self, model: str, file: str) -> str:
        pass
