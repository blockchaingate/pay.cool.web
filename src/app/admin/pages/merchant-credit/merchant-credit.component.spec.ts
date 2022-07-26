import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantCreditComponent } from './merchant-credit.component';

describe('MerchantCreditComponent', () => {
  let component: MerchantCreditComponent;
  let fixture: ComponentFixture<MerchantCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantCreditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
