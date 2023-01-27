import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrewardDiffComponent } from './payreward-diff.component';

describe('PayrewardDiffComponent', () => {
  let component: PayrewardDiffComponent;
  let fixture: ComponentFixture<PayrewardDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrewardDiffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrewardDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
