import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { FacedetectionComponent } from './facedetection/facedetection.component';
import { HttpClientModule } from '@angular/common/http';
import { WebcamModule } from 'ngx-webcam';
import { EnrollmentComponent } from './enrollment/enrollment.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardModule } from 'primeng/card';
import { StepsModule } from 'primeng/steps';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    WelcomeComponent,
    FacedetectionComponent,
    EnrollmentComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    WebcamModule,
    FormsModule,
    DropdownModule,
    BrowserAnimationsModule,
    CardModule,
    StepsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
