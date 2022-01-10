import sys
from flask import Flask, Blueprint, jsonify
from flask_cors import CORS
from src.http.routes import routes

app = Flask(__name__)
app.register_blueprint(routes)
CORS(app)


@ app.errorhandler(500)
def resource_not_found(e):
    return jsonify(error=str(e)), 500


@ app.errorhandler(404)
def resource_not_found(e):
    return jsonify(error=str(e)), 404


@ app.errorhandler(400)
def bad_request(e):
    return jsonify(error=str(e)), 404
