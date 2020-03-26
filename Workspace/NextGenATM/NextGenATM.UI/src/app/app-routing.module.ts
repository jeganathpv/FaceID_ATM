import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { FacedetectionComponent } from './facedetection/facedetection.component';
import { EnrollmentComponent } from './enrollment/enrollment.component';
import { QrscannerComponent } from './qrscanner/qrscanner.component';
import { UrlselectorComponent } from './urlselector/urlselector.component';



const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'qr', component: QrscannerComponent },
  { path: 'facedetection', component: FacedetectionComponent },
  { path: 'enrollment', component: EnrollmentComponent  , pathMatch:'full' },
  { path: 'enroll', component: UrlselectorComponent  , pathMatch:'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes , { useHash: true }), ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
