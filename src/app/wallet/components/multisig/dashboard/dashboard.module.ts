import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { LeftComponent } from './left/left.component';
import { AccountComponent } from './left/account/account.component';
import { ButtonsComponent } from './left/buttons/buttons.component';
import { ReceiveComponent } from './receive/receive.component';
import { MenuComponent } from './left/menu/menu.component';
import { HomeComponent } from './home/home.component';
import { AssetsComponent } from './assets/assets.component';
import { TransactionsComponent } from './transactions/transactions.component';

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
    TransactionsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
