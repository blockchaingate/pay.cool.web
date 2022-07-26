import { Component, Input, OnInit } from '@angular/core';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-admin-assets-list',
  providers: [],
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.scss', '../../../../table.scss']
})
export class AssetsListComponent implements OnInit{
    @Input() assets;
    constructor(private utilServ: UtilService) {

    }
    ngOnInit() {
      
    }
    showCoinName(coinType: number) {
      return this.utilServ.getCoinNameByTypeId(coinType);
    }

    getTotalBalance(coin: any) {
      return Number(coin.lockBalance ? coin.lockBalance : '0') + Number(coin.balance ? coin.balance : '0');
    }

    showAmount(amount: string) {
      return this.utilServ.showAmount(amount, 18);
    }
    getTotalValue(coin: any) {
      return this.getTotalBalance(coin) * Number(coin.usdValue.USD);
    }
}