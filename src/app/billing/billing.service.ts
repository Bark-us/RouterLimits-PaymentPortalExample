import { Injectable } from '@angular/core';
import { Plan, PaymentMethod, PaginatedPaymentMethods, PaginatedPlan } from '../models/billing';
import { Account } from '../models/account';
import { RlAPIService } from '../rl-api.service';
import { Observable, empty, observable, EMPTY, of } from 'rxjs';
import { expand, reduce, takeWhile } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  constructor(private api: RlAPIService) {
    // this.LoadAvailablePlans();
    // this.LoadPaymentMethods();
  }

  private availablePlans: Plan[] = [];
  private paymentMethods: PaymentMethod[] = [];
  private account: Account = null;
  private defaultPaymentMethodIndex = -1;

  GetDefaultPaymentMethod(): PaymentMethod {
    return this.paymentMethods[this.defaultPaymentMethodIndex];
  }

  GetDefaultPaymentMethodAsync(force?: boolean): Observable<PaymentMethod> {

    return new Observable( observer => {
      if (this.paymentMethods.length > 0 && !force) {
        observer.next(this.paymentMethods[this.defaultPaymentMethodIndex]);
        observer.complete();
      }

      this.LoadPaymentMethods().subscribe(() => {
        if (this.defaultPaymentMethodIndex < 0) {
          return observer.error('No Default Payment Method');
        }

        observer.next(this.paymentMethods[this.defaultPaymentMethodIndex]);
        observer.complete();
      },
      err => {
        observer.error(err);
      });
    });
  }

  GetAvailablePaymentMethodsAsync(force?: boolean): Observable<PaymentMethod[]> {

    return new Observable( observer => {
      if (this.paymentMethods.length > 0 && !force) {
        observer.next(this.paymentMethods);
        observer.complete();
      }

      this.LoadPaymentMethods().subscribe(() => {
        observer.next(this.paymentMethods);
        observer.complete();
      },
      err => {
        observer.error(err);
      });
    });
  }

  GetAvailablePlansAsync(force?: boolean): Observable<Plan[]> {

    return new Observable( observer => {
      if (this.availablePlans.length > 0 && !force) {
        observer.next(this.availablePlans);
        observer.complete();
      }

      this.LoadAvailablePlans().subscribe( plans => {
        observer.next(plans);
        observer.complete();
      },
      err => {
        observer.error(err);
      });
    });
  }

  GetAccountAsync(force?: boolean): Observable<Account> {

    return new Observable( observer => {
      if (!isNullOrUndefined(this.account) && !force) {
        observer.next(this.account);
        observer.complete();
      }

      this.api.getAccountDetails().subscribe( account => {
        observer.next(account);
        observer.complete();
      },
      err => {
        observer.error(err);
      });
    });
  }

  GetAvailablePaymentMethods(): PaymentMethod[] {
    if (!this.paymentMethods.length) {
      // TODO: request it from the server
    } else {
      return this.paymentMethods;
    }
  }

  LoadAvailablePlans(limit = 20): Observable<Plan[]> {

    this.availablePlans = [];

    return new Observable<Plan[]>( observer => {
      this.api.getAvailablePlans(null).pipe(
        expand(data => {

          if (!data || !data.Data) {
            return of(null);
          }

          data.Data.forEach(item => {
            this.availablePlans.push(item);
          });

          if (!data.HasMore || this.availablePlans.length >= limit)  {
            return of(null);
          } else {
            return this.api.getAvailablePlans(data.LastEvaluatedKey);
          }
        }),
        takeWhile((value: PaginatedPlan | Observable<void>, index: number) => {
          if (value === null) {
            return false;
          }
          return true;
        }),
        reduce((acc: Plan[], data: PaginatedPlan) => {
          const total = acc.concat(data.Data);
          return total;
        })
      ).subscribe(plans => {
        observer.next(this.availablePlans);
        observer.complete();
      },
      err => {
        observer.error(err);
      });
    });
  }

  LoadPaymentMethods(limit = 100): Observable<PaymentMethod[]> {
    this.defaultPaymentMethodIndex = 0;
    this.paymentMethods = [];

    return new Observable<PaymentMethod[]>(observer => {
      this.api.getPaymentMethods(null).pipe(
        expand(data => {

          if (!data || !data.Data) {
            return of(null);
          }

          data.Data.forEach(item => {
            this.paymentMethods.push(item);
            if (item.IsDefault) { this.defaultPaymentMethodIndex = this.paymentMethods.length - 1; }
          });

          if (!data.HasMore || this.paymentMethods.length >= limit)  {
            return of(null);
          } else {
            return this.api.getPaymentMethods(data.LastEvaluatedKey);
          }
        }),
        takeWhile((value: PaginatedPaymentMethods | Observable<void>, index: number) => {
          if (value === null) {
            return false;
          }
          return true;
        }),
        reduce((acc: PaymentMethod[], data: PaginatedPaymentMethods) => {
          const total = acc.concat(data.Data);
          return total;
        })
      ).subscribe((paymentMethods) => {
        observer.next(paymentMethods);
        observer.complete();
      });
    });
  }

  GetPaymentMethods() {

  }
}
