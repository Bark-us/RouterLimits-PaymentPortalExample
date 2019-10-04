import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivationSubscriptionsComponent } from './activation-subscriptions.component';

describe('ActivationSubscriptionsComponent', () => {
  let component: ActivationSubscriptionsComponent;
  let fixture: ComponentFixture<ActivationSubscriptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivationSubscriptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivationSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
