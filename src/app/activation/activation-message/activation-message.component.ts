import { Component, OnInit } from '@angular/core';
import { ActivateService, MessageState } from '../activate/activate.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-activation-message',
  templateUrl: './activation-message.component.html',
  styleUrls: ['./activation-message.component.sass']
})
export class ActivationMessageComponent implements OnInit {

  activate: ActivateService;
  messageState: MessageState;
  email: string;
  router: Router;

  constructor(activate: ActivateService, router: Router) {
    this.activate = activate;
    this.router = router;
    this.email = activate.getEmail();
    this.messageState = activate.getMessageState();
   }

  ngOnInit() {
    // Make sure there is an email
    if (!this.activate.getEmail()) {
      this.router.navigateByUrl('activate/email');
    }
  }

}
