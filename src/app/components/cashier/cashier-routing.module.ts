import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CashierComponent } from './cashier.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { SetupComponent } from './pages/setup/setup.component';
import { TransactionComponent } from './pages/transaction/transaction.component';

const routes: Routes = [
  {
    path: '', component: CashierComponent,
    children: [
      { path: 'setup', component: SetupComponent},
      { path: 'checkout', component: CheckoutComponent },
      { path: 'transaction-history', component: TransactionComponent },
      // { path: '', redirectTo: 'setup' }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashierRoutingModule { }
