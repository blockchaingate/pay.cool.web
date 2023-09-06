import { Component, OnInit, Input } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ReceiveComponent } from '../../receive/receive.component';
import { UtilService } from 'src/app/services/util.service';
import * as exaddr from '../../../../../../lib/exaddr';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit {
  @Input() multisigwallet: any;
  address: string;
  bsModalRef?: BsModalRef;
  constructor(
    private modalService: BsModalService, 
    private utilServ: UtilService) {}

  ngOnInit(): void {
  }

  openReceiveModal() {

    const initialState = {
      multisigwallet: this.multisigwallet
    };

    this.bsModalRef = this.modalService.show(ReceiveComponent, { initialState });

    this.bsModalRef.content.closeBtnName = 'Close';
  }

  copy() {
    let address = this.multisigwallet.address;
    if(this.multisigwallet.chain == 'KANBAN') {

      address = this.utilServ.exgToFabAddress(address);
      address = exaddr.toKbpayAddress(address);
    }
    this.utilServ.copy(address);
  }

  scan() {
    let url = '';
    const address = this.multisigwallet.address;
    switch(this.multisigwallet.chain) {
      case 'KANBAN': 
        url = 'https://' + (environment.production ? '' : 'test.') + 'exchangily.com/explorer/address-detail/' + address;
        break;
      case 'ETH': 
        url = 'https://' + (environment.production ? '' : 'goerli.') + 'etherscan.io/address/' + address;
        break;
      case 'BNB': 
        url = 'https://' + (environment.production ? '' : 'testnet.') + 'bscscan.com/address/' + address;
        break;
    }
    window.open(url, '_blank');
  }
}
