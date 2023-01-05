import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayRewardComponent } from './pay-reward.component';

describe('PayRewardComponent', () => {
  let component: PayRewardComponent;
  let fixture: ComponentFixture<PayRewardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayRewardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayRewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
