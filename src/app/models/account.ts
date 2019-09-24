import { Plan, PlanJSON } from './billing';

interface AccountJSON {
  id: string;
  active: boolean;
  plan?: PlanJSON;
}

export class Account {
  constructor({
    id,
    active,
    plan
  }: { id?: string; active?: boolean; plan?: Plan; } = {}) {
    this.Id = id;
    this.Active = active;
    this.Plan = plan;
  }

  Id: string;
  Active: boolean;
  Plan?: Plan;

  static fromJSON(json: AccountJSON): Account {
    const account = Object.create(Account.prototype);
    return Object.assign(account, {
      Id: json.id,
      Active: json.active,
      Plan: Plan.fromJSON(json.plan),
    });
  }

  static reviver(key: string, value: any): any {
    return key === '' ? Account.fromJSON(value) : value;
  }

  toJSON(): AccountJSON {
    return Object.assign({}, {
      id: this.Id.toString(),
      active: this.Active,
      plan: this.Plan.toJSON()
    });
  }
}

interface AccountCreatedResponseJSON {
  apiKey: string;
  account: AccountJSON;
}

export class AccountCreatedResponse {
  constructor({
    account,
    apiKey
  }: { account?: Account; apiKey?: string; } = {}) {
    this.Account = account;
    this.ApiKey = apiKey;
  }

  ApiKey: string;
  Account: Account;

  static fromJSON(json: AccountCreatedResponseJSON): AccountCreatedResponse {
    const account = Object.create(AccountCreatedResponse.prototype);
    return Object.assign(account, {
      ApiKey: json.apiKey,
      Account: Account.fromJSON(json.account)
    });
  }

  static reviver(key: string, value: any): any {
    return key === '' ? AccountCreatedResponse.fromJSON(value) : value;
  }

  toJSON(): AccountCreatedResponseJSON {
    return Object.assign({}, {
      apiKey: this.ApiKey.toString(),
      account: this.Account.toJSON()
    });
  }
}
