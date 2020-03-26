import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MiddlewareService } from '../middleware.service';

@Component({
  selector: 'app-urlselector',
  templateUrl: './urlselector.component.html',
  styleUrls: ['./urlselector.component.css']
})
export class UrlselectorComponent implements OnInit {
  validUrl:boolean = true;
  urlForm:FormGroup;
  constructor(  private formBuilder: FormBuilder,private router: Router , private middlewareService:MiddlewareService) { }


  ngOnInit() {
    this.urlForm = this.formBuilder.group ({url:''})
  }

  onSubmit(formValue){
    console.log(formValue);
    this.middlewareService.setBaseUrl(formValue.url)
    this.router.navigate(['/enrollment'])
  }
}
