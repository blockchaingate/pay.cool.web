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
import { UploadMediaComponent } from './upload-media/upload-media.component';
import { TransferOwnershipComponent } from './modals/transfer-ownership/transfer-ownership.component';
import { RewardDetailsComponent } from './modals/reward-details/reward-details.component';
import { SendRewardsSummaryComponent } from './modals/send-rewards-summary/send-rewards-summary.component';
import { FormsModule } from '@angular/forms';
import { ResizeImageComponent } from './resize-image/resize-image.component';
import { ImageCropperModule } from 'ngx-image-cropper';

import { QrscannerModalComponent } from './modals/qr-scanner/qrscanner-modal.component';
import { NgxScannerQrcodeModule, LOAD_WASM } from 'ngx-scanner-qrcode';

import { OverflowPipe } from './pipes/overflow.pipe';
import { TokbPipe } from './pipes/tokb.pipe';
LOAD_WASM().subscribe((res: any) => console.log('LOAD_WASM', res));

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
    SendRewardsSummaryComponent,
    UploadMediaComponent,
    QrscannerModalComponent,
    ResizeImageComponent,
    OverflowPipe,
    TokbPipe
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ImageCropperModule,
    NgxScannerQrcodeModule
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
    QrscannerModalComponent,
    SendRewardsSummaryComponent,
    UploadMediaComponent,
    ResizeImageComponent,
    OverflowPipe,
    TokbPipe
  ]
})
export class SharedModule { }
