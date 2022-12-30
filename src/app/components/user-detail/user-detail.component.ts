import { Component, Input, OnInit } from '@angular/core';
import { statuses } from '../../config/statuses';
import { metaforceProjectId } from '../../config/projectId';
import { UserReferralService } from '../../services/userreferral.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BuyService } from 'src/app/services/buy.service';
import { UtilService } from 'src/app/services/util.service';
import { PayRewardService } from 'src/app/services/payreward.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TxRewardsComponent } from '../../me/components/tx-rewards/tx-rewards.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  @Input() user: string;

  tabName: string;
  pv: number;
  gv: number;
  users: any;
  buys: any;
  icos: any;
  myicoRewards: any;
  myRewards: any;
  referral: string;
  status: number;
  dateCreated: any;
  statuses = statuses;

  pageSize: number = 10;
  pageNum: number = 0;
  totalCount: number;
  totalPageNum: number = 0; 
  children: any;

  constructor(
    private route: ActivatedRoute,
    private buyServ: BuyService,
    private modalService: BsModalService,
    private utilServ: UtilService,
    private payRewardServ: PayRewardService,
    private userreferralServ: UserReferralService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
          const user = params.get('id');
          if(user) {
            this.user = user;
            this.getBuys();
            this.getIcos();
            this.getMyIcoRewards();
            this.getMyRewards();
            this.changeTab('paycool');
          } else {
            this.changeTab('paycool');
            this.getBuys();
            this.getIcos();
            this.getMyIcoRewards();
            this.getMyRewards();
          }
      }
    )
    

  }

  showIcoRwards(icoid) {
    this.payRewardServ.getAllIcoRewardsById(icoid).subscribe(
      (rewards: any) => {
        console.log('rewards===', rewards);
        const initialState = {
          rewards
        };          

        this.modalService.show(TxRewardsComponent, { initialState, class: 'modal-lg' });
      }
    );
  }

  showRwards(txid) {
    this.payRewardServ.getAllRewardsByTxid(txid).subscribe(
      (rewards: any) => {
        console.log('rewards===', rewards);
        const initialState = {
          rewards
        };          

        this.modalService.show(TxRewardsComponent, { initialState, class: 'modal-lg' });
      }
    );
  }

  showCoinName(coinType) {
    return this.utilServ.getCoinNameByTypeId(coinType);
  }

  showAmount(amount) {
    return Number(this.utilServ.showAmount(amount, 18));
  }

  showName(name) {
    return this.utilServ.showName(name);
  }

  getBuys() {
    this.buyServ.getBuysByUser(this.user).subscribe(
      res => {
        this.buys = res;
      }
    );
  }

  getIcos() {
    this.buyServ.getIcosByUser(this.user).subscribe(
      res => {
        this.icos = res;
      }
    );
  }

  getMyIcoRewards() {
    this.payRewardServ.getIcoRewardsByUser(this.user).subscribe(
      res => {
        this.myicoRewards = res;
      }
    );
  }
  
  getMyRewards() {
    this.payRewardServ.getRewardsByUser(this.user).subscribe(
      res => {
        this.myRewards = res;
      }
    );
  }

  showStatus(status: any) {
    const statuses = this.statuses.filter(item => item.value == status);
    if(statuses && statuses.length > 0) {
      return statuses[0].text;
    }
    return '';
  }

  changeParentAddress(parentAddress: string) {
    this.user = parentAddress;
    this.userreferralServ.get(this.user).subscribe(
      (ret: any) => {
        this.referral = ret.referral;
        this.status = ret.status;
        this.dateCreated = ret.dateCreated;
        if(ret.newStatus && ret.newStatus > this.status) {
          this.status = ret.newStatus;
        }
      }
    );
    this.userreferralServ.getChildrenTotalCount(this.user).subscribe(
      (ret: any) => {
        this.totalCount = ret.totalCount;
        this.totalPageNum = this.totalCount / this.pageSize;
      }
    );
    this.gotoPage(0);
  }


  gotoPage(pageNum: number) {
    if(pageNum < 0 || (pageNum > this.totalPageNum)) {
      return;
    }
    this.pageNum = pageNum;
    if(this.tabName == 'paycool') {
      this.userreferralServ.getChildren(this.user, this.pageSize, this.pageNum).subscribe(
        (ret: any) => {
          this.users = ret;
        }
      );
    } else 
    if(this.tabName == 'metaforce'){
      this.userreferralServ.getProjectUserChildren(metaforceProjectId, this.user, this.pageSize, this.pageNum).subscribe(
        (ret: any) => {
          this.users = ret;
        }
      );
    }
  } 

  changeTab(tab: string) {
    this.tabName = tab;
    if(tab == 'paycool') {
      this.pv = 0;
      this.gv = 0;
      this.userreferralServ.getChildren(this.user, this.pageSize, this.pageNum).subscribe(
        (ret: any) => {
          this.users = ret;
        }
      );

      this.userreferralServ.get(this.user).subscribe(
        (ret: any) => {
          this.referral = ret.referral;
          this.status = ret.status;
          this.dateCreated = ret.dateCreated;
          if(ret.newStatus && ret.newStatus > this.status) {
            this.status = ret.newStatus;
          }
        }
      );
      this.userreferralServ.getChildrenTotalCount(this.user).subscribe(
        (ret: any) => {
          this.totalCount = ret.totalCount;
          this.totalPageNum = this.totalCount / this.pageSize;
        }
      );

    } else 
    if(tab == 'metaforce') {
      this.userreferralServ.getProjectUserChildren(metaforceProjectId, this.user, this.pageSize, this.pageNum).subscribe(
        (ret: any) => {
          this.users = ret;
        }
      );

      this.userreferralServ.getProjectUser(metaforceProjectId, this.user).subscribe(
        (ret: any) => {
          this.referral = ret.referral;
          this.pv = ret.pv;
          this.gv = ret.gv;
          this.dateCreated = ret.dateCreated;

          this.status = ret.status;
          if(ret.newStatus && ret.newStatus > this.status) {
            this.status = ret.newStatus;
          }
        }
      );

      this.userreferralServ.getProjectUserChildrenTotalCount(metaforceProjectId, this.user).subscribe(
        (ret: any) => {
          this.totalCount = ret.totalCount;
          this.totalPageNum = this.totalCount / this.pageSize;
        }
      );
    }
  }

}
