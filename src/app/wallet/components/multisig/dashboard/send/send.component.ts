import { Component } from '@angular/core';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent {
  nonce: number;
  to: string;
  amount: number;

  step: number = 1;
  next(event) {
    this.nonce = event.nonce;
    this.to = event.to;
    this.amount = event.amount;
    this.step = 2;
  }
}
