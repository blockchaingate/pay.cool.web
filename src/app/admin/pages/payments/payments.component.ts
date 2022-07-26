import { Component, OnInit } from '@angular/core';
import { StarService } from '../../../services/star.service';
import { UtilService } from '../../../services/util.service';
import BigNumber from 'bignumber.js';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RewardDetailsComponent } from '../../../shared/modals/reward-details/reward-details.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  modalRef: BsModalRef;
  charges: any;
  pageNum: number;
  pageSize: number;

  constructor(
    private modalService:BsModalService,
    private utilServ: UtilService,
    private router: Router,
    private starSer: StarService) { }

  ngOnInit(): void {
    this.pageNum = 1;
    this.pageSize = 10;
    this.starSer.getStarChargeFunds(this.pageNum, this.pageSize).subscribe(
      (ret: any) => {
        if(ret && ret.ok) {
          this.charges = ret._body;
        }
      }
    );
  }

  prev() {
    if(this.pageNum == 1) {
      return;
    }
    this.pageNum --;
    this.starSer.getStarChargeFunds(this.pageNum, this.pageSize).subscribe(
      (ret: any) => {
        if(ret && ret.ok) {
          this.charges = ret._body;
        }
      }
    );
  }

  next() {
    this.pageNum ++;
    this.starSer.getStarChargeFunds(this.pageNum, this.pageSize).subscribe(
      (ret: any) => {
        if(ret && ret.ok) {
          this.charges = ret._body;
        }
      }
    );
  }
  showCoinName(coinType:number) {
    return this.utilServ.getCoinNameByTypeId(coinType);
  }

  showAmount(amount: number) {
    return new BigNumber(amount).shiftedBy(-18).toNumber()
  }

  showAllRewardDetails() {
    this.router.navigate(['/admin/all-reward-details']);
  }

  showAddr(addr: string) {
    if(!addr) {
      return '';
    }
    return addr.substring(0,3) + '...' + addr.substring(addr.length-3);
  }

  rewardDetails(item) {
    console.log('item===', item);
    const initialState = {
      orderId: item.id,
      paidCoinType: item.coinType
    };          
    
    this.modalRef = this.modalService.show(RewardDetailsComponent, { initialState });
  }
}
