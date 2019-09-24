import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StripeService, Elements, Element as StripeElement, ElementsOptions, Token } from 'ngx-stripe';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-credit-card-form',
  templateUrl: './credit-card-form.component.html',
  styleUrls: ['./credit-card-form.component.sass']
})
export class CreditCardFormComponent implements OnInit {

  elements: Elements;
  card: StripeElement;
  stripeTest: FormGroup;
  // optional parameters
  elementsOptions: ElementsOptions = {
    locale: 'en'
  };

  @Output() messageEvent = new EventEmitter<Token>();

  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService,
    private snackBar: MatSnackBar) {}

    ngOnInit() {
      this.stripeTest = this.fb.group({
        name: ['', [
          Validators.required
        ]]
      });
      this.stripeService.elements(this.elementsOptions)
        .subscribe(elements => {
          this.elements = elements;
          // Only mount the element the first time
          if (!this.card) {
            this.card = this.elements.create('card', {
              style: {
                base: {
                  color: '#32325D',
                  fontWeight: 500,
                  fontFamily: 'Inter UI, Open Sans, Segoe UI, sans-serif',
                  fontSize: '16px',
                  fontSmoothing: 'antialiased',

                  '::placeholder': {
                    color: '#CFD7DF'
                  }
                },
                invalid: {
                  color: '#E25950'
                }
              }
            });

            this.card.mount('#card-element');
          }
        });
    }

    enterCard() {

      const name = this.stripeTest.get('name').value;
      if (!name) { return this.openSnackBar('Name is required.', 'Okay'); }

      this.stripeService
        .createToken(this.card, { name })
        .subscribe(result => {
          if (result.token) {
            // Use the token to create a charge or a customer
            // https://stripe.com/docs/charges
            console.log(result.token);
            this.messageEvent.emit(result.token);
            this.card.clear();
            this.stripeTest.reset();
          } else if (result.error) {
            return this.openSnackBar(result.error.message, 'Okay', 10000);
            // Error creating the token
            console.log(result.error.message);
          }
        });
    }

    openSnackBar(message: string, action: string, delay: number = 2000) {
      this.snackBar.open(message, action, {
        duration: delay,
      });
    }
}
