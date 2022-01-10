import os
import sys
import threading
from ..config import upload_dir


def upload_path(file: str):
    return os.path.join(upload_dir, file)


class SysRedirect(object):
    def __init__(self):
        self.terminal = sys.stdout                  # To continue writing to terminal
        # A dictionary of file pointers for file logging
        self.log = {}

    def register(self, filename):                    # To start redirecting to filename
        # Get thread ident (thanks @michscoots)
        ident = threading.currentThread().ident
        if ident in self.log:                       # If already in dictionary :
            # Closing current file pointer
            self.log[ident].close()
        # Creating a new file pointed associated with thread id
        self.log[ident] = open(filename, "a")

    def write(self, message):
        # Write in terminal (comment this line to remove terminal logging)
        self.terminal.write(message)
        ident = threading.currentThread().ident     # Get Thread id
        if ident in self.log:                       # Check if file pointer exists
            self.log[ident].write(message)          # write in file
        else:                                       # if no file pointer
            # write in all thread (this can be replaced by a Write in terminal)
            for ident in self.log:
                self.log[ident].write(message)

    def flush(self):
        # this flush method is needed for python 3 compatibility.
        # this handles the flush command by doing nothing.
        # you might want to specify some extra behavior here.
        pass
