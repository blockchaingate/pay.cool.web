import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-txs-in-biswap',
  templateUrl: './txs-in-biswap.component.html',
  styleUrls: ['./txs-in-biswap.component.scss']
})
export class TxsInBiswapComponent implements OnInit {
  txids: any;
  constructor() { }

  ngOnInit(): void {
  }

}
