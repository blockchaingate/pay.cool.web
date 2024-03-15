import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNodesComponent } from './user-nodes.component';

describe('UserNodesComponent', () => {
  let component: UserNodesComponent;
  let fixture: ComponentFixture<UserNodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserNodesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
