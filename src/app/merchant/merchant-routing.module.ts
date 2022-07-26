import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantComponent } from './merchant.component';
import { MerchantCreditComponent } from './pages/merchant-credit/merchant-credit.component';
import { MerchantCreditAddComponent } from './pages/merchant-credit-add/merchant-credit-add.component';
import { StoreComponent } from './pages/store/store.component';
import { StoresComponent } from './pages/stores/stores.component';

const routes: Routes = [
  {
    path: '', component: MerchantComponent,
    children: [
      {
        path: 'new-merchant', component: StoreComponent
      },     
      {
        path: '', redirectTo: 'stores'
      },
      {
        path: 'stores', component: StoresComponent
      },
      {
        path: 'merchant-credit', component: MerchantCreditComponent
      },
      {
        path: 'merchant-credit/add', component: MerchantCreditAddComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantRoutingModule { }
