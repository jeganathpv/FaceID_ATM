import { Component, OnInit } from '@angular/core';
import { ATMFlow, Customer } from '../models';

@Component({
  selector: 'app-atm-flow',
  templateUrl: './atm-flow.component.html',
  styleUrls: ['./atm-flow.component.css']
})
export class AtmFlowComponent implements OnInit {
  atmflow:ATMFlow;
  scannedResult ;
  customer:Customer;
  constructor() { }

  ngOnInit() {
    this.atmflow = ATMFlow.welcome;
  }
  onContinue(){
    this.atmflow = ATMFlow.scan;

  }

  onScanResult($event){
    // console.log($event);
    this.scannedResult = $event;
  }

  onConfirm(){
    this.customer.customerID = this.scannedResult;
    // go to next flow
  }

  onCancel(){
    this.scannedResult = '';

  }
}
