import json
from ..algo.example import create_example_model
from ...config import storage

from flask import Blueprint, make_response
routes = Blueprint('routes', __name__)


@routes.get("/example")
def example():
    response = make_response(create_example_model(), 200)
    response.mimetype = "text/plain"
    return response


@routes.get("/models")
def list_models():
    return json.dumps([ob.__dict__ for ob in storage.list_models()])
