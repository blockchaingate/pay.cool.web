import { Component, OnInit, Input } from '@angular/core';
import { MultisigService } from 'src/app/services/multisig.service';
import { interval, Subscription} from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-create-go',
  templateUrl: './create-go.component.html',
  styleUrls: ['./create-go.component.scss']
})
export class CreateGoComponent implements OnInit {

  @Input() txid: string;
  address: string;
  mySubscription: Subscription;
  hasError: boolean;
  isReady: boolean;
  constructor(private multisigServ: MultisigService, private localSt: LocalStorage) { }

  ngOnInit(): void {

    this.mySubscription= interval(3000).subscribe((x =>{
      this.checkAddress();
    }));



  }

  checkAddress() {
    this.multisigServ.getByTxid(this.txid).subscribe({
      next: (res: any) => {
        if(res.success) {
          const item = res.data;
          if(item.status) {
            if(item.status == '0x1') {
              this.address = item.address;

              const newItem = {
                name: item.name,
                owners: item.owners,
                confirmations: item.confirmations,
                address: item.address,
                chain: item.chain
              };

              this.localSt.getItem('multisigwallets').subscribe((wallets: any) => {

                if (!wallets) {
                  wallets = {
                    currentIndex: 0,
                    items: [newItem]
                  };
                } else {
                  wallets.items.push(newItem);
                  wallets.currentIndex = wallets.items.length - 1;
                }
                this.localSt.setItem('multisigwallets', wallets).subscribe(() => {
                  this.isReady = true;
                });
              });




            } else {
              this.hasError = true;
            }
            this.mySubscription.unsubscribe();
          }
        }
      }
    });
  }


}