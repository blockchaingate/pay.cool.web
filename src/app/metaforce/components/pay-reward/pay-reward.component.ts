import { Component, Input, OnInit } from '@angular/core';
import { PayRewardService } from 'src/app/services/payreward.service';
import { metaforceProjectId } from '../../../config/projectId';

@Component({
  selector: 'app-pay-reward',
  templateUrl: './pay-reward.component.html',
  styleUrls: ['./pay-reward.component.scss']
})
export class PayRewardComponent implements OnInit {
  @Input() type: string;
  pageSize = 5;
  pageNum = 0;
  rewards: any;
  constructor(private payRewardServ: PayRewardService) { }

  ngOnInit(): void {
    this.payRewardServ.getAllRewardsByProjectAndType(metaforceProjectId, this.type, this.pageSize, this.pageNum).subscribe(
      (rewards: any) => {
        this.rewards = rewards;
      }
    );
  }

  changePageNum(pageNum: number) {
    if(pageNum < 0) {
      pageNum = 0;
    }
    this.pageNum = pageNum;
    this.payRewardServ.getAllRewardsByProjectAndType(metaforceProjectId, this.type, this.pageSize, this.pageNum).subscribe(
      (rewards: any) => {
        this.rewards = rewards;
      }
    );
  }
}
