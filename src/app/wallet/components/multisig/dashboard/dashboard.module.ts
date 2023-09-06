import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { DashboardComponent } from './dashboard.component';
import { LeftComponent } from './left/left.component';
import { AccountComponent } from './left/account/account.component';
import { ButtonsComponent } from './left/buttons/buttons.component';
import { ReceiveComponent } from './receive/receive.component';
import { MenuComponent } from './left/menu/menu.component';
import { HomeComponent } from './home/home.component';
import { AssetsComponent } from './assets/assets.component';
import { OverviewComponent } from './home/overview/overview.component';
import { QueueComponent } from './home/queue/queue.component';
import { SendModule } from './send/send.module';
import { SidebarComponent } from './left/sidebar/sidebar.component';
import { AccountItemComponent } from './left/account-item/account-item.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DashboardComponent,
    LeftComponent,
    AccountComponent,
    ButtonsComponent,
    ReceiveComponent,
    MenuComponent,
    HomeComponent,
    AssetsComponent,
    OverviewComponent,
    QueueComponent,
    SidebarComponent,
    AccountItemComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    QRCodeModule,
    SharedModule,
    TranslateModule.forChild(),
    ModalModule.forRoot(),
    SendModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
