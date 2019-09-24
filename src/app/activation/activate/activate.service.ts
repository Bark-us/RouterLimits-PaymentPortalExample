import { Injectable } from '@angular/core';
import { RlAPIService } from 'src/app/rl-api.service';
import { User, UserCreatedResponse } from '../../models/user';
import { AccountCreatedResponse } from 'src/app/models/account';
import { AccountUpdateRequest } from 'src/app/models/billing';

export enum MessageState {
  AccountCreationSuccess,
  UserCreationSuccess,
  UserCreationError,
  None
}

@Injectable({
  providedIn: 'root'
})
export class ActivateService {

  private rlAPI: RlAPIService;
  private email: string;
  private messageState: MessageState;

  ErrorMessage: string;
  ErrorTitle: string;

  constructor(rlAPI: RlAPIService, ) {
    this.rlAPI = rlAPI;
    this.email = '';
    this.messageState = MessageState.None;
  }

  // Accessor functions
  getEmail() { return this.email; }
  setEmail(email: string) { this.email = email; }
  getMessageState(): MessageState {
    return this.messageState;
  }
  setMessageState(msgState: MessageState): void {
    this.messageState =  msgState;
  }

  // Functionality
  checkEmailAvailability(email: string) {

    const call = this.rlAPI.checkEmailAvailability(email);
    call.subscribe(
      data  => {
        console.log('GET Request is successful ', data);
      },
      error  => {
        console.log('Error', error);
      }
    );
    return call;
  }

  createUser(user: User): Promise<UserCreatedResponse> {
    return new Promise((resolve, reject) => {
      // Call RL API here to create a user.
      this.rlAPI.createUser(user).subscribe(
        data  => {
          this.messageState = MessageState.UserCreationSuccess;
          console.log('User create POST Request is successful ', data);
          return resolve(data);
        },
        error  => {
          this.messageState = MessageState.UserCreationError;
          console.log('Error', error);
          reject(error);
        }
      );
    });
  }

  createAccount(userId: string): Promise<AccountCreatedResponse> {
    return new Promise((resolve, reject) => {
      this.rlAPI.createAccount(userId).subscribe(data  => {
          this.messageState = MessageState.AccountCreationSuccess;
          console.log('Account create POST Request is successful ', data);
          return resolve(data);
        },
        error  => {
          this.messageState = MessageState.UserCreationError;
          console.log('Error', error);
          return reject(error);
        }
      );
    });
  }

  updateAccount(active?: boolean, planId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const updateReq = new AccountUpdateRequest({planId: planId ? planId : undefined, active: active ? active : undefined});
      this.rlAPI.updateAccount(updateReq).subscribe(data  => {
          this.messageState = MessageState.AccountCreationSuccess;
          console.log('Activate POST Request is successful ', data);
          return resolve(data);
        },
        error  => {
          this.messageState = MessageState.UserCreationError;
          console.log('Error', error);
          return reject(error);
        }
      );
    });
  }
}
