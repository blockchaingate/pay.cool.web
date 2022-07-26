import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../../services/wallet.service';

@Component({
  selector: 'app-admin-create-wallet',
  providers: [],
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.scss']
})
export class CreateWalletComponent implements OnInit{
  mnemonics: any;
   constructor(
     private walletServ: WalletService) {
    }

    ngOnInit() {
      let words = this.walletServ.generateMnemonic();
      sessionStorage.mnemonic = words;
      this.mnemonics = words.split(' ');
    }

}