import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiatCustomerComponent } from './fiat-customer.component';

describe('FiatCustomerComponent', () => {
  let component: FiatCustomerComponent;
  let fixture: ComponentFixture<FiatCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiatCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiatCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
