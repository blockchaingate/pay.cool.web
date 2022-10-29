import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-bootstrap-spinner";
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { QRCodeModule } from 'angularx-qrcode';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { RoleMenuPipe } from './pipes/role-menu.pipe';
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
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectAddComponent } from './pages/project-add/project-add.component';
import { ProjectUsersComponent } from './pages/project-users/project-users.component';
import { ProjectUserAddComponent } from './pages/project-user-add/project-user-add.component';
import { UserReferralsComponent } from './pages/user-referrals/user-referrals.component';
import { MerchantNodesComponent } from './pages/merchant-nodes/merchant-nodes.component';
import { MerchantNodeAddComponent } from './pages/merchant-node-add/merchant-node-add.component';
import { ProjectEditComponent } from './pages/project-edit/project-edit.component';
import { ProjectPackagesComponent } from './pages/project-packages/project-packages.component';
import { ProjectPackageAddComponent } from './pages/project-package-add/project-package-add.component';
import { ProjectPackageEditComponent } from './pages/project-package-edit/project-package-edit.component';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    RoleMenuPipe,
    StoresComponent,
    StoreApproveComponent,
    ExchangeRateComponent,
    FeeDistributionComponent,
    ExchangeRateAddComponent,
    FeeDistributionUpdateRewardCoinsComponent,
    FeeDistributionUpdateRewardPercentagesComponent,
    FeeDistributionUpdatePaymentFeeRateComponent,
    FiatPaymentComponent,
    MerchantCreditComponent,
    MerchantCreditAddComponent,
    FiatCustomerComponent,
    PaymentsComponent,
    VipsComponent,
    AllRewardDetailsComponent,
    MerchantsComponent,
    MerchantApproveComponent,
    ProjectsComponent,
    ProjectAddComponent,
    ProjectUsersComponent,
    ProjectUserAddComponent,
    UserReferralsComponent,
    MerchantNodesComponent,
    MerchantNodeAddComponent,
    ProjectEditComponent,
    ProjectPackagesComponent,
    ProjectPackageAddComponent,
    ProjectPackageEditComponent
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    FormsModule,
    QRCodeModule,
    SharedModule,
    ModalModule.forRoot(),
    TranslateModule.forChild(),
    ReactiveFormsModule,
    NgxSpinnerModule,
    RichTextEditorModule
  ],
  providers: [TranslateService]
})
export class AdminModule { }
