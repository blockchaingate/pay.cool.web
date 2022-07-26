import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiatPaymentComponent } from './fiat-payment.component';

describe('FiatPaymentComponent', () => {
  let component: FiatPaymentComponent;
  let fixture: ComponentFixture<FiatPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiatPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiatPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
