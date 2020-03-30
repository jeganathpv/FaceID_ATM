import { Component, OnInit } from '@angular/core';
import { Customer } from '../models';

@Component({
  selector: 'app-qrscanner',
  templateUrl: './qrscanner.component.html',
  styleUrls: ['./qrscanner.component.css']
})
export class QrscannerComponent implements OnInit {
  customer:Customer = {};
  qrCardDetails :string =''
  constructor() { }

  ngOnInit() {
  }
  scanSuccessHandler($event) {
    console.log($event);
    this.qrCardDetails = $event
  }

  onContinue(){
    this.customer.customerID = this.qrCardDetails;
  }
}
