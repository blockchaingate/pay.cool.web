import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.scss']
})
export class NewTransactionComponent implements OnInit{
  @Input() nonce: number;
  @Input() balance: number;
  to: string;
  amount: number;
  

  @Output() onSubmit = new EventEmitter<any>();

  constructor(private toastServ: ToastrService) {}
  ngOnInit(): void {

  }
  next() {
    if(this.balance < this.amount) {
      this.toastServ.info('Not enough balance');
      return;
    }
    this.onSubmit.emit(
      {
        nonce: this.nonce,
        to: this.to,
        amount: this.amount
      }
    );
  }
}
