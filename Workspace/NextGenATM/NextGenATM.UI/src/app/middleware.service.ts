import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { resolve } from 'url';
import { Bank } from './models';

@Injectable({
  providedIn: 'root'
})
export class MiddlewareService {
  FOLDER: any;
  imageObj = {
    image: ' '
  }
  authStatus: any;

  baseurl: string;
  constructor(private http: HttpClient) {
    this.baseurl = "http://192.168.1.5:5000"
    enum AuthState {
      authenticated,
      invalidusername,
      invalidpassword,
      loggedout
    }
    this.authStatus = AuthState.loggedout;
  }

  login(userObj) {
    return this.http.post(this.baseurl + "/auth", userObj)
  }
  getAuthStatus() {
    return this.authStatus;
  }

  getBankDetails() {
    return new Promise((resolve, reject) => {
      this.http.get<Bank[]>(this.baseurl + "/bank/getdetails").subscribe((res: Bank[]) => {
        resolve(res)
      })
    })
  }

  uploadImage(image) {
    let promise = new Promise((resolve, reject) => {
      this.convertToBase64(image, (result) => {
        this.imageObj.image = result;
        this.http.post(this.baseurl + "/upload", this.imageObj).subscribe(response => {
          resolve(response)
        })
      });
    });
  }

  createAccount(userDetails) {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseurl + "/account/generatecustid", userDetails).subscribe(response => {
        resolve(response)
      })
    })
  }

  getFaceCount(base64string) {
    let promise = new Promise((resolve, reject) => {
      this.imageObj.image = base64string;
      this.http.post(this.baseurl + "/detectface", this.imageObj).subscribe(response => {
        resolve(response)
      })
    })
    return promise;
  }

  detectFace(base64string) {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseurl + "/faceid/detectface", { "image": base64string }).subscribe(res => {
        resolve(res)
      })
    })
  }

  indexFace(customerId, base64string) {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseurl + "/faceid/indexface", { "customerID": customerId, "image": base64string }).subscribe(res => {
        resolve(res)
      })
    })
  }

  getQrDetails(customerID) {
    return this.http.post(this.baseurl + "/account/generateqrdetails", { "customerID": customerID })
  }

  generateQrCode(customerId) {
    let img = this.http.get("https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example&format=svg");
    return img;
  }

  convertToBase64(image, callback) {
    var reader = new FileReader();
    reader.onloadend = function () {
      const res = reader.result.toString();
      callback(res.split(',')[1]);
    }
    reader.readAsDataURL(image);
  }
}