from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from flask_cors import CORS, cross_origin
import base64
import face_recognition 
from PIL import Image

class FaceDetection():
    @staticmethod
    def locateFacesInImage(img):
        image = face_recognition.load_image_file(img)
        faceLocation = face_recognition.face_locations(image)
        return len(faceLocation)

class SaveFile:
    @staticmethod
    def saveFile(image_in_str):
        path = 'test.jpg'
        img = open(path,'wb')
        img.write(base64.b64decode(image_in_str))
        img.close()
        return path

# creating a Flask app
app = Flask(__name__)
CORS(app, support_credentials=True)
api = Api(app)


class FaceDetectionController(Resource):
    @app.route('/detectface',methods = ['POST'])
    @cross_origin(support_credentials = True)
    def fetchFaceCount():
        json_data = request.get_json(force = True)
        image_in_str = str(json_data['image'])
        img = SaveFile.saveFile(image_in_str)
        count =  FaceDetection.locateFacesInImage(img)
        return jsonify({'Status':'OK','facecount':count})

    
api.add_resource(FaceDetectionController)
app.run(host='0.0.0.0',port=5444)
