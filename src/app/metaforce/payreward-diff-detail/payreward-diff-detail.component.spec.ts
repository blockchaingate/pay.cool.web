import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrewardDiffDetailComponent } from './payreward-diff-detail.component';

describe('PayrewardDiffDetailComponent', () => {
  let component: PayrewardDiffDetailComponent;
  let fixture: ComponentFixture<PayrewardDiffDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrewardDiffDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrewardDiffDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
