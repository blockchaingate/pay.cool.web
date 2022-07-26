import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
    selector: 'show-seed-phrase-modal',
    templateUrl: './show-seed-phrase.modal.html',
    styleUrls: ['./show-seed-phrase.modal.css']
})
export class ShowSeedPhraseModal implements OnInit{
    seedPhrase: string;
    xPub: string;
    showXpub: boolean;
    constructor(
        private walletServ: WalletService,
        private modalRef: BsModalRef) {
    }

    ngOnInit() {
        this.showXpub = false;
        this.xPub = this.walletServ.getXpub(this.seedPhrase);
    }
    close() {
        this.modalRef.hide();
    } 

    show() {
        this.showXpub = true;
    }

}
