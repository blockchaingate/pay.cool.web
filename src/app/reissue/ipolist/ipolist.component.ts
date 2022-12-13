import { Component, OnInit } from '@angular/core';
import BigNumber from 'bignumber.js';
import { PayRewardService } from 'src/app/services/payreward.service';

@Component({
  selector: 'app-ipolist',
  templateUrl: './ipolist.component.html',
  styleUrls: ['./ipolist.component.scss', '../../../table.scss']
})
export class IpolistComponent implements OnInit {
  totalAmount: number;
  totalLp: number;
  ipos: any;
  constructor(private payrewardServ: PayRewardService) { }

  ngOnInit(): void {
    this.totalAmount = 0;
    this.totalLp = 0;
    this.payrewardServ.getIpos(1000, 0).subscribe(
      (ret) => {
        this.ipos = ret;
        for(let i = 0; i < ret.length; i++) {
          const item = ret[i];
          this.totalAmount = new BigNumber(this.totalAmount).plus(new BigNumber(item.amount)).toNumber();
          this.totalLp = new BigNumber(this.totalLp).plus(new BigNumber(item.liquidity)).toNumber();
        }
      }
    );
  }

}
