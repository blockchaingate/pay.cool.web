import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './info.component';
import { InfoRoutingModule } from './info-routing.module';
import { PaymentsComponent } from './components/payments/payments.component';
import { RewardsComponent } from './components/rewards/rewards.component';
import { LockersComponent } from './components/lockers/lockers.component';
import { MerchantPaymentsComponent } from './components/merchant-payments/merchant-payments.component';


@NgModule({
  declarations: [InfoComponent, PaymentsComponent, RewardsComponent, LockersComponent, MerchantPaymentsComponent],
  imports: [
    CommonModule,
    InfoRoutingModule
  ]
})
export class InfoModule { }
