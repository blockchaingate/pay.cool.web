import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { UserAuth } from '../../../services/user-auth.service'

@Component({
  selector: 'app-profle',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  selectCode = 1;
  email: string;
  memberId: string;
  referralCode: string;

  constructor(private _router: Router, private _route: ActivatedRoute, private _userAuth: UserAuth) { }

  ngOnInit() {
    this._route.params.subscribe(params => {
      this.memberId = params['id'];
      this.referralCode = this._userAuth.selectedCampaignId + '-' + params['referralCode'];
  });
}

  onSubmit() {
    // alert('email: ' + this.email );
  }
}
