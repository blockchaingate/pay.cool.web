import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnimComponent } from './anim.component';
import { PaymentFlowComponent } from './payment-flow/payment-flow.component';
import { MerchantAnimComponent } from './merchant/merchant-anim.component';

const routes: Routes = [
  {
    path: '', component: AnimComponent,
    children: [
      {
        path: 'payment-flow', component: PaymentFlowComponent
      },
      {
        path: 'merchant-anim', component: MerchantAnimComponent
      },
      {path: '', redirectTo: 'payment-flow', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnimRoutingModule { }
