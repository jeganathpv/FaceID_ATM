import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { FacedetectionComponent } from './facedetection/facedetection.component';



const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'facedetection', component: FacedetectionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
