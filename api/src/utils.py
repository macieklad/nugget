import os
from ..config import upload_dir


def upload_path(file: str):
    return os.path.join(upload_dir, file)
