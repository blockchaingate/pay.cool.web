import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import BigNumber from 'bignumber.js';
import { ToastrService } from 'ngx-toastr';
import { UserpayService } from 'src/app/services/userpay.service';
import { UserReferralService } from 'src/app/services/userreferral.service';
@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.scss']
})
export class ClaimComponent implements OnInit {
  order: any;
  address: string;
  code: string;
  currency: string;
  totalAmount: number;
  rewardAmount: number;
  
  constructor(
    private route: ActivatedRoute, 
    private toastr: ToastrService,
    private userreferralServ: UserReferralService,
    private userpayServ: UserpayService) {

  }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
          const code = params.get('code');
          this.userpayServ.getOrderByCode(code).subscribe(
            (order: any) => {
              this.order = order;
              this.code = order.code;
              this.currency = order.currency;
              this.totalAmount = order.totalAmount;
              this.rewardAmount = new BigNumber(this.totalAmount).multipliedBy(new BigNumber(0.2)).toNumber();
            }
          );
      }
    );
  }

  claim() {
    this.userreferralServ.get(this.address).subscribe(
      {
        next: (user: any) => {
          if(!user) {
            this.toastr.info('User not in Paycool, please enroll and try again');
            return;
          }
          this.userpayServ.claimReward(this.code, this.address).subscribe({
            next: (order: any) => {
              this.order = order;
              this.toastr.info('Your reward is pending');
            },
            error: (error: any) => {
              this.toastr.info(error.error.error);
            }
          }

          );
        },
        error: (error: any) => {
          console.log('error===', error);
          this.toastr.info(error.error.error);
        }
      }
      

    );


  }
}
