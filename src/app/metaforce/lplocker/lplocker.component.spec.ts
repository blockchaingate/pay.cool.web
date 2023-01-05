import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LplockerComponent } from './lplocker.component';

describe('LplockerComponent', () => {
  let component: LplockerComponent;
  let fixture: ComponentFixture<LplockerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LplockerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LplockerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
