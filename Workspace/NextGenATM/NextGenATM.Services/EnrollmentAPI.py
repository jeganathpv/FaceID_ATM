import io
from flask import Flask, jsonify, request, send_file
from flask_restful import Api, Resource
from flask_cors import CORS, cross_origin

# Import Models,Services
from Models import UserObject, CustomerObject, FaceIndexObject
from Services import LoginUser, BankService, AccountService, FaceDetection, FaceID
from StaticStatus import FaceIndex

app = Flask(__name__)
CORS(app, support_credentials=True)
api = Api(app)


class HealthChecker(Resource):
    @app.route('/checkhealth', methods=['GET'])
    @cross_origin(support_credentials=True)
    def checkHealth():
        return jsonify(True)


class LoginController(Resource):
    @app.route('/auth', methods=['POST'])
    @cross_origin(support_credentials=True)
    def userLogin():
        json_data = request.get_json(force=True)
        username = str(json_data['username'])
        password = str(json_data['password'])
        userObj = UserObject(username, password)
        return jsonify({'Status': str(LoginUser.validateUser(userObj))})


class BankController(Resource):
    @app.route('/bank/getdetails', methods=['GET'])
    @cross_origin(support_credentials=True)
    def getBankDetails():
        return jsonify({"BankDetails": BankService.getBankDetails()})


class AccountController(Resource):
    @app.route('/account/generatecustid', methods=['POST'])
    @cross_origin(support_credentials=True)
    def generateCustId():
        custId = AccountService.generateCustomerID()
        json_data = request.get_json(force=True)
        branchCode = json_data['branchCode']
        accountNo = json_data['accountNo']
        name = json_data['name']
        balance = json_data['balance']
        custObj = CustomerObject(custId, branchCode, accountNo, name, balance)
        accountNo = AccountService.addCustomerDetails(custObj)
        AccountService.updateExistingDetails(
            custId[-3:], branchCode, accountNo)
        return jsonify({'Status': True, 'customerID': custId})

    @app.route('/account/generateqrcard/<string:id>', methods=['GET'])
    @cross_origin(support_credentials=True)
    def generateQRDetails(id):
        customerID = str(id).strip()
        qrDetail = AccountService.fetchCustomerDetail(customerID)
        qrCardAsBytes = AccountService.generateQrCard(qrDetail)
        return send_file(
                io.BytesIO(qrCardAsBytes),
                mimetype='image/png',
                download_name='qrcard.png',
                as_attachment=True
            )

class FaceIDController(Resource):
    @app.route('/faceid/detectface', methods=['POST'])
    @cross_origin(support_credentials=True)
    def detectFace():
        json_data = request.get_json(force=True)
        image_str = json_data['image']
        path = FaceDetection.saveFile(image_str)
        status = FaceDetection.locateFacesInImage(path)
        return jsonify({'Status': status})

    @app.route('/faceid/indexface', methods=['POST'])
    @cross_origin(support_credentials=True)
    def indexFace():
        json_data = request.get_json(force=True)
        customerID = json_data['customerID']
        image_str = json_data['image']
        status = FaceID.index_faces(image_str)
        if status[0] == FaceIndex.Success:
            faceIndexObj = FaceIndexObject(customerID, status[1])
            FaceID.addIndexinDB(faceIndexObj)
            return jsonify({'Status': FaceIndex.Success.value})
        else:
            return jsonify({'Status': FaceIndex.Failure.value})


if __name__ == "__main__":
    api.add_resource(HealthChecker)
    api.add_resource(LoginController)
    api.add_resource(BankController)
    api.add_resource(AccountController)
    api.add_resource(FaceIDController)
    app.run(host='0.0.0.0', port=5010)
