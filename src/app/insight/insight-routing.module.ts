import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FetComponent } from './fet/fet.component';
import { MetaComponent } from './meta/meta.component';

const routes: Routes = [
    {
      path: 'fet', component: FetComponent,
    },
    {
      path: 'meta', component: MetaComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes), CommonModule],
    exports: [RouterModule]
  })

export class InsightRoutingModule { }
