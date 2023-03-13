import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CashierRoutingModule } from './cashier-routing.module';
import { CashierComponent } from './cashier.component';
import { TranslateModule } from '@ngx-translate/core';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { TransactionComponent } from './pages/transaction/transaction.component';
import { CashierHeaderComponent } from './component/cashier-header/cashier-header.component';
import { SetupComponent } from './pages/setup/setup.component';



@NgModule({
  declarations: [CashierComponent, CheckoutComponent, TransactionComponent, CashierHeaderComponent, SetupComponent],
  imports: [
    CommonModule,
    CashierRoutingModule,
    TranslateModule.forChild(),
  ]
})
export class CashierModule { }
