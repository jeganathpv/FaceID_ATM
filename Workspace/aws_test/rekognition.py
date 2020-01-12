import csv
import boto3

with open('credentials.csv','r') as input:
    next(input)
    reader = csv.reader(input)
    for line in reader:
        access_key_id = line[2]
        secret_access_key = line[3]
        region = line[5]

photo  = 'jegan.jpg'

client = boto3.client('rekognition',aws_access_key_id = access_key_id, aws_secret_access_key = secret_access_key, region_name=region)

with open(photo,'rb') as source_image:
    source_bytes = source_image.read()

response = client.detect_labels(Image = {'Bytes':source_bytes},MaxLabels = 10)

print(response)