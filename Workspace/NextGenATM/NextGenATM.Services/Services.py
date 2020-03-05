#FaceDetection
import face_recognition 
from PIL import Image
import base64
#AWS Lambda
import csv_load as aws 
import boto3

import datetime

#Import models,enums,repository
from Models import *
from StaticStatus import *
from Repository import *

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
        except:
            print(str(Exception))

class BankService:
    @staticmethod
    def getBankDetails():
        try:
            connector = BankDetails()
            bankDetails = connector.getBankDetails()
            return bankDetails
        except:
            print(str(Exception))    

class AccountService:
    @staticmethod
    def generateCustomerID(CustomerObject):
        try:
            connector = CustomerIDDetail()
            lastCustId = int(connector.getLastCustID())
            newCustID = lastCustId + 1
            date = datetime.datetime.now()
            series = date.strftime("%y%m")
            custId = series+str(newCustID)
            CustomerObject.set_customerID(custID) 
            connector = CustomerRepository()
            connector.addCustomer(CustomerObject)
            return custID 
        except Exception as e:
            if hasattr(e, 'message'):
                print(e.message)
            else:
                print(e)




class FaceDetection:
    #Count no. of faces found in image
    @staticmethod
    def locateFacesInImage(img):
        image = face_recognition.load_image_file(img)
        faceLocation = face_recognition.face_locations(image)
        return len(faceLocation)

    #To save file from the string
    @staticmethod
    def saveFile(image_in_str,mode):
        if mode == "enroll":
            path = "../StorageHub/Enroll/image.jpg"
        elif mode == "testing":
            path = "../StorageHub/Testing/test.jpg"
        img = open(path,'wb')
        img.write(base64.b64decode(image_in_str))
        img.close()
        return path

s3Resource = boto3.resource('s3',aws_access_key_id = aws.access_key_id, aws_secret_access_key = aws.secret_access_key, region_name=aws.region)

class S3Service():
    @staticmethod
    def uploadFileIntoS3(path, custId):
        try:
            imageFile = open(path,'rb')
            s3obj = s3Resource.Object('faceid-atm','{}.jpg'.format(custId))
            s3obj.put(Body = imageFile, Metadata = {'CustomerID':custId})
            return True
        except:
            return False    

s3Client = boto3.client('s3',aws_access_key_id = aws.access_key_id, aws_secret_access_key = aws.secret_access_key, region_name=aws.region)
rekognitionClient = boto3.client('rekognition',aws_access_key_id = aws.access_key_id, aws_secret_access_key = aws.secret_access_key, region_name=aws.region)
dynamodbClient = boto3.client('dynamodb',aws_access_key_id = aws.access_key_id, aws_secret_access_key = aws.secret_access_key, region_name=aws.region)

class FaceID():
    #Identify face from S3 Bucket image
    @staticmethod
    def index_faces(bucket, key):
        response = rekognitionClient.index_faces(
            Image={"S3Object":
                {"Bucket": bucket,
                "Name": key}},
                CollectionId="faceid")
        return response

    #Add users id and name in dynamo db
    @staticmethod
    def update_index(tableName,faceId, fullName):
        response = dynamodbClient.put_item(
            TableName=tableName,
            Item={
                'RekognitionId': {'S': faceId},
                'FullName': {'S': fullName}
                }
            ) 
        return response

