import { Component, OnInit } from '@angular/core';
import { metaforceProjectId } from '../../config/projectId';
import { GlobalRewardService } from 'src/app/services/globalreward.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-metaforce-global-dusd',
  templateUrl: './global-dusd.component.html',
  styleUrls: ['./global-dusd.component.scss']
})
export class GlobalDusdComponent implements OnInit {
  pageSize = 5;
  pageNum = 0;
  rewards: any;
  constructor(
    private utilServ: UtilService,
    private globalRewardServ: GlobalRewardService) { }

  ngOnInit(): void {
    this.globalRewardServ.getAllRewardsByProject(metaforceProjectId, this.pageSize, this.pageNum).subscribe(
      (rewards: any) => {
        this.rewards = rewards;
      }
    );
  }

  showCoinName(tokenId: number) {
    return this.utilServ.getCoinNameByTypeId(tokenId);
  }
  
  showId(txid) {
    return this.utilServ.showId(txid);
  }

  getUrl(txid: string) {
    const url = 'https://' + (environment.production ? '' : 'test.') + 'exchangily.com/explorer/tx-detail/' + txid;
    return url;
  }

  changePageNum(pageNum: number) {
    console.log('11');
    if(pageNum < 0) {
      pageNum = 0;
    }
    this.pageNum = pageNum;
    this.globalRewardServ.getAllRewardsByProject(metaforceProjectId, this.pageSize, this.pageNum).subscribe(
      (rewards: any) => {
        this.rewards = rewards;
      }
    );
    console.log('22');
  }
}
