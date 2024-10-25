import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { StoreApproveComponent } from './pages/store-approve/store-approve.component';
import { FeeDistributionComponent } from './pages/fee-distribution/fee-distribution.component';
import { FeeDistributionUpdateRewardCoinsComponent } from './pages/fee-distribution-update-reward-coins/fee-distribution-update-reward-coins.component';
import { FeeDistributionUpdateRewardPercentagesComponent } from './pages/fee-distribution-update-reward-percentages/fee-distribution-update-reward-percentages.component';
import { FeeDistributionUpdatePaymentFeeRateComponent } from './pages/fee-distribution-update-payment-fee-rate/fee-distribution-update-payment-fee-rate.component';
import { FiatPaymentComponent } from './pages/fiat-payment/fiat-payment.component';
import { FiatCustomerComponent } from './pages/fiat-customer/fiat-customer.component';
import { PaymentsComponent } from './pages/payments/payments.component';
import { VipsComponent } from './pages/vips/vips.component';
import { AllRewardDetailsComponent } from './pages/all-reward-details/all-reward-details.component';
import { MerchantsComponent } from './pages/merchants/merchants.component';
import { MerchantApproveComponent } from './pages/merchant-approve/merchant-approve.component';

import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectAddComponent } from './pages/project-add/project-add.component';
import { ProjectUsersComponent } from './pages/project-users/project-users.component';
import { ProjectUserAddComponent } from './pages/project-user-add/project-user-add.component';
import { UserReferralsComponent } from './pages/user-referrals/user-referrals.component';

import { MerchantNodesComponent } from './pages/merchant-nodes/merchant-nodes.component';
import { MerchantNodeAddComponent } from './pages/merchant-node-add/merchant-node-add.component';

import { MerchantNodeUsersComponent } from './pages/merchant-node-users/merchant-node-users.component';

import { UserNodesComponent } from './pages/user-nodes/user-nodes.component';
import { UserNodeAddComponent } from './pages/user-node-add/user-node-add.component';

import { UserNodeUsersComponent } from './pages/user-node-users/user-node-users.component';
import { FiatOrdersComponent } from './pages/fiat-orders/fiat-orders.component';
import { ProjectEditComponent } from './pages/project-edit/project-edit.component';

import { ProjectPackagesComponent } from './pages/project-packages/project-packages.component';
import { ProjectPackageAddComponent } from './pages/project-package-add/project-package-add.component';
import { ProjectPackageEditComponent } from './pages/project-package-edit/project-package-edit.component';
import { UserReferralEditComponent } from './pages/user-referral-edit/user-referral-edit.component';

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
        path: 'projects', component: ProjectsComponent
      },  
      {
        path: 'project/add', component: ProjectAddComponent
      }, 
      {
        path: 'project/:id/edit', component: ProjectEditComponent
      }, 
      {
        path: 'project-users', component: ProjectUsersComponent
      },  
      {
        path: 'project-user/add', component: ProjectUserAddComponent
      }, 
      {
        path: 'project-packages', component: ProjectPackagesComponent
      },  
      {
        path: 'project-package/add', component: ProjectPackageAddComponent
      }, 
      {
        path: 'project-package/:id/edit', component: ProjectPackageEditComponent
      }, 
      {
        path: 'merchants', component: MerchantsComponent
      },  
      {
        path: 'merchant-nodes', component: MerchantNodesComponent
      },  
      {
        path: 'merchant-node-users', component: MerchantNodeUsersComponent
      },  
      {
        path: 'user-nodes', component: UserNodesComponent
      },  
      {
        path: 'user-node-users', component: UserNodeUsersComponent
      },  
      {
        path: 'fiat-orders', component: FiatOrdersComponent
      },  
      {
        path: 'merchant-node/add', component: MerchantNodeAddComponent
      }, 
      {
        path: 'merchant-node/:id/update', component: MerchantNodeAddComponent
      }, 
      {
        path: 'user-node/add', component: UserNodeAddComponent
      },
      {
        path: 'user-node/:id/update', component: UserNodeAddComponent
      }, 
      {
        path: 'users', component: UserReferralsComponent
      },  
      {
        path: 'user-edit/:id', component: UserReferralEditComponent
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
        path: 'all-reward-details', component: AllRewardDetailsComponent
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
