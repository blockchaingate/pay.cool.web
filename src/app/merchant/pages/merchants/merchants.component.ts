import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { MerchantService } from 'src/app/services/merchant.service';

@Component({
  selector: 'app-merchants',
  templateUrl: './merchants.component.html',
  styleUrls: ['./merchants.component.scss']
})
export class MerchantsComponent implements OnInit {
  merchants: any;
  pageSize = 100;
  pageNum = 0;
  walletAddress: string;
  myMerchantExisted: boolean = false;
  constructor(
    private dataServ: DataService,
    private merchantServ: MerchantService,
    private router: Router) { }

  ngOnInit(): void {
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        this.walletAddress = walletAddress;
        this.merchantServ.getMerchantsByAddress(this.walletAddress).subscribe(
          (ret: any) => {
            if(ret && (ret.length > 0)) {
              this.myMerchantExisted = true;
            }
          }
        );
      }
    );

    this.merchantServ.getAllPagination(this.pageNum, this.pageSize).subscribe(
      (ret: any) => {
        if(ret) {
          this.merchants = ret;
        }
      }
    );
  }

  myMerchant() {
    if(this.myMerchantExisted) {
      this.router.navigate(['/merchants/merchant-info']);
    } else {
      this.router.navigate(['/merchants/new-merchant']);
    }
  }


}
