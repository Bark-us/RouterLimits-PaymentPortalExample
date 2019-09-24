import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageMap } from '@ngx-pwa/local-storage';
import { map, catchError, first, pairwise } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { BillingAuthResponseSchema, BillingAuthResponse } from 'src/app/models/billing';
import { Router, ActivatedRoute } from '@angular/router';
import { RlAPIService } from 'src/app/rl-api.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticating = false;
  routeListener;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storageMap: StorageMap,
    private api: RlAPIService,
    private ngZone: NgZone,
    private authService: AuthService,
  ) {
  }

  onRouteChange() {
    this.routeListener = this.router.events.subscribe((event) => { console.log(event); });
  }

  OnDestroy() {
    this.routeListener.unsubscribe();
  }

  isAuthenticated(): Observable<boolean> {

    return this.storageMap.get('auth').pipe(
      map((data: any) => {
        if (isNullOrUndefined(data) || isNullOrUndefined(data.ApiKey) || isNullOrUndefined(data.AccountId)) { return false; }
        // TODO: Make sure API key is still is valid
        return data.ApiKey.length > 0 && data.AccountId.length > 0;
      })
    );
  }

  async authenticate(routeURL) {

    if (this.isAuthenticating) { return; }
    this.isAuthenticating = true;
    try {
      const params = await this.route.queryParams.pipe(first()).toPromise();
      const jwt = params.jwt;
      const helper = new JwtHelperService();
      const token = helper.decodeToken(jwt);
      const action = token.action;

      const auth = await this.api.authenticate(params.jwt).pipe(first()).toPromise();
      await this.storageMap.set('auth', auth).toPromise();

      this.ngZone.run(() => {
        this.isAuthenticating = false;

        if (!action) {
          return this.router.navigateByUrl(routeURL);
        }

        switch (action) {
          case 'UpdatePaymentInformation':
            this.router.navigateByUrl('/billing/payment');
            break;
          case 'ChangePlan':
              this.router.navigateByUrl('/billing/subscription');
              break;
          default:
            return this.router.navigateByUrl('billing');
        }
      });

    } catch (error) {
        this.router.navigateByUrl('error');
        console.error(error);
    }
  }
}
