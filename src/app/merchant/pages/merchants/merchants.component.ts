import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(
    private merchantServ: MerchantService,
    private router: Router) { }

  ngOnInit(): void {
    this.merchantServ.getAllPagination(this.pageNum, this.pageSize).subscribe(
      (ret: any) => {
        if(ret) {
          this.merchants = ret;
        }
      }
    );
  }

  myMerchant() {
    this.router.navigate(['/merchants/new-merchant']);
  }

}
