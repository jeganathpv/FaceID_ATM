import { Component, OnInit } from '@angular/core';
import { Customer } from '../models';
import { MessageService } from 'primeng/api';
import { MiddlewareService } from '../middleware.service';

@Component({
  selector: 'app-qrscanner',
  templateUrl: './qrscanner.component.html',
  styleUrls: ['./qrscanner.component.css']
})
export class QrscannerComponent implements OnInit {
  customer:Customer = {};
  qrCardDetails :string =''
  constructor(private messageService: MessageService, private middlewareService: MiddlewareService) { }

  ngOnInit() {
  }
  scanSuccessHandler($event) {
    this.middlewareService.matchQrWithAccount($event).then((res:any)=> {
      // console.log(res);
      if(res.Status === 2){
        this.messageService.add({severity:'error', summary:'Account not found', detail:'Please place the valid QR Card'});
        return;
      }
      else{
        this.qrCardDetails = $event;
      }
    });
    // this.qrCardDetails = $event;
  }

  onContinue(){
    this.customer.customerID = this.qrCardDetails;
  }
}
