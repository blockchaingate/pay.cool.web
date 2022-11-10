import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LplockersComponent } from './lplockers.component';

describe('LplockersComponent', () => {
  let component: LplockersComponent;
  let fixture: ComponentFixture<LplockersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LplockersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LplockersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
