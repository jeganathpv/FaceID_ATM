import { Component, OnInit } from '@angular/core';
import { ATMFlow, Customer } from '../models';
import { MiddlewareService } from '../middleware.service';
import { MessageService } from 'primeng/api';
import { TimerService } from '../timer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-atm-flow',
  templateUrl: './atm-flow.component.html',
  styleUrls: ['./atm-flow.component.css']
})
export class AtmFlowComponent implements OnInit {
  atmflow: ATMFlow;
  scannedResult: string;
  customer: Customer = {};
  imageLoading: boolean = false;
  statusMsg: string = '';
  amountRequired: string = '';
  operationTimedOut: boolean = false;
  carousalSource = ['1.svg','2.png','3.svg'];
  imageNumber: number = 0;
  constructor(private middlewareService: MiddlewareService, private timer: TimerService, private messageService: MessageService, private router: Router) { }

  ngOnInit() {
    this.atmflow = ATMFlow.welcome;
    this.timer.getTimer().subscribe(() => {
      setTimeout(() => {
        this.cleanUp();
        this.router.navigate(['atm-flow'])
      }, 100000)
      this.operationTimedOut = true;
      this.messageService.add({ severity: 'error', summary: 'Operation Timed out', detail: 'No input received' });
    })
    //Carousel Feature
    this.imageNumber = Math.floor(Math.random() * (this.carousalSource.length));
    setInterval(() => {
      this.changeCarousalImage(); 
      }, 10000);
  }

  /**
   * To cleanup the current session
   */
  cleanUp() {
    this.atmflow = ATMFlow.welcome;
    this.scannedResult = '';
    this.customer = {};
    this.imageLoading = false;
    this.statusMsg = '';
    this.amountRequired = '';
    this.operationTimedOut = false;
  }

  /**
   * To change the image in carousel
   */
  changeCarousalImage() {
    if(this.imageNumber<this.carousalSource.length-1){
      this.imageNumber++;
    }
    else{
      this.imageNumber = 0;
    }
  }

  /**
   * Switch from welcome screen to QR Scanner 
   */
  onContinue() {
    this.atmflow = ATMFlow.scan;
    this.timer.startTimer(10000);
  }

  /**
   * To fetch account details of the customer
   * @param $event details in the qr code
   */
  onScanResult($event) {
    this.timer.clearTimer();
    this.scannedResult = $event;
    this.middlewareService.getAccountDetails(this.scannedResult).then((res: Customer) => {
      this.customer.customerID = res.customerID;
      this.customer.name = res.name;
      this.customer.accountNo = res.accountNo;
    })
  }

  /**
   * Switch to face detection component
   */
  onConfirm() {
    this.atmflow = ATMFlow.facedetection;
    this.timer.startTimer(3000);
  }

  /**
   * To check faceid against customer id and navigated to transaction type page
   * @param $event base64 string of the image captured
   */
  imageCaptured($event) {
    this.timer.clearTimer();
    this.middlewareService.detectFace($event).then((res: any) => {
      if (res.Status == 1) {
        this.imageLoading = true;
        this.statusMsg = "Face Detection Starts";
        this.middlewareService.matchFaceWithAccount(this.customer.customerID, $event).then((res: any) => {
          if (res.Status == 1) {
            this.atmflow = ATMFlow.selectTransactionType;
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Face ID Not Match', detail: 'Face ID not match with the account!' });
            this.atmflow = ATMFlow.welcome;
            return;
          }
        })
      }
      else if (res.Status == 2) {
        this.messageService.add({ severity: 'warn', summary: 'Face detection failed', detail: 'No face found!' });
        return;
      }
      else if (res.Status == 3) {
        this.messageService.add({
          severity: 'warn', summary: 'Face detection failed', detail: 'More than one face found'
        });
        return;
      }
    })
  }

  /**
   * To check the balance of the customer and then switch the navigation
   */
  checkBalance() {
    this.middlewareService.getAccountBalance(this.customer.customerID).then((res: any) => {
      this.customer.balance = res.balance;
    })
    this.atmflow = ATMFlow.checkBalance;
  }

  /**
   * Switch to Withdrawal page
   */
  withdrawalPage() {
    this.timer.startTimer(10000);
    this.atmflow = ATMFlow.withdrawalPage;
  }

  /**
   * To withdraw amount from the customer account and switch to check balance
   */
  withdrawAmount() {
    this.timer.clearTimer();
    if (parseInt(this.amountRequired) > 20000) {
      this.messageService.add({
        severity: 'warn', summary: 'Amount Exceeded', detail: 'Please try again later.'
      });
      this.cleanUp();
    }
    else {
      this.middlewareService.withdrawCashFromAccount(this.customer.customerID, this.amountRequired).then((res: any) => {
        if (res.Status == 1) {
          this.messageService.add({
            severity: 'success', summary: 'Cash Withdrawed', detail: 'Cash withdraw successfully!'
          });
          this.checkBalance();
          this.amountRequired = '';
        }
        else {
          this.messageService.add({
            severity: 'warn', summary: 'Insufficient Balance', detail: 'You don\'t have sufficient amount to withdrawal. Please try again later.'
          });
          this.cleanUp();
        }
      })
    }
  }

  /**
   * To continue banking after withdrawal or check balance
   */
  continueBanking() {
    this.atmflow = ATMFlow.selectTransactionType;
  }
}
