import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserReferralService } from 'src/app/services/userreferral.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-referrals',
  templateUrl: './user-referrals.component.html',
  styleUrls: ['./user-referrals.component.scss']
})
export class UserReferralsComponent implements OnInit {
  users: any;

  constructor(
    private router: Router,
    private userreferralServ: UserReferralService) { }

  ngOnInit(): void {
    this.userreferralServ.getTree(environment.addresses.Referral_ROOT).subscribe(
      (items) => {
        this.users = items;
      }
    );
  }

  showId(id: string) {
    return id.substring(0,5) + '...' + id.substring(id.length - 5);
  }

  showStatus(item: any) {
    let status = item.status;
    if(item.newStatus && (item.newStatus > item.status)) {
      status = item.newStatus;
    }
    return status;
  }

  edit(userAddress: string) {
    this.router.navigate(['/admin/user-edit/' + userAddress]);
  }

  
}
