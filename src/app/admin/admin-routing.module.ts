import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { StoresComponent } from './pages/stores/stores.component';
import { StoreApproveComponent } from './pages/store-approve/store-approve.component';
import { ExchangeRateComponent } from './pages/exchange-rate/exchange-rate.component';
import { FeeDistributionComponent } from './pages/fee-distribution/fee-distribution.component';
import { ExchangeRateAddComponent } from './pages/exchange-rate-add/exchange-rate-add.component';
import { FeeDistributionUpdateRewardCoinsComponent } from './pages/fee-distribution-update-reward-coins/fee-distribution-update-reward-coins.component';
import { FeeDistributionUpdateRewardPercentagesComponent } from './pages/fee-distribution-update-reward-percentages/fee-distribution-update-reward-percentages.component';
import { FeeDistributionUpdatePaymentFeeRateComponent } from './pages/fee-distribution-update-payment-fee-rate/fee-distribution-update-payment-fee-rate.component';
import { FiatPaymentComponent } from './pages/fiat-payment/fiat-payment.component';
import { MerchantCreditComponent } from './pages/merchant-credit/merchant-credit.component';
import { MerchantCreditAddComponent } from './pages/merchant-credit-add/merchant-credit-add.component';
import { FiatCustomerComponent } from './pages/fiat-customer/fiat-customer.component';
import { PaymentsComponent } from './pages/payments/payments.component';
import { VipsComponent } from './pages/vips/vips.component';
import { AllRewardDetailsComponent } from './pages/all-reward-details/all-reward-details.component';
import { MerchantsComponent } from './pages/merchants/merchants.component';
import { MerchantApproveComponent } from './pages/merchant-approve/merchant-approve.component';

import { 
  WalletGuardService as WalletGuard 
} from '../services/wallet-guard.service';

const routes: Routes = [
  {
    path: '', component: AdminComponent,
    canActivate: [WalletGuard], 
    children: [
      {
        path: 'dashboard', component: DashboardComponent
      },
      {
        path: 'stores', component: StoresComponent
      },  
      {
        path: 'merchants', component: MerchantsComponent
      },  
      {
        path: 'vips', component: VipsComponent
      },  
      {
        path: 'store/:id/approve', component: StoreApproveComponent
      },   
      {
        path: 'merchant/:id/approve', component: MerchantApproveComponent
      },   
      {
        path: 'payments', component: PaymentsComponent
      },   
      {
        path: 'fiat-payment', component: FiatPaymentComponent
      },  
      {
        path: 'fiat-customer', component: FiatCustomerComponent
      },      
      {
        path: 'exchange-rate', component: ExchangeRateComponent
      },
      {
        path: 'all-reward-details', component: AllRewardDetailsComponent
      },
      {
        path: 'exchange-rate/:coinName/edit', component: ExchangeRateAddComponent
      },
      {
        path: 'fee-distribution', component: FeeDistributionComponent
      },
      {
        path: 'fee-distribution/update-reward-coins', component: FeeDistributionUpdateRewardCoinsComponent
      },
      {
        path: 'fee-distribution/update-reward-percentages', component: FeeDistributionUpdateRewardPercentagesComponent
      },
      {
        path: 'fee-distribution/update-payment-fee-rate', component: FeeDistributionUpdatePaymentFeeRateComponent
      },
      {
        path: 'merchant-credit', component: MerchantCreditComponent
      },
      {
        path: 'merchant-credit/add', component: MerchantCreditAddComponent
      },
      {
        path: '', redirectTo: 'dashboard'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
