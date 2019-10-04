import { isNullOrUndefined } from 'util';

export const BillingAuthResponseSchema: any = {
  type: 'object',
  properties: {
    ApiKey: { type: 'string' },
    AccountId: { type: 'string' }
  },
  required: ['AccountId', 'ApiKey'],
  additionalProperties: false
};

export interface BillingAuthResponseJSON {
  apiKey: string;
  accountId: string;
}

export class BillingAuthResponse {
  constructor(apiKey?: string, accountId?: string) {
    this.ApiKey = apiKey;
    this.AccountId = accountId;
  }

  ApiKey: string;
  AccountId: string;

  // static fromJSON(json: BillingAuthResponseJSON): BillingAuthResponse {
  //   if (!json) {
  //     return undefined;
  //   }
  //   const billingAuth = Object.create(BillingAuthResponse.prototype);
  //   return Object.assign(billingAuth, {
  //     ApiKey: json.apiKey,
  //     AccountId: json.accountId
  //   });
  // }

  // static reviver(key: string, value: any): BillingAuthResponse {
  //   return key === '' ? BillingAuthResponse.fromJSON(value) : value;
  // }

  // toJSON(): BillingAuthResponseJSON {
  //   return Object.assign({}, {
  //     apiKey: this.ApiKey.toString(),
  //     accountId: this.AccountId.toString()
  //   });
  // }
}

export interface PlanJSON {
  id: string;
  name: string;
  unavailable: boolean;
}

export class Plan {
  constructor({ id, name, unavailable }: {id?: string, name?: string, unavailable?: boolean} = {}) {
    this.Id = id;
    this.Name = name;
    this.Unavailable = unavailable;
  }

  Id: string;
  Name: string;
  Unavailable: boolean;

  static fromJSON(json: PlanJSON): Plan {
    if (!json) {
      return undefined;
    }
    const plan = Object.create(Plan.prototype);
    return Object.assign(plan, {
      Id: json.id,
      Name: json.name,
      Unavailable: json.unavailable
    });
  }

  static reviver(key: string, value: any): Plan {
    return key === '' ? Plan.fromJSON(value) : value;
  }

  toJSON(): PlanJSON {
    return Object.assign({}, {
      id: this.Id.toString(),
      name: this.Name.toString(),
      unavailable: this.Unavailable
    });
  }
}

export interface PaginatedPlanJSON {
  hasMore: boolean;
  lastEvaluatedKey: string;
  data: PlanJSON[];
}

export class PaginatedPlan {
  constructor(hasMore?: boolean, lastEvaluatedKey?: string, data?: Plan[]) {
    this.HasMore = hasMore;
    this.LastEvaluatedKey = lastEvaluatedKey;
    this.Data = data;
  }

  HasMore: boolean;
  LastEvaluatedKey: string;
  Data: Plan[];

  static fromJSON(json: PaginatedPlanJSON): PaginatedPlan {
    if (!json) {
      return undefined;
    }
    const d = [];
    json.data.forEach(p => { d.push(Plan.fromJSON(p)); } );
    const pPlan = Object.create(PaginatedPlan.prototype);
    return Object.assign(pPlan, {
      HasMore: json.hasMore,
      LastEvaluatedKey: json.lastEvaluatedKey,
      Data: d
    });
  }

  static reviver(key: string, value: any): PaginatedPlan {
    return key === '' ? PaginatedPlan.fromJSON(value) : value;
  }

  toJSON(): PaginatedPlanJSON {
    const d = [];
    this.Data.forEach(p => { d.push(p.toJSON()); } );
    return Object.assign({}, {
      hasMore: this.HasMore,
      lastEvaluatedKey: this.LastEvaluatedKey.toString(),
      data: d
    });
  }
}

export interface CardInfoJSON {
  brand: string;
  expMonth: string;
  expYear: string;
  last4: string;
}

export class CardInfo {
  constructor({
    brand,
    expMonth,
    expYear,
    last4
  }: { brand?: string; expMonth?: number; expYear?: number; last4?: number } = {}) {
    this.Brand = brand;
    this.ExpMonth = expMonth;
    this.ExpYear = expYear;
    this.Last4 = last4;
  }

  Brand: string;
  ExpMonth: number;
  ExpYear: number;
  Last4: number;

  static fromJSON(json: CardInfoJSON): CardInfo {
    if (!json) {
      return undefined;
    }
    const card = Object.create(CardInfo.prototype);
    return Object.assign(card, {
      Brand: json.brand,
      ExpMonth: json.expMonth,
      ExpYear: json.expYear,
      Last4: json.last4
    });
  }

  static reviver(key: string, value: any): CardInfo {
    return key === '' ? CardInfo.fromJSON(value) : value;
  }

  toJSON(): CardInfoJSON {
    return Object.assign({}, {
      brand: this.Brand,
      expMonth: this.ExpMonth.toString(),
      expYear: this.ExpYear.toString(),
      last4: this.Last4.toString()
    });
  }
}

export interface PaymentMethodJSON {
  id: string;
  isDefault: boolean;
  cardInfo: CardInfoJSON;
}

