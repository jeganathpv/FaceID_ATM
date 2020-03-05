import { Component, OnInit } from '@angular/core';
import { MiddlewareService } from '../middleware.service';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.css']
})
export class EnrollmentComponent implements OnInit {
  authStatus: any;
  selectedBank: any;
  selectedBankDetails: any;
  banksList: any;
  bankSelectorList: any[] = [];
  constructor(private middlewareService: MiddlewareService) { }

  ngOnInit() {
    this.authStatus = this.middlewareService.getAuthStatus();
    console.log(this.authStatus)
  }

  onstateChange() {
    this.authStatus = this.middlewareService.getAuthStatus();
    if (this.authStatus == 1) {
      this.initEnrollment();
    }
  }
  initEnrollment() {
    this.middlewareService.getBankDetails().subscribe((data: any) => {
      this.banksList = data.BankDetails;
      this.banksList.forEach(element => {
        console.log(element.location)
        this.bankSelectorList.push(element.location)
      });
    })
    console.log(this.bankSelectorList);
  }

}
