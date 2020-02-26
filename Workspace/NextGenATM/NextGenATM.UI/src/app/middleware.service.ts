import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class MiddlewareService {
  FOLDER: any;
  imageObj = {
    image: ' '
  }
  constructor(private http: HttpClient) { }

  uploadImage(image) {
    let promise = new Promise((resolve, reject) => {
      this.convertToBase64(image, (result) => {
        this.imageObj.image = result;
        this.http.post("http://192.168.1.5:5444/upload", this.imageObj).subscribe(response => {
          resolve(response)
        })
      });
    });
  }

  getFaceCount(base64string) {
    let promise = new Promise((resolve, reject) => {
      this.imageObj.image = base64string;
      this.http.post("http://192.168.1.5:5444/detectface", this.imageObj).subscribe(response => {
        resolve(response)
      })
    })
    return promise;
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