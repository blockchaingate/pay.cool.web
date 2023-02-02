import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { QRCodeModule } from 'angularx-qrcode';
import { SharedModule } from '../shared/shared.module';
import { WalletComponent } from './wallet.component';
import { WalletDashboardComponent } from './components/wallet-dashboard/wallet-dashboard.component';
import { MnemonicComponent } from './components/mnemonic/mnemonic.component';
import { MnemeditComponent} from './components/mnemonic/mnemedit.component';
import { PaycoolComponent } from './components/paycool/paycool.component';
import { CreateWalletComponent } from './components/create-wallet/create-wallet.component';
import { ConfirmMnemonicsComponent } from './components/create-wallet/confirmmnem.component';
import { CoinsListComponent } from './components/coins-list/coins-list.component';
import { NoWalletComponent } from './components/create-wallet/no-wallet.component';
import { AssetsListComponent } from './components/assets-list/assets-list.component';
import { WalletPwdComponent } from './components/create-wallet/wallet-pwd.component';
import { ImportWalletComponent } from './components/import-wallet/import-wallet.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { TranslateService } from '@ngx-translate/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { WalletRoutingModule } from './wallet-routing.module';
import { NgxBootstrapSwitchModule } from 'ngx-bootstrap-switch';
import { TransactionDetailComponent } from './modals/transaction-detail/transaction-detail.component';
import { ReceiveComponent } from './modals/receive/receive.component';
import { SendComponent } from './modals/send/send.component';
import { LoginSettingModal } from './modals/login-setting/login-setting.modal';
import { ShowSeedPhraseModal } from './modals/show-seed-phrase/show-seed-phrase.modal';
import { GetFreeFabModal } from './modals/get-free-fab/get-free-fab.modal';
import { AddGasModal } from './modals/add-gas/add-gas.modal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonModule,
    NgxBootstrapSwitchModule.forRoot(),
    QRCodeModule,
    BsDropdownModule.forRoot(),
    TranslateModule.forChild(),
    WalletRoutingModule,
    SharedModule
  ],
  providers: [
    TranslateService
  ],
  declarations: [
    WalletComponent,
    WalletDashboardComponent,
    MnemonicComponent,
    MnemeditComponent,
    CreateWalletComponent,
    ConfirmMnemonicsComponent,
    NoWalletComponent,
    CoinsListComponent,
    WalletPwdComponent,
    TransactionHistoryComponent,
    ImportWalletComponent,
    ReceiveComponent,
    AssetsListComponent,
    SendComponent,
    TransactionDetailComponent,
    PaycoolComponent,
    LoginSettingModal,
    ShowSeedPhraseModal,
    GetFreeFabModal,
    AddGasModal
  ],
  entryComponents: [
    ReceiveComponent,
    SendComponent,
    TransactionDetailComponent,
    LoginSettingModal,
    ShowSeedPhraseModal,
    GetFreeFabModal,
    AddGasModal
  ],
  exports: [
  ]
})
export class WalletModule { }
