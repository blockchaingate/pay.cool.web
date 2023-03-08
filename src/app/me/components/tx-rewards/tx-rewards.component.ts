import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-tx-rewards',
  templateUrl: './tx-rewards.component.html',
  styleUrls: ['./tx-rewards.component.scss']
})
export class TxRewardsComponent implements OnInit {
  rewards: any;
  constructor(private utilServ: UtilService) { }

  ngOnInit(): void {
  }

  showId(id: string) {
    return this.utilServ.showId(id);
  }
  showRewardAmount(item) {
    if(!item.typeHex) {
      return item.rewardAmount;
    }
    return Number(this.utilServ.showAmount(item.rewardAmount, 18));
  }
}
