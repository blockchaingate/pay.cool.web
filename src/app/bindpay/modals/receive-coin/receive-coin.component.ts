import { Component} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
@Component({
    selector: 'modal-receive-coin',
    templateUrl: './receive-coin.component.html',
    styleUrls: ['./receive-coin.component.scss']
})
export class ReceiveCoinModal {
    modalRef: BsModalRef;
    exAddr: string;
    link: string;
    constructor() {

    }

    copyAddress() {
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = this.exAddr;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }
    
    dlDataUrlBin() {
        const y = document.getElementById('address_qr_code').getElementsByTagName('canvas')[0];
        if(y) {
            var link = y.toDataURL("image/png");
            this.link = link;   
        }
     
    }
}
