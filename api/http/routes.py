from flask import Blueprint
routes = Blueprint('routes', __name__)


@routes.get("/hello")
def hello():
    return "Hello, world"
