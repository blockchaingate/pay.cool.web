import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { MerchantService } from 'src/app/services/merchant.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-merchant-credit',
  templateUrl: './merchant-credit.component.html',
  styleUrls: ['./merchant-credit.component.scss']
})
export class MerchantCreditComponent implements OnInit {
  merchant_credit_list: any;
  merchant_credit_charger_list: any;
  constructor(
    private dataServ: DataService,
    private merchantServ:MerchantService, 
    private router: Router, private utilServ: UtilService) { }

  ngOnInit(): void {
    this.dataServ.currentMyStore.subscribe(
      (store: any) => {
        console.log('storedddd==', store);
        if(store && store._id) {
          this.merchantServ.getMerchantCreditsByID(store.id).subscribe(
            (ret: any) => {
              this.merchant_credit_list = ret;
            }
          );
          this.merchantServ.getMerchantCreditChargersByID(store.id).subscribe(
            (ret: any) => {
              this.merchant_credit_charger_list = ret;
            }
          );
        }
      } 
    );

  }

  getCoinName(coinType: number) {
    const coinName = this.utilServ.getCoinNameByTypeId(coinType);
    return coinName;
  }
  
  add() {
    this.router.navigate(['/merchants/merchant-credit/add']);
  }

  setCharger() {
    this.router.navigate(['/merchants/merchant-credit/add-charger']);
  }
}
