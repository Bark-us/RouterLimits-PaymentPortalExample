import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivateService } from '../activate/activate.service';
import { Account } from 'src/app/models/account';
import { RlAPIService } from '../../rl-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageMap } from '@ngx-pwa/local-storage';
import { AuthService } from '../../authentication/auth/auth.service';
import { Plan } from '../../models/billing';
import { Token } from 'ngx-stripe';
import { BillingService } from '../../billing/billing.service';
import { forkJoin } from 'rxjs';
import { isNullOrUndefined } from 'util';

export enum ActivationSubPage {
  SelectAPlan,
  PaymentInformation
}

@Component({
  selector: 'app-activation-subscriptions',
  templateUrl: './activation-subscriptions.component.html',
  styleUrls: ['./activation-subscriptions.component.sass']
})
export class ActivationSubscriptionsComponent implements OnInit {
  stripeToken: Token;
  selectedPlan: Plan;
  account: Account;
  page = ActivationSubPage.SelectAPlan;
  loaded = false;
  plans: Plan[] = [];

  constructor(
    private router: Router,
    private activate: ActivateService,
    private billingService: BillingService,
    private api: RlAPIService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    const one = this.billingService.GetAvailablePlansAsync(null);
    const two = this.billingService.GetAccountAsync();
    forkJoin(one, two).subscribe(results => {
      this.plans = [];
      const acct = results[1];

      results[0].forEach(p => {
        if (isNullOrUndefined(p.Unavailable) || p.Unavailable === false) {
          this.plans.push(p);
        }
      });

      if (!this.plans || !this.plans.length) {
        this.openSnackBar('Error 5965: No available plans found', 'Okay', 30000);
        return this.router.navigateByUrl('error');
      }

      this.selectedPlan = this.plans[0];

      this.account = acct;

      this.loaded = true;
    },
    err => {
      console.error(err);
      if (err && err.message) {
        this.openSnackBar(err.message, 'Okay', 30000);
      }
      return this.router.navigateByUrl('error');
    });
  }

  receiveNewStripeToken($event) {

    this.loaded = false;
    this.stripeToken = $event;

    // Create new card payment method and set as default
    this.api.createNewPaymentMethod(this.stripeToken.id, true).subscribe(
      newMethod => {
        this.activate.updateAccount(true, this.selectedPlan.Id)
        .then((data: any) => {
            this.router.navigateByUrl('activate/done');
        })
        .catch((err) => {
          if (err.error && err.error.message) {
            this.loaded = true;
            return this.openSnackBar(err.error.message, 'Okay', 10000);
          }
        });
      },
      err => {
        this.loaded = true;
        return this.openSnackBar(err.error.message, 'Okay', 10000);
      }
    );
  }

  selectPlan() {
    this.page = ActivationSubPage.PaymentInformation;
  }

  backToPlans() {
    this.page = ActivationSubPage.SelectAPlan;
  }

  openSnackBar(message: string, action: string, delay: number = 2000) {
    this.snackBar.open(message, action, {
      duration: delay,
    });
  }
}
