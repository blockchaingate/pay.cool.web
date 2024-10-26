/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UserTreeComponent } from './user-tree.component';

describe('UserTreeComponent', () => {
  let component: UserTreeComponent;
  let fixture: ComponentFixture<UserTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
