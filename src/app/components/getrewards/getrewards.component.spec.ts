import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetrewardsComponent } from './getrewards.component';

describe('GetrewardsComponent', () => {
  let component: GetrewardsComponent;
  let fixture: ComponentFixture<GetrewardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetrewardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetrewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
