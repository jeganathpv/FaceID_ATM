import json
import pymongo

from Helper import DataMassager
from Models import UserObject

with open('appsettings.json', 'r') as json_file:
    appsettings = json.load(json_file)

mongourl = appsettings['MongoPath']
collections_list = appsettings['Collections']
database = appsettings['DBName']


class RootUser():

    def __init__(self):
        self.conn = pymongo.MongoClient(mongourl)
        self.mydb = self.conn[database]
        self.mycoll = self.mydb[collections_list['Collection0']]

    def getRootUserDetails(self):
        userInfo = DataMassager.massageDataDocument(self.mycoll.find_one())
        return UserObject(**userInfo)


class BankRepository():
    def __init__(self):
        self.conn = pymongo.MongoClient(mongourl)
        self.mydb = self.conn[database]
        self.mycoll = self.mydb[collections_list['Collection1']]

    def getBankDetails(self):
        bankdetailsInDb = self.mycoll.find()
        details = []
        for detail in bankdetailsInDb:
            newDetail = DataMassager.massageDataDocument(detail)
            details.append(newDetail)
        return details

    def updateLastAccountNo(self, branchCode, acNo):
        query = {"branchCode": branchCode}
        value = {"$set": {"lastAddedAcNo": acNo}}
        self.mycoll.update_one(query, value)


class CustomerRepository():
    def __init__(self):
        self.conn = pymongo.MongoClient(mongourl)
        self.mydb = self.conn[database]
        self.mycoll = self.mydb[collections_list['Collection2']]

    def addCustomer(self, CustomerObject):
        self.mycoll.insert_one(CustomerObject.__dict__)

    def getCustomerDetail(self, customerID):
        query = {"customerID": customerID}
        customerDetail = {}
        for x in self.mycoll.find(query):
            customerDetail = DataMassager.massageDataDocument(x)
        return customerDetail

    def updateCustomerBalance(self, customerID, balance):
        query = {"customerID": customerID}
        value = {"$set": {"balance": balance}}
        self.mycoll.update_one(query, value)


class FaceIDRepository():
    def __init__(self):
        self.conn = pymongo.MongoClient(mongourl)
        self.mydb = self.conn[database]
        self.mycoll = self.mydb[collections_list['Collection3']]

    def addFaceIndex(self, FaceIndexObject):
        self.mycoll.insert_one(FaceIndexObject.__dict__)

    def getFaceIdDetails(self):
        faceIdDetails = []
        for x in self.mycoll.find():
            faceIdDetails.append(DataMassager.massageDataDocument(x))
        return faceIdDetails


class CustomerIDRepository():
    def __init__(self):
        self.conn = pymongo.MongoClient(mongourl)
        self.mydb = self.conn[database]
        self.mycoll = self.mydb[collections_list['Collection4']]

    def getLastCustID(self):
        custId = self.mycoll.find_one()
        return custId['lastCustomerID']

    def updateLastCustID(self, custID):
        query = {"lastCustomerID": self.getLastCustID()}
        value = {"$set": {"lastCustomerID": custID}}
        self.mycoll.update_one(query, value)
