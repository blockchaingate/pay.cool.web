import { Component, OnInit } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  multisigwallet: any;
  constructor( private localSt: LocalStorage) { }

  ngOnInit(): void {
    this.localSt.getItem('multisigwallets').subscribe({next: (wallets: any) => {
      const multisigwallet = wallets.items[wallets.currentIndex];
      this.multisigwallet = multisigwallet;
    }});
  }

}
