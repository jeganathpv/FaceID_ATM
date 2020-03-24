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
  authStatus = 1;
  enrollmentStep: number = 3;
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

  constructor(private middlewareService: MiddlewareService, private messageService: MessageService) {

  }

  ngOnInit() {

    this.middlewareService.generateQrCode('jhv').subscribe(res => {
      this.qrCode = res;
      this.middlewareService.convertToBase64(this.qrCode, (callback) => {
        console.log("base64", callback)
      })
    })
    this.authStatus = this.middlewareService.getAuthStatus();
    this.authStatus = 1;
    this.enrollmentStep = 3;
    this.middlewareService.getBankDetails().then((res: Bank[]) => {
      this.availableBanksList = res['BankDetails'];
      this.buildDropdown();
    });
    this.customer = {};
  }

  buildDropdown() {

    this.availableBanksList.forEach(bank => {
      this.bankSelectionList.push({
        label: bank.location,
        value: bank
      });
    });

  }

  formSubmit(val) {
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
    this.authStatus = 1;
    this.enrollmentStep = 0;

  }
  public captureScreen() {
    var data = document.getElementById('card');
  //   html2canvas(data).then(canvas => {
  //     // Few necessary setting options  
  //     var imgWidth = 208;
  //     var pageHeight = 295;
  //     var imgHeight = canvas.height * imgWidth / canvas.width;
  //     var heightLeft = imgHeight;
  //     var ctx = canvas.getContext("2d");
      
  //     // ctx.drawImage(data, 0, 0);

  //     const contentDataURL = canvas.toDataURL('image/svg');
  //     this.downloadURI("data:" + contentDataURL, "yourImage.png");
  //     // let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
  //     // var position = 0;
  //     // pdf.addImage(contentDataURL, 'SVG', 0, position, imgWidth, imgHeight)
  //     // pdf.save('MYPdf.pdf'); // Generated PDF   
  //   });
  // }
  //  downloadURI(uri, name) {
  //   var link = document.createElement("a");
  //   link.download = name;
  //   link.href = uri;
  //   link.click();
  //   //after creating link you should delete dynamic link
  //   //clearDynamicLink(link); 
  html2canvas(data).then(function(canvas) {
    document.body.appendChild(canvas);   });

}
}


