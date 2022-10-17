import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WalletComponent } from './wallet.component';
import { WalletDashboardComponent } from './components/wallet-dashboard/wallet-dashboard.component';
import { CreateWalletComponent } from './components/create-wallet/create-wallet.component';
import { ImportWalletComponent } from './components/import-wallet/import-wallet.component';
import { ConfirmMnemonicsComponent } from './components/create-wallet/confirmmnem.component';
import { WalletPwdComponent } from './components/create-wallet/wallet-pwd.component';
import { PaycoolComponent } from './components/paycool/paycool.component';

const routes: Routes = [
    {
        path: '', component: WalletComponent,
        children: [
            { path: 'dashboard', component: WalletDashboardComponent },
            { path: 'create', component: CreateWalletComponent},
            { path: 'paycool', component: PaycoolComponent},
            { path: 'import', component: ImportWalletComponent},
            { path: 'confirm', component: ConfirmMnemonicsComponent},
            { path: 'pwd', component: WalletPwdComponent},
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: []
})
export class WalletRoutingModule { }
