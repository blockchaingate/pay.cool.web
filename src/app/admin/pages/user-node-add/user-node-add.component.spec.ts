import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNodeAddComponent } from './user-node-add.component';

describe('UserNodeAddComponent', () => {
  let component: UserNodeAddComponent;
  let fixture: ComponentFixture<UserNodeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserNodeAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNodeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
