import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-confirm-transaction',
  templateUrl: './confirm-transaction.component.html',
  styleUrls: ['./confirm-transaction.component.scss']
})
export class ConfirmTransactionComponent {
  @Input() nonce: number;
  @Input() to: string;
  @Input() amount: number;


  @Output() onAction = new EventEmitter<string>();
  sign() {
    this.onAction.emit('sign');
  }

  back() {
    this.onAction.emit('back');
  }
}
