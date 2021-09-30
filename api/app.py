from flask import Flask
from .http.routes import routes

app = Flask(__name__)
app.register_blueprint(routes)
