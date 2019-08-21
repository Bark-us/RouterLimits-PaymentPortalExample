import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BillingComponent } from './billing/billing.component';
import { ActivationComponent } from './activation/activation.component';


const routes: Routes = [
  { path: '', redirectTo: '/billing', pathMatch: 'full' },
  { path: 'billing', component: BillingComponent },
  { path: 'activate', component: ActivationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
