import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { ActivateService } from '../activate/activate.service';
import {Router} from '@angular/router';
import { CustomErrorStateMatcher } from '../activation.component';
import { LoggerService } from 'src/app/logger.service';

@Component({
  selector: 'app-activation-email',
  templateUrl: './activation-email.component.html',
  styleUrls: ['./activation-email.component.sass']
})

export class ActivationEmailComponent implements OnInit {

  private router: Router;

  emailFormControl: FormControl;
  matcher: CustomErrorStateMatcher;
  activate: ActivateService;
  email: string;


  constructor(router: Router, activateService: ActivateService, private logger: LoggerService) {
    this.router = router;
    this.email = '';
    this.activate = activateService;
    this.emailFormControl  = new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
    ]);

    this.matcher = new CustomErrorStateMatcher();
   }

  ngOnInit() {
  }

  async checkEmail() {
    await this.activate.checkEmailAvailability(this.emailFormControl.value).subscribe(
      (data: any)  => {
        const next = (data.status === 'available');
        if (next) {
          this.activate.setEmail(this.emailFormControl.value);
          this.router.navigateByUrl('activate/signup');
          return;
        }

        this.logger.Error('That email is not available.', 'Okay', 2000);
      },
      error  => {
        console.log('Error', error);
      }
    );
  }
}
