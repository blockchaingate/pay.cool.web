import { Component, OnInit } from '@angular/core';
import BigNumber from 'bignumber.js';
import { PayRewardService } from 'src/app/services/payreward.service';
import { statuses } from '../../config/statuses';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ipolist',
  templateUrl: './ipolist.component.html',
  styleUrls: ['./ipolist.component.scss', '../../../table.scss']
})
export class IpolistComponent implements OnInit {
  statuses = statuses;
  totalAmount: number;
  totalLp: number;
  ipos: any;
  isAdmin: boolean;
  constructor(
    private payrewardServ: PayRewardService, 
    private router : Router) { }

  ngOnInit(): void {
    const href = this.router.url;
    this.isAdmin = (href == '/reissue/ipo');
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

  delete(ipoid) {
    this.payrewardServ.deleteIpo(ipoid).subscribe(
      (ret) => {
        this.ipos = this.ipos.filter(item => item._id != ipoid);
      }
    );
  }
  showStatusText(status) {
    const statuses = this.statuses.filter(item => item.value == status);
    if(statuses && statuses.length > 0) {
      return statuses[0].text;
    }
    return '';
  }

}
