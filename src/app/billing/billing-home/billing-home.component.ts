import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RlAPIService } from 'src/app/rl-api.service';
import { PaymentMethod } from 'src/app/models/billing';
import { BillingService } from '../billing.service';
import { forkJoin } from 'rxjs';
import { LoggerService } from 'src/app/logger.service';

@Component({
  selector: 'app-billing-home',
  templateUrl: './billing-home.component.html',
  styleUrls: ['./billing-home.component.sass']
})
export class BillingHomeComponent implements OnInit {

  loaded: boolean;
  title: string;
  plusString: string;
  currentPlanString: string;
  lastFour: string;
  router: Router;
  defaultPaymentMethod: PaymentMethod;
  isAccountActive = true;
  NO_PLAN_STRING = ' n/a ';

  constructor(router: Router, private api: RlAPIService, private billingService: BillingService, private logger: LoggerService) {
    this.loaded = false;
    this.router = router;
    this.title = 'Your App Title Here';
    this.plusString = 'Plus';
    this.currentPlanString = '';
    this.lastFour = '';
    this.defaultPaymentMethod = null;
  }

  ngOnInit() {
    const one = this.billingService.GetDefaultPaymentMethodAsync();
    const two = this.billingService.GetAccountAsync();
    forkJoin(one, two).subscribe(results => {
      this.defaultPaymentMethod = results[0];
      const acct = results[1];

      if (acct && acct.Plan && acct.Plan.Name) {
        this.currentPlanString = acct.Plan.Name;
      } else {
        this.currentPlanString = this.NO_PLAN_STRING;
      }

      this.isAccountActive = acct.Active;

      if (!this.defaultPaymentMethod) {
        // tslint:disable-next-line: max-line-length
        this.logger.Caution('Account Activation Incomplete: \nYou must enter a valid payment method to login to your account.', 'Okay', 10000);
        // return this.router.navigateByUrl('/billing/payment');
        // return false;
      } else if (!this.currentPlanString || this.currentPlanString === this.NO_PLAN_STRING || !this.isAccountActive) {
        this.logger.Caution('Account Activation Incomplete: \nSelect a plan to activate your account.', 'Okay', 10000);
        // return this.router.navigateByUrl('/billing/subscriptions');
      }

      this.loaded = true;
    },
    err => {
      console.error(err);
      if (err && err.status && err.status === 401) {
        return this.router.navigateByUrl('error');
      }
      this.currentPlanString = this.NO_PLAN_STRING;
    });
  }

  paymentMethodsClicked() {
    this.router.navigateByUrl('/billing/payment');
  }

  modifySubscriptionClicked() {
    this.router.navigateByUrl('/billing/subscriptions');
  }
}
