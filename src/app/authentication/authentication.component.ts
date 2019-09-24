import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.sass']
})
export class AuthenticationComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log('Called Authenticate');
    if (!this.authService.isAuthenticating) {
      this.authService.authenticate('');
    }
  }
}
