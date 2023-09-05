// src/app/auth/auth-guard.service.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { DataService } from './data.service';

@Injectable()
export class WalletGuardService implements CanActivate {
  constructor(
    public router: Router, 
    private dataServ: DataService,
    private localSt: LocalStorage) {}
  canActivate(): Observable<boolean> {
    return this.localSt.getItem('ecomwallets').pipe(
      take(1),
      map((wallets: any) => {
        if(!wallets || !wallets.items || (wallets.items.length == 0)) {
          this.router.navigate(['/wallet']);
          return false;
        }

        const wallet = wallets.items[wallets.currentIndex];

        const addresses = wallet.addresses;
        const walletAddressItem = addresses.filter(item => item.name == 'FAB')[0];
        const walletAddress = walletAddressItem.address;
        this.dataServ.changeWalletAddress(walletAddress);
        return true;
      })
    );
  }
}