import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {

  hideNav: boolean;

  constructor(private router: Router, private authService: AuthService) {
    this.hideNav = this.authService.isInApp;
   }

  @Input() backText = 'Back';
  @Input() routeUrl = '/billing/home';
  @Input() noReturn = false;
  ngOnInit() {
    this.hideNav = this.authService.isInApp;
  }

  navArrowClicked() {
    this.router.navigateByUrl(this.routeUrl);
  }

  close() {
    self.close();
    self.close();
  }
}
