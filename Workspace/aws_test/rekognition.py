import csv_load as aws

import boto3

photo  = 'jegan.jpg'

client = boto3.client('rekognition',aws_access_key_id = aws.access_key_id, aws_secret_access_key = aws.secret_access_key, region_name=aws.region)

with open(photo,'rb') as source_image:
    source_bytes = source_image.read()

response = client.detect_labels(Image = {'Bytes':source_bytes},MaxLabels = 10)

print(response)