import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FetComponent } from './fet.component';

describe('GetComponent', () => {
  let component: FetComponent;
  let fixture: ComponentFixture<FetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
