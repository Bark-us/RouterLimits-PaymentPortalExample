import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BillingAuthResponse } from 'src/app/models/billing';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticating = false;
  auth: BillingAuthResponse;

  constructor(
    private router: Router,
  ) {}

  isAuthenticated(): Observable<boolean> {

    return new Observable<boolean>(observer => {

      if (!this.auth || !this.auth.AccountId || !this.auth.AccountId) {
        observer.next(false);
        observer.complete();
      }

      observer.next(this.auth.ApiKey.length > 0 && this.auth.AccountId.length > 0);
      observer.complete();
    });
  }
}
