import { Component, Input, OnInit } from '@angular/core';
import { statuses } from '../../config/statuses';
import { metaforceProjectId } from '../../config/projectId';
import { UserReferralService } from '../../services/userreferral.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { iif } from 'rxjs';

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
  referral: string;
  statuses = statuses;

  pageSize: number = 10;
  pageNum: number = 0;
  totalCount: number;
  totalPageNum: number = 0; 
  children: any;

  constructor(
    private route: ActivatedRoute,
    private userreferralServ: UserReferralService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
          const user = params.get('id');
          if(user) {
            this.user = user;
            this.changeTab('paycool');
          } else {
            this.changeTab('paycool');
          }
      }
    )
    

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
