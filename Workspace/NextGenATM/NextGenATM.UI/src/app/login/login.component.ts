import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MiddlewareService } from '../middleware.service';
import { MessageService } from 'primeng/api';
import { Message } from 'primeng//api';
import { AuthState } from '../models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Output() stateChange = new EventEmitter;
  username: string;
  password: string;
  msgs: Message[] = [];
  constructor(private middlewareService: MiddlewareService, private messageService: MessageService) { }

  ngOnInit() {
  }

  submitForm() {
    this.middlewareService.login({ "username": this.username, "password": this.password }).subscribe((data: any) => {
      // update the authstatus in middlewareseervice
      this.middlewareService.authStatus = data.Status;
      if (data.Status == 1) {
        this.stateChange.emit();
        this.middlewareService.authStatus.next(AuthState.authenticated);
        this.messageService.add({ severity: 'success', summary: 'Login Successful', detail: 'Logged in successfully' });

      }

      else if (data.Status == 2)
        this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: 'User Does not exist' });
      else if (data.Status == 3)
        this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: 'Invalid Password' });
      else {
        this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: 'Soething wet wrong' });
      }
    })
  }
}
