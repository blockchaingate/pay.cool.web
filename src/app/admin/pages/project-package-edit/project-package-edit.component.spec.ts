import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPackageEditComponent } from './project-package-edit.component';

describe('ProjectPackageEditComponent', () => {
  let component: ProjectPackageEditComponent;
  let fixture: ComponentFixture<ProjectPackageEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectPackageEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPackageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
