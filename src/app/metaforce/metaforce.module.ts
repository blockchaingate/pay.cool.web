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
import { LplockerComponent } from './lplocker/lplocker.component';
import { PayRewardComponent } from './components/pay-reward/pay-reward.component';
import { ProjectUserComponent } from './components/project-user/project-user.component';
import { GlobalDusdComponent } from './global-dusd/global-dusd.component';
import { PayrewardDiffComponent } from './payreward-diff/payreward-diff.component';

@NgModule({
  declarations: [
    MetaforceComponent, 
    OverviewComponent, 
    PaymentsComponent, 
    MarketingComponent, 
    GapComponent, 
    LeadershipComponent, 
    GlobalComponent, 
    CardComponent, LplockerComponent, PayRewardComponent, ProjectUserComponent, GlobalDusdComponent, PayrewardDiffComponent
  ],
  imports: [
    CommonModule,
    MetaforceRoutingModule
  ]
})
export class MetaforceModule { }
