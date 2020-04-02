from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from flask_cors import CORS, cross_origin

# Import Models,Services
from StaticStatus import QRMatch, FaceIDMatch
from Services import AccountService, FaceDetection, FaceID


app = Flask(__name__)
CORS(app, support_credentials=True)
api = Api(app)


class HealthChecker(Resource):
    @app.route('/checkhealth', methods=['GET'])
    @cross_origin(support_credentials=True)
    def checkHealth(self):
        return jsonify(True)


class AuthController(Resource):
    @app.route('/auth/matchqr', methods=['POST'])
    @cross_origin(support_credentials=True)
    def matchQrCode(self):
        json_data = request.get_json(force=True)
        qrCode = json_data['qrCode']
        if AccountService.matchQrCodeWithAccount(qrCode):
            return jsonify({"Status": QRMatch.AccountFound.value})
        else:
            return jsonify({"Status": QRMatch.AccountNotFound.value})


class AccountController(Resource):
    @app.route('/account/getdetails', methods=['POST'])
    @cross_origin(support_credentials=True)
    def fetchAccountDetails(self):
        json_data = request.get_json(force=True)
        customerID = json_data['customerID']
        custDetail = AccountService.fetchCustomerDetail(customerID)
        return jsonify(custDetail.__dict__)

    @app.route('/account/getbalance', methods=['POST'])
    @cross_origin(support_credentials=True)
    def fetchBalance(self):
        json_data = request.get_json(force=True)
        customerID = json_data['customerID']
        return jsonify({"balance": AccountService.fetchAccountBalance(customerID)})

    @app.route('/account/withdrawcash', methods=['POST'])
    @cross_origin(support_credentials=True)
    def cashWithdraw(self):
        json_data = request.get_json(force=True)
        customerID = json_data['customerID']
        amount = int(json_data['amount'])
        return jsonify({"Status": AccountService.cashWithdrawal(customerID, amount)})


class FaceIDController(Resource):
    @app.route('/faceid/detectface', methods=['POST'])
    @cross_origin(support_credentials=True)
    def detectFace(self):
        json_data = request.get_json(force=True)
        image_str = json_data['image']
        path = FaceDetection.saveFile(image_str)
        status = FaceDetection.locateFacesInImage(path)
        return jsonify({'Status': status})

    @app.route('/faceid/matchface', methods=['POST'])
    @cross_origin(support_credentials=True)
    def matchFace(self):
        json_data = request.get_json(force=True)
        customerID = json_data['customerID']
        image_str = json_data['image']
        status = FaceID.match_face(image_str, customerID)
        if status:
            return jsonify({'Status': FaceIDMatch.FaceIDMatchWithAccount.value})
        else:
            return jsonify({'Status': FaceIDMatch.FaceIDNotMatchWithAccount.value})


if __name__ == "__main__":
    api.add_resource(HealthChecker)
    api.add_resource(AuthController)
    api.add_resource(AccountController)
    api.add_resource(FaceIDController)
    app.run(host='0.0.0.0', port=5100)
