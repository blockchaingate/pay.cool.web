import { Component, Input, OnInit } from '@angular/core';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-admin-coins-list',
  providers: [],
  templateUrl: './coins-list.component.html',
  styleUrls: ['./coins-list.component.scss', '../../../../table.scss']
})
export class CoinsListComponent implements OnInit{
    @Input() coins;
    constructor(private utilServ: UtilService) {

    }
    ngOnInit() {
      
    }
    showCoinName(coinName: string) {
      return this.utilServ.showCoinName(coinName);
    }

    getTotalBalance(coin: any) {
      return Number(coin.lockBalance ? coin.lockBalance : '0') + Number(coin.balance ? coin.balance : '0');
    }

    getTotalValue(coin: any) {
      return this.getTotalBalance(coin) * Number(coin.usdValue.USD);
    }
}