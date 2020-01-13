import csv_load as aws 
import list_images as ls
import boto3


s3 = boto3.resource('s3',aws_access_key_id = aws.access_key_id, aws_secret_access_key = aws.secret_access_key, region_name=aws.region)

path = "./training_data"
username = "Jeganathan_PV"

counter = 0 
for image in ls.populate_files(path):
    counter += 1
    file = open(image,'rb')
    object = s3.Object('faceid-atm','faceid/{}{}.jpg'.format(username,counter))
    ret = object.put(Body = file,Metadata = {'FullName':username})
    print("{} image added".format(str(counter)))

# print("Total {} images added into S3Bucket successfully".format(counter))