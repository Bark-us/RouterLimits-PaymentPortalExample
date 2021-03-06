import { Component, OnInit, Inject } from '@angular/core';
import { Plan, AccountUpdateRequest } from 'src/app/models/billing';
import { Account } from 'src/app/models/account';
import { RlAPIService } from 'src/app/rl-api.service';
import { map, finalize } from 'rxjs/operators';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/dialogs/confirm/confirm-dialog.component';
import { BillingService } from '../billing.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { LoggerService } from 'src/app/logger.service';

@Component({
  selector: 'app-billing-subscriptions',
  templateUrl: './billing-subscriptions.component.html',
  styleUrls: ['./billing-subscriptions.component.sass']
})
export class BillingSubscriptionsComponent implements OnInit {

  constructor(
    private router: Router,
    private api: RlAPIService,
    private billingService: BillingService,
    public dialog: MatDialog,
    private logger: LoggerService) { }

  selectedPlan: string;
  selectedPlanName: string;
  account: Account;
  loaded = false;
  defaultPaymentMethod = null;
  plans: Plan[] = [];

  ngOnInit() {
    const one = this.billingService.GetAvailablePlansAsync(null);
    const two = this.billingService.GetAccountAsync();
    const three = this.billingService.GetDefaultPaymentMethodAsync();
    forkJoin(one, two, three).subscribe(results => {
      this.plans = [];
      const acct = results[1];
      this.defaultPaymentMethod = results[2];

      results[0].forEach(p => {
        if (isNullOrUndefined(p.Unavailable) || p.Unavailable === false) {
          this.plans.push(p);
        }
      });

      if (!this.plans || !this.plans.length) {
        this.logger.Error('Error 5966: No available plans found', 'Okay', 30000);
        return this.router.navigateByUrl('error');
      }

      // TODO: Add error handling in case of no account
      if (acct && acct.Plan && acct.Plan.Name) {
        this.selectedPlan = acct.Plan.Id;
        this.selectedPlanName = acct.Plan.Name;
      }
      this.account = acct;

      this.loaded = true;
    },
    err => {
      console.error(err);
      if (err && err.status && err.status === 401) {
        return this.router.navigateByUrl('error');
      }
    });
  }

  changePlan(): void {

    if (!this.defaultPaymentMethod) {
        const snackMsg = 'You must enter payment information before you can change plans.';
        this.logger.Error(snackMsg, 'Okay', 4000);
        this.router.navigateByUrl('/billing/payment');
        return;
    }

    const updateReq = new AccountUpdateRequest({planId: this.selectedPlan});
    this.plans.forEach(element => {
      if (element.Id === this.selectedPlan) {this.selectedPlanName = element.Name; return false; }
    });
    this.api.updateAccount(updateReq).subscribe((ex) => {
      if (!this.account.Active) {
        this.account.Active = true;
        return this.logger.Success('Account activated on ' + this.selectedPlanName, 'Okay', 5000);
      }

      this.logger.Success('Plan updated to ' + this.selectedPlanName, 'Okay', 2000);
    },
    error => {

      let snackMsg = 'Error changing plan.';

      if (error.status === 409 && error.error && error.error.code) {
        if (error.error.code === 'NO_PAYMENT_METHOD') {
          snackMsg = 'You must enter payment information before you can change plans.';
          this.logger.Error(snackMsg, 'Okay', 4000);
          return this.router.navigateByUrl('/billing/payment');
        } else if (error.error.code === 'PAYMENT_FAILED') {
          snackMsg = 'Your plan was not updated. ' +
          'We were not able to charge your card. ' +
          'Make sure your payment information is up to date then try again.';
        }
      }
      this.logger.Error(snackMsg, 'Okay', 4000);
      console.error(error);
    });
  }

  cancelAccount(): void {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {title: 'Cancel Account', message: 'Are you sure you would like to cancel your account?', affirmText: 'No', denyText: 'Okay'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        return;
      }

      const updateReq = new AccountUpdateRequest({active: false});
      this.api.updateAccount(updateReq).subscribe((ex) => {
        this.account.Active = false;
        this.logger.Success('Account cancelled.', 'Okay', 2000);
      },
      error => {
        this.logger.Error('Error: Account not cancelled.', 'Okay', 4000);
        console.error(error);
      });
    });
  }

  reactivateAccount(): void {

    // Subscribes to hard coded essentials plan id
    const updateReq = new AccountUpdateRequest({active: true, planId: 'ybpn94jx'});
    this.api.updateAccount(updateReq).subscribe((ex) => {
      this.account.Active = true;
      this.selectedPlan = this.plans[0].Id;
      this.selectedPlanName = this.plans[0].Name;
      this.logger.Success('Account activated.', 'Okay', 2000);
    },
    error => {
      this.logger.Error('Error: Account could not be activated.', 'Okay', 4000);
      console.error(error);
    });
  }

  returnHome(): void {
    this.router.navigateByUrl('billing');
  }
}
