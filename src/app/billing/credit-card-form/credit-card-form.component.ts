import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StripeService, Elements, Element as StripeElement, ElementsOptions, Token } from 'ngx-stripe';
import { finalize } from 'rxjs/operators';
import { LoggerService } from 'src/app/logger.service';


@Component({
  selector: 'app-credit-card-form',
  templateUrl: './credit-card-form.component.html',
  styleUrls: ['./credit-card-form.component.sass']
})
export class CreditCardFormComponent implements OnInit {

  elements: Elements;
  card: StripeElement;
  stripeTest: FormGroup;
  isCreatingCard = false;

  // optional parameters
  elementsOptions: ElementsOptions = {
    locale: 'en'
  };

  @Output() messageEvent = new EventEmitter<Token>();

  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService,
    private logger: LoggerService) {}

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
      if (!name) { return this.logger.Error('Name is required.', 'Okay', 2000); }

      this.isCreatingCard = true;
      this.stripeService
        .createToken(this.card, { name })
        .pipe(finalize(() => {this.isCreatingCard = false; }))
        .subscribe(result => {
          if (result.token) {
            // Use the token to create a charge or a customer
            // https://stripe.com/docs/charges
            console.log(result.token);
            this.messageEvent.emit(result.token);
            this.card.clear();
            this.stripeTest.reset();
          } else if (result.error) {
            // This is a hacky way to standardize stripe's server message with stripe's credit card form
            if (result.error.message === 'Your postal code is incomplete.') {result.error.message = 'Your zip code is incomplete.'; }
            return this.logger.Error(result.error.message, 'Okay', 10000);
          }
        });
    }
}
