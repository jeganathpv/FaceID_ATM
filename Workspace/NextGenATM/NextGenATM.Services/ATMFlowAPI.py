from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from flask_cors import CORS, cross_origin

#Import Models,Services
from Models import *
from Services import * 


app = Flask(__name__)
CORS(app, support_credentials = True)
api = Api(app)

