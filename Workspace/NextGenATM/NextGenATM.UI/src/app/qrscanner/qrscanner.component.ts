import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Customer, QRMatch } from '../models';
import { MessageService } from 'primeng/api';
import { MiddlewareService } from '../middleware.service';

@Component({
  selector: 'app-qrscanner',
  templateUrl: './qrscanner.component.html',
  styleUrls: ['./qrscanner.component.css']
})
export class QrscannerComponent implements OnInit {
  @Output() scannedDetails = new EventEmitter();


  // qrCardDetails :string =''
  constructor(private messageService: MessageService, private middlewareService: MiddlewareService) { }

  ngOnInit() {
  }
  scanSuccessHandler($event) {
    console.log($event);
    // this.qrCardDetails = $event
    // this.scannedDetails.emit(this.qrCardDetails);
    
    this.middlewareService.matchQrWithAccount($event).then((res:any)=> {
      // console.log(res);
      if(res.Status === QRMatch.AccountNotFound){
        this.messageService.add({severity:'error', summary:'Account not found', detail:'Please place the valid QR Card'});
        return;
      }
      else{
        // this.qrCardDetails = $event;
        this.scannedDetails.emit($event);
      }
    });
    // this.qrCardDetails = $event;
  }


}
