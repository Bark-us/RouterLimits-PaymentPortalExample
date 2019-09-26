import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, config, observable } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';
import { BillingAuthResponse, Plan, AccountUpdateRequest, PaymentMethod, CardInfo, PaginatedPaymentMethods, PaginatedPlan } from './models/billing';
import { isNullOrUndefined, isNull } from 'util';
import { StorageMap } from '@ngx-pwa/local-storage';
import { AccountCreatedResponse, Account } from './models/account';
import { UserCreatedResponse } from './models/user';
import { AuthService } from './authentication/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RlAPIService {

  constructor(private http: HttpClient, private storageMap: StorageMap, private authService: AuthService) {}

  private billingApiKey = '';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  authenticate(jwt: string): Observable<BillingAuthResponse> {

    const resp: BillingAuthResponse = {
      ApiKey:   'e6999be8eee5ef9a4ae81e749ANDREWISCOOL77e2345967e14589abb',
      AccountId:   'vw63n2wz'
    };

    return this.POST({url: '/authenticate', body: { jwt }, options: this.httpOptions, mockData: resp}).pipe(
      map(i => {
        const item = i as any;
        return new BillingAuthResponse(
          item.apiKey,
          item.accountId
        );
      })
    );
  }

  checkEmailAvailability(email: string) {
    // No authentication required; send options
    return this.GET({base: environment.routerLimitsApi, url: '/users/email/' + email, options: this.httpOptions});
  }

  createAccount(userId: string, routerPairingCode?: number): Observable<AccountCreatedResponse> {

    // TODO: Add account model
    const resp = new AccountCreatedResponse({
      apiKey: 'e6999be8eee5ef9a4ae81e749ANDREWISCOOL77e2345967e14589abb',
      account: new Account({
        id: 'vw63n2wz',
        active: true,
        plan: new Plan({ id: 'vw63n2wx', name: 'Not so cool plan' })
      })
    });

    return this.POST({
      url: '/accounts',
      body: {userId, routerPairingCode},
      options: this.httpOptions,
      mockData: resp
    })
    .pipe(map(x =>
      JSON.parse(JSON.stringify(x), AccountCreatedResponse.reviver)));
  }

  createNewPaymentMethod(token: string, setDefault: boolean): Observable<PaymentMethod> {

    const resp = new PaymentMethod({
          id: 'card_77oi3jgfjm',
          isDefault: true,
          cardInfo: new CardInfo({brand: 'Master Card', expMonth: 7, expYear: 2020, last4: 4343})
        });

    return this.POST({
      url: '/accounts/' + '<<ACCOUNTID>>/paymentMethods',
      body: {token, setDefault},
      mockData: resp
    }).pipe(map(x =>
      JSON.parse(JSON.stringify(x), PaymentMethod.reviver)));
  }

  createUser(user: any): Observable<UserCreatedResponse> {
    // No authentication required; send options
    return this.POST({base: environment.routerLimitsApi, url: '/users', body: user, options: this.httpOptions})
    .pipe(map(x =>
      UserCreatedResponse.fromJSON(x)));
  }

  deletePaymentMethod(methodId: string): Observable<void> {

    return this.DELETE({ url: '/accounts/' + '<<ACCOUNTID>>/paymentMethods/' + methodId });
  }

  updateAccount(accountUpdateRequest: AccountUpdateRequest) {

    const jsonBody =  accountUpdateRequest.toJSON();
    return this.POST({url: '/accounts/' + '<<ACCOUNTID>>', body: jsonBody});
  }

  getAccountDetails(): Observable<Account> {

    const resp: Account = new Account({id: 'vw63n2wz', active: true, plan: new Plan ({id: 'vw63n2wx', name: 'Not so cool plan'})});

    return this.GET({
      url: '/accounts/' + '<<ACCOUNTID>>',
      mockData: resp
    }).pipe(map(x => Account.fromJSON(x)));
  }

  getAvailablePlans(startKey: string): Observable<PaginatedPlan> {

    const resp: Plan[] = [
      new Plan ({ id: 'ap77n2wz', name: 'Super Cool Plan'}),
      new Plan ({id: 'vw63n2wx', name: 'Not so cool plan'})
    ];

    return this.GET({
      url: '/plans',
      mockData: resp
    }).pipe(map(x =>
      JSON.parse(JSON.stringify(x), PaginatedPlan.reviver)));
  }

  getPaymentMethods(startKey: string): Observable<PaginatedPaymentMethods> {

    const resp = new PaginatedPaymentMethods({
      hasMore: false,
      data: [
        new PaymentMethod({
          id: 'card_34oi3j4fjm',
          isDefault: true,
          cardInfo: new CardInfo({ brand: 'Visa', expMonth: 3, expYear: 2023, last4: 4242 })
        }),
        new PaymentMethod({
          id: 'card_77uu7k4fpo',
          isDefault: false,
          cardInfo: new CardInfo({ brand: 'Master Card', expMonth: 5, expYear: 2019, last4: 2567 })
        })
      ]
    });

    return this.GET({
      url: '/accounts/' + '<<ACCOUNTID>>/paymentMethods',
      mockData: resp
    }).pipe(map(x =>
      JSON.parse(JSON.stringify(x), PaginatedPaymentMethods.reviver)));
  }

  setDefaultPaymentMethod(methodId: string): Observable<void> {

    return this.POST({
      url: '/accounts/' + '<<ACCOUNTID>>/paymentMethods/' + methodId + '/setDefault',
      body: {},
      mockData: {}
    });
  }

  GET(params: {base?: string, url: string, mockData?: any, options?: any }) {

    // tslint:disable-next-line: variable-name
    let _baseApiUrl = environment.billingApi;

    if (!isNullOrUndefined(params.base)) {
      _baseApiUrl = params.base;
    }

    if (environment.mockBillingAPI && (_baseApiUrl === environment.billingApi)) {
      if (isNullOrUndefined(params.mockData)) { params.mockData = {}; }
      return this.makeObservable(params.mockData, 200);
    }

    // If options are passed in we can go ahead and make the GET call
    if (!isNullOrUndefined(params.options)) {
      return this.http.get(_baseApiUrl + params.url, params.options);
    }


    if (isNullOrUndefined(this.authService.auth.ApiKey) || isNullOrUndefined(this.authService.auth.AccountId)) {
      throw new Error('Not Authorized');
    }

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': this.authService.auth.ApiKey
      })
    };

    return this.http.get(_baseApiUrl + params.url.replace('<<ACCOUNTID>>', this.authService.auth.AccountId), options);
  }

  POST(params: {base?: string, url: string, body: any, mockData?: any, options?: any}): Observable<any> {

    // tslint:disable-next-line: variable-name
    let _baseApiUrl = environment.billingApi;

    if (!isNullOrUndefined(params.base)) {
      _baseApiUrl = params.base;
    }

    if (environment.mockBillingAPI && (_baseApiUrl === environment.billingApi)) {
      let data = {};
      if (!isNullOrUndefined(params.mockData)) { data = params.mockData; }
      // Empty response
      return this.makeObservable(data, 0);
    }

    // If options are passed in we can go ahead and make the POST call
    if (!isNullOrUndefined(params.options)) {
      return this.http.post(_baseApiUrl + params.url, params.body, params.options);
    }

    if (isNullOrUndefined(this.authService.auth.ApiKey) || isNullOrUndefined(this.authService.auth.AccountId)) {
      throw new Error('Not Authorized');
    }

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': this.authService.auth.ApiKey
      })
    };

    // Make the call to update the subscription
    return this.http.post(_baseApiUrl + params.url.replace('<<ACCOUNTID>>', this.authService.auth.AccountId), params.body, options);
  }

  DELETE(params: {url: string, mockData?: any, options?: any }) {

    if (environment.mockBillingAPI) {
      if (isNullOrUndefined(params.mockData)) { params.mockData = {}; }
      return this.makeObservable(params.mockData, 200);
    }

    // If options are passed in we can go ahead and make the GET call
    if (!isNullOrUndefined(params.options)) {
      return this.http.delete(environment.billingApi + params.url, params.options);
    }

    if (isNullOrUndefined(this.authService.auth.ApiKey) || isNullOrUndefined(this.authService.auth.AccountId)) {
      throw new Error('Not Authorized');
    }

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': this.authService.auth.ApiKey
      })
    };

    return this.http.delete(environment.billingApi + params.url.replace('<<ACCOUNTID>>', this.authService.auth.AccountId), options);
  }

  addBasicAuth(username, password) {
    if (!password) {
      password = '';
    }
    else { password = ':' + password; }

    return 'Basic ' + btoa(username + password);
  }

  makeObservable<T>(obj: T, delay: number = 500): Observable < T > {
    return new Observable<T>(observer => {
      setTimeout(() => {
        observer.next(obj);
        observer.complete();
      }, delay);
    });
  }
}
