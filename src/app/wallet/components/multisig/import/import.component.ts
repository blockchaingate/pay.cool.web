import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MultisigService } from 'src/app/services/multisig.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import * as exaddr from '../../../../lib/exaddr';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  step = 1;
  address: string;
  multisig: any;
  wallets: any;
  constructor(
    private localSt: LocalStorage,
    private router: Router,
    private multisigServ: MultisigService,
    private utilServ: UtilService,
    private toastServ: ToastrService
    ) { }

  ngOnInit(): void {
    this.localSt.getItem('multisigwallets').subscribe((wallets: any) => {
      this.wallets = wallets;
    });
  }

  back() {
    this.step = 1;
  }

  confirm() {
    
    let wallets = this.wallets;
      if (!wallets) {
        wallets = {
          currentIndex: 0,
          items: [this.multisig]
        };
      } else {
        wallets.items.push(this.multisig);
        wallets.currentIndex = wallets.items.length - 1;
      }
      this.localSt.setItem('multisigwallets', wallets).subscribe(() => {
        this.router.navigate(['/wallet/multisig/dashboard']);
      });
  }

  import() {
    let addressHex = this.address;
    if(addressHex.indexOf('0x') < 0) {
      addressHex = exaddr.toLegacyAddress(addressHex);
      addressHex = this.utilServ.fabToExgAddress(addressHex);
    }
    addressHex = addressHex.toLowerCase();
    if(this.wallets) {
      const items = this.wallets.items;
      if(items) {
        for(let i = 0; i < items.length; i++) {
          const address = items[i].address;
          if(address.toLowerCase() == addressHex) {
            this.toastServ.info('You already have the wallet');
            return;
          }
        }
      }
    }
    this.multisigServ.getByAddress(addressHex).subscribe(
      {
        next: (ret: any) => {
          if(ret.success) {
            const data = ret.data;
            this.multisig = data;
            this.step = 2;
          } else {
            this.toastServ.error('Error while getting multisig wallet by addess');
          }
        },
        error: (error: any) => {
          this.toastServ.error(error);
        }
      }
    );
  }
}
