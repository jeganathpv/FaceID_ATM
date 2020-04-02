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
        """To fetch the root user details from the database"""
        userInfo = DataMassager.massageDataDocument(self.mycoll.find_one())
        return UserObject(**userInfo)


class BankRepository():
    def __init__(self):
        self.conn = pymongo.MongoClient(mongourl)
        self.mydb = self.conn[database]
        self.mycoll = self.mydb[collections_list['Collection1']]

    def getBankDetails(self):
        """To get the available bank details from the database"""
        bankdetailsInDb = self.mycoll.find()
        details = []
        for detail in bankdetailsInDb:
            newDetail = DataMassager.massageDataDocument(detail)
            details.append(newDetail)
        return details

    def updateLastAccountNo(self, branchCode, acNo):
        """To update the last updated account number for the particular branch"""
        query = {"branchCode": branchCode}
        value = {"$set": {"lastAddedAcNo": acNo}}
        self.mycoll.update_one(query, value)


class CustomerRepository():
    def __init__(self):
        self.conn = pymongo.MongoClient(mongourl)
        self.mydb = self.conn[database]
        self.mycoll = self.mydb[collections_list['Collection2']]

    def putCustomerDetail(self, CustomerObject):
        """To insert new customer details into the database"""
        self.mycoll.insert_one(CustomerObject.__dict__)

    def getCustomerDetail(self, customerID):
        """To fetch the particular customer details from the database"""
        query = {"customerID": customerID}
        customerDetail = {}
        for x in self.mycoll.find(query):
            customerDetail = DataMassager.massageDataDocument(x)
        return customerDetail

    def updateCustomerBalance(self, customerID, balance):
        """To update the balance for the customer into the database"""
        query = {"customerID": customerID}
        value = {"$set": {"balance": balance}}
        self.mycoll.update_one(query, value)


class FaceIDRepository():
    def __init__(self):
        self.conn = pymongo.MongoClient(mongourl)
        self.mydb = self.conn[database]
        self.mycoll = self.mydb[collections_list['Collection3']]

    def putFaceIndex(self, FaceIndexObject):
        """To insert face index into the database"""
        self.mycoll.insert_one(FaceIndexObject.__dict__)

    def getFaceIdDetails(self):
        """To fetch the face if details from the database"""
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
        """To fetch the last updated customer id from the database"""
        custId = self.mycoll.find_one()
        return custId['lastCustomerID']

    def updateLastCustID(self, custID):
        """To update the last customer id into the database"""
        query = {"lastCustomerID": self.getLastCustID()}
        value = {"$set": {"lastCustomerID": custID}}
        self.mycoll.update_one(query, value)
