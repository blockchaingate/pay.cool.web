import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { RewardService } from 'src/app/services/reward.service';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.scss']
})
export class RewardsComponent implements OnInit {
  rewards: any;
  constructor(
    private dataServ: DataService,
    private rewardServ: RewardService,
  ) { }

  ngOnInit(): void {
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        if(walletAddress) {
          this.rewardServ.getAllRewardsByUser(walletAddress, 100, 0).subscribe(
            (rewards) => {
              this.rewards = rewards;
            }
          );
        }
      }
    );
  }

}
