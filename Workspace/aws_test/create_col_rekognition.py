import csv_load as aws 
import boto3

#create collection in aws rekognition
def create_collection(collection_id):

    client=boto3.client('rekognition',aws_access_key_id = aws.access_key_id, aws_secret_access_key = aws.secret_access_key, region_name=aws.region)

    #Create a collection
    print('Creating collection:' + collection_id)
    response=client.create_collection(CollectionId=collection_id)
    print('Collection ARN: ' + response['CollectionArn'])
    print('Status code: ' + str(response['StatusCode']))
    print('Done...')
    
def main():
    collection_id='faceid'
    create_collection(collection_id)

if __name__ == "__main__":
    main()    