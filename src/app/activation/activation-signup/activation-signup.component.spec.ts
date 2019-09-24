import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivationSignupComponent } from './activation-signup.component';

describe('ActivationSignupComponent', () => {
  let component: ActivationSignupComponent;
  let fixture: ComponentFixture<ActivationSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivationSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivationSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
