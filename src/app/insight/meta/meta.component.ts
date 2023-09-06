import { Component, OnInit } from '@angular/core';
import { InsightService } from 'src/app/services/insight.service';
import { PayRewardService } from 'src/app/services/payreward.service';
import { UtilService } from 'src/app/services/util.service';
import { TxRewardsComponent } from '../../me/components/tx-rewards/tx-rewards.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TxsInBiswapComponent } from '../txs-in-biswap/txs-in-biswap.component';
@Component({
  selector: 'app-meta',
  templateUrl: './meta.component.html',
  styleUrls: ['./meta.component.scss']
})
export class MetaComponent implements OnInit {
  pageSize: number = 10;
  pageNum: number = 0;
  type: string;
  from: string;
  to: string;
  buys: any;
  typesOfPackage: any = [0, 1, 2];
  
  total: any;
  address: string = '';

  constructor(
    private utilServ: UtilService,
    private modalService: BsModalService,
    private payRewardServ: PayRewardService,
    private insightServ: InsightService) { }

  ngOnInit(): void {
    this.type = 'all';
  }

  search() {
    this.pageNum = 0;
    this.insightServ.getBuysBySearch(this.from, this.to, this.type, this.address, this.typesOfPackage, this.pageSize, this.pageNum).subscribe(
      (ret) => {
        this.buys = ret;
      }
    );

    this.insightServ.getBuysBySearchTotal(this.from, this.to, this.type, this.address, this.typesOfPackage).subscribe(
      (ret) => {
        this.total = ret;
      }
    );
  }

  showAmount(amount) {
    return Number(this.utilServ.showAmount(amount, 18));
  }

  showId(txid) {
    return this.utilServ.showId(txid);
  }

  showRwards(txid: string) {
    this.payRewardServ.getAllRewardsByTxid(txid).subscribe(
      (rewards: any) => {
        const initialState = {
          rewards
        };          

        this.modalService.show(TxRewardsComponent, { initialState, class: 'modal-lg' });
      }
    );
  }

  showTxsInBiswap(txid: string) {
    this.insightServ.getBiswapTransactions(txid).subscribe(
      (txids: any) => {
        const initialState = {
          txids
        };          

        this.modalService.show(TxsInBiswapComponent, { initialState, class: 'modal-lg' });
      }
    );
  }

  goto(pageNum: number) {
    if(pageNum < 0) {
      pageNum = 0;
    }
    if(pageNum > this.total.totalCount / this.pageSize) {
      pageNum = Math.round(this.total.totalCount / this.pageSize);
    }
    this.pageNum = pageNum;
    
    this.insightServ.getBuysBySearch(this.from, this.to, this.type, this.address, this.typesOfPackage, this.pageSize, pageNum).subscribe(
      (ret) => {
        this.buys = ret;
      }
    );
  }
}
