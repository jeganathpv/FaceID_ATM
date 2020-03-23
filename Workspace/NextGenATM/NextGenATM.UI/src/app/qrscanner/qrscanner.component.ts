import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-qrscanner',
  templateUrl: './qrscanner.component.html',
  styleUrls: ['./qrscanner.component.css']
})
export class QrscannerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  scanSuccessHandler($event) {
    console.log($event)
  }
}
