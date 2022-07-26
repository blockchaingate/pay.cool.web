import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { StarService } from 'src/app/services/star.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-merchant-credit',
  templateUrl: './merchant-credit.component.html',
  styleUrls: ['./merchant-credit.component.scss']
})
export class MerchantCreditComponent implements OnInit {
  merchant_credit_list: any;
  constructor(
    private dataServ: DataService,
    private starServ:StarService, private router: Router, private utilServ: UtilService) { }

  ngOnInit(): void {
    this.dataServ.currentMyStore.subscribe(
      (store: any) => {
        console.log('store==', store);
        if(store && store._id) {
          this.starServ.get7StarMerchantCreditsByStore(store._id).subscribe(
            (ret: any) => {
              if(ret && ret.ok) {
                this.merchant_credit_list = ret._body;
              }
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
}
