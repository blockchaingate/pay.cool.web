import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent {
  @Input() transaction: any;
  @Input() chain: string;
  link() {
    let url = '';
    const txid = this.transaction.link_data;
    switch(this.chain) {
      case 'KANBAN': 
        url = 'https://' + (environment.production ? '' : 'test.') + 'exchangily.com/explorer/tx-detail/' + txid;
        break;
      case 'ETH': 
        url = 'https://' + (environment.production ? '' : 'goerli.') + 'etherscan.io/tx/' + txid;
        break;
      case 'BNB': 
        url = 'https://' + (environment.production ? '' : 'testnet.') + 'bscscan.com/tx/' + txid;
        break;
    }
    return url;
  }
}
