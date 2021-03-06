import { Component, OnInit } from '@angular/core';
import { Token } from 'ngx-stripe';
import { PaymentMethod } from 'src/app/models/billing';
import { BillingService } from '../billing.service';
import { RlAPIService } from 'src/app/rl-api.service';
import { LoggerService } from 'src/app/logger.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-billing-payment-methods',
  templateUrl: './billing-payment-methods.component.html',
  styleUrls: ['./billing-payment-methods.component.sass']
})
export class BillingPaymentMethodsComponent implements OnInit {

  constructor(
    private billingService: BillingService,
    private api: RlAPIService,
    private logger: LoggerService,
    private router: Router) { }

  paymentMethods = [];
  stripeToken: Token;

  ngOnInit() {
    this.billingService.GetAvailablePaymentMethodsAsync(false).subscribe( pmt => {
      if (!pmt) { return this.paymentMethods = []; }
      this.paymentMethods = pmt;
    });
  }

  receiveNewStripeToken($event) {
    this.stripeToken = $event;

    // Create new card payment method and set as default
    this.api.createNewPaymentMethod(this.stripeToken.id, true).subscribe(
      newMethod => {
        // Refresh the payment methods in the billing service
        this.refreshPayments();
      },
      err => {
        console.log(err);
      }
    );
  }

  deletePaymentMethod(method: PaymentMethod, index: number) {

    if (method.IsDefault) {
      return this.logger.Error('You cannot delete your default payment method.', 'Okay', 2000);
    }

    this.api.deletePaymentMethod(method.Id).subscribe(() => {
      // Refresh the payment methods in the billing service
      this.refreshPayments();
    },
    err => {
      console.log(err);
    });
  }

  setAsDefault(method: PaymentMethod, index: number) {
    this.api.setDefaultPaymentMethod(method.Id).subscribe(() => {
      // Refresh the payment methods in the billing service
      this.refreshPayments();
    });
  }

  refreshPayments() {
    this.billingService.GetAvailablePaymentMethodsAsync(true).subscribe(pmt => {
      this.paymentMethods = pmt;
    });
  }

  returnHome(): void {
    this.router.navigateByUrl('billing');
  }
}
