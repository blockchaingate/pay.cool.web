import { Component, OnInit } from '@angular/core';
import { PayRewardService } from 'src/app/services/payreward.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PayrewardDiffDetailComponent } from '../payreward-diff-detail/payreward-diff-detail.component';

@Component({
  selector: 'app-payreward-diff',
  templateUrl: './payreward-diff.component.html',
  styleUrls: ['./payreward-diff.component.scss']
})
export class PayrewardDiffComponent implements OnInit {
  pageSize = 5;
  pageNum = 0;
  payrewardDiffs: any;

  constructor(
    private modalService: BsModalService,
    private payrewardServ: PayRewardService) { }

  ngOnInit(): void {
    this.payrewardServ.getPayRewardDiff(this.pageSize, this.pageNum).subscribe(
      ret => {
        this.payrewardDiffs = ret;
      }
    );
  }

  changePageNum(pageNum: number) {
    if(pageNum < 0) {
      pageNum = 0;
    }
    this.pageNum = pageNum;
    this.payrewardServ.getPayRewardDiff(this.pageSize, this.pageNum).subscribe(
      ret => {
        this.payrewardDiffs = ret;
      }
    );
  }

  showDetails(item) {
    const initialState = {
      item
    };          

    this.modalService.show(PayrewardDiffDetailComponent, { initialState, class: 'modal-lg' });
  }
}
