import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modify-referral-modal',
  templateUrl: './modify-referral.modal.html',
  styleUrls: ['./modify-referral.modal.scss']
})
export class ModifyReferralModalComponent implements OnInit{
    referral: string;
    public onClose: Subject<string>;
    constructor(private bsModalRef: BsModalRef) {

    }
    ngOnInit(): void {
        this.onClose = new Subject();
    }

    confirm() {
        this.onClose.next(this.referral);
        this.close();
    }

    close() {
        this.bsModalRef.hide();
    }
}
