import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { MemberService } from '../../../services/member.service';
import { UserAuth } from '../../../services/user-auth.service';

@Component({
    selector: 'app-activation',
    templateUrl: './activation.component.html',
    styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit {
    email = '';
    activationCode = '';
    errMsg: string;
    sucMsg: string;

    constructor(private _router: Router, private _route: ActivatedRoute,
        private _memberService: MemberService, private _userAuth: UserAuth) {
    }

    ngOnInit() {
        this.email = this._route.snapshot.paramMap.get('email');
        this.activationCode = this._route.snapshot.paramMap.get('acode');
    }

    onSubmit() {
        if(this.email && this.activationCode) {
            this._memberService.activation(this.email, this.activationCode)
            .then(ret => this._router.navigate(['member/signin']), err => this.errMsg = err.message);
        } else {
            this.errMsg = 'Please enter valid email and activation code';
        }
    }
}
