import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReissueComponent } from './reissue.component';
import { IpoComponent } from './ipo/ipo.component';
import { MissComponent } from './miss/miss.component';
import { ExcessComponent } from './excess/excess.component';

const routes: Routes = [
    {
        path: '', component: ReissueComponent,
    },
    {
        path: 'ipo', component: IpoComponent,
    },
    {
        path: 'miss', component: MissComponent,
    },
    {
        path: 'excess', component: ExcessComponent,
    }     
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: []
})
export class ReissueRoutingModule { }