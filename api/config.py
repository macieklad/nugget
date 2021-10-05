import os
from .src.data import Datastore
from .src.data.fs_store import FsStore

storage: Datastore = FsStore(os.path.join(
    os.path.dirname(__file__), 'storage/models'))
upload_dir = os.path.join(
    os.path.dirname(__file__), 'storage/uploads')
