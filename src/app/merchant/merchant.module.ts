import { NgModule } from '@angular/core';
import { MerchantRoutingModule } from './merchant-routing.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MerchantComponent } from './merchant.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UploadMediaComponent } from './components/upload-media/upload-media.component';
import { TranslateModule } from '@ngx-translate/core';
import { StoreComponent } from './pages/store/store.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { QRCodeModule } from 'angularx-qrcode';
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AddCreditComponent } from './pages/add-credit/add-credit.component';
import { MerchantCreditComponent } from './pages/merchant-credit/merchant-credit.component';
import { MerchantCreditAddComponent } from './pages/merchant-credit-add/merchant-credit-add.component';
import { StoresComponent } from './pages/stores/stores.component';
import { StoreDetailComponent } from './components/store-detail/store-detail.component';
import { MerchantDetailComponent } from './components/merchant-detail/merchant-detail.component';
import { NewMerchantComponent } from './pages/new-merchant/new-merchant.component';
import { MerchantsComponent } from './pages/merchants/merchants.component';

@NgModule({
  declarations: [
    MerchantComponent,
    UploadMediaComponent,
    StoreComponent,
    AddCreditComponent,
    MerchantCreditComponent,
    MerchantCreditAddComponent,
    StoresComponent,
    StoreDetailComponent,
    MerchantDetailComponent,
    NewMerchantComponent,
    MerchantsComponent
  ],
  imports: [
    BsDropdownModule.forRoot(),
    MerchantRoutingModule,
    CommonModule,
    FormsModule,
    QRCodeModule,
    ModalModule.forRoot(),
    TranslateModule.forChild(),
    ReactiveFormsModule,
    RichTextEditorModule,
    CollapseModule.forRoot()
  ],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class MerchantModule { }
