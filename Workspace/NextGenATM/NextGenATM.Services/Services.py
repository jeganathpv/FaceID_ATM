# FaceDetection
import face_recognition
from PIL import Image
import base64
# AWS Lambda
import csv_load as aws
import boto3
import json
import datetime
import os

# Import models,enums,repository
from Models import CustomerQRObject
from StaticStatus import Login, CashWithdrawal, FaceCount, FaceIndex
from Repository import RootUser, CustomerRepository, BankRepository, CustomerIDRepository, FaceIDRepository
from Helper import QRCardGenerator, ImageToB64, HandleException

with open('appsettings.json', 'r') as json_file:
    appsettings = json.load(json_file)

awsCredentials = appsettings["AWSCredentials"]

class LoginUser:
    @staticmethod
    def validateUser(UserObject):
        """To validate the user's credentials"""
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
            HandleException.exceptionHandler(e)


class BankService:
    @staticmethod
    def getBankDetails():
        """To get the bank details"""
        try:
            connector = BankRepository()
            bankDetails = connector.getBankDetails()
            return bankDetails
        except Exception as e:
            HandleException.exceptionHandler(e)


class AccountService:
    @staticmethod
    def generateCustomerID():
        """To generate new customer id"""
        try:
            connector = CustomerIDRepository()
            lastCustId = int(connector.getLastCustID())
            newCustID = lastCustId + 1
            date = datetime.datetime.now()
            series = date.strftime("%y%m")
            custId = str(series)+str(newCustID).zfill(3)
            return custId
        except Exception as e:
            HandleException.exceptionHandler(e)

    @staticmethod
    def addCustomerDetails(CustomerObject):
        """Add customer details into repository"""
        try:
            connector = CustomerRepository()
            CustomerObject.accountNo = CustomerObject.accountNo[:10] + str(
                int(CustomerObject.accountNo[10:])+1).zfill(5)
            connector.putCustomerDetail(CustomerObject)
            return CustomerObject.accountNo
        except Exception as e:
            HandleException.exceptionHandler(e)

    @staticmethod
    def updateExistingDetails(custId, branchCode, lastAddedAcNo):
        """Update existing customer id and 
        last added account number for the particular branch"""
        try:
            connector = CustomerIDRepository()
            connector.updateLastCustID(custId)
            connector = BankRepository()
            connector.updateLastAccountNo(branchCode, lastAddedAcNo)
        except Exception as e:
            HandleException.exceptionHandler(e)

    @staticmethod
    def fetchCustomerDetail(customerID):
        """Get customer details from the repository"""
        try:
            connector = CustomerRepository()
            customerDetail = connector.getCustomerDetail(customerID)
            custObj = CustomerQRObject(
                customerDetail['customerID'], customerDetail['accountNo'], customerDetail['name'])
            return custObj
        except Exception as e:
            HandleException.exceptionHandler(e)

    @staticmethod
    def generateQrCard(qrDetail):
        """Generate QR Card using Helper"""
        try:
            QRCardGenerator.generateQrCard(qrDetail)
            return ImageToB64.getBase64String("backup/card/{}.png".format(qrDetail.customerID))
        except Exception as e:
            HandleException.exceptionHandler(e)

    @staticmethod
    def matchQrCodeWithAccount(qrCode):
        """Match the QR COde against the customer account"""
        try:
            connector = CustomerRepository()
            customerDetail = connector.getCustomerDetail(qrCode)
            if customerDetail['customerID'] == qrCode:
                return True
            else:
                return False
        except Exception as e:
            HandleException.exceptionHandler(e)

    @staticmethod
    def fetchAccountBalance(customerID):
        """Get the account balance the customer"""
        try:
            connector = CustomerRepository()
            customerDetail = connector.getCustomerDetail(customerID)
            return customerDetail['balance']
        except Exception as e:
            HandleException.exceptionHandler(e)

    @staticmethod
    def cashWithdrawal(customerID, amount):
        """To withdraw cash and update the balance"""
        try:
            connector = CustomerRepository()
            customerDetail = connector.getCustomerDetail(customerID)
            availableBalance = int(customerDetail['balance'])
            if availableBalance > amount:
                balance = availableBalance - amount
                connector.updateCustomerBalance(customerID, str(balance))
                return CashWithdrawal.Success.value
            else:
                return CashWithdrawal.InsufficientBalance.value
        except Exception as e:
            HandleException.exceptionHandler(e)


class FaceDetection:
    # Count no. of faces found in image
    @staticmethod
    def locateFacesInImage(img):
        """To locate face in the image"""
        try:
            image = face_recognition.load_image_file(img)
            faceLocation = face_recognition.face_locations(image)
            count = len(faceLocation)
            os.remove(img)
            if count == 0:
                return FaceCount.NotFound.value
            elif count == 1:
                return FaceCount.Success.value
            else:
                return FaceCount.MoreThanOne.value
        except Exception as e:
            HandleException.exceptionHandler(e)

    # To save file from the string
    @staticmethod
    def saveFile(image_in_str):
        """To save image in local"""
        try:
            path = "test.jpg"
            img = open(path, 'wb')
            img.write(base64.b64decode(image_in_str))
            img.close()
            return path
        except Exception as e:
            HandleException.exceptionHandler(e)


rekognitionClient = boto3.client('rekognition',
                      aws_access_key_id=awsCredentials['AccessKeyId'],
                      aws_secret_access_key=awsCredentials['SecretAccessKey'],
                      region_name=awsCredentials['Region'])


class FaceID():
    # Identify face from S3 Bucket image
    @staticmethod
    def index_faces(image_str):
        """Index face with aws face rekognition"""
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
            HandleException.exceptionHandler(e)

    @staticmethod
    def addIndexinDB(FaceIndexObject):
        """To add indexed face id in repository"""
        connector = FaceIDRepository()
        connector.putFaceIndex(FaceIndexObject)

    @staticmethod
    def match_face(image_str, customerID):
        """To match face id using aws face rekogintion and validate against customer id"""
        try:
            image_bytes = base64.b64decode(image_str)
            response = rekognitionClient.search_faces_by_image(
                CollectionId=appsettings["Rekognition"],
                Image={'Bytes': image_bytes}
            )
            faceMatch = False
            connector = FaceIDRepository()
            for match in response['FaceMatches']:
                faceDetails = connector.getFaceIdDetails()
                faceid = match['Face']['FaceId']
                faceIdMatch = list(
                    filter(lambda faceDetail: faceDetail["faceID"] == faceid, faceDetails))
                if len(faceIdMatch) == 1 and customerID in [customerID['customerID'] for customerID in faceIdMatch]:
                    faceMatch = True
                    break
            return faceMatch
        except Exception as e:
            HandleException.exceptionHandler(e)
