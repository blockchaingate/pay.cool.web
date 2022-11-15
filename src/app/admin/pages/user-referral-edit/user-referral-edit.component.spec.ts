import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReferralEditComponent } from './user-referral-edit.component';

describe('UserReferralEditComponent', () => {
  let component: UserReferralEditComponent;
  let fixture: ComponentFixture<UserReferralEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserReferralEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserReferralEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
