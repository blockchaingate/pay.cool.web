import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MetaforceComponent } from './metaforce.component';
import { PayrewardDiffComponent } from './payreward-diff/payreward-diff.component';
import { PendingsComponent } from './pendings/pendings.component';

const routes: Routes = [
    {
      path: '', component: MetaforceComponent,
    },
    {
      path: 'payreward-diff', component: PayrewardDiffComponent,
    },
    {
      path: 'payreward-diff/:id', component: PayrewardDiffComponent,
    },
    {
      path: 'pendings', component: PendingsComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

export class MetaforceRoutingModule { }