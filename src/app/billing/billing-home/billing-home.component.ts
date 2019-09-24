import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RlAPIService } from 'src/app/rl-api.service';
import { PaymentMethod } from 'src/app/models/billing';
import { BillingService } from '../billing.service';
import { isNullOrUndefined } from 'util';
import { finalize } from 'rxjs/operators';

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

  private defaultPaymentLoaded = false;
  private planLoaded = false;

  constructor(router: Router, private billingApi: RlAPIService, private billingService: BillingService) {
    this.loaded = false;
    this.router = router;
    this.title = 'Your App Title Here';
    this.plusString = 'Plus';
    this.currentPlanString = '';
    this.lastFour = '';
    this.defaultPaymentMethod = null;
  }

  ngOnInit() {
    this.billingService.GetDefaultPaymentMethodAsync().pipe(
      finalize(() => {
        this.defaultPaymentLoaded = true;
        this.checkLoaded();
    }))
    .subscribe((pmnt) => {
      this.defaultPaymentMethod = pmnt;
    },
    // Catch
    (err) => {
      if (err && err.status && err.status === 401) {
        return this.router.navigateByUrl('error');
      }
      this.defaultPaymentMethod = null;
    });

    this.billingService.GetAccountAsync()
    .pipe(
      finalize(() => {
        this.planLoaded = true;
        this.checkLoaded();
    }))
    .subscribe(acct => {
      if (acct && acct.Plan && acct.Plan.Name) {
        this.currentPlanString = acct.Plan.Name;
      } else {
        this.currentPlanString = ' n/a ';
      }
    },
    err => {
      if (err && err.status && err.status === 401) {
        return this.router.navigateByUrl('error');
      }
      this.currentPlanString = ' n/a ';
    });
  }

  checkLoaded() {
    this.loaded = (this.planLoaded && this.defaultPaymentLoaded);
  }

  paymentMethodsClicked() {
    this.router.navigateByUrl('/billing/payment');
  }

  modifySubscriptionClicked() {
    this.router.navigateByUrl('/billing/subscriptions');
  }
}
