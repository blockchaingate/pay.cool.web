import { Component, OnInit } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { DataService } from './services/data.service';
import { StoreService } from './services/store.service';
import { WalletService } from './services/wallet.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Pay.cool';
  public href: string = "";
  public isCashierPage: boolean = false;
  constructor(private storage: StorageMap,
    private walletServ: WalletService,
    private dataServ: DataService,
    private storeServ: StoreService,
    private location: Location
  ) {

  }
  ngOnInit() {
    this.href = this.location.path();
    
    this.href = this.href.split('/')[1];

    if (this.href == 'cashier') {
      this.isCashierPage = true;
    }

    this.storage.get('ecomwallets').subscribe(
      (wallets: any) => {
        if (!wallets || !wallets.items || (wallets.items.length == 0)) {
          //this.router.navigate(['/wallet']);
          return false;
        }
        this.walletServ.refreshWallets(wallets);
      }
    );
  }
}
