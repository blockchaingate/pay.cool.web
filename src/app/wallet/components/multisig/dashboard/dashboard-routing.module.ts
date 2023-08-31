import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { AssetsComponent } from './assets/assets.component';
import { TransactionsComponent } from './transactions/transactions.component';

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
                path: 'transactions', component: TransactionsComponent,
            }
        ]
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: []
})
export class DashboardRoutingModule { }