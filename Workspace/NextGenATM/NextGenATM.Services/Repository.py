import json
import pymongo

with open('appsettings.json','r') as json_file:
    appsettings = json.load(json_file)

mongourl = appsettings['MongoPath']
collections_list = appsettings['Collections']
database = appsettings['DBName']

class RootUser():
    collection = collections_list['Collection0']


class BankDetails():
    collection = collections_list['Collection1']

class Customer():
    collection = collections_list['Collection2']

class FaceIDDetails():
    collection = collections_list['Collection3']

