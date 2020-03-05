import json
import pymongo

from Helper import DataMassager
from Models import *

with open('appsettings.json','r') as json_file:
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
    

class BankDetails():
    def __init__(self):
        self.conn = pymongo.MongoClient(mongourl)
        self.mydb = self.conn[database]
        self.mycoll = self.mydb[collections_list['Collection1']]

    def getBankDetails(self):
        bankdetailsInDb = self.mycoll.find()
        details = []
        for detail in bankdetailsInDb:
            newDetail = str(DataMassager.massageDataDocument(detail))
            details.append(newDetail)
        return details



class CustomerRepository():
    def __init__(self):
        self.conn = pymongo.MongoClient(mongourl)
        self.mydb = self.conn[database]
        self.mycoll = self.mydb[collections_list['Collection2']]

    def addCustomer(self,CustomerObject):
        mycoll.insert_one(CustomerIDDetail.__dict__)


class FaceIDDetails():
    def __init__(self):
        self.conn = pymongo.MongoClient(mongourl)
        self.mydb = self.conn[database]
        self.mycoll = self.mydb[collections_list['Collection3']]

class CustomerIDDetail():
    def __init__(self):
        self.conn = pymongo.MongoClient(mongourl)
        self.mydb = self.conn[database]
        self.mycoll = self.mydb[collections_list['Collection3']]

    def getLastCustID(self):
        custId = self.mycoll.find_one()
        return custId['lastCustomerID']

