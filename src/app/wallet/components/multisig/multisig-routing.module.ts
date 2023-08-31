import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MultisigComponent } from './multisig.component';
import { CreateComponent } from './create/create.component';
import { ImportComponent } from './import/import.component';
const routes: Routes = [
    {
        path: '', component: MultisigComponent,
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(w => w.DashboardModule)
    },
    {
        path: 'create', component: CreateComponent,
    },
    {
        path: 'import', component: ImportComponent,
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: []
})
export class MultisigRoutingModule { }
