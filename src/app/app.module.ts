import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../material-module';
import { NgxStripeModule } from 'ngx-stripe';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BillingComponent } from './billing/billing.component';
import { ActivationComponent } from './activation/activation.component';
import { ActivationEmailComponent } from './activation/activation-email/activation-email.component';
import { ActivationSignupComponent } from './activation/activation-signup/activation-signup.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ActivateService } from './activation/activate/activate.service';
import { HttpClientModule } from '@angular/common/http';
import { ActivationMessageComponent } from './activation/activation-message/activation-message.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { BillingHomeComponent } from './billing/billing-home/billing-home.component';
import { BillingPaymentMethodsComponent } from './billing/billing-payment-methods/billing-payment-methods.component';
import { BillingSubscriptionsComponent } from './billing/billing-subscriptions/billing-subscriptions.component';
import { CreditCardFormComponent } from './billing/credit-card-form/credit-card-form.component';
import { environment } from 'src/environments/environment';
import { StorageModule } from '@ngx-pwa/local-storage';
import { NavbarComponent } from './navigation/navbar/navbar.component';
import { ConfirmDialogComponent } from './dialogs/confirm/confirm-dialog.component';
import { ErrorComponent } from './error/error.component';
import { FooterComponent } from './navigation/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    BillingComponent,
    ActivationEmailComponent,
    ActivationSignupComponent,
    ActivationComponent,
    ActivationMessageComponent,
    AuthenticationComponent,
    BillingHomeComponent,
    BillingPaymentMethodsComponent,
    BillingSubscriptionsComponent,
    ConfirmDialogComponent,
    CreditCardFormComponent,
    NavbarComponent,
    ErrorComponent,
    FooterComponent
  ],
  imports: [
    NgxStripeModule.forRoot(environment.stripePublicKey),
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule, FormsModule,
    FlexLayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    StorageModule.forRoot({ IDBNoWrap: true })
  ],
  entryComponents: [ ConfirmDialogComponent ],
  providers: [ActivateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
