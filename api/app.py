from flask import Flask
from flask_cors import CORS
from .http.routes import routes

app = Flask(__name__)
app.register_blueprint(routes)
CORS(app)
