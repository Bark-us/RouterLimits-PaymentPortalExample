import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router) { }

  @Input() backText = 'Back';
  @Input() routeUrl = '/billing/home';
  @Input() noReturn = false;
  ngOnInit() {
  }

  navArrowClicked() {
    this.router.navigateByUrl(this.routeUrl);
  }
}
