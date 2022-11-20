import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectComponent } from './project.component';
import { ProjectRoutingModule } from './project-routing.module';
import { PackagesComponent } from './packages/packages.component';
import { PackageComponent } from './package/package.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProjectComponent, PackagesComponent, PackageComponent],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    FormsModule,
    TranslateModule.forChild()
  ]
})
export class ProjectModule { }