export class PaymentMethod {
  constructor({
    id,
    isDefault,
    cardInfo
  }: { id?: string; isDefault?: boolean; cardInfo?: CardInfo } = {}) {
    this.Id = id;
    this.IsDefault = isDefault;
    this.CardInfo = cardInfo;
  }

  Id: string;
  IsDefault: boolean;
  CardInfo: CardInfo;

  static fromJSON(json: PaymentMethodJSON): PaymentMethod {
    if (!json) {
      return undefined;
    }
    const pMeth = Object.create(PaginatedPlan.prototype);
    return Object.assign(pMeth, {
      Id: json.id,
      IsDefault: json.isDefault,
      CardInfo: CardInfo.fromJSON(json.cardInfo)
    });
  }

  static reviver(key: string, value: any): PaymentMethod {
    return key === '' ? PaymentMethod.fromJSON(value) : value;
  }

  toJSON(): PaymentMethodJSON {
    return Object.assign({}, {
      id: this.Id.toString(),
      isDefault: this.IsDefault,
      cardInfo: this.CardInfo.toJSON()
    });
  }
}

export interface PaginatedPaymentMethodsJSON {
  hasMore: boolean;
  lastEvaluatedKey: string;
  data: PaymentMethodJSON[];
}

export class PaginatedPaymentMethods {
  constructor({hasMore, lastEvaluatedKey, data}: {hasMore?: boolean, lastEvaluatedKey?: string, data?: PaymentMethod[]}) {
    this.HasMore = hasMore;
    this.LastEvaluatedKey = lastEvaluatedKey;
    this.Data = data;
  }

  HasMore: boolean;
  LastEvaluatedKey: string;
  Data: PaymentMethod[];

  static fromJSON(json: PaginatedPaymentMethodsJSON): PaginatedPaymentMethods {
    if (!json) {
      return undefined;
    }
    const d = [];
    json.data.forEach(p => { d.push(PaymentMethod.fromJSON(p)); } );
    const pMethods = Object.create(PaginatedPaymentMethods.prototype);
    return Object.assign(pMethods, {
      HasMore: json.hasMore,
      LastEvaluatedKey: json.lastEvaluatedKey,
      Data: d
    });
  }

  static reviver(key: string, value: any): PaginatedPaymentMethods {
    return key === '' ? PaginatedPaymentMethods.fromJSON(value) : value;
  }

  toJSON(): PaginatedPaymentMethodsJSON {
    const d = [];
    this.Data.forEach(p => { d.push(p.toJSON()); } );
    return Object.assign({}, {
      hasMore: this.HasMore,
      lastEvaluatedKey: this.LastEvaluatedKey.toString(),
      data: d
    });
  }
}

export interface AccountUpdateRequestJSON {
  active?: boolean;
  planId?: string;
}

export class AccountUpdateRequest {
  constructor({ active, planId }: { active?: boolean; planId?: string } = {}) {
    this.Active = active;
    this.PlanId = planId;
  }

  Active: boolean;
  PlanId: string;

  static fromJSON(json: AccountUpdateRequestJSON): AccountUpdateRequest {
    if (!json) {
      return undefined;
    }
    const info = Object.create(AccountUpdateRequest.prototype);
    return Object.assign(info, {
      Active: json.active,
      PlanId: json.planId
    });
  }

  static reviver(key: string, value: any): AccountUpdateRequest {
    return key === '' ? AccountUpdateRequest.fromJSON(value) : value;
  }

  toJSON(): AccountUpdateRequestJSON {
    return Object.assign({}, {
      active: !isNullOrUndefined(this.Active) ? this.Active : undefined,
      planId: !isNullOrUndefined(this.PlanId) ? this.PlanId.toString() : undefined
    });
  }
}

export class AccountCreateRequest {
  constructor(userId?: string, routerPairingCode?: string) {
    this.userId = userId;
    this.routerPairingCode = routerPairingCode;
  }

  userId: string;
  routerPairingCode: string;
}

// export interface PaginatedResponseJSON<T> {
//   hasMore: boolean;
//   lastEvaluatedKey: string;
//   data: T[];
// }

// export class PaginatedResponse<T> {
//   constructor({hasMore, lastEvaluatedKey, data}: {hasMore?: boolean, lastEvaluatedKey?: string, data?: T}) {
//     this.HasMore = hasMore;
//     this.LastEvaluatedKey = lastEvaluatedKey;
//     this.Data = data;
//   }

//   HasMore: boolean;
//   LastEvaluatedKey: string;
//   Data: T;

//   static fromJSON(json: any): any {
//     if (!json) {
//       return undefined;
//     }
//     const card = Object.create(PaginatedResponse.prototype);
//     return Object.assign(card, {
//       HasMore: json.hasMore,
//       LastEvaluatedKey: json.lastEvaluatedKey,
//       Data: json.data
//     });
//   }

//   static reviver(key: string, value: any): CardInfo {
//     return key === '' ? PaginatedResponse.fromJSON(value) : value;
//   }

//   toJSON(): PaginatedResponseJSON<any> {
//     return Object.assign({}, {
//       brand: this.Brand,
//       expMonth: this.ExpMonth.toString(),
//       expYear: this.ExpYear.toString(),
//       last4: this.Last4.toString()
//     });
//   }
// }
