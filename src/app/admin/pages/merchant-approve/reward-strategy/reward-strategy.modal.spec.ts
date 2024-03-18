import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardStrategyComponent } from './reward-strategy.component';

describe('RewardStrategyComponent', () => {
  let component: RewardStrategyComponent;
  let fixture: ComponentFixture<RewardStrategyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RewardStrategyComponent]
    });
    fixture = TestBed.createComponent(RewardStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
