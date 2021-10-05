import json
from ..data.exceptions import ModelNotFoundException

from ..algo.example import create_example_model
from ...config import storage
from ..utils import upload_path

from flask import Blueprint, request, make_response, abort
routes = Blueprint('routes', __name__)


@routes.get("/example")
def example():
    response = make_response(create_example_model(), 200)
    response.mimetype = "text/plain"
    return response


@routes.get("/model/<name>")
def get_model(name):
    try:
        return storage.load_model(name).json()
    except ModelNotFoundException:
        abort(404, description="Model does not exist")


@routes.get("/models")
def list_models():
    return json.dumps([model.json() for model in storage.list_models()])


@routes.post("/models")
def create_model():
    name = request.json.get('name')
    if name is None:
        abort(400, description="Model name is required while creating it")
    return storage.create_model(name).json()


@routes.put("/models")
@routes.patch("/models")
def update_model():
    model_name = request.json.get('name')
    if model_name is None:
        abort(400, description="Model name is required while creating it")
    model = storage.load_model(model_name)
    try:
        new_name = request.json.get('new_name')
        if new_name is not None:
            model = storage.rename_model(model_name, new_name)
        if 'file' in request.files:
            file = request.files['file']
            path = upload_path(file.filename)
            file.save(path)
            model = storage.store_file(model_name, path)
    except ModelNotFoundException:
        abort(404, description="Model does not exist")
    return model.json()
