import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNodeLinkAddComponent } from './user-node-link-add.component';

describe('UserNodeLinkAddComponent', () => {
  let component: UserNodeLinkAddComponent;
  let fixture: ComponentFixture<UserNodeLinkAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserNodeLinkAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNodeLinkAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
