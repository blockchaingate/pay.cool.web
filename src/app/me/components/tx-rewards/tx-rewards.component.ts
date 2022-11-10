import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tx-rewards',
  templateUrl: './tx-rewards.component.html',
  styleUrls: ['./tx-rewards.component.scss']
})
export class TxRewardsComponent implements OnInit {
  rewards: any;
  constructor() { }

  ngOnInit(): void {
  }

}
