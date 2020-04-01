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
  atmflow:ATMFlow;
  scannedResult: string ;
  customer:Customer = {};
  imageLoading: boolean = false;
  statusMsg: string = '';
  amountRequired : string = '';
  operationTimedOut:boolean = false;
  constructor(private middlewareService:MiddlewareService,private timer:TimerService ,  private messageService : MessageService,private router: Router) { }
  
  ngOnInit() {
    this.atmflow = ATMFlow.welcome;
   this.timer.getTimer().subscribe(()=>{
     console.log('timer fired');
     setTimeout(() => {this.cleanUp();
     this.router.navigate(['atm-flow'])} , 2000)
     this.operationTimedOut = true;
     this.messageService.add({ severity: 'error', summary: 'Operation Timed out', detail: 'No input received' });

    //  this.atmflow = ATMFlow.welcome;
   

   })
    
  }
  cleanUp(){
  this.atmflow = ATMFlow.welcome;
  this.scannedResult = '';
  this.customer = {};
  this.imageLoading = false;
  this.statusMsg = '';
  this.amountRequired = '';
  this.operationTimedOut= false;
  }
  onContinue(){
    this.atmflow = ATMFlow.scan;
    this.timer.startTimer(10000);
  }

  onScanResult($event){
    // console.log($event);
    this.timer.clearTimer();
    this.scannedResult = $event;
    
    this.middlewareService.getAccountDetails(this.scannedResult).then((res:Customer)=>{
      this.customer.customerID = res.customerID;
      this.customer.name = res.name;
      this.customer.accountNo = res.accountNo;
    })
  }

  onConfirm(){
    // this.customer.customerID = this.scannedResult;
    this.atmflow = ATMFlow.facedetection;
    this.timer.startTimer(3000);
    // go to next flow
  }

  onCancel(){
    this.scannedResult = '';
    this.atmflow = ATMFlow.welcome;
    this.customer = {};
  }

  imageCaptured($event){
    this.timer.clearTimer();
    this.middlewareService.detectFace($event).then((res: any) => {
      if (res.Status == 1) {
        this.imageLoading = true;
        this.statusMsg = "Face Detection Starts";
        this.middlewareService.matchFaceWithAccount(this.customer.customerID,$event).then((res:any)=>{
          if(res.Status == 1){
            this.atmflow = ATMFlow.selectTransactionType;
          }
          else{
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

  checkBalance(){
    this.middlewareService.getAccountBalance(this.customer.customerID).then((res:any) => {
      this.customer.balance = res.balance;
    })
    this.atmflow = ATMFlow.checkBalance;
  }

  withdrawalPage(){
    this.timer.startTimer(10000);
    this.atmflow = ATMFlow.withdrawalPage;
  }

  withdrawAmount(){
    this.timer.clearTimer();
    if(parseInt(this.amountRequired)>20000){
      this.messageService.add({
        severity: 'warn', summary: 'Amount Exceeded', detail: 'Please try again later.'
      });
      this.onCancel();
    }
    else{
      this.middlewareService.withdrawCashFromAccount(this.customer.customerID,this.amountRequired).then((res:any) => {
        if(res.Status == 1){
          this.messageService.add({
            severity: 'success', summary: 'Cash Withdrawed', detail: 'Cash withdraw successfully!'
          });
          this.checkBalance();
        }
        else{
          this.messageService.add({
            severity: 'warn', summary: 'Insufficient Balance', detail: 'You don\'t have sufficient amount to withdrawal. Please try again later.'
          });
          this.onCancel();
        }
      })
    }
  }
  
  continueBanking(){
    this.atmflow = ATMFlow.selectTransactionType;
  }

 
}
