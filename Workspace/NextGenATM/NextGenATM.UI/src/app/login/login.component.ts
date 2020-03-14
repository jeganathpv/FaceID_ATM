import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MiddlewareService } from '../middleware.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Output() stateChange = new EventEmitter;
  username: string;
  password: string;
  constructor(private middlewareService: MiddlewareService) { }

  ngOnInit() {
  }

  submitForm() {
    this.middlewareService.login({ "username": this.username, "password": this.password }).subscribe((data: any) => {
      // update the authstatus in middlewareseervice
      this.middlewareService.authStatus = data.Status;
      if (data.Status == 1)
        this.stateChange.emit();
    })
  }
}
