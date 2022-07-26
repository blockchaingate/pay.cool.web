import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

import { Member } from '../models/member';

@Injectable()
export class MemberService {
    constructor(private http: HttpService) { }

    // For signup
    public createMember(data) {
        const theBody = {
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            invitationCode: data.invitationCode
        };
        const path = 'members/create';
        return this.http.post(path, theBody, false).toPromise();
    }

    // Get member
    public getMember(data) {
        const path = 'members/findOne';
        return this.http.post(path, data, true).toPromise();
    }

    // Get members
    public getMembers(data) {
        const path = 'members/find';
        return this.http.post(path, data, true).toPromise();
    }

    // Get all members
    public getAllMembers() {
        const path = 'members';
        return this.http.get(path, true).toPromise();
    }

    // Login
    loginMember(email: string, password: string) {
        sessionStorage.removeItem('id_token');
        const theBody = { email, password };
        const path = 'members/login';
        return this.http.post(path, theBody, false).toPromise();
    }

    // Activation
    activation(email: string, activeCode: string) {
        const path = 'members/activation/' + email + '/' + activeCode;
        return this.http.get(path, false).toPromise();
    }

    // Get member by using id
    getMemberById(id: number | string) {
        const path = 'members/' + id;
        return this.http.get(path, true).toPromise();
    }

    // Update member
    updateMember(data) {
        const path = 'members/FindOneAndUpdate';
        return this.http.post(path, data, true).toPromise();
    }

    // Request Password Reset
    requestPwdReset(email: string) {
        const theBody = { email };
        const path = 'members/requestpwdreset';
        return this.http.post(path, theBody, false).toPromise();
    }

    // Execute Password Reset
    executePwdReset(id: string, pwdresetcode: string, passwd: string) {
        const theBody = { id, pwdresetcode, passwd };
        const path = 'members/exepwdreset';
        return this.http.post(path, theBody, true).toPromise();
    }
}
