import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { MultisigService } from 'src/app/services/multisig.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {

  multisigwallet: any;
  native: number;
  tokens: any;
  chain: string;
  ethAddress: string;
  kanbanAddress: string;
  wallet: any;
  sendable: boolean;
  constructor(
    private localSt: LocalStorage, 
    private multisigServ: MultisigService,
    private utilServ: UtilService,
    private router: Router
    ) { }

  ngOnInit(): void {



    this.localSt.getItem('multisigwallets').subscribe({next: (wallets: any) => {
      const multisigwallet = wallets.items[wallets.currentIndex];
      this.multisigwallet = multisigwallet;
      const chain = multisigwallet.chain;
      const address = multisigwallet.address;
      this.chain = chain;

      this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

        if (!wallets || (wallets.length == 0)) {
          return;
        }
        this.wallet = wallets.items[wallets.currentIndex];
  
        this.loadWallet();
  
      });

      this.multisigServ.getAssets(chain, address).subscribe(
        (ret: any) => {
          if(ret.success) {
            const data = ret.data;
            this.native = data.native;
            this.tokens = data.tokens;
          }
        }
      );
    }});
  }

  loadWallet() {

    const addresses = this.wallet.addresses;
    for(let i = 0; i < addresses.length;i++) {
      const item = addresses[i];
      const name = item.name;
      const address = item.address;
      if(name == 'ETH') {
        this.ethAddress = address;
      } 
      else if(name == 'FAB') {
        this.kanbanAddress = this.utilServ.fabToExgAddress(address);
      }
    }


    const selfAddress = ((this.chain == 'KANBAN') ? this.kanbanAddress : this.ethAddress);
    console.log('selfAddress==', selfAddress);
    if(!selfAddress) {
      return false;
    }
    const owners = this.multisigwallet.owners;


    this.sendable = false;

    for(let i = 0; i < owners.length; i++) {
      const address = owners[i].address;
      console.log('address of owners=', address);
      if(address.toLowerCase() == selfAddress.toLowerCase()) {
        this.sendable = true;
      }
    }
    console.log('sendable===', this.sendable);

  }

  send(id: string) {
    const url = '/wallet/multisig/dashboard/send/' + id;
    this.router.navigate([url]);
  }
}