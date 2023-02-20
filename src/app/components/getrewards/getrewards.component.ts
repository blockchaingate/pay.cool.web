import { Component, OnInit } from '@angular/core';
import { RewardService } from 'src/app/services/reward.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-getrewards',
  templateUrl: './getrewards.component.html',
  styleUrls: ['./getrewards.component.scss']
})
export class GetrewardsComponent implements OnInit {
  walletAddress: string;
  rewards: any;
  pageSize:number = 10;
  totalGets: number;
  pageNum:number = 0;
  constructor(private rewardServ: RewardService, private utilServ: UtilService) { }

  ngOnInit(): void {
  }

  search() {
    this.rewardServ.getTotalGetRewards(this.walletAddress).subscribe(
      (ret: any) => {
        this.totalGets = ret.totalGets;
      }
    );
    this.rewardServ.getGetRewards(this.walletAddress, this.pageSize, this.pageNum).subscribe(
      (ret: any) => {
        this.rewards = ret;
      }
    );
  }

  showAmount(amount: any) {
    return this.utilServ.showAmount(amount, 18);
  }

  getType(type) {
    if(type == 0) {
      return 'biswap';
    }
    return 'metaforce';
  }

  goto(pageNum) {
    if(pageNum < 0) {
      pageNum = 0;
    }
    this.pageNum = pageNum;
    this.rewardServ.getGetRewards(this.walletAddress, this.pageSize, this.pageNum).subscribe(
      (ret: any) => {
        this.rewards = ret;
      }
    );
  }
}
