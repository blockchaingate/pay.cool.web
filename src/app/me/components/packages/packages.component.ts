import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { BuyService } from 'src/app/services/buy.service';
import { UtilService } from 'src/app/services/util.service';
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

  showAmount(amount) {
    return Number(this.utilServ.showAmount(amount, 18));
  }

  showName(name) {
    return this.utilServ.showName(name);
  }
}
