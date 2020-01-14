import csv_load as aws 
import boto3

s3 = boto3.client('s3',aws_access_key_id = aws.access_key_id, aws_secret_access_key = aws.secret_access_key, region_name=aws.region)
rekognition = boto3.client('rekognition',aws_access_key_id = aws.access_key_id, aws_secret_access_key = aws.secret_access_key, region_name=aws.region)
dynamodb = boto3.client('dynamodb',aws_access_key_id = aws.access_key_id, aws_secret_access_key = aws.secret_access_key, region_name=aws.region)


def index_faces(bucket, key):

    response = rekognition.index_faces(
        Image={"S3Object":
            {"Bucket": bucket,
            "Name": key}},
            CollectionId="faceid")
    return response

def update_index(tableName,faceId, fullName):
    response = dynamodb.put_item(
        TableName=tableName,
        Item={
            'RekognitionId': {'S': faceId},
            'FullName': {'S': fullName}
            }
        ) 
    return response


try:
    bucket = "faceid-atm"
    key = "faceid/Jeganathan_PV1.jpg"
    response  = index_faces(bucket,key)
    print("Indexing Successful")
    # Commit faceId and full name object metadata to DynamoDB
    

    if response['ResponseMetadata']['HTTPStatusCode'] == 200:
        faceId = response['FaceRecords'][0]['Face']['FaceId']
        ret = s3.head_object(Bucket=bucket,Key=key)
        personFullName = ret['Metadata']['fullname']

        update_index('faceid_collection',faceId,personFullName)
    print("Dumping Indexed faces into DynamoDB Successful")
    print(type(response))

    print(response)
except Exception as e:
    print(e)
    print("Error processing object {} from bucket {}. ".format(key, bucket))
    # raise e