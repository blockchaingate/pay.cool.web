import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { AssetsComponent } from './assets/assets.component';
import { SendComponent } from './send/send.component';

const routes: Routes = [
    {
        path: '', component: DashboardComponent,
        children: [
            {
                path: '', component: HomeComponent,
            },
            {
                path: 'assets', component: AssetsComponent,
            },
            {
                path: 'send/:id/:decimals', component: SendComponent,
            },
            {
                path: 'transactions', loadChildren: () => import('./transactions/transactions.module').then(w => w.TransactionsModule)
            }
        ]
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: []
})
export class DashboardRoutingModule { }