import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTreeModule} from '@angular/material/tree';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TfTreeComponent } from './tf-tree/tf-tree.component';
import { InfoBoxComponent } from './info-box/info-box.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderRewardsComponent } from './order-history/rewards/rewards.component';
import { PasswordModalComponent } from './modals/password-modal/password-modal.component';
import { RequestRefundComponent } from './modals/request-refund/request-refund.component';
import { RefundComponent } from './modals/refund/refund.component';
import { StarRewardsComponent } from './star-rewards/star-rewards.component';
import { TransferOwnershipComponent } from './modals/transfer-ownership/transfer-ownership.component';
import { RewardDetailsComponent } from './modals/reward-details/reward-details.component';
import { SendRewardsSummaryComponent } from './modals/send-rewards-summary/send-rewards-summary.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TfTreeComponent,
    InfoBoxComponent,
    OrderHistoryComponent,
    PasswordModalComponent,
    RequestRefundComponent,
    TransferOwnershipComponent,
    RefundComponent,
    StarRewardsComponent,
    OrderRewardsComponent,
    RewardDetailsComponent,
    SendRewardsSummaryComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
  ],
  exports: [
    TfTreeComponent,
    InfoBoxComponent,
    OrderHistoryComponent,
    PasswordModalComponent,
    RequestRefundComponent,
    TransferOwnershipComponent,
    StarRewardsComponent,
    RefundComponent,
    RewardDetailsComponent,
    SendRewardsSummaryComponent
  ]
})
export class SharedModule { }
