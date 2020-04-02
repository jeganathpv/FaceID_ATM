import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnrollmentComponent } from './enrollment/enrollment.component';
import { UrlselectorComponent } from './urlselector/urlselector.component';
import { AtmFlowComponent } from './atm-flow/atm-flow.component';


const routes: Routes = [
  { path: '', component: UrlselectorComponent , pathMatch:'full'},
  { path: 'enroll', component: UrlselectorComponent  , pathMatch:'full'},
  { path: 'enrollment', component: EnrollmentComponent  , pathMatch:'full' },
  { path: 'atm-flow',component: AtmFlowComponent , pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes , { useHash: true }), ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
