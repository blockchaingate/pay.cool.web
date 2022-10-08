import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { QRCodeModule } from 'angularx-qrcode';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { UserTreeComponent } from './components/user-tree/user-tree.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdminModule } from './components/admin/admin.module';
// import { MyAssetsComponent } from './components/my-assets/my-assets.component';
// import { OrderComponent } from './components/order/order.component';
import { PaymentSuccessComponent } from './components/payment/success.component';
import { PaymentFailComponent } from './components/payment/fail.component';
import { DeleteWalletModalComponent } from './components/modals/delete-wallet/delete-wallet.component';
import { MatStepperModule } from '@angular/material/stepper';
import { StarService } from './services/star.service';
import { ApiService } from './services/api.service';
import { CoinService } from './services/coin.service';
import { HttpService } from './services/http.service';
import { KanbanService } from './services/kanban.service';
import { MemberService } from './services/member.service';
import { OrderService } from './services/order.service';
import { UserAuth } from './services/user-auth.service';
import { UtilService } from './services/util.service';
import { WalletService } from './services/wallet.service';
import { Web3Service } from './services/web3.service';
import { StorageService } from './services/storage.service';
import { TimerService } from './services/timer.service';
import { AirdropService } from './services/airdrop.service';
import { IddockService } from './services/iddock.service';
import { DataService } from './services/data.service';
import { StoreService } from './services/store.service';
import { MerchantService } from './services/merchant.service';
import { UploadService } from './services/upload.service';
import { WalletGuardService } from './services/wallet-guard.service';
import { KanbanSmartContractService } from './services/kanban.smartcontract.service';
import { MembershipComponent } from './components/membership/membership.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { AboutComponent } from './components/about/about.component';
import { JobComponent } from './components/job/job.component';
import { VersionComponent } from './components/version/version.component';
import { ManualComponent } from './components/manual/manual.component';
import { ScComponent } from './components/manual/sc/sc.component';
import { TransferOwnershipComponent } from './components/transfer-ownership/transfer-ownership.component';
import { SupportComponent } from './components/support/support.component'

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserTreeComponent,
    NavbarComponent,
    PaymentSuccessComponent,
    PaymentFailComponent,
    DeleteWalletModalComponent,
    FooterComponent,
    PrivacyComponent,
    AboutComponent,
    JobComponent,
    MembershipComponent,
    VersionComponent,
    ManualComponent,
    ScComponent,
    SupportComponent,
    TransferOwnershipComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    SharedModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AdminModule,
    MatStepperModule,
    FontAwesomeModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    QRCodeModule,
    ModalModule.forRoot(),
    NgxSmartModalModule.forRoot(),
    ToastrModule.forRoot(),
    TranslateModule.forRoot(
      {
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }
    ),
    // TreeDiagramModule,
    // NgxGraphModule
  ],
  providers: [
    StarService,
    ApiService,
    CoinService,
    HttpService,
    KanbanService,
    MemberService,
    UserAuth,
    UtilService,
    WalletService,
    Web3Service,
    IddockService,
    StorageService,
    TimerService,
    OrderService,
    UploadService,
    AirdropService,
    DataService,
    MerchantService,
    WalletGuardService,
    StoreService,
    KanbanSmartContractService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
