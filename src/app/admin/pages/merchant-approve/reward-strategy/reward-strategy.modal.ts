import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-reward-strategy',
  templateUrl: './reward-strategy.modal.html',
  styleUrls: ['./reward-strategy.modal.scss']
})
export class RewardStrategyModal implements OnInit {
  customer: number = 0;
  customerLv1: number = 0;
  customerLv2: number = 0;
  customerLv3: number = 0;

  merchant: number = 0;
  merchantLv1: number = 0;

  customerNodeLv1: number = 0;
  customerNodeLv2: number = 0;
  customerNodeLv3: number = 0;

  merchantNodeLv1: number = 0;
  merchantNodeLv2: number = 0;
  merchantNodeLv3: number = 0;

  strategy: any;
  public onClose: Subject<any>;
  constructor(private bsModalRef: BsModalRef, private toastr: ToastrService) {

  }
  ngOnInit(): void {
      this.onClose = new Subject();
  }

  confirm() {
      const total = this.customer + this.customerLv1 + this.customerLv2 + this.customerLv3
      + this.merchant + this.merchantLv1 + this.customerNodeLv1 + this.customerNodeLv2 + this.customerNodeLv3
      + this.merchantNodeLv1 + this.merchantNodeLv2 + this.merchantNodeLv3;

      if(total <= 1) {
        this.toastr.error('Total reward is less than 1');
        return;
      }

      if(total > 100) {
        this.toastr.error('Total reward is greater than 100');
        return;
      }
      this.strategy = {
        customer: this.customer,
        customerReferral: [
          this.customerLv1,
          this.customerLv2,
          this.customerLv3
        ],
        merchant: this.merchant,
        merchantReferral: this.merchantLv1,
        customerNodeReferral: [
          this.customerNodeLv1,
          this.customerNodeLv2,
          this.customerNodeLv3
        ],
        merchantNodeReferral: [
          this.merchantNodeLv1,
          this.merchantNodeLv2,
          this.merchantNodeLv3
        ]
      };
      this.onClose.next(this.strategy);
      this.close();
  }

  close() {
      this.bsModalRef.hide();
  }
}
