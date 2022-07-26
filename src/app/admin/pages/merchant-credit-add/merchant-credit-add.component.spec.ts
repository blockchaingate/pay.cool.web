import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantCreditAddComponent } from './merchant-credit-add.component';

describe('MerchantCreditAddComponent', () => {
  let component: MerchantCreditAddComponent;
  let fixture: ComponentFixture<MerchantCreditAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantCreditAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantCreditAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
