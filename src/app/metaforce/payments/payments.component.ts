import { Component, OnInit } from '@angular/core';
import { BuyService } from 'src/app/services/buy.service';
import { PayRewardService } from 'src/app/services/payreward.service';
import { UtilService } from 'src/app/services/util.service';
import { TxRewardsComponent } from '../../me/components/tx-rewards/tx-rewards.component';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-metaforce-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  pageSize = 5;
  pageNum = 0;
  buys: any;
  constructor(
    private utilServ: UtilService,
    private modalService: BsModalService,
    private payRewardServ: PayRewardService,
    private buyServ: BuyService) { }

  ngOnInit(): void {
    this.buyServ.getBuys(this.pageSize, this.pageNum).subscribe(
      res => {
        this.buys = res;
      }
    );
  }

  changePageNum(pageNum: number) {
    if(pageNum < 0) {
      pageNum = 0;
    }
    this.pageNum = pageNum;
    this.buyServ.getBuys(this.pageSize, this.pageNum).subscribe(
      res => {
        this.buys = res;
      }
    );
  }

  showRwards(txid) {
    this.payRewardServ.getAllRewardsByTxid(txid).subscribe(
      (rewards: any) => {
        console.log('rewards===', rewards);
        const initialState = {
          rewards
        };          

        this.modalService.show(TxRewardsComponent, { initialState, class: 'modal-lg' });
      }
    );
  }

  showType(type) {
    if(type == 0) {
      return 'Packages';
    }
    if(type == 1) {
      return 'Monthly Fee';
    }
    if(type == 2) {
      return 'Annual Fee';
    }
    if(type == 3) {
      return 'Global Rewards';
    }
    return '';
  }
  showCoinName(coinType) {
    return this.utilServ.getCoinNameByTypeId(coinType);
  }

  showAmount(amount) {
    return Number(this.utilServ.showAmount(amount, 18));
  }

}
