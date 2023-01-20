import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalDusdComponent } from './global-dusd.component';

describe('GlobalDusdComponent', () => {
  let component: GlobalDusdComponent;
  let fixture: ComponentFixture<GlobalDusdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalDusdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalDusdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
