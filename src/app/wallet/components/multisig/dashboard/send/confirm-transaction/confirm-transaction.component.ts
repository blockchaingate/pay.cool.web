import { Component } from '@angular/core';

@Component({
  selector: 'app-confirm-transaction',
  templateUrl: './confirm-transaction.component.html',
  styleUrls: ['./confirm-transaction.component.scss']
})
export class ConfirmTransactionComponent {
  nonce: number;
  to: string;
  amount: number;
  sign() {
    
  }
}
