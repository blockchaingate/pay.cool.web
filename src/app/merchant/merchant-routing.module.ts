import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantComponent } from './merchant.component';
import { StoreComponent } from './pages/store/store.component';
import { StoresComponent } from './pages/stores/stores.component';
import { NewMerchantComponent } from './pages/new-merchant/new-merchant.component';
import { EditMerchantComponent } from './pages/edit-merchant/edit-merchant.component';
import { MerchantsComponent } from './pages/merchants/merchants.component';
import { MerchantInfoComponent } from './pages/merchant-info/merchant-info.component';
import { MerchantHomeComponent } from './pages/merchant-home/merchant-home.component';
import { MerchantSubmittedComponent } from './pages/merchant-submitted/merchant-submitted.component';
import { ContactComponent } from './pages/contact/contact.component';

const routes: Routes = [
  {
    path: '', component: MerchantComponent,
    children: [
      {
        path: 'home', component: MerchantHomeComponent
      },
      {
        path: 'new-merchant', component: NewMerchantComponent
      },   
      {
        path: 'edit-merchant/:id', component: EditMerchantComponent
      }, 
      {
        path: 'merchant-submitted', component: MerchantSubmittedComponent
      },
      {
        path: 'merchant-info', component: MerchantInfoComponent
      },    
      {
        path: '', redirectTo: 'merchants'
      },
      {
        path: 'merchants', component: MerchantsComponent
      },
      {
        path: 'new-store', component: StoreComponent
      },    
      {
        path: 'stores', component: StoresComponent
      },
      {
        path: 'contact', component: ContactComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantRoutingModule { }
