import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MultisigComponent } from './multisig.component';
import { CreateComponent } from './create/create.component';
import { ImportComponent } from './import/import.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
    {
        path: '', component: MultisigComponent,
    },
    {
        path: 'dashboard', component: DashboardComponent,
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
