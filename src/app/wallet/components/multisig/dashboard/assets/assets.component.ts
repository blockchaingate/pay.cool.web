import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { MultisigService } from 'src/app/services/multisig.service';

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
  constructor(
    private localSt: LocalStorage, 
    private multisigServ: MultisigService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.localSt.getItem('multisigwallets').subscribe({next: (wallets: any) => {
      const multisigwallet = wallets.items[wallets.currentIndex];
      this.multisigwallet = multisigwallet;
      const chain = multisigwallet.chain;
      const address = multisigwallet.address;
      this.chain = chain;
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

  send(id: string) {
    const url = '/wallet/multisig/dashboard/send/' + id;
    this.router.navigate([url]);
  }
}
