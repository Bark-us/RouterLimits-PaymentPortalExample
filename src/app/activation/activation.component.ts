import { Component, OnInit } from '@angular/core';
import { ActivateService } from './activate/activate.service';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.sass']
})

export class ActivationComponent implements OnInit {

  activate: ActivateService;
  test: string;

  constructor(private activateService: ActivateService) {
    this.activate = activateService;
   }

  ngOnInit() {

  }

}
