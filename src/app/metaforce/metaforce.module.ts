import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetaforceComponent } from './metaforce.component';
import { MetaforceRoutingModule } from './metaforce-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { PaymentsComponent } from './payments/payments.component';
import { MarketingComponent } from './marketing/marketing.component';
import { GapComponent } from './gap/gap.component';
import { LeadershipComponent } from './leadership/leadership.component';
import { GlobalComponent } from './global/global.component';
import { CardComponent } from './components/card/card.component';

@NgModule({
  declarations: [
    MetaforceComponent, 
    OverviewComponent, 
    PaymentsComponent, 
    MarketingComponent, 
    GapComponent, 
    LeadershipComponent, 
    GlobalComponent, 
    CardComponent
  ],
  imports: [
    CommonModule,
    MetaforceRoutingModule
  ]
})
export class MetaforceModule { }
