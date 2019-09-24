import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingSubscriptionsComponent } from './billing-subscriptions.component';

describe('BillingSubscriptionsComponent', () => {
  let component: BillingSubscriptionsComponent;
  let fixture: ComponentFixture<BillingSubscriptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingSubscriptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
