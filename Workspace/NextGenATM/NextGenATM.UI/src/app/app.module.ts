import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

import { FacedetectionComponent } from './facedetection/facedetection.component';
import { HttpClientModule } from '@angular/common/http';
import { WebcamModule } from 'ngx-webcam';
import { EnrollmentComponent } from './enrollment/enrollment.component';
import { LoginComponent } from './login/login.component';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardModule } from 'primeng/card';
import { StepsModule } from 'primeng/steps';
import { CarouselModule } from 'primeng/carousel';
import { QRCodeModule } from 'angularx-qrcode';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { QrscannerComponent } from './qrscanner/qrscanner.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { UrlselectorComponent } from './urlselector/urlselector.component';
import { AtmFlowComponent } from './atm-flow/atm-flow.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FacedetectionComponent,
    EnrollmentComponent,
    LoginComponent,
    QrscannerComponent,
    UrlselectorComponent,
    AtmFlowComponent,
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
    StepsModule,
    CarouselModule,
    QRCodeModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    ZXingScannerModule,
    ReactiveFormsModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
