import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNodeLinksComponent } from './user-node-links.component';

describe('UserNodeLinksComponent', () => {
  let component: UserNodeLinksComponent;
  let fixture: ComponentFixture<UserNodeLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserNodeLinksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNodeLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
