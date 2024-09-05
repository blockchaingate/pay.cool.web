import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AnimRoutingModule } from './anim-routing.module';
import { AnimComponent } from './anim.component';
import { PaymentFlowComponent } from './payment-flow/payment-flow.component';
import { MerchantAnimComponent } from './merchant/merchant-anim.component';

@NgModule({
  declarations: [
    AnimComponent,
    PaymentFlowComponent,
    MerchantAnimComponent
  ],
  imports: [
    AnimRoutingModule,
    CommonModule,
    FormsModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
  ],
  providers: []
})
export class AnimModule { }
