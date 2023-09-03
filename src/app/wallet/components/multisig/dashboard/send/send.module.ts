import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SendComponent } from './send.component';
import { NewTransactionComponent } from './new-transaction/new-transaction.component';
import { TransactionStatusComponent } from './transaction-status/transaction-status.component';
import { ConfirmTransactionComponent } from './confirm-transaction/confirm-transaction.component';

@NgModule({
  declarations: [SendComponent, NewTransactionComponent, TransactionStatusComponent, ConfirmTransactionComponent],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class SendModule { }
