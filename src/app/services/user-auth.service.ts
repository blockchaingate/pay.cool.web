import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of as observableOf } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserAuth {
    private _isLoggedIn = false;
    private _hasMerchant = false;
    private _hasWriteAccess = false;
    private _id;
    private _displayName;
    private _email;
    private _token;
    private _kyc;
    private _kycNote = '';
    private _lan = 'en';
    private _selectedCampaignId = 2;

    manageNews = 0;
    manageEmployee = 0;
    manageFinance = 0;
    manageCoins = 0;

    // store the URL so we can redirect after logging in
    redirectUrl: string;

    constructor() {
        if (!this._token) {
            const tken = sessionStorage.getItem('id_token');
            if (tken) {
                this._token = tken;
            }
        }
    }

    get id() { return this._id; }

    set id(newId) { this._id = newId; }

    get displayName() { return this._displayName; }

    set displayName(dispName) { this._displayName = dispName; }

    get kyc() { return this._kyc; }

    set kyc(theKyc) {
        this._kyc = theKyc;
    }

    get kycNote() { return this.kycNote; }

    set kycNote(kycNote) { this._kycNote = kycNote; }

    get email() { return this._email; }

    set email(email) { this._email = email; }

    get token() { return this._token; }

    set token(token) {
        this._token = token;
    }

    set hasMerchant(hasMerchant: boolean) {
        this._hasMerchant = hasMerchant;
    }

    get hasMerchant(): boolean {
        return this._hasMerchant;
    }

    set language(lan: string) {
        this._lan = lan;
    }

    get language(): string {
        return this._lan;
    }

    get lanCode(): string {
        return this.language.toUpperCase();
    }

    set hasWrite(hasWriteAccess: boolean) {
        this._hasWriteAccess = hasWriteAccess;
    }

    get hasWrite(): boolean {
        return this._hasWriteAccess;
    }

    set loginStatus(isLoggedIn: boolean) {
        this._isLoggedIn = isLoggedIn;
    }

    get loginStatus(): boolean {
        return this._isLoggedIn;
    }

    set selectedCampaignId(campaignId: number) {
        this._selectedCampaignId = campaignId;
    }

    get selectedCampaignId(): number {
        return this._selectedCampaignId;
    }

    login(): Observable<boolean> {
        return observableOf(true).pipe(delay(1000).apply(val => this._isLoggedIn = true));
    }

    logout(): void {
        this._isLoggedIn = false;
        this._hasWriteAccess = false;
    }
}
