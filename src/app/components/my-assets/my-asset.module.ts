import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { QRCodeModule } from 'angularx-qrcode';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MyAssetsComponent } from './my-assets.component';
import { MyAssetDashboardComponent } from './components/dashboard/asset-dashboard.component';

import { TranslateService } from '@ngx-translate/core';
import { StarService } from '../../services/star.service';

import { MyAssetRoutingModule } from './my-asset-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    QRCodeModule,
    TranslateModule.forChild(),
    MyAssetRoutingModule,
    MatCardModule,
    MatRadioModule,
    MatSelectModule
  ],
  providers: [
    StarService,
    TranslateService,
  ],
  declarations: [
    MyAssetsComponent,
    MyAssetDashboardComponent
  ],
  exports: [
  ]
})
export class MyAssetModule { }
