import { NgModule } from '@angular/core';
import { MerchantRoutingModule } from './merchant-routing.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SharedModule } from '../shared/shared.module';
import { MerchantComponent } from './merchant.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';
import { StoreComponent } from './pages/store/store.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { QRCodeModule } from 'angularx-qrcode';
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { StoresComponent } from './pages/stores/stores.component';
import { StoreDetailComponent } from './components/store-detail/store-detail.component';
import { MerchantDetailComponent } from './components/merchant-detail/merchant-detail.component';
import { NewMerchantComponent } from './pages/new-merchant/new-merchant.component';
import { EditMerchantComponent } from './pages/edit-merchant/edit-merchant.component';
import { MerchantsComponent } from './pages/merchants/merchants.component';
import { MerchantHomeComponent } from './pages/merchant-home/merchant-home.component';
import { MerchantSubmittedComponent } from './pages/merchant-submitted/merchant-submitted.component';
import { ContactComponent } from './pages/contact/contact.component';


@NgModule({
  declarations: [
    MerchantComponent,
    StoreComponent,
    StoresComponent,
    StoreDetailComponent,
    MerchantDetailComponent,
    NewMerchantComponent,
    EditMerchantComponent,
    MerchantsComponent,
    MerchantHomeComponent,
    MerchantSubmittedComponent,
    ContactComponent
  ],
  imports: [
    BsDropdownModule.forRoot(),
    MerchantRoutingModule,
    CommonModule,
    FormsModule,
    QRCodeModule,
    ModalModule.forRoot(),
    SharedModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    RichTextEditorModule,
    CollapseModule.forRoot()
  ],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class MerchantModule { }
