import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantSubmittedComponent } from './merchant-submitted.component';

describe('MerchantSubmittedComponent', () => {
  let component: MerchantSubmittedComponent;
  let fixture: ComponentFixture<MerchantSubmittedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantSubmittedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
