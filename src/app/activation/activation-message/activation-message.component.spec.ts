import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivationMessageComponent } from './activation-message.component';

describe('ActivationMessageComponent', () => {
  let component: ActivationMessageComponent;
  let fixture: ComponentFixture<ActivationMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivationMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivationMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
