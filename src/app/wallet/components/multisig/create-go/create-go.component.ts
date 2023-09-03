import { Component, OnInit, Input } from '@angular/core';
import { MultisigService } from 'src/app/services/multisig.service';
import { interval, Subscription} from 'rxjs';

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
  constructor(private multisigServ: MultisigService) { }

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
