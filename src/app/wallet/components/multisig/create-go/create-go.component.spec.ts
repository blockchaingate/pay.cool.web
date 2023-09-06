import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGoComponent } from './create-go.component';

describe('CreateGoComponent', () => {
  let component: CreateGoComponent;
  let fixture: ComponentFixture<CreateGoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
