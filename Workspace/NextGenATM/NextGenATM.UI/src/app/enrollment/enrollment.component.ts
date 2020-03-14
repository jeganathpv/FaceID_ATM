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
  authStatus = 1;
  enrollmentStep: number = 2;
  availableBanksList: Bank[];
  selectedBank: Bank;
  bankSelectionList: SelectItem[];
  customer: Customer;
  validForm: boolean = true;
  imageLoading: boolean = false;
  statusMsg: string = "Please wait";
  constructor(private middlewareService: MiddlewareService) {

  }

  ngOnInit() {


    this.authStatus = this.middlewareService.getAuthStatus();
    this.authStatus = 1;
    this.enrollmentStep = 3;
    this.middlewareService.getBankDetails().then((res: Bank[]) => {
      this.availableBanksList = res['BankDetails']
    });
    this.customer = {};
  }

  buildDropdown() {
    let currentBank: SelectItem;
    this.availableBanksList.forEach(bank => {
      currentBank['label'] = bank.location;
      currentBank['value'] = bank;
      this.bankSelectionList.push(currentBank);
    });
  }

  dropDownChange($event) {
    if ($event.value) {
      // this.enrollmentStep = 2;
    }
  }
  formSubmit(val) {
    if (!this.customer.name && !this.customer.balance) {
      this.validForm = false;
      return
    }
    this.middlewareService.createAccount(this.customer).then((res: Customer) => {
      this.customer.customerID = res.customerID;
      this.enrollmentStep = 3;
    })
  }
  imageCaptured($event) {
    this.statusMsg = "Indexing Face";
    this.middlewareService.detectFace($event).then((res: any) => {
      if (res.Status == 1) {
        this.statusMsg = "Indexing Done";
        this.enrollmentStep = 3;
      }
    })

  }
  onstateChange() {
    this.authStatus = 1;
    this.enrollmentStep = 1
  }
}
