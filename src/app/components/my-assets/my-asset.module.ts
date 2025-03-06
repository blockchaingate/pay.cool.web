import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { QRCodeModule } from 'angularx-qrcode';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MyAssetsComponent } from './my-assets.component';
import { MyAssetDashboardComponent } from './components/dashboard/asset-dashboard.component';

import { TranslateService } from '@ngx-translate/core';
import { UserpayService } from '../../services/userpay.service';

import { MyAssetRoutingModule } from './my-asset-routing.module';

@NgModule({ declarations: [
        MyAssetsComponent,
        MyAssetDashboardComponent
    ],
    exports: [], imports: [CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        QRCodeModule,
        TranslateModule.forChild(),
        MyAssetRoutingModule,
        MatCardModule,
        MatRadioModule,
        MatSelectModule], providers: [
        UserpayService,
        TranslateService,
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class MyAssetModule { }
