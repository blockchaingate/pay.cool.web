import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.scss']
})
export class NewTransactionComponent {
  nonce: number;
  to: string;
  amount: number;

  @Output() onSubmit = new EventEmitter<any>();
  next() {
    this.onSubmit.emit(
      {
        nonce: this.nonce,
        to: this.to,
        amount: this.amount
      }
    );
  }
}
