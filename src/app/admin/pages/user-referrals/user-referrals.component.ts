import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserReferralService } from 'src/app/services/userreferral.service';
import { statuses } from '../../../config/statuses';

@Component({
  selector: 'app-user-referrals',
  templateUrl: './user-referrals.component.html',
  styleUrls: ['./user-referrals.component.scss']
})
export class UserReferralsComponent implements OnInit {
  users: any;
  pageSize = 10;
  pageNum = 0;
  statuses = statuses;
  totalCount: number;
  totalPageNum: number = 0; 
  constructor(
    private router: Router,
    private userreferralServ: UserReferralService) { }

  ngOnInit(): void {

    this.userreferralServ.get
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

  showId(id: string) {
    return id.substring(0,5) + '...' + id.substring(id.length - 5);
  }

  showStatus(status: any) {
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
