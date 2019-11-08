import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { first } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RlAPIService } from '../rl-api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.sass']
})
export class AuthenticationComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private api: RlAPIService,
    private router: Router,
    private ngZone: NgZone,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('Called Authenticate');
    if (this.authService.isAuthenticating) {
      return false;
    }

    this.authenticate('');
  }

  async authenticate(routeURL) {

    if (this.authService.isAuthenticating) { return; }
    this.authService.isAuthenticating = true;
    try {
      const params = await this.route.queryParams.pipe(first()).toPromise();
      const jwt = params.jwt;
      const helper = new JwtHelperService();
      const token = helper.decodeToken(jwt);
      const action = token.action;

      const auth = await this.api.authenticate(params.jwt).pipe(first()).toPromise();

      this.authService.auth = auth;

      this.ngZone.run(() => {
        this.authService.isAuthenticating = false;

        if (!action) {
          return this.router.navigateByUrl(routeURL);
        }

        switch (action) {
          case 'AppMenu':
            this.authService.isInApp = true;
            return this.router.navigateByUrl(routeURL);
            break;
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
