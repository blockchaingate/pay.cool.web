import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { SharedModule } from 'src/app/shared/shared.module';
import { HistoryComponent } from './history/history.component';
import { QueueComponent } from './queue/queue.component';
import { TransactionsComponent } from './transactions.component';
import { ProposalComponent } from './queue/proposal/proposal.component';
import { DetailsComponent } from './queue/proposal/details/details.component';
import { ProgressComponent } from './queue/proposal/progress/progress.component';

@NgModule({
  declarations: [
    TransactionsComponent,
    HistoryComponent,
    QueueComponent,
    ProposalComponent,
    DetailsComponent,
    ProgressComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CollapseModule.forRoot(),
    TransactionsRoutingModule
  ]
})
export class TransactionsModule { }
