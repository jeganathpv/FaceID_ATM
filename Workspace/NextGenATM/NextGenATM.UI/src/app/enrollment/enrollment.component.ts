import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MiddlewareService } from '../middleware.service';
import { EnrollmentStep, Bank, Customer } from '../models';
import { SelectItem } from 'primeng/api/selectitem';
import { MessageService } from 'primeng/api';
import { Message } from 'primeng//api';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.css'],
})
export class EnrollmentComponent implements OnInit {
  authStatus;
  enrollmentStep: number;
  availableBanksList: Bank[];
  selectedBank: Bank;
  bankSelectionList: SelectItem[] = [];
  customer: Customer;
  validForm: boolean = true;
  imageLoading: boolean = false;
  statusMsg: string = "Please wait";
  msgs: Message[] = [];
  qrCode;
  tempaccntnum = '1211221'
  cardinString = '';

  constructor(private middlewareService: MiddlewareService, private messageService: MessageService) {

  }

  ngOnInit() {
    this.toDataURL(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${this.tempaccntnum}`, dataUrl =>  {
  console.log('RESULT:', dataUrl);
  // this.qrcodeinstring = dataUrl 
})

    this.authStatus = this.middlewareService.getAuthStatus();
    
    this.customer = {};
    // this.authStatus = 1;
    // this.enrollmentStep = 3;
    this.middlewareService.generateQrCode('s').subscribe((data:any) => {
      this.cardinString = "data:image/png;base64,"+data.card
    })
  }

  buildDropdown() {

    this.availableBanksList.forEach(bank => {
      this.bankSelectionList.push({
        label: bank.location,
        value: bank
      });
    });

  }

  formSubmit() {
    if (this.customer.name != null && this.customer.balance != null && this.selectedBank && this.selectedBank.branchCode) {
      this.middlewareService.createAccount({
        branchCode: this.selectedBank.branchCode,
        accountNo: this.selectedBank.lastAddedAcNo,
        name: this.customer.name,
        balance: this.customer.balance
      }).then((res: any) => {
        if (res.Status)
          this.customer.customerID = res.customerID;
        this.enrollmentStep = 2;
      })
    }
    else {
      let messageDetail = 'Please fill out the form';
      if(!this.selectedBank){
        messageDetail = 'Please Select a branch';
      }
      this.validForm = false;
      this.messageService.add({ severity: 'warn', summary: 'Form Error', detail: messageDetail });
      return
    }
  }
  imageCaptured($event) {
    this.middlewareService.detectFace($event).then((res: any) => {
      if (res.Status == 1) {
        this.imageLoading = true;
        this.statusMsg = "Indexing Face";
        this.middlewareService.indexFace(this.customer.customerID, $event).then((res: any) => {
          if (res.Status == 1) {
            this.statusMsg = "Indexing Done";
            this.enrollmentStep = 3;
            this.middlewareService.generateQrCode('s').subscribe((data:any) => {
              this.cardinString = "data:image/png;base64,"+data.card
            })
            this.imageLoading = false;
          }
        })
      }
      else if (res.Status == 2) {
        this.messageService.add({ severity: 'warn', summary: 'Face detection failed', detail: 'No face found!' });
      }
      else if (res.Status == 3) {
        this.messageService.add({
          severity: 'warn', summary: 'Face detection failed', detail: 'More than one face found'
        });
      }
    })

  }
  onstateChange() {
    // hit when login is successful
    this.authStatus = 1;
    this.enrollmentStep = 0;
    this.middlewareService.getBankDetails().then((res: Bank[]) => {
      this.availableBanksList = res['BankDetails'];
      this.buildDropdown();
    });

  }
  public captureScreen() {
    var data = document.getElementById('card');
  html2canvas(data , { height :1080,
    width : 1920, x:0 , y : 100 ,allowTaint: false}).then(function(canvas) {
     const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;  
      var imgWidth = 208;   
      var pageHeight = 295;    
      var imgHeight = canvas.height * imgWidth / canvas.width;  
      var heightLeft = imgHeight;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
      pdf.save('MYPdf.pdf'); // Generated PDF   
    // document.body.appendChild(canvas); 
    });

}

 toDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}

}


