import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { BuyService } from 'src/app/services/buy.service';
import { PayRewardService } from 'src/app/services/payreward.service';
import { UtilService } from 'src/app/services/util.service';
import { TxRewardsComponent } from '../tx-rewards/tx-rewards.component';
import { BsModalService } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {
  buys: any;
  constructor(
    private dataServ: DataService,
    private utilServ: UtilService,
    private modalService: BsModalService,
    private payRewardServ: PayRewardService,
    private buyServ: BuyService
  ) { }

  ngOnInit(): void {
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        if(walletAddress) {
          this.buyServ.getBuysByUser(walletAddress).subscribe(
            res => {
              this.buys = res;
            }
          );
        }
      }
    );
  }

  showCoinName(coinType) {
    return this.utilServ.getCoinNameByTypeId(coinType);
  }

  showRwards(txid) {
    this.payRewardServ.getAllRewardsByTxid(txid).subscribe(
      (rewards: any) => {
        const initialState = {
          rewards
        };          

        this.modalService.show(TxRewardsComponent, { initialState, class: 'modal-lg' });
      }
    );
  }
  
  showAmount(amount) {
    return Number(this.utilServ.showAmount(amount, 18));
  }

  showName(name) {
    return this.utilServ.showName(name);
  }
}
