import { Component, OnInit } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { DataService } from './services/data.service';
import { StoreService } from './services/store.service';
import { WalletService } from './services/wallet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = '7StarPay';
  constructor(private localSt: LocalStorage,
    private walletServ: WalletService,
    private dataServ: DataService,private storeServ: StoreService) {
    
  }
  ngOnInit() {
    this.localSt.getItem('ecomwallets').subscribe(
      (wallets: any) => {
        console.log('wallets===', wallets);
        if(!wallets || !wallets.items || (wallets.items.length == 0)) {
          //this.router.navigate(['/wallet']);
          return false;
        }
        this.walletServ.refreshWallets(wallets);

              
      }
    );
  }
}
