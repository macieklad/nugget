from ..algo.example import create_example_model
from flask import Blueprint, make_response
routes = Blueprint('routes', __name__)


@routes.get("/example")
def example():
    response = make_response(create_example_model(), 200)
    response.mimetype = "text/plain"
    return response
