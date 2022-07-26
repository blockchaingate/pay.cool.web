import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfTreeComponent } from './tf-tree.component';

describe('TfTreeComponent', () => {
  let component: TfTreeComponent;
  let fixture: ComponentFixture<TfTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TfTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TfTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
