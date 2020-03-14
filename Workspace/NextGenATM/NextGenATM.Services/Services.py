# FaceDetection
import face_recognition
from PIL import Image
import base64
# AWS Lambda
import csv_load as aws
import boto3
import json
import datetime

# Import models,enums,repository
from Models import *
from StaticStatus import *
from Repository import *

with open('appsettings.json', 'r') as json_file:
    appsettings = json.load(json_file)


class LoginUser:
    @staticmethod
    def validateUser(UserObject):
        try:
            connector = RootUser()
            userInfoInDb = connector.getRootUserDetails()
            if userInfoInDb.username != UserObject.username:
                return Login.NotFound.value
            else:
                if userInfoInDb.password == UserObject.password:
                    return Login.Success.value
                else:
                    return Login.WrongPassword.value
        except Exception as e:
            if hasattr(e, 'message'):
                print(e.message)
            else:
                print(e)


class BankService:
    @staticmethod
    def getBankDetails():
        try:
            connector = BankDetails()
            bankDetails = connector.getBankDetails()
            return bankDetails
        except Exception as e:
            if hasattr(e, 'message'):
                print(e.message)
            else:
                print(e)


class AccountService:
    @staticmethod
    def generateCustomerID():
        try:
            connector = CustomerIDDetail()
            lastCustId = int(connector.getLastCustID())
            newCustID = lastCustId + 1
            date = datetime.datetime.now()
            series = date.strftime("%y%m")
            custId = str(series)+str(newCustID).zfill(3)
            return custId
        except Exception as e:
            if hasattr(e, 'message'):
                print(e.message)
            else:
                print(e)

    @staticmethod
    def addCustomerDetails(CustomerObject):
        try:
            connector = CustomerRepository()
            CustomerObject.accountNo = CustomerObject.accountNo[:10] + str(
                int(CustomerObject.accountNo[10:])+1).zfill(5)
            connector.addCustomer(CustomerObject)
            return CustomerObject.accountNo
        except Exception as e:
            if hasattr(e, 'message'):
                print(e.message)
            else:
                print(e)

    @staticmethod
    def updateExistingDetails(custId, branchCode, lastAddedAcNo):
        try:
            connector = CustomerIDDetail()
            connector.updateLastCustID(custId)
            connector = BankDetails()
            connector.updateLastAccountNo(branchCode, lastAddedAcNo)
        except Exception as e:
            if hasattr(e, 'message'):
                print(e.message)
            else:
                print(e)

    @staticmethod
    def fetchCustomerDetail(customerID):
        try:
            connector = CustomerRepository()
            customerDetail = connector.getBankDetail(customerID)
            custObj = CustomerQRObject(
                customerDetail['customerID'], customerDetail['accountNo'], customerDetail['name'])
            return custObj
        except Exception as e:
            if hasattr(e, 'message'):
                print(e.message)
            else:
                print(e)

    @staticmethod
    def matchQrCodeWithAccount(qrCode):
        try:
            connector = CustomerRepository()
            customerDetail = connector.getBankDetail(qrCode)
            if customerDetail['customerID'] == qrCode:
                return True
            else:
                return False
        except Exception as e:
            if hasattr(e, 'message'):
                print(e.message)
            else:
                print(e)


class FaceDetection:
    # Count no. of faces found in image
    @staticmethod
    def locateFacesInImage(img):
        try:
            image = face_recognition.load_image_file(img)
            faceLocation = face_recognition.face_locations(image)
            count = len(faceLocation)
            if count == 0:
                return FaceCount.NotFound.value
            elif count == 1:
                return FaceCount.Success.value
            else:
                return FaceCount.MoreThanOne.value
        except Exception as e:
            return FaceCount.NotFound.value
            if hasattr(e, 'message'):
                print(e.message)
            else:
                print(e)

    # To save file from the string
    @staticmethod
    def saveFile(image_in_str):
        try:
            path = "test.jpg"
            img = open(path, 'wb')
            img.write(base64.b64decode(image_in_str))
            img.close()
            return path
        except Exception as e:
            if hasattr(e, 'message'):
                print(e.message)
            else:
                print(e)


rekognitionClient = boto3.client('rekognition', aws_access_key_id=aws.access_key_id,
                                 aws_secret_access_key=aws.secret_access_key, region_name=aws.region)


class FaceID():
    # Identify face from S3 Bucket image
    @staticmethod
    def index_faces(image_str):
        try:
            image_bytes = base64.b64decode(image_str)
            response = rekognitionClient.index_faces(
                Image={"Bytes": image_bytes},
                CollectionId=appsettings["Rekognition"])
            if response['ResponseMetadata']['HTTPStatusCode'] == 200:
                faceId = response['FaceRecords'][0]['Face']['FaceId']
                return [FaceIndex.Success, faceId]
            else:
                return [FaceIndex.Failure]
        except Exception as e:
            if hasattr(e, 'message'):
                print(e.message)
            else:
                print(e)

    @staticmethod
    def addIndexinDB(FaceIndexObject):
        connector = FaceIDDetails()
        connector.addFaceIndex(FaceIndexObject)

    @staticmethod
    def match_face(image_str, customerID):
        try:
            image_bytes = base64.b64decode(image_str)
            response = rekognitionClient.search_faces_by_image(
                CollectionId=appsettings["Rekognition"],
                Image={'Bytes': image_bytes}
            )
            faceMatch = False
            connector = FaceIDDetails()
            print(response['FaceMatches'])
            for match in response['FaceMatches']:
                faceDetails = connector.getFaceIdDetails()
                faceid = match['Face']['FaceId']
                faceIdMatch = list(filter(lambda faceDetail: faceDetail["faceID"] == faceid, faceDetails))
                if len(faceIdMatch) == 1 and customerID in [customerID['customerID'] for customerID in faceIdMatch]:
                    faceMatch = True
                    break
            return faceMatch
        except Exception as e:
            if hasattr(e, 'message'):
                print(e.message)
            else:
                print(e)
