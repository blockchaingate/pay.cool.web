import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MeComponent } from './me.component';
import { MeRoutingModule } from './me-routing.module';
import { PaymentsComponent } from './components/payments/payments.component';
import { RewardsComponent } from './components/rewards/rewards.component';
import { LockersComponent } from './components/lockers/lockers.component';
import { MerchantPaymentsComponent } from './components/merchant-payments/merchant-payments.component';
import { SettingsComponent } from './components/settings/settings.component';
import { PackagesComponent } from './components/packages/packages.component';


@NgModule({
  declarations: [MeComponent, PaymentsComponent, RewardsComponent, LockersComponent, MerchantPaymentsComponent, SettingsComponent, PackagesComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule.forChild(),
    MeRoutingModule
  ]
})
export class MeModule { }
