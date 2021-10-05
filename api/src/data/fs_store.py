import os
import shutil
from typing import List

from .exceptions import ModelFileNotFoundException, ModelNotFoundException
from .store import Datastore
from ..domain.ProcessModel import ProcessModel


class FsStore(Datastore):
    storage_dir: str

    def __init__(self, storage_dir: str):
        self.storage_dir = storage_dir

        if not os.path.isdir(storage_dir):
            os.mkdir(storage_dir)

    def list_models(self) -> List[ProcessModel]:
        models = []
        for dir in os.listdir(self.storage_dir):
            dir_path = os.path.join(self.storage_dir, dir)
            if os.path.isdir(dir_path):
                files = os.listdir(dir_path)
                models.append(ProcessModel(name=dir, files=files))
        return models

    def create_model(self, model: str) -> ProcessModel:
        if not self.model_exists(model):
            os.mkdir(os.path.join(self.storage_dir, model))
            return ProcessModel(name=model, files=[])
        else:
            return self.load_model(model)

    def delete_model(self, model: str):
        loc = self.get_model_location(model)
        if os.path.exists(loc):
            os.unlink(loc)

    def rename_model(self, old: str, new: str) -> ProcessModel:
        model = self.load_model(old)
        loc = self.get_model_location(model)
        shutil.move(loc, os.path.join(os.path.dirname(loc), new))
        model.name = new
        return model

    def store_file(self, model: str, file: str) -> ProcessModel:
        instance = self.load_model(model)
        print(self.get_model_location(model))
        shutil.copy(file, self.get_model_location(model))
        instance.files.append(os.path.basename(file))
        return instance

    def read_file(self, model: str, file: str) -> str:
        instance = self.load_model(model)
        if not file in instance.files:
            raise ModelFileNotFoundException(
                "Model does not contain file %s" % file)
        with open(os.path.join(self.get_model_location(model), file), 'r') as file:
            return file.read()

    def load_model(self, model: str) -> ProcessModel:
        if not self.model_exists(model):
            raise ModelNotFoundException('Model not found')
        dir_path = os.path.join(self.storage_dir, model)
        files = os.listdir(dir_path)
        return ProcessModel(name=model, files=files)

    def get_model_location(self, model: str) -> str:
        return os.path.join(self.storage_dir, model)

    def model_exists(self, model: str) -> bool:
        return os.path.isdir(
            os.path.join(self.storage_dir, model)
        )
