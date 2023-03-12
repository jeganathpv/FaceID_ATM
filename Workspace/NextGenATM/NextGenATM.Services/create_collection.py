import json
import boto3

with open('appsettings.json', 'r') as json_file:
    appsettings = json.load(json_file)

awsCredentials = appsettings["AWSCredentials"]
rekognitionCollectionName = appsettings["Rekognition"]

client = boto3.client('rekognition',
                      aws_access_key_id=awsCredentials['AccessKeyId'],
                      aws_secret_access_key=awsCredentials['SecretAccessKey'],
                      region_name=awsCredentials['Region'])

response = client.create_collection(CollectionId=rekognitionCollectionName)

print(response['CollectionArn'])