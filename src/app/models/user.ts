interface UserJSON {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  address2?: string;
  address3?: string;
  city: string;
  state: string;
  country: string;
  zip?: string;
}

export class User {

  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  address2: string;
  address3: string;
  city: string;
  state: string;
  country: string;
  zip: string;

  constructor(firstName: string, lastName: string, email: string, phone: string,
              address: string, address2: string, address3: string, city: string, state: string, country: string, zip: string) {
                this.firstName = firstName;
                this.lastName = lastName;
                this.address = address;
                this.email = email;
                this.phone = phone;
                this.address2 = address2;
                this.address3 = address3;
                this.city = city;
                this.state = state;
                this.country = country;
                this.zip = zip;
  }

  static fromJSON(json: UserJSON): User {
    const user = Object.create(User.prototype);
    return Object.assign(user, {
      firstName: json.firstName,
      lastName: json.lastName,
      address: json.address,
      email: json.email,
      phone: json.phone,
      address2: json.address2,
      address3: json.address3,
      city: json.city,
      state: json.state,
      country: json.country,
      zip: json.zip,
    });
  }

  static reviver(key: string, value: any): any {
    return key === '' ? User.fromJSON(value) : value;
  }

  toJSON(): UserJSON {
    return Object.assign({}, {
      firstName: this.ifExistsSetToString(this.firstName),
      lastName: this.ifExistsSetToString(this.lastName),
      address: this.ifExistsSetToString(this.address),
      email: this.ifExistsSetToString(this.email),
      phone: this.ifExistsSetToString(this.phone),
      address2: this.ifExistsSetToString(this.address2),
      address3: this.ifExistsSetToString(this.address3),
      city: this.city.toString(),
      state: this.state.toString(),
      country: this.country.toString(),
      zip: this.ifExistsSetToString(this.zip),
    });
  }

  ifExistsSetToString(val): any {
    if (val) {
      return val.toString();
    } else {
      return undefined;
    }
  }
}

export interface UserCreatedResponseJSON {
  authorizationRequired: boolean;
  userId: string;
}

export class UserCreatedResponse {
  constructor({
    authorizationRequired,
    userId
  }: { authorizationRequired?: boolean, userId?: string; } = {}) {
    this.AuthorizationRequired = authorizationRequired;
    this.UserId = userId;
  }

  AuthorizationRequired: boolean;
  UserId: string;

  static fromJSON(json: UserCreatedResponseJSON): UserCreatedResponse {
    const user = Object.create(UserCreatedResponse.prototype);
    return Object.assign(user, {
      AuthorizationRequired: json.authorizationRequired,
      UserId: json.userId
    });
  }

  static reviver(key: string, value: any): any {
    return key === '' ? UserCreatedResponse.fromJSON(value) : value;
  }

  toJSON(): UserCreatedResponseJSON {
    return Object.assign({}, {
      authorizationRequired: this.AuthorizationRequired,
      userId: this.UserId.toString()
    });
  }
}
