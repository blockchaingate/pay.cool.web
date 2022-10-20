import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantPaymentsComponent } from './merchant-payments.component';

describe('MerchantPaymentsComponent', () => {
  let component: MerchantPaymentsComponent;
  let fixture: ComponentFixture<MerchantPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantPaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
