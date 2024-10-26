import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'progress-modal',
    templateUrl: './progress.component.html'
})
export class ProgressModalComponent {
    txids: any;

    constructor(private _bsModalRef: BsModalRef) { }

    public ngOnInit(): void {
    }

    public closeDialog() {
        this._bsModalRef.hide();
    }

    public onConfirm(): void {

        this._bsModalRef.hide();
    }

    public onCancel(): void {
        this._bsModalRef.hide();
    }

}