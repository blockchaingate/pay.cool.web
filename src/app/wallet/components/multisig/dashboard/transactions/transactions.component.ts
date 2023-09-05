import { Component, OnInit } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  activeTab: string = 'queue';
  multisigwallet: any;
  constructor(private localSt: LocalStorage) { }

  ngOnInit(): void {
    this.localSt.getItem('multisigwallets').subscribe({next: (wallets: any) => {
      const multisigwallet = wallets.items[wallets.currentIndex];
      this.multisigwallet = multisigwallet;
    }});
  }

  changeTab(tab: string) {
    if(tab != this.activeTab) {
      this.activeTab = tab;
    }
  }
}