from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from flask_cors import CORS, cross_origin

#Import Models,Services
from Models import *
from Services import * 


app = Flask(__name__)
CORS(app, support_credentials = True)
api = Api(app)

class LoginController(Resource):
    @app.route('/auth',methods = ['POST'])
    @cross_origin(support_credentials = True)
    def userLogin():
        json_data = request.get_json(force = True)
        username = str(json_data['username'])
        password = str(json_data['password'])
        userObj = UserObject(username,password)
        return jsonify({'Status':str(LoginUser.validateUser(userObj))})

class BankController(Resource):
    @app.route('/bank/getdetails',methods = ['GET'])
    @cross_origin(support_credentials = True)
    def getBankDetails():
        return jsonify({"BankDetails":BankService.getBankDetails()})

class AccountController(Resource):
    @app.route('/account/generatecustid',methods = ['POST'])
    @cross_origin(support_credentials = True)
    def generateCustId():
        custId = AccountService.generateCustomerID()
        json_data = request.get_json(force = True)
        branchCode = json_data['branchCode']
        accountNo = json_data['accountNo']
        name = json_data['name']
        balance = json_data['balance']
        custObj = CustomerObject(custId,branchCode,accountNo,name,balance)
        accountNo = AccountService.addCustomerDetails(custObj)
        AccountService.updateExistingDetails(custId[-3:],branchCode,accountNo)
        return jsonify({'Status':True,'customerID':custId})

    @app.route('/account/generateqrdetails',methods = ['POST'])
    @cross_origin(support_credentials = True)
    def generateQRDetails():
        json_data = request.get_json(force =True)
        customerID = json_data['customerID']
        qrDetail = AccountService.fetchCustomerDetail(customerID)
        return jsonify(qrDetail.__dict__)


class FaceIDController(Resource):
    @app.route('/faceid/detectface',methods = ['POST'])
    @cross_origin(support_credentials = True)
    def detectFace():
        json_data = request.get_json(force = True)
        image_str = json_data['image']
        path = FaceDetection.saveFile(image_str)
        status = FaceDetection.locateFacesInImage(path)
        return jsonify({'Status':status})

    @app.route('/faceid/indexface',methods = ['POST'])
    @cross_origin(support_credentials = True)
    def indexFace():
        json_data = request.get_json(force =True)
        customerID = json_data['customerID']
        image_str = json_data['image']
        status = FaceID.index_faces(image_str)
        if status[0]== FaceIndex.Success:
            faceIndexObj = FaceIndexObject(customerID,status[1])
            FaceID.addIndexinDB(faceIndexObj)
            return jsonify({'Status':FaceIndex.Success.value})
        else:
            return jsonify({'Status':FaceIndex.Failure.value})





if __name__ == "__main__":
    api.add_resource(LoginController)
    api.add_resource(BankController)
    api.add_resource(AccountController)
    api.add_resource(FaceIDController)
    app.run(host= '0.0.0.0',port=5000)