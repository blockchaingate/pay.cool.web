import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BindpayComponent } from './bindpay.component';
import { LockedlpComponent } from './lockedlp/lockedlp.component';

const routes: Routes = [
    { path: '', component: BindpayComponent },
    { path: 'lockedlp', component: LockedlpComponent }
];
  
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BindpayRoutingModule { }