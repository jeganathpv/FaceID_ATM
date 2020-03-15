import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MiddlewareService } from '../middleware.service';
import { EnrollmentStep, Bank, Customer } from '../models';
import { SelectItem } from 'primeng/api/selectitem';


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

  constructor(private middlewareService: MiddlewareService) {

  }

  ngOnInit() {


    this.authStatus = this.middlewareService.getAuthStatus();
    // this.authStatus = 1;
    this.enrollmentStep = 0;
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

  dropDownChange($event) {
    if ($event.value) {
      this.enrollmentStep = 1;
    }
  }
  formSubmit(val) {
    if (!this.customer.name && !this.customer.balance) {
      this.validForm = false;
      return
    }
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
  imageCaptured($event) {
    this.imageLoading = true;
    this.middlewareService.detectFace($event).then((res: any) => {

      if (res.Status == 1) {
        this.statusMsg = "Indexing Face";
        this.middlewareService.indexFace(this.customer.customerID, $event).then((res: any) => {
          if (res.Status == 1) {
            this.statusMsg = "Indexing Done";
            this.enrollmentStep = 3;
            this.imageLoading = false;
          }
        })
      }
      else {
        this.enrollmentStep = 2;
        this.imageLoading = false;
      }
    })

  }
  onstateChange() {
    this.authStatus = 1;
    this.enrollmentStep = 0;
  }
}


