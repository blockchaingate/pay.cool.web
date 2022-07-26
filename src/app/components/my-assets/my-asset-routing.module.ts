import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyAssetsComponent } from './my-assets.component';
import { MyAssetDashboardComponent } from './components/dashboard/asset-dashboard.component';

const routes: Routes = [
    {
        path: '', component: MyAssetsComponent,
        children: [
            { path: 'dashboard', component: MyAssetDashboardComponent },
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: []
})
export class MyAssetRoutingModule { }
