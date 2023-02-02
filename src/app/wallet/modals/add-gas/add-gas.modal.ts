import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { AirdropService } from '../../../services/airdrop.service';
import { HttpClient } from '@angular/common/http';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
    selector: 'add-gas-modal',
    templateUrl: './add-gas.modal.html',
    styleUrls: ['./add-gas.modal.scss']
})
export class AddGasModal implements OnInit {
    public onClose: Subject<any>;
    address: string;
    amount: number;
    
    publicIP: string;
    constructor(
        private modalRef: BsModalRef) {

    }

    ngOnInit() {
        this.onClose = new Subject();
    }

    onSubmit() {
        this.onClose.next(this.amount);
        this.close();
    }

    close() {
        this.modalRef.hide();
    }      
}
