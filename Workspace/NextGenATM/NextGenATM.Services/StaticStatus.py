import enum

class Login(enum.Enum):
    Success = 1
    NotFound = 2
    WrongPassword = 3

class FaceCount(enum.Enum):
    Success = 1
    NotFound = 2
    MoreThanOne = 3