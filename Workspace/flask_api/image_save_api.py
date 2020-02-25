from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from flask_cors import CORS, cross_origin
import base64

# creating a Flask app
app = Flask(__name__)
# CORS(app, support_credentials=True)
api = Api(app)


class SaveFile:
    def saveFile(self,image_in_str):
        img = open('test.jpg','wb')
        img.write(base64.b64decode(image_in_str))
        img.close()
        return True

class FileController(Resource):

    @app.route('/upload',methods = ['POST'])
    # @cross_origin(supports_credentials=True)
    def uploadFile():
        json_data = request.get_json(force = True)
        image_in_str = str(json_data['image'])
        obj = SaveFile()
        if(obj.saveFile(image_in_str)):
            return jsonify({'Status':'File Upload successfully'})
        else:
            return jsonify({'Status':'Failed to upload'})

api.add_resource(FileController)

app.run(host= '0.0.0.0',port=5444)
        
