import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserReferralService } from 'src/app/services/userreferral.service';
import { statuses } from '../../../config/statuses';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-referrals',
  templateUrl: './user-referrals.component.html',
  styleUrls: ['./user-referrals.component.scss']
})
export class UserReferralsComponent implements OnInit {
  users: any;
  user: string;
  pageSize = 10;
  pageNum = 0;
  statuses = statuses;
  totalCount: number;
  totalPageNum: number = 0; 
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private userreferralServ: UserReferralService) { }

  ngOnInit(): void {

    //this.userreferralServ.get
    this.userreferralServ.getAllUsers(this.pageSize, this.pageNum).subscribe(
      (ret: any) => {
        this.users = ret;
      }
    );
    this.userreferralServ.getAllUsersTotalCount().subscribe(
      (ret: any) => {
        this.totalCount = ret.totalCount;
        this.totalPageNum = this.totalCount / this.pageSize;
      }
    );
  }

  search() {
    this.userreferralServ.get(this.user).subscribe(
      (user: any) => {
        if(!user) {
          this.toastr.info('User not found');
          return;
        }
        this.users = [user];
        this.totalCount = 1;
        this.totalPageNum = this.totalCount / this.pageSize;
      }
    );
  }

  gotoPage(pageNum: number) {
    if(pageNum < 0 || (pageNum > this.totalPageNum)) {
      return;
    }
    this.pageNum = pageNum;
    this.userreferralServ.getAllUsers(this.pageSize, this.pageNum).subscribe(
      (ret: any) => {
        this.users = ret;
      }
    );
  } 

  showStatus(item: any) {
    let status = item.status;
    if(item.newStatus && item.newStatus > item.status) {
      status = item.newStatus;
    }
    status = status % 8;
    const statuses = this.statuses.filter(item => item.value == status);
    if(statuses && statuses.length > 0) {
      return statuses[0].text;
    }
    return '';
  }

  edit(userAddress: string) {
    this.router.navigate(['/admin/user-edit/' + userAddress]);
  }

  
}
