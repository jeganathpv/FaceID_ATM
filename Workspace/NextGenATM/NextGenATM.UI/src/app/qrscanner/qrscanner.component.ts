import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { QRMatch } from '../models';
import { MessageService } from 'primeng/api';
import { MiddlewareService } from '../middleware.service';
import { TimerService } from '../timer.service';

@Component({
  selector: 'app-qrscanner',
  templateUrl: './qrscanner.component.html',
  styleUrls: ['./qrscanner.component.css']
})
export class QrscannerComponent implements OnInit {
  @Output() scannedDetails = new EventEmitter();

  constructor(private messageService: MessageService, private timer: TimerService, private middlewareService: MiddlewareService) { }

  ngOnInit() {
  }
  /**
    * Called when the qrcard is successfully scanned
    * @param $event the qrdata in string
     */
  scanSuccessHandler($event) {
    this.timer.resetTimer();
    this.middlewareService.matchQrWithAccount($event).then((res: any) => {
      if (res.Status === QRMatch.AccountNotFound) {
        this.messageService.add({ severity: 'error', summary: 'Account not found', detail: 'Please place the valid QR Card' });
        return;
      }
      else {
        this.scannedDetails.emit($event);
      }
    });
  }
}
