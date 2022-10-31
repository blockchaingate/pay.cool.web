import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project.component';
import { ProjectRoutingModule } from './project-routing.module';
import { PackagesComponent } from './packages/packages.component';
import { PackageComponent } from './package/package.component';


@NgModule({
  declarations: [ProjectComponent, PackagesComponent, PackageComponent],
  imports: [
    CommonModule,
    ProjectRoutingModule
  ]
})
export class ProjectModule { }
