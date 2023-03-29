import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bank } from './models';
import { AuthState } from './models';
import { BehaviorSubject } from 'rxjs';
import { saveAs } from 'file-saver';


@Injectable({
  providedIn: 'root'
})
export class MiddlewareService {
  FOLDER: any;
  imageObj = {
    image: ' '
  }
  authStatus: BehaviorSubject<number>;
  baseurl: string = '';

  constructor(private http: HttpClient) {
    this.baseurl = ''
    this.authStatus = new BehaviorSubject(AuthState.loggedout);
  }

  /**
    * Dynamically sets the baseURL
    * @param baseUrl the base url in string 
   */
  setBaseUrl(baseUrl: string) {
    this.baseurl = baseUrl;
  }

  /**
    * To authenticate the user 
   */
  login(userObj) {
    return this.http.post(this.baseurl + "/auth", userObj)
  }

  /**
    * Log out the current user 
   */
  logOut() {
    this.authStatus.next(AuthState.loggedout);
  }

  /**
    * return the current login status 
   */
  getAuthStatus() {
    return this.authStatus;
  }

  /**
    * Fetches the list of available banks 
   */
  getBankDetails() {
    return new Promise((resolve, reject) => {
      this.http.get<Bank[]>(this.baseurl + "/bank/getdetails").subscribe((res: Bank[]) => {
        resolve(res)
      })
    })
  }

  /**
    * Creates a new account
    * @param userDetails object containing the details of the user 
   */
  createAccount(userDetails) {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseurl + "/account/generatecustid", userDetails).subscribe(response => {
        resolve(response)
      })
    })
  }

  /** 
    * Returns the number of faces in the image
    * @param base64string the base64uri of the image to check
   */
  getFaceCount(base64string) {
    let promise = new Promise((resolve, reject) => {
      this.imageObj.image = base64string;
      this.http.post(this.baseurl + "/detectface", this.imageObj).subscribe(response => {
        resolve(response)
      })
    })
    return promise;
  }

  /**
    * Checks if a face is present
    * @param base64string the base64uri of the image to check
   */
  detectFace(base64string) {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseurl + "/faceid/detectface", { "image": base64string }).subscribe(res => {
        resolve(res)
      })
    })
  }
  
  /**
   * Indexes the face data to store in database
   * @param customerId the customer id
   * @param base64string the base64 string of the face image
   */
  indexFace(customerId, base64string) {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseurl + "/faceid/indexface", { "customerID": customerId, "image": base64string }).subscribe(res => {
        resolve(res)
      })
    })
  }

  /**
   * Returns the generated qrcard as string
   * @param customerId the customer id of the current user
   */
  generateQrCode(customerId: string) {
    return this.http.get(this.baseurl + `/account/generateqrcard/${customerId}`, { responseType: 'blob' })
    .subscribe((response) => {
      const blob = new Blob([response], { type: 'image/png' });
      const filename = `${customerId}_card.png`;
      saveAs(blob, filename);
    })
  }
  
  /**
   * To check account is found against the qr code
   * @param qrCode Scanned details from the qr scanner
   */
  matchQrWithAccount(qrCode) {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseurl + "/auth/matchqr", { "qrCode": qrCode }).subscribe(res => {
        resolve(res)
      })
    })
  }

  /**
   * To fetch the account details of the customer
   * @param customerID Requires customerID 
   */
  getAccountDetails(customerID) {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseurl + "/account/getdetails", { "customerID": customerID }).subscribe(res => {
        resolve(res)
      })
    })
  }

  /**
   * Used to match the face dectected with the customer's account
   * @param customerID Used to cross check against customer id
   * @param image Base64 image string
   */
  matchFaceWithAccount(customerID, image) {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseurl + "/faceid/matchface", { "customerID": customerID, "image": image }).subscribe(res => {
        resolve(res)
      })
    })
  }

  /**
   * Used to fetch account balance of the customer
   * @param customerID Use customerid to fetch
   */
  getAccountBalance(customerID) {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseurl + "/account/getbalance", { "customerID": customerID }).subscribe(res => {
        resolve(res)
      })
    })
  }

  /**
   * API Call to withdraw amount from the customer's account
   * @param customerID accepts customer's id
   * @param amount Amount required for the customer
   */
  withdrawCashFromAccount(customerID, amount) {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseurl + "/account/withdrawcash", { "customerID": customerID, "amount": amount }).subscribe(res => {
        resolve(res)
      })
    })
  }

  /**
   * Checks if the service is running
   */
  checkHealth(){
    return new Promise<void>((resolve , reject) => {
      this.http.get(this.baseurl + '/checkhealth').toPromise().then(active => {
        if(active === true)
          resolve();
        else
          reject();
      }).catch(()=>{
        reject()
      })
    });
  }
}