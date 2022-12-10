import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReissueRoutingModule } from './reissue-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReissueComponent } from './reissue.component';
import { IpoComponent } from './ipo/ipo.component';
import { MissComponent } from './miss/miss.component';
import { ExcessComponent } from './excess/excess.component';

@NgModule({
  declarations: [ReissueComponent, IpoComponent, MissComponent, ExcessComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReissueRoutingModule,
    TranslateModule.forChild()
  ]
})
export class ReissueModule { }
