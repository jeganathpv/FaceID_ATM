import csv_load as aws 
import boto3
# from PIL import Image

rekognition = boto3.client('rekognition',aws_access_key_id = aws.access_key_id, aws_secret_access_key = aws.secret_access_key, region_name=aws.region)
dynamodb = boto3.client('dynamodb',aws_access_key_id = aws.access_key_id, aws_secret_access_key = aws.secret_access_key, region_name=aws.region)

image = "testing/test.png"
with open(image,"rb") as img:
    image_binary = img.read()

response = rekognition.search_faces_by_image(
        CollectionId='faceid',
        Image={'Bytes':image_binary}                                       
        )
print("Image searching done...")

for match in response['FaceMatches']:
    print (match['Face']['FaceId'],match['Face']['Confidence'])
        
    face = dynamodb.get_item(
        TableName='faceid_collection',  
        Key={'RekognitionId': {'S': match['Face']['FaceId']}}
        )
    
    if 'Item' in face:
        print (face['Item']['FullName']['S'])
    else:
        print ('no match found in person lookup')

print(response)