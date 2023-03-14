import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmUnlocklpComponent } from './confirm-unlocklp.component';

describe('ConfirmUnlocklpComponent', () => {
  let component: ConfirmUnlocklpComponent;
  let fixture: ComponentFixture<ConfirmUnlocklpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmUnlocklpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmUnlocklpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
