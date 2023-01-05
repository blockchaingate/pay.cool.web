import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MetaforceComponent } from './metaforce.component';

const routes: Routes = [
    {
      path: '', component: MetaforceComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

export class MetaforceRoutingModule { }