import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantCreditAddChargerComponent } from './merchant-credit-add-charger.component';

describe('MerchantCreditAddChargerComponent', () => {
  let component: MerchantCreditAddChargerComponent;
  let fixture: ComponentFixture<MerchantCreditAddChargerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantCreditAddChargerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantCreditAddChargerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
