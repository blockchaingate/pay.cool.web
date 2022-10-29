import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPackageAddComponent } from './project-package-add.component';

describe('ProjectPackageAddComponent', () => {
  let component: ProjectPackageAddComponent;
  let fixture: ComponentFixture<ProjectPackageAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectPackageAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPackageAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
