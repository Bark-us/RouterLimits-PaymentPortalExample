import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingPaymentMethodsComponent } from './billing-payment-methods.component';

describe('BillingPaymentMethodsComponent', () => {
  let component: BillingPaymentMethodsComponent;
  let fixture: ComponentFixture<BillingPaymentMethodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingPaymentMethodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingPaymentMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
