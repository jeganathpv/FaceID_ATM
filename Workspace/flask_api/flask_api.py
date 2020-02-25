# Using flask to make an api
# import necessary libraries and functions
from flask import Flask, jsonify, request
from flask_restful import Api,Resource

# creating a Flask app
app = Flask(__name__)
api = Api(app)


class SampleController(Resource):
    @app.route('/hello', methods=['GET'])
    def helloMethod():
        data = "hello world"
        return jsonify({'data': data})

    @app.route('/getsquare', methods=['POST'])
    def getSquare():
        json_data = request.get_json(force=True)
        num = int(json_data['num'])
        return jsonify({'square': num*num})


api.add_resource(SampleController)

app.run(host='0.0.0.0', port=5443)
