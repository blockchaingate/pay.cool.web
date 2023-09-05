import { Component, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.scss']
})
export class NewTransactionComponent {
  @Input() nonce: number;
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
