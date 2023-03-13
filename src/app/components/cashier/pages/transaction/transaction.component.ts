import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  title = 'Transaction History';

  transactionHistory = [
    {
      id: "2342341352324",
      address: "0x0d1d4e623d10f9fba5db95830f7d3839406c6af2",
      currency: "ETH",
      amount: 0.0034,
    },
    {
      id: "4534433423424",
      address: "0x0d1d4e623d10f9fba5db95830f7d3839406c6af2",
      currency: "BTC",
      amount: 0.00048,
    },
    {
      id: "33242341352324",
      address: "0x0d1d4e623d10f9fba5db95830f7d3839406c6af2",
      currency: "FAB",
      amount: 3445.003,
    },
  ];
  constructor() { }



  ngOnInit(): void {
  }

}
