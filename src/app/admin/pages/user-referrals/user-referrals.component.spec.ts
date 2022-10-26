import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReferralsComponent } from './user-referrals.component';

describe('UserReferralsComponent', () => {
  let component: UserReferralsComponent;
  let fixture: ComponentFixture<UserReferralsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserReferralsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserReferralsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
