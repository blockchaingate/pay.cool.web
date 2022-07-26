import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { MemberService } from '../../../services/member.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  email = '';
  walletAddress = '';
  pwd = '';
  pwdConfirm = '';
  invitationCode = '';
  refCodeModify = true;
  errMsg = '';

  constructor(private _router: Router, private _route: ActivatedRoute, private memberServ: MemberService) { }

  ngOnInit() {
    this.invitationCode = this._route.snapshot.paramMap.get('refCode');
    if(this.invitationCode) { this. refCodeModify = false; }
  }

  onSubmit() {
    if (!this.email || this.email.indexOf('@') < 2 || !this.pwd || this.pwd.length < 6) {
      this.errMsg = 'Please enter valid email and password';
      return;
    }

    if (this.pwd !== this.pwdConfirm) {
      this.errMsg = 'Password mismatch';
      return;
    }

    if (!this.walletAddress || this.walletAddress.length < 20) {
      this.errMsg = 'Wallet FAB address required';
      return;
    }

    if(this.invitationCode) {
      this.invitationCode = this.invitationCode.replace('_', '-');
      this.invitationCode = this.invitationCode.replace('－', '-');
      this.invitationCode = this.invitationCode.replace('--', '-');
    }

    const data = {
      email: this.email,
      password: this.pwd,
      invitationCode: this.invitationCode
    }

    if (!data.invitationCode || data.invitationCode.length < 1) { delete data.invitationCode; }

    this.memberServ.createMember(data).then(
      ret => { this._router.navigate(['member/activation']); },
      err => { this.errMsg = err.message; }
    );
  }
}
