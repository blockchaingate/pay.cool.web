import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { MemberService } from '../../../services/member.service';
import { UserAuth } from '../../../services/user-auth.service'

@Component({
  selector: 'app-sign-in',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SignInComponent implements OnInit {
  email: string;
  password: string;
  repassword: string;
  mnemonic: string;
  errMsg = '';

  constructor(private _router: Router, private _route: ActivatedRoute, private memberServ: MemberService, private userAuth: UserAuth) { }

  ngOnInit() {
  }

  onSubmit() {
    this.errMsg = '';
    if (!this.email || this.email.indexOf('@') < 2 || !this.password || this.password.length < 4) {
      this.errMsg = 'Please enter valid email and password';
      return;
    }
    this.memberServ.loginMember(this.email, this.password).then(
      ret => {
        this.userAuth.loginStatus = true;
        this.userAuth.token = ret['token'];
        this.userAuth.displayName = ret['displayName'];
        this.userAuth.email = ret['email'];
        this._router.navigate(['member/profile', { id: ret['id'], referralCode: ret['referralCode'] }]);
      },
      err => { this.errMsg = err.message; }
    )
  }
}
