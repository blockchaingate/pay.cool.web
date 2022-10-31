import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackagesComponent } from './packages/packages.component';
import { PackageComponent } from './package/package.component';
import { ProjectComponent } from './project.component';

const routes: Routes = [
    {
        path: '', component: ProjectComponent,
    },
    {
        path: ':id/packages', component: PackagesComponent,
    },
    {
        path: 'package/:id', component: PackageComponent,
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: []
})
export class ProjectRoutingModule { }