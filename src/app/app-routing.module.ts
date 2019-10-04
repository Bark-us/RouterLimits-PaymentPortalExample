import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivationComponent } from './activation/activation.component';
import { ActivationEmailComponent } from './activation/activation-email/activation-email.component';
import { ActivationSignupComponent } from './activation/activation-signup/activation-signup.component';
import { ActivationMessageComponent } from './activation/activation-message/activation-message.component';
import { BillingPaymentMethodsComponent } from './billing/billing-payment-methods/billing-payment-methods.component';
import { BillingHomeComponent } from './billing/billing-home/billing-home.component';
import { BillingSubscriptionsComponent } from './billing/billing-subscriptions/billing-subscriptions.component';
import { AuthGuardService as AuthGuard } from './authentication/auth-guard/auth-guard.service';
import { AuthenticationComponent } from './authentication/authentication.component';
import { BillingComponent } from './billing/billing.component';
import { ErrorComponent } from './error/error.component';
import { ActivationSubscriptionsComponent } from './activation/activation-subscriptions/activation-subscriptions.component';


const routes: Routes = [
  { path: '', redirectTo: '/billing', pathMatch: 'full' },
  { path: 'auth', component: AuthenticationComponent},
  { path: 'error', component: ErrorComponent},
  { path: 'billing',
    component: BillingComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', component: BillingHomeComponent},
      {path: 'payment', component: BillingPaymentMethodsComponent},
      {path: 'payments', redirectTo: 'payment', pathMatch: 'full'},
      {path: 'subscription', redirectTo: 'subscriptions', pathMatch: 'full'},
      {path: 'subscriptions', component: BillingSubscriptionsComponent},
      {path: '**', component: BillingHomeComponent},
    ]
  },
  { path: 'activate',
    component: ActivationComponent,
    children: [
      {path: '', redirectTo: 'email', pathMatch: 'full'},
      {path: 'email', component: ActivationEmailComponent},
      {path: 'signup', component: ActivationSignupComponent},
      {path: 'subscriptions', component: ActivationSubscriptionsComponent},
      {path: 'done', component: ActivationMessageComponent},
      {path: '**', component: ActivationEmailComponent},
    ]
  },
  {path: '**', component: BillingHomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
