import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Customer } from '../models';
// import { EventEmitter } from 'protractor';
// import { EventEmitter } from 'events';

@Component({
  selector: 'app-qrscanner',
  templateUrl: './qrscanner.component.html',
  styleUrls: ['./qrscanner.component.css']
})
export class QrscannerComponent implements OnInit {
  @Output() scannedDetails = new EventEmitter();


  qrCardDetails :string =''
  constructor() { }

  ngOnInit() {
  }
  scanSuccessHandler($event) {
    console.log($event);
    this.qrCardDetails = $event
    this.scannedDetails.emit(this.qrCardDetails);
    }
}
