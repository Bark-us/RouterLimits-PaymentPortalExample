import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title: string = 'Your App Title Here';
  plusString: string = 'Plus';
  currentPlanString: string = 'Plus';
  lastFour: string = "7878";
}
