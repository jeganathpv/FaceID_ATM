
class UserObject:
    def __init__(self,username,password):
        self.username = username
        self.password = password

class BankDetailObject:
    def __init__(self,branchCode, ifscCode, location, lastAddedAcNo):
        self.branchCode = branchCode
        self.ifscCode = ifscCode
        self.location = location 
        self.lastAddedAcNo = lastAddedAcNo

class CustomerObject:
    def __init__(self,customerID, branchCode, accountNo, name, balance):
        self.customerID = customerID
        self.branchCode = branchCode
        self.accountNo = accountNo
        self.name = name
        self.balance = balance

class CustomerQRObject:
    def __init__(self,customerID,accountNo,name):
        self.customerID = customerID
        self.accountNo = accountNo
        self.name = name 
class FaceIndexObject:
    def __init__(self,customerID,faceID):
        self.customerID = customerID
        self.faceID = faceID