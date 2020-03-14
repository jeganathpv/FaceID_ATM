from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from flask_cors import CORS, cross_origin
import base64
import boto3
import csv_load as aws 

rekognition = boto3.client('rekognition',aws_access_key_id = aws.access_key_id, aws_secret_access_key = aws.secret_access_key, region_name=aws.region)


# creating a Flask app
app = Flask(__name__)
CORS(app, support_credentials=True)
api = Api(app)

class Rekognition():
    @staticmethod
    def index_face_bytes(image_bytes):
        response = rekognition.index_faces(
            Image={"Bytes":image_bytes},
                CollectionId="faceid")
        return response

class IndexFace(Resource):

    @app.route('/upload',methods = ['POST'])
    @cross_origin(supports_credentials=True)
    def uploadFile():
        json_data = request.get_json(force = True)
        image_in_str = str(json_data['image'])
        image_in_bytes = base64.b64decode(image_in_str)
        response = Rekognition.index_face_bytes(image_in_bytes)
        if response['ResponseMetadata']['HTTPStatusCode'] == 200:
            faceId = response['FaceRecords'][0]['Face']['FaceId']
            return jsonify({'Status':'Face Indexed successfully','Index':faceId})
        else:
            return jsonify({'Status':'Failed to index'})

api.add_resource(IndexFace)

app.run(host= '0.0.0.0',port=5444)