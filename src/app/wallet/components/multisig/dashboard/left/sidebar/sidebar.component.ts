import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{
  multisigwallets: any;
  wallets: any;
  @Output() onBack = new EventEmitter();
  constructor(private localSt: LocalStorage) { }

  ngOnInit(): void {
    
    this.localSt.getItem('multisigwallets').subscribe({next: (wallets: any) => {
      console.log('something chainge');
      this.wallets = wallets;
      const multisigwallets = wallets.items;
      this.multisigwallets = multisigwallets;
    }});
  }
  back() {
    this.onBack.emit();
  }

  changeWallet(index: number) {
    this.wallets.currentIndex = index;
    const newWallets = JSON.parse(JSON.stringify(this.wallets));

    this.localSt.setItem('multisigwallets', newWallets).subscribe( () => {
      this.back();
    });
  }
}
