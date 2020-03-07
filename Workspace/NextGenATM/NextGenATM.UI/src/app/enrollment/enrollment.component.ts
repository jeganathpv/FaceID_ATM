import { Component, OnInit } from '@angular/core';
import { MiddlewareService } from '../middleware.service';
import { AuthState } from '../models';


@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.css']
})
export class EnrollmentComponent implements OnInit {
  authStatus: AuthState;

  constructor(private middlewareService: MiddlewareService) {

  }

  ngOnInit() {
    this.authStatus = this.middlewareService.getAuthStatus();
  }


}
