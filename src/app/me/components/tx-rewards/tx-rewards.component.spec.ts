import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxRewardsComponent } from './tx-rewards.component';

describe('TxRewardsComponent', () => {
  let component: TxRewardsComponent;
  let fixture: ComponentFixture<TxRewardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxRewardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
