import enum

class Login(enum.Enum):
    Success = 1
    NotFound = 2
    WrongPassword = 3

class FaceCount(enum.Enum):
    Success = 1
    NotFound = 2
    MoreThanOne = 3

class FaceIndex(enum.Enum):
    Success = 1
    Failure = 2

class QRMatch(enum.Enum):
    AccountFound = 1
    AccountNotFound = 2

class FaceIDMatch(enum.Enum):
    FaceIDMatchWithAccount = 1
    FaceIDNotMatchWithAccount = 2 

class CashWithdrawal(enum.Enum):
    Success = 1
    InsufficientBalance = 2

