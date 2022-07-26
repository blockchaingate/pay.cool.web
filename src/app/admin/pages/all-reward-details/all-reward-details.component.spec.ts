import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRewardDetailsComponent } from './all-reward-details.component';

describe('AllRewardDetailsComponent', () => {
  let component: AllRewardDetailsComponent;
  let fixture: ComponentFixture<AllRewardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllRewardDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllRewardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
