import { Component, OnInit } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  address: string;
  chain: string = 'KANBAN';
  gasPrice: number = 40;
  gasLimit: number = 100000;
  confirmations: number = 1;
  owners: any = [
    {
      name: '',
      address: ''
    },
    {
      name: '',
      address: ''
    }
  ];
  wallet: any;
  wallets: any;
  constructor(private localSt: LocalStorage) { }

  ngOnInit(): void {
    this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

      if (!wallets || (wallets.length == 0)) {
        return;
      }
      this.wallets = wallets;
      this.wallet = wallets.items[wallets.currentIndex];

      this.loadWallet();

    });
  }

  loadWallet() {
    const addresses = this.wallet.addresses;
    let chain = this.chain;
    if(chain == 'KANBAN') {
      chain = 'FAB';
    }
    if(chain == 'BNB') {
      chain = 'ETH';
    }
    const addressItems = addresses.filter(item => item.name == chain);
    if(!addressItems || (addressItems.length == 0)) {
      return;
    }
    const address = addressItems[0].address;
    this.address = address;
  }

  confirm() {
    console.log('this.gasPrice=', this.gasPrice);
    
  }

  onWalletChange(walletIndex) {
    this.wallet = this.wallets.items[walletIndex];
    this.loadWallet();
  }
}
