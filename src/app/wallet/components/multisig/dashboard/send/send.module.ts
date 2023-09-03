import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendComponent } from './send.component';
import { NewTransactionComponent } from './new-transaction/new-transaction.component';
import { TransactionStatusComponent } from './transaction-status/transaction-status.component';

@NgModule({
  declarations: [SendComponent, NewTransactionComponent, TransactionStatusComponent],
  imports: [
    CommonModule
  ]
})
export class SendModule { }
