import os
from flask import Flask
from flask_cors import CORS

from .src.data import Datastore
from .src.data.fs_store import FsStore
from .src.http.routes import routes

store: Datastore = FsStore(os.path.join(
    os.path.dirname(__file__), 'storage/models'))

app = Flask(__name__)
app.register_blueprint(routes)
CORS(app)
