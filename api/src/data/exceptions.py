class ModelNotFoundException(BaseException):
    def __new__(self, m):
        self.message = m

    def __str__(self):
        return self.message


class ModelFileNotFoundException(BaseException):
    def __new__(self, m):
        self.message = m

    def __str__(self):
        return self.message


class StorageException(BaseException):
    def __new__(self, m):
        self.message = m

    def __str__(self):
        return self.message
