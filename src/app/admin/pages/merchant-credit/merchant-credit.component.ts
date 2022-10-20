import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MerchantService } from 'src/app/services/merchant.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-merchant-credit',
  templateUrl: './merchant-credit.component.html',
  styleUrls: ['./merchant-credit.component.scss']
})
export class MerchantCreditComponent implements OnInit {
  merchant_credit_list: any;
  constructor(
    private merchantServ:MerchantService, 
    private router: Router, 
    private utilServ: UtilService) { }

  ngOnInit(): void {

    this.merchantServ.getMerchantCredits(100, 0).subscribe(
      (ret: any) => {
        this.merchant_credit_list = ret;
      }
    );
  }

  showId(id: string) {
    return id.substring(0, 3) + '...' + id.substring(id.length - 3);
  }
  
  getCoinName(coinType: number) {
    const coinName = this.utilServ.getCoinNameByTypeId(coinType);
    return coinName;
  }
  
  add() {
    this.router.navigate(['/admin/merchant-credit/add']);
  }

}
