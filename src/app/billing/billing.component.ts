import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.sass']
})
export class BillingComponent implements OnInit {

  title: string;
  plusString: string;
  currentPlanString: string;
  lastFour: string;

  constructor() {
    this.title = 'Your App Title Here';
    this.plusString = 'Plus';
    this.currentPlanString = 'Plus';
    this.lastFour = "7878";
  }

  ngOnInit() {
  }

}
