import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsightRoutingModule } from './insight-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FetComponent } from './fet/fet.component';
import { MetaComponent } from './meta/meta.component';
import { TxsInBiswapComponent } from './txs-in-biswap/txs-in-biswap.component';

@NgModule({
  declarations: [FetComponent, MetaComponent, TxsInBiswapComponent],
  imports: [
    CommonModule,
    InsightRoutingModule,
    FormsModule, 
    ReactiveFormsModule
  ]
})
export class InsightModule { }
