import csv_load as aws 
import boto3

s3 = boto3.resource('s3',aws_access_key_id = aws.access_key_id, aws_secret_access_key = aws.secret_access_key, region_name=aws.region)

file = open('jegan.jpg','rb')
object = s3.Object('faceid-atm','jegan.jpg')
ret = object.put(Body = file,Metadata = {'FullName':'Jeganathan_PV'})
print("Image Added")