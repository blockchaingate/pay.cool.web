import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockedlpComponent } from './lockedlp.component';

describe('LockedlpComponent', () => {
  let component: LockedlpComponent;
  let fixture: ComponentFixture<LockedlpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LockedlpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LockedlpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
