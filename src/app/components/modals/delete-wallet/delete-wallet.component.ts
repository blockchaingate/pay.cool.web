import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'delete-wallet-modal',
    templateUrl: './delete-wallet.component.html'
})
export class DeleteWalletModalComponent {
    public onClose: Subject<boolean>;
    checked = false;

    constructor(private _bsModalRef: BsModalRef) { }

    public ngOnInit(): void {
        this.onClose = new Subject();
    }

    public closeDialog() {
        this._bsModalRef.hide();
    }

    public onConfirm(): void {
        if(!this.checked) return;
        // this.localSt.removeItem('7star_ref').subscribe(() => { });

        this.onClose.next(true);
        this._bsModalRef.hide();
    }

    public onCancel(): void {
        this.onClose.next(false);
        this._bsModalRef.hide();
    }

    confirmRead(cb) {
        this.checked =cb.checked;
    }
}