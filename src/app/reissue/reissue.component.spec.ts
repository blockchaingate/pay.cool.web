import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReissueComponent } from './reissue.component';

describe('ReissueComponent', () => {
  let component: ReissueComponent;
  let fixture: ComponentFixture<ReissueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReissueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReissueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
