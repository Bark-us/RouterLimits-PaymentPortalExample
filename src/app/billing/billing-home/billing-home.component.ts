import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RlAPIService } from 'src/app/rl-api.service';
import { PaymentMethod, AccountUpdateRequest } from 'src/app/models/billing';
import { BillingService } from '../billing.service';
import { isNullOrUndefined } from 'util';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  private defaultPaymentLoaded = false;
  private planLoaded = false;

  constructor(router: Router, private api: RlAPIService, private billingService: BillingService, private snackBar: MatSnackBar) {
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
      this.isAccountActive = acct.Active;
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

  reactivateAccount(): void {

    if (this.isAccountActive) { return; }

    // Subscribes to hard coded essentials plan id
    const updateReq = new AccountUpdateRequest({active: true, planId: 'ybpn94jx'});
    this.api.updateAccount(updateReq).subscribe((ex) => {

      this.snackBar.open('Account re-activated.', 'Okay', {
        duration: 2000,
      });
      this.router.navigateByUrl('/billing/subscriptions');
    },
    error => {
      this.snackBar.open('Error: Account could not be re-activated.', 'Okay', {
        duration: 4000,
      });
      console.error(error);
    });
  }
}
