import { Component, OnInit, Input } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import * as exaddr from '../../../../../../lib/exaddr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  @Input() multisigwallet: any;
  constructor(private utilServ: UtilService) { }

  ngOnInit(): void {
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
