import { Component, OnInit } from '@angular/core';
import { Token } from 'ngx-stripe';
import { PaymentMethod } from 'src/app/models/billing';
import { BillingService } from '../billing.service';
import { RlAPIService } from 'src/app/rl-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-billing-payment-methods',
  templateUrl: './billing-payment-methods.component.html',
  styleUrls: ['./billing-payment-methods.component.sass']
})
export class BillingPaymentMethodsComponent implements OnInit {

  constructor(
    private billingService: BillingService,
    private api: RlAPIService,
    private snackBar: MatSnackBar) { }

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
      return this.snackBar.open('You cannot delete your default payment method.', 'Okay', {duration: 2000});
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
}
